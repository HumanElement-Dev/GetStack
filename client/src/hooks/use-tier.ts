import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./use-auth";

export type UserTier = {
  tier: "free" | "premium";
  status: "active" | "cancelled" | "past_due" | "trialing";
  currentPeriodEnd?: string;
  isSuperAdmin?: boolean;
};

async function fetchTier(): Promise<UserTier> {
  const res = await fetch("/api/user/tier", { credentials: "include" });
  if (!res.ok) return { tier: "free", status: "active" };
  return res.json();
}

export function useUserTier() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const query = useQuery<UserTier>({
    queryKey: ["/api/user/tier"],
    queryFn: fetchTier,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const isPremium = isAuthenticated && query.data?.tier === "premium";
  const isFree = !isAuthenticated || query.data?.tier === "free";

  return {
    tier: query.data?.tier ?? "free",
    status: query.data?.status ?? "active",
    currentPeriodEnd: query.data?.currentPeriodEnd,
    isPremium,
    isFree,
    isLoading: authLoading || (isAuthenticated && query.isLoading),
  };
}
