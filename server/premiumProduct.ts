import { getUncachableStripeClient } from "./stripeClient";

export const PREMIUM_PRODUCT_NAME = "GetStack Premium";
export const PREMIUM_PRODUCT_DESCRIPTION =
  "Full dashboard access, save up to 100 sites, detection history, and priority support.";
export const PREMIUM_MONTHLY_PRICE_CENTS = 900;

export async function ensurePremiumProduct() {
  const stripe = await getUncachableStripeClient();
  const existing = await stripe.products.search({
    query: `name:'${PREMIUM_PRODUCT_NAME}' AND active:'true'`,
    limit: 1,
  });

  const product =
    existing.data[0] ??
    (await stripe.products.create({
      name: PREMIUM_PRODUCT_NAME,
      description: PREMIUM_PRODUCT_DESCRIPTION,
    }));

  const prices = await stripe.prices.list({
    product: product.id,
    active: true,
    limit: 100,
  });
  const monthlyPrice = prices.data.find(
    (price) =>
      price.unit_amount === PREMIUM_MONTHLY_PRICE_CENTS &&
      price.currency === "usd" &&
      price.recurring?.interval === "month"
  );

  if (monthlyPrice) {
    return { product, price: monthlyPrice, createdProduct: existing.data.length === 0, createdPrice: false };
  }

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: PREMIUM_MONTHLY_PRICE_CENTS,
    currency: "usd",
    recurring: { interval: "month" },
  });

  return { product, price, createdProduct: existing.data.length === 0, createdPrice: true };
}