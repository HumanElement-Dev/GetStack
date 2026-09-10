import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ResultsDisplay, { type DetectionResult } from "@/components/results-display";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { BookmarkPlus, Check, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function formatCmsName(cmsType: string): string {
  const names: Record<string, string> = {
    wordpress: "WordPress",
    wix: "Wix",
    shopify: "Shopify",
    squarespace: "Squarespace",
    webflow: "Webflow",
    joomla: "Joomla",
    drupal: "Drupal",
  };
  return names[cmsType.toLowerCase()] ?? cmsType;
}

export default function SharedResult() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

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
    ? `${result.domain} is running ${formatCmsName(result.cmsType)}. View the full technology stack analysis on GetStack.`
    : "View this website technology stack analysis on GetStack.";

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!result) return;
      const response = await apiRequest("POST", "/api/pins", {
        domain: result.domain,
        name: result.domain,
        cmsType: result.cmsType,
      });
      return response.json() as Promise<{ alreadySaved?: boolean }>;
    },
    onSuccess: (savedSite) => {
      queryClient.invalidateQueries({ queryKey: ["/api/pins"] });
      toast({
        title: savedSite?.alreadySaved ? "Already saved" : "Site saved",
        description: savedSite?.alreadySaved
          ? `${result?.domain} is already in your saved sites.`
          : `${result?.domain} was added to your saved sites.`,
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Could not save site",
        description: error.message.includes("Pin limit reached")
          ? "You have reached your saved-sites limit."
          : "Please try again.",
      });
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GetStack" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
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
              <p className="text-amber-700 text-sm">This scan result was not found. Check that the link is correct.</p>
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
              <div className="mt-6 rounded-xl border bg-card p-4 sm:p-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-foreground">Want to check another website?</p>
                  <p className="text-sm text-muted-foreground">Run your own free technology stack scan.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  {isAuthenticated && (
                    <Button
                      variant="outline"
                      onClick={() => saveMutation.mutate()}
                      disabled={saveMutation.isPending || saveMutation.isSuccess}
                    >
                      {saveMutation.isSuccess ? <Check className="w-4 h-4 mr-2" /> : <BookmarkPlus className="w-4 h-4 mr-2" />}
                      {saveMutation.isSuccess ? "Site saved" : saveMutation.isPending ? "Saving…" : "Save this site"}
                    </Button>
                  )}
                  <Link href="/detect">
                    <Button className="w-full">
                      <Search className="w-4 h-4 mr-2" />
                      Scan your own site
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
