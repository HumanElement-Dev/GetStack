export function hasActivePremiumTier(tier: string | null | undefined, status: string | null | undefined): boolean {
  return tier === "premium" && (status === "active" || status === "trialing");
}