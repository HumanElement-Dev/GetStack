import { Helmet } from "react-helmet-async";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useUserTier } from "@/hooks/use-tier";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Check, Zap, Globe, LayoutDashboard, History, Shield, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";
import { useState, useEffect } from "react";

const FEATURES_FREE = [
  "Unlimited one-off detections",
  "WordPress, Wix, Shopify, Squarespace, Joomla & Drupal",
  "Theme, plugin & app detection",
  "Technology stack analysis",
];

const FEATURES_PREMIUM = [
  "Everything in Free",
  "Full dashboard access",
  "Save & monitor up to 100 sites",
  "Detection history & tracking",
  "Priority support",
];

type StripePrice = {
  id: string;
  unit_amount: number;
  currency: string;
  recurring?: { interval: string };
};

type StripeProduct = {
  id: string;
  name: string;
  description: string;
  prices: StripePrice[];
};

export default function Pricing() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { isPremium, isLoading: tierLoading } = useUserTier();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showCancelledBanner, setShowCancelledBanner] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("cancelled") === "1") {
      setShowCancelledBanner(true);
      // Clean up query param without a page reload
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const { data: productsData } = useQuery<{ data: StripeProduct[] }>({
    queryKey: ["/api/stripe/products-with-prices"],
    retry: false,
    staleTime: 1000 * 60 * 10,
  });

  const checkoutMutation = useMutation({
    mutationFn: async (priceId: string) => {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ priceId }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Checkout failed");
      }
      return res.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const managePortalMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Portal unavailable");
      }
      return res.json();
    },
    onSuccess: (data) => {
      if (data.url) window.location.href = data.url;
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const premiumProduct = productsData?.data?.[0];
  const monthlyPrice = premiumProduct?.prices?.find(
    (p) => p.recurring?.interval === "month"
  );

  const displayPrice = monthlyPrice
    ? `$${(monthlyPrice.unit_amount / 100).toFixed(0)}`
    : "$9";

  const handleUpgrade = () => {
    if (!isAuthenticated) {
      setLocation("/login");
      return;
    }
    if (monthlyPrice) {
      trackEvent("checkout_start", "billing", "monthly");
      checkoutMutation.mutate(monthlyPrice.id);
    } else {
      toast({
        title: "Not available yet",
        description: "Stripe is being configured. Check back soon.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Helmet>
        <title>Pricing - GetStack</title>
        <meta name="description" content="GetStack is free to use with no account needed. Upgrade to premium for site monitoring, detection history, and unlimited saved sites." />
      </Helmet>
      <Header />
      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Checkout cancelled banner */}
          {showCancelledBanner && (
            <div className="mb-8 flex items-center justify-between gap-4 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
              <span>Checkout was cancelled — no charge was made. You can upgrade whenever you're ready.</span>
              <button
                onClick={() => setShowCancelledBanner(false)}
                className="shrink-0 rounded p-0.5 hover:bg-amber-100 dark:hover:bg-amber-900"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Heading */}
          <div className="text-center mb-14">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Simple, honest pricing</h1>
            <p className="text-lg text-muted-foreground">
              The public detection tool is always free. Upgrade for a full dashboard.
            </p>
          </div>

          {/* Plan cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free */}
            <Card className="border-2">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-xl">Free</CardTitle>
                  <Badge variant="secondary">Current plan</Badge>
                </div>
                <div className="mt-2">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground ml-1">/ month</span>
                </div>
                <CardDescription className="mt-2">
                  Instant platform detection for any website, no account required.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {FEATURES_FREE.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setLocation("/detect")}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Start Detecting
                </Button>
              </CardContent>
            </Card>

            {/* Premium */}
            <Card className="border-2 border-primary relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg">
                POPULAR
              </div>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-primary" />
                  <CardTitle className="text-xl">Premium</CardTitle>
                </div>
                <div className="mt-2">
                  <span className="text-4xl font-bold">{displayPrice}</span>
                  <span className="text-muted-foreground ml-1">/ month</span>
                </div>
                <CardDescription className="mt-2">
                  Full dashboard, site monitoring, and detection history.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {FEATURES_PREMIUM.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                {isPremium ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                      <Shield className="w-4 h-4" />
                      You're on Premium
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => managePortalMutation.mutate()}
                      disabled={managePortalMutation.isPending}
                    >
                      {managePortalMutation.isPending ? "Loading..." : "Manage Subscription"}
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    onClick={handleUpgrade}
                    disabled={checkoutMutation.isPending || authLoading || tierLoading}
                  >
                    {checkoutMutation.isPending
                      ? "Redirecting..."
                      : isAuthenticated
                      ? "Upgrade to Premium"
                      : "Sign in to Upgrade"}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Feature comparison callouts */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="text-center p-5">
              <LayoutDashboard className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Personal Dashboard</h3>
              <p className="text-sm text-muted-foreground">
                Your own space to run analyses and track results.
              </p>
            </div>
            <div className="text-center p-5">
              <Globe className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">100 Saved Sites</h3>
              <p className="text-sm text-muted-foreground">
                Pin and monitor up to 100 websites from your dashboard.
              </p>
            </div>
            <div className="text-center p-5">
              <History className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Detection History</h3>
              <p className="text-sm text-muted-foreground">
                Track how sites change over time with full history.
              </p>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-10">
            Cancel anytime. No hidden fees. Payments are securely processed by Stripe.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
