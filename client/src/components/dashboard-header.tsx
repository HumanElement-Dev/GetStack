import { Bell, User } from "lucide-react";
import { Link } from "wouter";
import DetectionForm from "@/components/detection-form";
import type { DetectionResult } from "@/components/results-display";

interface DashboardHeaderProps {
  onResult: (result: DetectionResult | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function DashboardHeader({ onResult, isLoading, setIsLoading }: DashboardHeaderProps) {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-40 gap-6">
      {/* Logo */}
      <Link href="/" data-testid="link-header-home">
        <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <i className="fas fa-layer-group text-xl text-primary"></i>
          </div>
          <span className="text-xl font-semibold text-foreground whitespace-nowrap">GetStack</span>
        </div>
      </Link>

      {/* Search/Detection Form - inline */}
      <div className="flex-1 max-w-2xl">
        <DetectionForm 
          onResult={onResult} 
          isLoading={isLoading} 
          setIsLoading={setIsLoading}
          inline
        />
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
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