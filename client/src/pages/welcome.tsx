import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Search, Puzzle, Eye, ShieldCheck, Globe } from "lucide-react";
import { SiWordpress, SiWix, SiShopify, SiSquarespace } from "react-icons/si";
import type { IconType } from "react-icons";
import type { LucideIcon } from "lucide-react";

type PlatformIcon = IconType | LucideIcon;

const platforms: { name: string; icon: PlatformIcon; color: string; summary: string }[] = [
  { name: "WordPress", icon: SiWordpress, color: "#21759B", summary: "Theme, version & plugins" },
  { name: "Wix", icon: SiWix, color: "#0C6EFC", summary: "Builder type, apps & templates" },
  { name: "Shopify", icon: SiShopify, color: "#96BF48", summary: "Theme, store info & apps" },
  { name: "Squarespace", icon: SiSquarespace, color: "#222222", summary: "Version, features & template" },
];

export default function Welcome() {
  const [, setLocation] = useLocation();
  const [website, setWebsite] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleAnalyze = () => {
    const target = website.trim()
      ? `/detect?url=${encodeURIComponent(website.trim())}`
      : "/detect";
    setIsTransitioning(true);
    setTimeout(() => setLocation(target), 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAnalyze();
    }
  };

  return (
    <div className={`min-h-screen bg-background text-foreground font-sans transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      <Header />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="mb-8">
              <i className="fas fa-layer-group text-6xl text-primary mb-4"></i>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6">
              Welcome to GetStack
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">The fastest way to detect what a website is built with. Analyze any domain to discover themes, plugins, versions, and more.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto">
              <Input
                type="text"
                placeholder="Enter website URL..."
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 h-12 text-base"
                data-testid="input-website"
              />
              <Button 
                size="lg" 
                className="h-12 px-6 text-base font-semibold w-full sm:w-auto"
                onClick={handleAnalyze}
                data-testid="button-analyze"
              >
                <Search className="w-4 h-4 mr-2" />
                Analyze
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 rounded-lg border bg-card">
              <div className="flex justify-center mb-4">
                <Eye className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Detection</h3>
              <p className="text-muted-foreground">Identify the platform behind any website in seconds — WordPress, Wix, Shopify, Squarespace, and more.</p>
            </div>
            
            <div className="text-center p-6 rounded-lg border bg-card">
              <div className="flex justify-center mb-4">
                <Puzzle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Theme & Plugin Info</h3>
              <p className="text-muted-foreground">Discover active themes, plugins, apps, features, and platform versions across all supported CMSs.</p>
            </div>
            
            <div className="text-center p-6 rounded-lg border bg-card">
              <div className="flex justify-center mb-4">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure Analysis</h3>
              <p className="text-muted-foreground">
                Safe, non-intrusive scanning that respects website security and privacy.
              </p>
            </div>
          </div>

          {/* Supported Platforms */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Supported Platforms</h2>
              <p className="text-muted-foreground">Deep detection for the web's most popular site builders</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {platforms.map((platform) => {
                const Icon = platform.icon || Globe;
                return (
                  <div
                    key={platform.name}
                    className="flex flex-col items-center gap-3 p-5 rounded-lg border bg-card hover:shadow-md transition-shadow"
                  >
                    <Icon className="w-8 h-8" style={{ color: platform.color }} />
                    <span className="font-semibold text-foreground">{platform.name}</span>
                    <span className="text-xs text-muted-foreground text-center">{platform.summary}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-muted/30 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Ready to analyze a website?</h2>
            <p className="text-muted-foreground mb-6">Enter any domain or URL to start discovering its technology stack — completely free, no account required.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/detect">
                <Button 
                  size="lg"
                  data-testid="button-start-analysis"
                >
                  Start Free Analysis
                </Button>
              </Link>
              <Link href="/pricing">
                <Button 
                  variant="outline" 
                  size="lg"
                >
                  View Premium Plans
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}