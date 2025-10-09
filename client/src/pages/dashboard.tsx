import Sidebar from "@/components/sidebar";
import DashboardHeader from "@/components/dashboard-header";
import DetectionForm from "@/components/detection-form";
import ResultsDisplay, { type DetectionResult } from "@/components/results-display";
import { useState } from "react";

export default function Dashboard() {
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Dashboard Header */}
        <DashboardHeader />

        {/* Content Area */}
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Detection Form */}
            <div className={`transition-transform duration-300 ${isLoading ? '-translate-y-4' : 'translate-y-0'}`}>
              <DetectionForm 
                onResult={setResult} 
                isLoading={isLoading} 
                setIsLoading={setIsLoading} 
              />
            </div>

            {/* Results Display */}
            <ResultsDisplay result={result} isLoading={isLoading} />
          </div>
        </main>
      </div>
    </div>
  );
}