import { type Express } from "express";
import { db } from "./db";
import { users } from "@shared/models/auth";
import { userTiers } from "@shared/schema";
import { eq, sql } from "drizzle-orm";
import { isAuthenticated } from "./replit_integrations/auth";
import { getUncachableStripeClient } from "./stripeClient";

export function registerStripeRoutes(app: Express) {
  // Get current user's tier (free or premium)
  app.get("/api/user/tier", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;

      // Super admins always get premium access
      if (req.user.role === "super_admin") {
        return res.json({ tier: "premium", status: "active", isSuperAdmin: true });
      }

      const [user] = await db.select().from(users).where(eq(users.id, userId));

      if (!user?.stripeCustomerId) {
        return res.json({ tier: "free", status: "active" });
      }

      // Query stripe.subscriptions for active subscription
      try {
        const result = await db.execute(sql`
          SELECT status, current_period_end 
          FROM stripe.subscriptions 
          WHERE customer = ${user.stripeCustomerId} 
            AND status IN ('active', 'trialing')
          LIMIT 1
        `);

        if (result.rows.length > 0) {
          const row = result.rows[0] as any;
          return res.json({
            tier: "premium",
            status: row.status,
            currentPeriodEnd: row.current_period_end,
          });
        }
      } catch {
        // stripe schema not yet available - fall through to free tier
      }

      return res.json({ tier: "free", status: "active" });
    } catch (error) {
      console.error("Error fetching user tier:", error);
      res.status(500).json({ error: "Failed to fetch tier" });
    }
  });

  // Create a Stripe checkout session
  app.post("/api/stripe/checkout", isAuthenticated, async (req: any, res) => {
    try {
      const { priceId } = req.body;
      if (!priceId) {
        return res.status(400).json({ error: "priceId is required" });
      }

      const [user] = await db.select().from(users).where(eq(users.id, req.user.id));
      let stripeCustomerId = user?.stripeCustomerId;

      const stripe = await getUncachableStripeClient();

      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: user?.email || undefined,
          metadata: { userId: req.user.id },
        });
        stripeCustomerId = customer.id;
        await db
          .update(users)
          .set({ stripeCustomerId })
          .where(eq(users.id, req.user.id));
      }

      const host = req.get("host");
      const protocol = req.headers["x-forwarded-proto"] || req.protocol;

      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: "subscription",
        success_url: `${protocol}://${host}/dashboard?upgraded=1`,
        cancel_url: `${protocol}://${host}/pricing`,
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Checkout error:", error);
      res.status(500).json({ error: error.message || "Failed to create checkout session" });
    }
  });

  // Create a Stripe billing portal session (manage subscription)
  app.post("/api/stripe/portal", isAuthenticated, async (req: any, res) => {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, req.user.id));

      if (!user?.stripeCustomerId) {
        return res.status(400).json({ error: "No Stripe customer found" });
      }

      const stripe = await getUncachableStripeClient();
      const host = req.get("host");
      const protocol = req.headers["x-forwarded-proto"] || req.protocol;

      const session = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${protocol}://${host}/dashboard`,
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Portal error:", error);
      res.status(500).json({ error: error.message || "Failed to create portal session" });
    }
  });

  // Get available products with prices (for pricing page)
  app.get("/api/stripe/products-with-prices", async (_req, res) => {
    try {
      const result = await db.execute(sql`
        SELECT 
          p.id as product_id,
          p.name as product_name,
          p.description as product_description,
          pr.id as price_id,
          pr.unit_amount,
          pr.currency,
          pr.recurring
        FROM stripe.products p
        LEFT JOIN stripe.prices pr ON pr.product = p.id AND pr.active = true
        WHERE p.active = true
        ORDER BY pr.unit_amount ASC
      `);

      const productsMap = new Map<string, any>();
      for (const row of result.rows as any[]) {
        if (!productsMap.has(row.product_id)) {
          productsMap.set(row.product_id, {
            id: row.product_id,
            name: row.product_name,
            description: row.product_description,
            prices: [],
          });
        }
        if (row.price_id) {
          productsMap.get(row.product_id).prices.push({
            id: row.price_id,
            unit_amount: row.unit_amount,
            currency: row.currency,
            recurring: row.recurring,
          });
        }
      }

      res.json({ data: Array.from(productsMap.values()) });
    } catch {
      // stripe schema not yet set up
      res.json({ data: [] });
    }
  });
}
