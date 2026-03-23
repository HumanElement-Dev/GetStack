// Stripe client stub - will be replaced after Stripe integration OAuth
// This file provides typed stubs so the server can start without Stripe configured

export async function getUncachableStripeClient(): Promise<any> {
  throw new Error('Stripe integration not configured. Please connect Stripe via the integrations panel.');
}

export async function getStripeSync(): Promise<any> {
  throw new Error('Stripe integration not configured. Please connect Stripe via the integrations panel.');
}
