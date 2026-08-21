import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import DetectionForm from "@/components/detection-form";
import ResultsDisplay, { type DetectionResult } from "@/components/results-display";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  wordpressDetectorFaqItems,
  wordpressDetectorFaqSchema,
  wordpressDetectorSeo,
} from "@shared/wordpress-detector-seo";

const resultHighlights = [
  "WordPress version — current, outdated, or actively hidden",
  "Active theme — including parent and child theme relationships",
  "Detected plugins — categorized by function with direct links to WordPress.org",
  "Version status — whether core and plugins are up to date",
  "Security signals — login URL changes, version suppression, admin access indicators",
];

export default function WordPressDetector() {
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [scanDomain, setScanDomain] = useState("");

  const scrollToTool = () => {
    document.getElementById("scan-tool")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Helmet>
        <title>{wordpressDetectorSeo.title}</title>
        <meta
          name="description"
          content={wordpressDetectorSeo.description}
        />
        <meta
          property="og:title"
          content={wordpressDetectorSeo.title}
        />
        <meta
          property="og:description"
          content={wordpressDetectorSeo.ogDescription}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={wordpressDetectorSeo.canonicalUrl} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={wordpressDetectorSeo.title} />
        <meta name="twitter:description" content={wordpressDetectorSeo.ogDescription} />
        <link rel="canonical" href={wordpressDetectorSeo.canonicalUrl} />
        <script type="application/ld+json">
          {JSON.stringify(wordpressDetectorFaqSchema)}
        </script>
      </Helmet>
      <Header />

      <main>
        <section className="px-4 pt-14 pb-10 sm:px-6 sm:pt-20 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-5">
              WordPress Detector — Find Any WordPress Site&apos;s Theme, Plugins and
              Version
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Paste any URL and see exactly what WordPress theme, plugins, and
              version a site is running. Free, instant, no account required.
            </p>
          </div>
        </section>

        <section id="scan-tool" className="scroll-mt-6 px-4 pb-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl border bg-card p-5 sm:p-8 shadow-sm">
              <DetectionForm
                onResult={setResult}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                onScanStart={setScanDomain}
              />
            </div>
            <div className="mt-8">
              <ResultsDisplay
                result={result}
                isLoading={isLoading}
                scanDomain={scanDomain}
              />
            </div>
          </div>
        </section>

        <section className="border-y bg-muted/20 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-14">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground">What this detects</h2>
              <p className="text-muted-foreground leading-relaxed">
                GetStack analyzes any WordPress site and surfaces the full picture —
                not just whether it&apos;s running WordPress, but what version, which
                theme, every detectable plugin, and whether the core installation is
                up to date or carrying known security risks.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Most WordPress sites don&apos;t advertise this information. Some actively
                hide it. GetStack finds it anyway, pulling from multiple signals in the
                page source, HTTP headers, and asset structure to build a complete stack
                profile.
              </p>
              <div className="pt-2">
                <h3 className="font-semibold text-foreground mb-4">
                  What you&apos;ll see in your results:
                </h3>
                <ul className="space-y-3">
                  {resultHighlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-3 text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-primary" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground">Why people use this</h2>
              <p className="text-muted-foreground leading-relaxed">
                Freelancers and agencies run a WordPress detection scan before every
                client call. Knowing whether a site is running 47 plugins on an outdated
                WordPress core tells you more about the project scope than the client
                brief will.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Developers use it to research sites they admire — what page builder are
                they using, how heavy is their plugin stack, what&apos;s their theme setup.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Site owners use it to check their own site the way an outsider would see
                it — version exposure, plugin footprint, security signals.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground">
                What WordPress version tells you
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                WordPress releases major updates roughly twice a year. Sites running more
                than one major version behind are missing security patches and performance
                improvements. A site on WordPress 5.x in 2025 is carrying years of
                unpatched vulnerabilities.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                GetStack flags version status clearly — current, outdated, or hidden.
                Hidden versions are actually a good sign — it means someone has actively
                configured the site to suppress version exposure, which is a basic
                security best practice.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground">
                What the plugin list tells you
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Plugin count is a proxy for technical debt. A WordPress site with 8
                well-maintained plugins is a different project than one with 34 plugins,
                several of which haven&apos;t been updated in two years.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                GetStack detects active plugins and categorizes them — page builders, SEO
                tools, security plugins, forms, ecommerce, performance. That breakdown
                tells you immediately what the site is trying to do and how it&apos;s doing it.
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8">FAQ</h2>
            <Accordion type="single" collapsible className="w-full border-t">
              {wordpressDetectorFaqItems.map((item, index) => (
                <AccordionItem key={item.question} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left text-base">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
          <div className="max-w-3xl mx-auto rounded-2xl bg-muted/40 border px-6 py-10 text-center sm:px-10">
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Ready to see what&apos;s under the hood?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-7">
              GetStack detects WordPress themes, plugins, and version status on any site
              — free, in seconds.
            </p>
            <Button size="lg" onClick={scrollToTool}>
              Run a Free Scan
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}