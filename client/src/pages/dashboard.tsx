import DashboardHeader from "@/components/dashboard-header";
import SitesSidebar from "@/components/sidebar";
import SiteDetailSidebar from "@/components/site-detail-sidebar";
import ResultsDisplay, { type DetectionResult } from "@/components/results-display";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useUserTier } from "@/hooks/use-tier";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Zap, LayoutDashboard, Globe, History, RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { PinnedSite } from "@shared/schema";

function UpgradeWall() {
  const [, setLocation] = useLocation();

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

        <Button className="w-full mb-3" size="lg" onClick={() => setLocation("/pricing")}>
          <Zap className="w-4 h-4 mr-2" />
          View Plans & Upgrade
        </Button>
        <Button variant="ghost" className="w-full text-sm" onClick={() => setLocation("/detect")}>
          Continue with free detection tool
        </Button>
      </div>
    </div>
  );
}

const CMS_COLORS: Record<string, string> = {
  wordpress: "bg-blue-600",
  wix: "bg-purple-600",
  shopify: "bg-green-600",
  squarespace: "bg-gray-700",
  joomla: "bg-orange-600",
};

function SiteOverview({ site }: { site: PinnedSite }) {
  const initial = site.domain.replace(/^(https?:\/\/)?(www\.)?/, "").charAt(0).toUpperCase();
  const color = CMS_COLORS[site.cmsType?.toLowerCase() ?? ""] ?? "bg-muted-foreground/40";

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8">
      <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center text-white text-2xl font-bold mb-5`}>
        {initial}
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-1">{site.name || site.domain}</h2>
      {site.cmsType && (
        <p className="text-sm text-muted-foreground mb-6 capitalize">{site.cmsType}</p>
      )}
      <p className="text-sm text-muted-foreground max-w-xs">
        Hit <span className="font-medium text-foreground">Analyze</span> in the search bar above to load the latest results for this site.
      </p>
    </div>
  );
}

export default function Dashboard() {
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSite, setSelectedSite] = useState<PinnedSite | null>(null);
  const [siteView, setSiteView] = useState("dashboard");
  const [scanUrl, setScanUrl] = useState<string | undefined>(undefined);

  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { isPremium, isLoading: tierLoading } = useUserTier();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const upgradeToastShown = useRef(false);

  // Handle ?upgraded=1 coming back from Stripe checkout success
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("upgraded") !== "1") return;
    window.history.replaceState({}, "", window.location.pathname);
    if (upgradeToastShown.current) return;
    upgradeToastShown.current = true;
    toast({
      title: "Welcome to Premium!",
      description: "Your subscription is being activated. The dashboard will unlock shortly.",
    });
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      await queryClient.invalidateQueries({ queryKey: ["/api/stripe/status"] });
      if (attempts >= 10) clearInterval(interval);
    }, 3000);
    return () => clearInterval(interval);
  }, [toast, queryClient]);

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

  if (!isAuthenticated) return null;

  const handleSelectSite = (site: PinnedSite) => {
    setSelectedSite(site);
    setSiteView("dashboard");
    setScanUrl(site.domain);
    if (result?.domain !== site.domain) {
      setResult(null);
    }
  };

  const handleBackToSites = () => {
    setSelectedSite(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {isPremium ? (
        <>
          <DashboardHeader
            onResult={setResult}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            defaultUrl={scanUrl}
          />
          <div className="flex flex-1 min-h-0">
            {/* Primary sidebar — desktop only */}
            <div className="hidden md:flex">
              <SitesSidebar
                collapsed={!!selectedSite}
                selectedSiteId={selectedSite?.id ?? null}
                onSelectSite={handleSelectSite}
                currentResult={result}
              />
            </div>

            {/* Contextual site-detail sidebar */}
            {selectedSite && (
              <div className="hidden md:flex">
                <SiteDetailSidebar
                  site={selectedSite}
                  activeView={siteView}
                  onViewChange={setSiteView}
                  onBack={handleBackToSites}
                />
              </div>
            )}

            <main className="flex-1 p-4 md:p-8 overflow-auto">
              {selectedSite && !result && !isLoading ? (
                <SiteOverview site={selectedSite} />
              ) : (
                <ResultsDisplay result={result} isLoading={isLoading} compact={true} />
              )}
            </main>
          </div>
        </>
      ) : (
        <>
          <header className="w-full border-b border-border bg-background px-6 py-4 flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center">
              <i className="fas fa-layer-group text-base text-foreground"></i>
            </div>
            <span className="font-semibold text-foreground">GetStack</span>
          </header>
          <div className="flex flex-1">
            <UpgradeWall />
          </div>
        </>
      )}
    </div>
  );
}
