import DashboardHeader from "@/components/dashboard-header";
import Sidebar from "@/components/sidebar";
import ResultsDisplay, { type DetectionResult } from "@/components/results-display";
import { useState } from "react";

export default function Dashboard() {
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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