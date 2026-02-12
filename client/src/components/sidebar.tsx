import { Link, useLocation } from "wouter";
import { Home, Search, Settings, BarChart3, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Analyze", path: "/dashboard" },
    ...((user as any)?.role === "super_admin" ? [{ icon: ShieldCheck, label: "Admin", path: "/admin" }] : []),
  ];

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col min-h-full">
      {/* Navigation */}
      <nav className="flex-1 p-4 pt-6 space-y-2">
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

      {/* Leave Button */}
      <div className="p-4">
        <Link href="/">
          <div
            className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors cursor-pointer text-muted-foreground hover:bg-muted hover:text-foreground"
            data-testid="button-leave"
          >
            <LogOut className="w-5 h-5" />
            <span>Leave Dashboard</span>
          </div>
        </Link>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          <p>A [<a href="https://humanelement.agency" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">HumanElement</a>] idea</p>
        </div>
      </div>
    </aside>
  );
}