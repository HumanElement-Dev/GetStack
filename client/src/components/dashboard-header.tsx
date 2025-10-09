import { Bell, User } from "lucide-react";
import { Link } from "wouter";

export default function DashboardHeader() {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Page Title */}
      <div>
        <h2 className="text-xl font-semibold text-foreground">WordPress Analyzer</h2>
        <p className="text-sm text-muted-foreground">Detect and analyze WordPress installations</p>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3">
        <Link href="/detect" className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm" data-testid="button-free-tool">
          Free Tool
        </Link>
        <Link href="/dashboard" className="bg-primary hover:bg-blue-600 text-primary-foreground px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm" data-testid="button-dashboard">
          Dashboard
        </Link>
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