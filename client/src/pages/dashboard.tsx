import DashboardHeader from "@/components/dashboard-header";
import Sidebar from "@/components/sidebar";
import ResultsDisplay, { type DetectionResult } from "@/components/results-display";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [authLoading, isAuthenticated, setLocation]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Full-width Dashboard Header */}
      <DashboardHeader 
        onResult={setResult} 
        isLoading={isLoading} 
        setIsLoading={setIsLoading}
      />

      {/* Content Area with Sidebar */}
      <div className="flex flex-1">
        {/* Sidebar - hidden on mobile */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          {/* Results Display */}
          <ResultsDisplay result={result} isLoading={isLoading} compact={true} />
        </main>
      </div>
    </div>
  );
}