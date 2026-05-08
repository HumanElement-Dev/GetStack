import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ResultsDisplay, { type DetectionResult } from "@/components/results-display";

export default function SharedResult() {
  const { id } = useParams<{ id: string }>();

  const { data: result, isLoading, isError } = useQuery<DetectionResult>({
    queryKey: ["/api/result", id],
    queryFn: async () => {
      const res = await fetch(`/api/result/${id}`);
      if (!res.ok) throw new Error("Result not found");
      return res.json();
    },
    enabled: !!id,
    retry: false,
  });

  const pageTitle = result
    ? `${result.domain} — GetStack`
    : "Scan Result — GetStack";

  const pageDescription = result?.cmsType
    ? `${result.domain} is running ${result.cmsType.charAt(0).toUpperCase() + result.cmsType.slice(1)}. View the full technology stack analysis on GetStack.`
    : "View this website technology stack analysis on GetStack.";

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Helmet>
      <Header />
      <main className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {isLoading && (
            <ResultsDisplay result={null} isLoading={true} scanDomain={id} />
          )}

          {isError && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
              <p className="text-amber-800 font-semibold mb-1">Result not found</p>
              <p className="text-amber-700 text-sm">This scan result may have expired or the link is incorrect.</p>
            </div>
          )}

          {result && (
            <>
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">
                  Shared scan result for{" "}
                  <span className="font-medium text-foreground">{result.domain}</span>
                </p>
              </div>
              <ResultsDisplay result={result} isLoading={false} />
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
