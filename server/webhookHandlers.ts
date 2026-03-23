import { getStripeSync } from './stripeClient';
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

    // Let stripe-replit-sync verify the signature and sync data to stripe.* tables
    const sync = await getStripeSync();
    await sync.processWebhook(payload, signature);

    // Parse the verified payload and update user_tiers as source of truth
    try {
      const event = JSON.parse(payload.toString());
      if (SUBSCRIPTION_EVENTS.has(event.type)) {
        await WebhookHandlers.handleSubscriptionEvent(event);
      }
    } catch (err) {
      console.error('Error updating user tier from webhook event:', err);
    }
  }

  static async handleSubscriptionEvent(event: any): Promise<void> {
    const subscription = event.data?.object;
    if (!subscription?.customer) return;

    const customerId = subscription.customer as string;
    const subscriptionId = subscription.id as string;
    const status = subscription.status as string;
    const isPremium = status === 'active' || status === 'trialing';
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
