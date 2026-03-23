import { getUncachableStripeClient } from '../server/stripeClient';

/**
 * Creates the GetStack Premium plan in Stripe.
 * Run with: npx tsx scripts/seed-products.ts
 *
 * This script is idempotent - safe to run multiple times.
 */
async function createProducts() {
  try {
    const stripe = await getUncachableStripeClient();
    console.log('Connecting to Stripe...');

    // Check if Premium product already exists
    const existing = await stripe.products.search({
      query: "name:'GetStack Premium' AND active:'true'",
    });

    if (existing.data.length > 0) {
      console.log('GetStack Premium product already exists.');
      console.log(`Product ID: ${existing.data[0].id}`);
      const prices = await stripe.prices.list({ product: existing.data[0].id, active: true });
      prices.data.forEach((p) => {
        const amount = p.unit_amount ? `$${(p.unit_amount / 100).toFixed(2)}` : 'custom';
        console.log(`Price: ${amount}/${p.recurring?.interval ?? 'one-time'} → ${p.id}`);
      });
      return;
    }

    // Create the Premium product
    const product = await stripe.products.create({
      name: 'GetStack Premium',
      description: 'Full dashboard access, save up to 100 sites, detection history, and priority support.',
    });
    console.log(`Created product: ${product.name} (${product.id})`);

    // Monthly price at $9/month
    const monthlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 900, // $9.00
      currency: 'usd',
      recurring: { interval: 'month' },
    });
    console.log(`Created monthly price: $9.00/month → ${monthlyPrice.id}`);

    console.log('\nDone! Add this price ID to your pricing page if needed:');
    console.log(`MONTHLY_PRICE_ID=${monthlyPrice.id}`);
    console.log('\nWebhooks will sync this data to your database automatically.');
  } catch (error: any) {
    console.error('Error creating products:', error.message);
    process.exit(1);
  }
}

createProducts();
