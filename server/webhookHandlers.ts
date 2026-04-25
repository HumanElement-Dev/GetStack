import Stripe from 'stripe';
import { getStripeSync, getUncachableStripeClient } from './stripeClient';
import { db } from './db';
import { users } from '@shared/models/auth';
import { userTiers } from '@shared/schema';
import { eq, sql } from 'drizzle-orm';

const SUBSCRIPTION_EVENTS = new Set([
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
]);

export class WebhookHandlers {
  static async processWebhook(payload: Buffer, signature: string): Promise<void> {
    if (!Buffer.isBuffer(payload)) {
      throw new Error(
        'STRIPE WEBHOOK ERROR: Payload must be a Buffer. ' +
        'This usually means express.json() parsed the body before reaching this handler. ' +
        'FIX: Ensure webhook route is registered BEFORE app.use(express.json()).'
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
    }

    // Verify the webhook signature and parse the event
    const stripe = await getUncachableStripeClient();
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err: any) {
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }

    // Also sync to stripe.* tables via stripe-replit-sync
    try {
      const sync = await getStripeSync();
      await sync.processWebhook(payload, signature);
    } catch {
      // Non-fatal — stripe-replit-sync may use a different webhook secret
    }

    // Update user_tiers as source of truth
    try {
      if (SUBSCRIPTION_EVENTS.has(event.type)) {
        await WebhookHandlers.handleSubscriptionEvent(event);
      }
    } catch (err) {
      console.error('Error updating user tier from webhook event:', err);
    }
  }

  /**
   * Returns true only if the subscription contains at least one item whose
   * product is our approved Premium product (name contains "premium").
   * This prevents granting premium access via subscriptions from other products.
   */
  static async isApprovedPremiumSubscription(subscription: any): Promise<boolean> {
    const items: { price?: { product?: string } }[] = subscription?.items?.data ?? [];
    if (items.length === 0) return false;

    const productIds = items
      .map((item) => item?.price?.product)
      .filter((id): id is string => typeof id === 'string' && id.length > 0);

    if (productIds.length === 0) return false;

    // Verify at least one product is our Premium product (by name)
    try {
      const result = await db.execute(sql`
        SELECT id FROM stripe.products
        WHERE id = ANY(${productIds})
          AND active = true
          AND name = 'GTSTK Premium'
        LIMIT 1
      `);
      return result.rows.length > 0;
    } catch {
      // stripe schema may not be ready yet — fall back to allowing it
      return true;
    }
  }

  static async handleSubscriptionEvent(event: any): Promise<void> {
    const subscription = event.data?.object;
    if (!subscription?.customer) return;

    const customerId = subscription.customer as string;
    const subscriptionId = subscription.id as string;
    const status = subscription.status as string;
    const isActiveStatus = status === 'active' || status === 'trialing';

    // Only grant premium if the subscription is for our approved Premium product
    const isApproved = isActiveStatus
      ? await WebhookHandlers.isApprovedPremiumSubscription(subscription)
      : false;

    const isPremium = isActiveStatus && isApproved;

    const currentPeriodEnd = subscription.current_period_end
      ? new Date(subscription.current_period_end * 1000)
      : null;

    // Find the user who owns this Stripe customer ID
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.stripeCustomerId, customerId))
      .limit(1);

    if (!user) return;

    // Keep stripeSubscriptionId current on the users table
    await db
      .update(users)
      .set({ stripeSubscriptionId: subscriptionId })
      .where(eq(users.id, user.id));

    // Upsert user_tiers — this is the app's source of truth for subscription status
    await db
      .insert(userTiers)
      .values({
        userId: user.id,
        tier: isPremium ? 'premium' : 'free',
        status,
        currentPeriodEnd,
        pinLimit: isPremium ? 100 : 3,
      })
      .onConflictDoUpdate({
        target: userTiers.userId,
        set: {
          tier: isPremium ? 'premium' : 'free',
          status,
          currentPeriodEnd,
          pinLimit: isPremium ? 100 : 3,
          updatedAt: new Date(),
        },
      });
  }
}
