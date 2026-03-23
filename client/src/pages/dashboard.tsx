import DashboardHeader from "@/components/dashboard-header";
import Sidebar from "@/components/sidebar";
import ResultsDisplay, { type DetectionResult } from "@/components/results-display";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useUserTier } from "@/hooks/use-tier";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Zap, LayoutDashboard, Globe, History } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

function UpgradeWall() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const portalMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Portal unavailable");
      return res.json();
    },
    onSuccess: (data) => {
      if (data.url) window.location.href = data.url;
    },
    onError: () => {
      toast({ title: "Error", description: "Could not open billing portal", variant: "destructive" });
    },
  });

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Zap className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Dashboard requires Premium</h2>
        <p className="text-muted-foreground mb-8">
          Upgrade to Premium to access your personal dashboard, save up to 100 sites, and track detection history.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <LayoutDashboard className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Full Dashboard</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <Globe className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">100 Saved Sites</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <History className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">History</p>
          </div>
        </div>

        <Button
          className="w-full mb-3"
          size="lg"
          onClick={() => setLocation("/pricing")}
        >
          <Zap className="w-4 h-4 mr-2" />
          View Plans & Upgrade
        </Button>
        <Button
          variant="ghost"
          className="w-full text-sm"
          onClick={() => setLocation("/detect")}
        >
          Continue with free detection tool
        </Button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { isPremium, isLoading: tierLoading } = useUserTier();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [authLoading, isAuthenticated, setLocation]);

  if (authLoading || tierLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {isPremium ? (
        <>
          <DashboardHeader
            onResult={setResult}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
          <div className="flex flex-1">
            <div className="hidden md:block">
              <Sidebar />
            </div>
            <main className="flex-1 p-4 md:p-8">
              <ResultsDisplay result={result} isLoading={isLoading} compact={true} />
            </main>
          </div>
        </>
      ) : (
        <>
          {/* Minimal header for upgrade wall */}
          <header className="w-full border-b border-border bg-background px-6 py-4 flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center">
              <i className="fas fa-layer-group text-base text-foreground"></i>
            </div>
            <span className="font-semibold text-foreground">GetStack</span>
          </header>
          <div className="flex flex-1">
            <div className="hidden md:block">
              <Sidebar />
            </div>
            <UpgradeWall />
          </div>
        </>
      )}
    </div>
  );
}
