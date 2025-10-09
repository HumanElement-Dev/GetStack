import { Bell, User, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function DashboardHeader() {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search websites, results, or enter a URL..."
            className="pl-10 bg-background"
            data-testid="input-dashboard-search"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        <button 
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          data-testid="button-notifications"
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
        </button>
        <button 
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          data-testid="button-user-menu"
        >
          <User className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
}