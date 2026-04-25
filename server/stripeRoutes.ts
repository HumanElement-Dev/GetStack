import { type Express } from "express";
import { db } from "./db";
import { users } from "@shared/models/auth";
import { userTiers } from "@shared/schema";
import { eq, sql } from "drizzle-orm";
import { isAuthenticated } from "./replit_integrations/auth";
import { getUncachableStripeClient } from "./stripeClient";

export function registerStripeRoutes(app: Express) {
  // Get current user's subscription status — reads from user_tiers (source of truth)
  // Also available at GET /api/user/tier (alias kept for backwards compatibility)
  async function getTierHandler(req: any, res: any) {
    try {
      const userId: string = req.user.claims.sub;

      // Look up the DB user to check role
      const [dbUser] = await db.select().from(users).where(eq(users.id, userId));

      // Super admins always get premium access regardless of subscription
      if (dbUser?.role === "super_admin") {
        return res.json({ tier: "premium", status: "active", isSuperAdmin: true });
      }

      // Read from user_tiers — this is the app's source of truth, updated by webhooks
      const [tier] = await db.select().from(userTiers).where(eq(userTiers.userId, userId));

      if (tier && (tier.tier === "premium") && (tier.status === "active" || tier.status === "trialing")) {
        return res.json({
          tier: "premium",
          status: tier.status,
          currentPeriodEnd: tier.currentPeriodEnd,
        });
      }

      return res.json({ tier: "free", status: "active" });
    } catch (error) {
      console.error("Error fetching user tier:", error);
      res.status(500).json({ error: "Failed to fetch subscription status" });
    }
  }

  app.get("/api/stripe/status", isAuthenticated, getTierHandler);
  app.get("/api/user/tier", isAuthenticated, getTierHandler);

  // Resolve the single approved Premium monthly price from our synced Stripe tables.
  // The client MUST NOT dictate which price to charge — we look it up server-side.
  async function resolveApprovedPremiumPriceId(): Promise<string | null> {
    try {
      const result = await db.execute(sql`
        SELECT pr.id
        FROM stripe.prices pr
        JOIN stripe.products p ON p.id = pr.product
        WHERE p.active = true
          AND pr.active = true
          AND pr.recurring IS NOT NULL
          AND LOWER(p.name) LIKE '%premium%'
        ORDER BY pr.unit_amount ASC
        LIMIT 1
      `);
      return (result.rows[0]?.id as string) ?? null;
    } catch {
      return null;
    }
  }

  // Create a Stripe checkout session for the authenticated user.
  // The priceId from the client is used only to confirm intent; the actual price used
  // is always resolved server-side from the approved Premium product.
  app.post("/api/stripe/checkout", isAuthenticated, async (req: any, res) => {
    try {
      const userId: string = req.user.claims.sub;
      const [dbUser] = await db.select().from(users).where(eq(users.id, userId));
      if (!dbUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Server-side price resolution — ignore any client-provided priceId
      const approvedPriceId = await resolveApprovedPremiumPriceId();
      if (!approvedPriceId) {
        return res.status(503).json({ error: "Premium plan not configured yet. Please try again soon." });
      }

      const stripe = await getUncachableStripeClient();
      let stripeCustomerId = dbUser.stripeCustomerId;

      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: dbUser.email ?? undefined,
          metadata: { userId },
        });
        stripeCustomerId = customer.id;
        await db.update(users).set({ stripeCustomerId }).where(eq(users.id, userId));
      }

      const host = req.get("host");
      const protocol = (req.headers["x-forwarded-proto"] as string) || req.protocol;

      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        payment_method_types: ["card"],
        line_items: [{ price: approvedPriceId, quantity: 1 }],
        mode: "subscription",
        success_url: `${protocol}://${host}/dashboard?upgraded=1`,
        cancel_url: `${protocol}://${host}/pricing?cancelled=1`,
      });

      res.json({ url: session.url });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to create checkout session";
      console.error("Checkout error:", message);
      res.status(500).json({ error: message });
    }
  });

  // Open Stripe billing portal so the user can manage their subscription
  app.post("/api/stripe/portal", isAuthenticated, async (req: any, res) => {
    try {
      const userId: string = req.user.claims.sub;
      const [dbUser] = await db.select().from(users).where(eq(users.id, userId));

      if (!dbUser) {
        return res.status(404).json({ error: "User not found" });
      }

      const stripe = await getUncachableStripeClient();
      let stripeCustomerId = dbUser.stripeCustomerId;

      if (!stripeCustomerId) {
        // Search for an existing Stripe customer by email to avoid duplicates
        if (dbUser.email) {
          const existing = await stripe.customers.list({ email: dbUser.email, limit: 1 });
          if (existing.data.length > 0) {
            stripeCustomerId = existing.data[0].id;
          }
        }
        // If still no customer, create one
        if (!stripeCustomerId) {
          const customer = await stripe.customers.create({
            email: dbUser.email ?? undefined,
            metadata: { userId },
          });
          stripeCustomerId = customer.id;
        }
        // Persist for future requests
        await db.update(users).set({ stripeCustomerId }).where(eq(users.id, userId));
      }

      const host = req.get("host");
      const protocol = (req.headers["x-forwarded-proto"] as string) || req.protocol;

      const session = await stripe.billingPortal.sessions.create({
        customer: stripeCustomerId,
        return_url: `${protocol}://${host}/dashboard`,
      });

      res.json({ url: session.url });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to open billing portal";
      console.error("Portal error:", message);
      res.status(500).json({ error: message });
    }
  });

  // Return active products with their prices (used by the /pricing page)
  app.get("/api/stripe/products-with-prices", async (_req, res) => {
    try {
      const result = await db.execute(sql`
        SELECT
          p.id   AS product_id,
          p.name AS product_name,
          p.description AS product_description,
          pr.id  AS price_id,
          pr.unit_amount,
          pr.currency,
          pr.recurring
        FROM stripe.products p
        LEFT JOIN stripe.prices pr ON pr.product = p.id AND pr.active = true
        WHERE p.active = true
        ORDER BY pr.unit_amount ASC
      `);

      const productsMap = new Map<string, { id: string; name: string; description: string; prices: object[] }>();
      for (const row of result.rows as Record<string, unknown>[]) {
        const productId = row.product_id as string;
        if (!productsMap.has(productId)) {
          productsMap.set(productId, {
            id: productId,
            name: row.product_name as string,
            description: row.product_description as string,
            prices: [],
          });
        }
        if (row.price_id) {
          productsMap.get(productId)!.prices.push({
            id: row.price_id,
            unit_amount: row.unit_amount,
            currency: row.currency,
            recurring: row.recurring,
          });
        }
      }

      res.json({ data: Array.from(productsMap.values()) });
    } catch {
      // stripe schema not yet set up — return empty so pricing page falls back to static display
      res.json({ data: [] });
    }
  });
}
