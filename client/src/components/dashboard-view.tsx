import { ChevronRight, Layers, Palette, Puzzle, type LucideIcon } from "lucide-react";
import { SiteIdentityCard, type DetectionResult } from "@/components/results-display";
import { NetworkSummaryCards } from "@/components/network-details-card";

interface DashboardViewProps {
  result: DetectionResult;
  site?: { domain: string; name?: string | null };
  onNavigate: (view: string) => void;
}

function detectPlatform(result: DetectionResult): string {
  if (result.isWordPress) return "WordPress";
  if (result.wixInfo) return "Wix";
  if (result.shopifyInfo) return "Shopify";
  if (result.squarespaceInfo) return "Squarespace";
  if (result.webflowInfo || result.isWebflow) return "Webflow";
  if (result.joomlaInfo) return "Joomla";
  if (result.drupalInfo) return "Drupal";
  return result.cmsType || "Unknown";
}

function SummaryLinkCard({
  title,
  summary,
  icon: Icon,
  onClick,
  testId,
}: {
  title: string;
  summary: string;
  icon: LucideIcon;
  onClick: () => void;
  testId: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-24 w-full items-start justify-between gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/40 hover:bg-primary/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      data-testid={testId}
    >
      <span className="min-w-0">
        <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
          {title}
        </span>
        <span className="mt-2 block break-words text-sm font-semibold text-foreground">{summary}</span>
      </span>
      <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
    </button>
  );
}

export default function DashboardView({ result, site, onNavigate }: DashboardViewProps) {
  const title = site?.name || site?.domain || result.domain;
  const platform = detectPlatform(result);
  const versionSummary = result.isWordPress
    ? result.wordPressVersion
      ? `v${result.wordPressVersion}${result.wordPressVersionStatus ? ` · ${result.wordPressVersionStatus}` : ""}`
      : "Version not exposed"
    : "Version not detected";
  const reportedPluginCount = result.pluginCount ? Number.parseInt(result.pluginCount, 10) : Number.NaN;
  const pluginCount = result.plugins?.length
    ? result.plugins.length
    : Number.isFinite(reportedPluginCount) ? reportedPluginCount : null;
  const pluginSummary = pluginCount !== null
    ? `${pluginCount} plugin${pluginCount === 1 ? "" : "s"} detected`
    : result.isWordPress ? "Plugin details unavailable" : "Not applicable";
  const themeSummary = result.themeInfo?.name || result.theme || result.shopifyInfo?.themeName || "No theme detected";

  return (
    <div className="max-w-3xl space-y-6">
      <SiteIdentityCard
        result={{ ...result, siteTitle: result.siteTitle || title }}
        compact
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <SummaryLinkCard
          title="Platform & version"
          summary={`${platform} · ${versionSummary}`}
          icon={Layers}
          onClick={() => onNavigate("cms-stack")}
          testId="dashboard-platform-summary"
        />
        <SummaryLinkCard
          title="Plugins"
          summary={pluginSummary}
          icon={Puzzle}
          onClick={() => onNavigate("plugins")}
          testId="dashboard-plugins-summary"
        />
        <SummaryLinkCard
          title="Theme"
          summary={themeSummary}
          icon={Palette}
          onClick={() => onNavigate("theme")}
          testId="dashboard-theme-summary"
        />
      </div>

      <section className="space-y-3" aria-labelledby="dashboard-network-heading">
        <h2 id="dashboard-network-heading" className="text-sm font-semibold text-foreground">Network</h2>
        <NetworkSummaryCards domain={result.domain} onNavigate={onNavigate} />
      </section>
    </div>
  );
}
