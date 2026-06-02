import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      {/* Main footer */}
      <div className="bg-muted/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                  <i className="fas fa-layer-group text-primary-foreground text-xs"></i>
                </div>
                <span className="text-foreground font-semibold">GetStack</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Instantly detect the CMS and tech stack behind any website.
              </p>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/" className="hover:text-foreground transition-colors">Detect a Site</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-muted/50 border-t border-border py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-muted-foreground">
          <p>© 2026 GetStack. All rights reserved.</p>
          <p>
            A{" "}
            <a
              href="https://humanelement.agency"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-blue-600 transition-colors font-medium"
              data-testid="link-humanelement"
            >
              HumanElement
            </a>{" "}
            idea.
          </p>
        </div>
      </div>
    </footer>
  );
}
