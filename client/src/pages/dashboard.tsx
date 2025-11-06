import DashboardHeader from "@/components/dashboard-header";
import ResultsDisplay, { type DetectionResult } from "@/components/results-display";
import { useState } from "react";

export default function Dashboard() {
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Dashboard Header with search integrated */}
      <DashboardHeader 
        onResult={setResult} 
        isLoading={isLoading} 
        setIsLoading={setIsLoading}
      />

      {/* Content Area */}
      <main className="flex-1 p-8">
        {/* Results Display */}
        <ResultsDisplay result={result} isLoading={isLoading} />
      </main>
    </div>
  );
}