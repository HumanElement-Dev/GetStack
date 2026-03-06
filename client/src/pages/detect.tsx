import Header from "@/components/header";
import Footer from "@/components/footer";
import DetectionForm from "@/components/detection-form";
import ResultsDisplay, { type DetectionResult } from "@/components/results-display";
import FeatureSection from "@/components/feature-section";
import { useState, useEffect, useRef } from "react";
import { useSearch } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Detect() {
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(
    () => !!new URLSearchParams(window.location.search).get("url")
  );
  const [mounted, setMounted] = useState(false);
  const search = useSearch();
  const { toast } = useToast();
  const hasAutoRun = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const urlParam = params.get("url");
    
    if (urlParam && !hasAutoRun.current && !result) {
      hasAutoRun.current = true;
      runDetection(urlParam);
    }
  }, [search]);

  const runDetection = async (domain: string) => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const response = await apiRequest("POST", "/api/detect-wordpress", { domain });
      const data = await response.json();
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setResult(data);
      toast({
        title: "Analysis Complete",
        description: `Detection finished for ${data.domain}`,
      });
    } catch (error: any) {
      console.error("Detection error:", error);
      
      let errorMessage = "Unable to analyze the website. Please check the URL and try again.";
      
      const errorResult: DetectionResult = {
        id: Date.now().toString(),
        domain: domain.replace(/^https?:\/\//, ''),
        isWordPress: null,
        error: errorMessage,
        createdAt: new Date().toISOString(),
      };
      
      setResult(errorResult);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-background text-foreground font-sans transition-opacity duration-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <Header />
      
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Hero Section - hidden while loading or after results appear */}
          <div className={`text-center mb-12 transition-all duration-500 ${(result || isLoading) ? 'opacity-0 h-0 mb-0 overflow-hidden' : 'opacity-100'}`}>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Is this website running WordPress?
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              Enter a domain or URL to quickly detect if a website is built with WordPress
            </p>
          </div>

          {/* Detection Form - moves to top when results appear */}
          <div className={`transition-all duration-300 ${result ? 'mb-8' : 'mb-12'}`}>
            <DetectionForm 
              onResult={setResult} 
              isLoading={isLoading} 
              setIsLoading={setIsLoading} 
            />
          </div>

          {/* Results Display */}
          <ResultsDisplay result={result} isLoading={isLoading} />

          {/* Feature Section - only show when no results */}
          {!result && <FeatureSection />}
        </div>
      </main>

      <Footer />
    </div>
  );
}