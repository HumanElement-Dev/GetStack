import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Welcome() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
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
            <Link href="/dashboard">
              <Button 
                size="lg" 
                className="px-8 py-4 text-lg font-semibold"
                data-testid="button-get-started"
              >
                Get Started
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 rounded-lg border bg-card">
              <i className="fas fa-search text-3xl text-primary mb-4"></i>
              <h3 className="text-xl font-semibold mb-3">Instant Detection</h3>
              <p className="text-muted-foreground">
                Get immediate results about whether a website runs on WordPress with detailed analysis.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg border bg-card">
              <i className="fas fa-puzzle-piece text-3xl text-primary mb-4"></i>
              <h3 className="text-xl font-semibold mb-3">Theme & Plugin Info</h3>
              <p className="text-muted-foreground">
                Discover active themes, plugin counts, and WordPress versions when available.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg border bg-card">
              <i className="fas fa-shield-alt text-3xl text-primary mb-4"></i>
              <h3 className="text-xl font-semibold mb-3">Secure Analysis</h3>
              <p className="text-muted-foreground">
                Safe, non-intrusive scanning that respects website security and privacy.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-muted/30 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Ready to analyze a website?</h2>
            <p className="text-muted-foreground mb-6">Enter any domain or URL to start discovering its technology stack.</p>
            <Link href="/dashboard">
              <Button 
                variant="outline" 
                size="lg"
                data-testid="button-start-analysis"
              >
                Start Analysis
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}