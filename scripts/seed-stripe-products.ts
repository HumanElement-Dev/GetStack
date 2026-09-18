import {
  ensurePremiumProduct,
  PREMIUM_PRODUCT_NAME,
} from '../server/premiumProduct';

/**
 * Creates the GetStack Premium plan in Stripe.
 * Run with: npx tsx scripts/seed-products.ts
 *
 * This script is idempotent - safe to run multiple times.
 */
async function createProducts() {
  try {
    console.log('Connecting to Stripe...');
    const result = await ensurePremiumProduct();
    console.log(
      result.createdProduct
        ? `Created product: ${result.product.name} (${result.product.id})`
        : `${PREMIUM_PRODUCT_NAME} product already exists (${result.product.id}).`
    );
    console.log(
      result.createdPrice
        ? `Created monthly price: $9.00/month → ${result.price.id}`
        : `Monthly price already exists: $9.00/month → ${result.price.id}`
    );
    console.log('\nWebhooks will sync this data to your database automatically.');
  } catch (error: any) {
    console.error('Error creating products:', error.message);
    process.exit(1);
  }
}

createProducts();
