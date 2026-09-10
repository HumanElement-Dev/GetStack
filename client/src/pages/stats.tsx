import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import {
  ArrowRight,
  BarChart3,
  ExternalLink,
  Layers3,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StatEntry = {
  name: string;
  category: string;
  sites: number;
  share: number;
};

type StatsResponse = {
  totalScans: number;
  uniqueDomains: number;
  cmsPlatformsDetected: number;
  technologiesIdentified: number;
  updatedAt: string | null;
  cmsShare: StatEntry[];
  topTechnologies: StatEntry[];
  wordpressThemes: StatEntry[];
  wordpressPlugins: StatEntry[];
  wordpressPageBuilders: StatEntry[];
};

const seo = {
  title: "Website Technology Statistics & Trends | GetStack",
  description:
    "Explore the most popular CMS platforms, including Webflow, WordPress themes, plugins and website technologies detected by GetStack.",
  canonical: "https://gtstk.dev/stats",
};

const directoryItems = [
  {
    title: "CMS Platforms",
    description:
      "See which content management systems and website platforms appear most frequently.",
    icon: Layers3,
    dataKey: "cmsShare" as const,
    href: "#cms-statistics",
    cta: "Explore CMS data",
  },
  {
    title: "WordPress Themes",
    description: "The most frequently detected WordPress themes across GetStack scans.",
    icon: Sparkles,
    dataKey: "wordpressThemes" as const,
    href: "#wordpress-statistics",
    cta: "Explore themes",
  },
  {
    title: "WordPress Plugins",
    description: "See which WordPress plugins appear most often across analyzed websites.",
    icon: BarChart3,
    dataKey: "wordpressPlugins" as const,
    href: "#wordpress-statistics",
    cta: "Explore plugins",
  },
];

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatShare(value: number) {
  return `${value.toLocaleString("en-US", {
    maximumFractionDigits: 1,
  })}%`;
}

function formatDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function EmptyData({ label = "No data available yet." }: { label?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/20 px-5 py-8 text-center">
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function Rankings({
  title,
  entries,
}: {
  title: string;
  entries: StatEntry[];
}) {
  return (
    <Card className="border-border/80 bg-card shadow-none">
      <CardHeader className="border-b border-border/70 pb-4">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        {entries.length === 0 ? (
          <EmptyData />
        ) : (
          <ol className="divide-y divide-border/70">
            {entries.slice(0, 5).map((entry, index) => (
              <li key={`${entry.name}-${index}`} className="flex items-center gap-3 py-3">
                <span className="w-5 font-mono text-xs text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                  {entry.name}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatShare(entry.share)}
                </span>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}

export default function Stats() {
  const { data, isLoading, isError, refetch } = useQuery<StatsResponse>({
    queryKey: ["/api/stats"],
    staleTime: 5 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: true,
  });

  const datasetSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: "GetStack website technology statistics",
      description: seo.description,
      url: seo.canonical,
      creator: {
        "@type": "Organization",
        name: "GetStack",
        url: "https://gtstk.dev",
      },
      isAccessibleForFree: true,
      temporalCoverage: data?.updatedAt ? data.updatedAt : undefined,
      dateModified: data?.updatedAt ? data.updatedAt : undefined,
      variableMeasured: [
        "Website scans",
        "Unique domains",
        "CMS platforms",
        "Detected technologies",
      ],
    }),
    [data?.updatedAt],
  );

  const updatedDate = formatDate(data?.updatedAt ?? null);
  const metrics = data
    ? [
        { label: "Successful scans", value: data.totalScans, icon: Search },
        { label: "Unique domains", value: data.uniqueDomains, icon: ShieldCheck },
        { label: "CMS platforms detected", value: data.cmsPlatformsDetected, icon: Layers3 },
        { label: "Technologies identified", value: data.technologiesIdentified, icon: BarChart3 },
      ]
    : [];
  const availableDirectoryItems = data
    ? directoryItems.filter((item) => data[item.dataKey].length > 0)
    : [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={seo.canonical} />
        <meta property="og:title" content={seo.title} />
        <meta property="og:description" content={seo.description} />
        <meta property="og:type" content="dataset" />
        <meta property="og:url" content={seo.canonical} />
        <script type="application/ld+json">{JSON.stringify(datasetSchema)}</script>
      </Helmet>

      <Header />
      <main>
        <section className="relative overflow-hidden border-b border-border/70">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_15%,hsl(var(--primary)/.09),transparent_34%)]" />
          <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-24 lg:px-8">
            <div className="max-w-3xl">
              <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                <span className="h-px w-7 bg-primary" />
                GetStack intelligence
              </p>
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-6xl">
                What is the web built with?
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                Explore the technologies, platforms, themes, plugins and apps detected across
                websites analyzed by GetStack.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <span>
                  {data ? `${formatNumber(data.totalScans)} successful scans` : "Aggregate scan data"}
                </span>
                <span className="hidden text-border sm:inline">•</span>
                <span>{updatedDate ? `Updated ${updatedDate}` : "Updated as new data arrives"}</span>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/">
                    Scan a Website <ArrowRight />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="#overview">Explore the data</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="overview" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-12 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-32 animate-pulse bg-card p-5">
                  <div className="h-3 w-20 rounded bg-muted" />
                  <div className="mt-7 h-8 w-24 rounded bg-muted" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-8 text-center">
              <p className="font-medium">The intelligence feed is unavailable right now.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Please try again in a moment.
              </p>
              <Button className="mt-5" variant="outline" onClick={() => refetch()}>
                <RefreshCw /> Retry
              </Button>
            </div>
          ) : !data ? (
            <EmptyData label="There is no aggregate data to show yet." />
          ) : (
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-4">
              {metrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <div key={metric.label} className="bg-card p-5 sm:p-7">
                    <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    <p className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
                      {formatNumber(metric.value)}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">
                      {metric.label}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {data && (
          <>
            <section id="cms-statistics" className="mx-auto max-w-7xl scroll-mt-20 px-4 pb-16 sm:px-6 lg:px-8">
              <div className="mb-8 max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                  Platform share
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  The web, according to GetStack
                </h2>
                <p className="mt-3 leading-7 text-muted-foreground">
                  A snapshot of the platforms appearing most frequently across websites analyzed
                  with GetStack.
                </p>
              </div>
              {data.cmsShare.length === 0 ? (
                <EmptyData label="CMS share will appear when enough detections are available." />
              ) : (
                <Card className="border-border/80 shadow-none">
                  <CardContent className="space-y-5 p-5 sm:p-8">
                    {data.cmsShare.map((entry) => (
                      <div key={entry.name}>
                        <div className="mb-2 flex items-baseline justify-between gap-4">
                          <span className="font-medium">{entry.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {formatShare(entry.share)}{" "}
                            <span className="hidden sm:inline">· {formatNumber(entry.sites)} sites</span>
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                          <div
                            className="h-full rounded-full bg-primary transition-[width]"
                            style={{ width: `${Math.min(entry.share, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </section>

            {availableDirectoryItems.length > 0 && (
            <section className="border-y border-border/70 bg-muted/20">
              <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                      The directory
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                      Explore the stack
                    </h2>
                  </div>
                  <p className="max-w-sm text-sm leading-6 text-muted-foreground">
                    Jump directly to the datasets currently supported by GetStack detections.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {availableDirectoryItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Card key={item.title} className="border-border/80 bg-card shadow-none">
                        <CardContent className="flex min-h-44 flex-col p-6 sm:p-7">
                          <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                          <h3 className="mt-6 text-xl font-semibold">{item.title}</h3>
                          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                            {item.description}
                          </p>
                          <a href={item.href} className="mt-auto flex items-center gap-2 pt-6 text-sm font-medium text-primary hover:underline">
                            {item.cta} <ArrowRight className="h-4 w-4" />
                          </a>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </section>
            )}

            <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                    Latest successful scan per domain
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                    Most detected technologies
                  </h2>
                </div>
                <span className="text-sm text-muted-foreground">
                  {data.topTechnologies.length} results
                </span>
              </div>
              {data.topTechnologies.length === 0 ? (
                <EmptyData label="Technology rankings will appear when detections are available." />
              ) : (
                <div className="overflow-hidden rounded-xl border border-border bg-card">
                  <div className="hidden grid-cols-[56px_1fr_1fr_120px_100px] gap-4 border-b border-border bg-muted/30 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:grid">
                    <span>Rank</span><span>Technology</span><span>Category</span><span>Sites</span><span>Share</span>
                  </div>
                  <div className="divide-y divide-border/70">
                    {data.topTechnologies.slice(0, 20).map((entry, index) => (
                      <div key={`${entry.name}-${index}`} className="grid gap-2 px-5 py-4 sm:grid-cols-[56px_1fr_1fr_120px_100px] sm:items-center sm:gap-4">
                        <span className="font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                        <span className="font-medium">{entry.name}</span>
                        <span className="text-sm text-muted-foreground">{entry.category}</span>
                        <span className="text-sm text-muted-foreground">{formatNumber(entry.sites)}</span>
                        <span className="text-sm font-medium">{formatShare(entry.share)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <section id="wordpress-statistics" className="scroll-mt-20 border-y border-border/70 bg-muted/20">
              <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="mb-8 max-w-xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                    A closer look
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                    Inside WordPress
                  </h2>
                </div>
                <div className="grid gap-4 lg:grid-cols-3">
                  <Rankings title="Top themes" entries={data.wordpressThemes} />
                  <Rankings title="Top plugins" entries={data.wordpressPlugins} />
                  <Rankings title="Top page builders" entries={data.wordpressPageBuilders} />
                </div>
              </div>
            </section>
          </>
        )}

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 rounded-2xl border border-border bg-card p-6 sm:p-10 lg:grid-cols-[1.15fr_.85fr] lg:p-14">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                About the data
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">A view of what GetStack sees</h2>
              <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">
                GetStack statistics are based on websites submitted for analysis through GetStack.
                They represent the websites our users investigate, not a random sample of the
                entire internet. Technologies are identified using publicly detectable signals and
                may not always be visible or identifiable.
              </p>
              <Link href="/faq" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                Learn how GetStack detects technologies <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
            <ul className="space-y-4 text-sm leading-6 text-muted-foreground">
              {[
                "Statistics reflect GetStack scans, not the entire web.",
                "Scan totals include repeat analyses; shares use each domain's latest successful scan.",
                "Detection is based on publicly observable technology.",
                "Hidden or server-side technologies may not be detectable.",
                "Detection confidence can vary by website and signal.",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-2xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12 sm:py-16">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Curious what a website is running?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
              Enter any URL and let GetStack identify the technologies behind it.
            </p>
            <Button asChild size="lg" variant="secondary" className="mt-8">
              <Link href="/">
                Scan a Website <ArrowRight />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}