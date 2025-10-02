import { Link, useLocation } from "wouter";
import { Home, Search, Settings, BarChart3 } from "lucide-react";

export default function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Analyze", path: "/dashboard" },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0">
      {/* Branding */}
      <div className="p-6 border-b border-border">
        <Link href="/" data-testid="link-sidebar-home">
          <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <i className="fas fa-layer-group text-xl text-primary"></i>
            </div>
            <span className="text-xl font-semibold text-foreground">GetStack</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <Link key={item.label} href={item.path}>
              <div
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          <p>A [<a href="https://humanelement.agency" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">HumanElement</a>] idea</p>
        </div>
      </div>
    </aside>
  );
}