import { Bell, User } from "lucide-react";

export default function DashboardHeader() {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Page Title */}
      <div>
        <h2 className="text-xl font-semibold text-foreground">WordPress Analyzer</h2>
        <p className="text-sm text-muted-foreground">Detect and analyze WordPress installations</p>
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