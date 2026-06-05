import { Layers, CheckCircle, AlertTriangle, HelpCircle, Clock, Puzzle } from "lucide-react";
import type { DetectionResult } from "@/components/results-display";

interface DashboardViewProps {
  result: DetectionResult;
  site?: { domain: string; name?: string | null };
}

function formatScanned(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function detectPlatform(result: DetectionResult): { label: string; color: string; bg: string } {
  if (result.isWordPress) return { label: "WordPress", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" };
  if (result.wixInfo) return { label: "Wix", color: "text-purple-700", bg: "bg-purple-50 border-purple-200" };
  if (result.shopifyInfo) return { label: "Shopify", color: "text-green-700", bg: "bg-green-50 border-green-200" };
  if (result.squarespaceInfo) return { label: "Squarespace", color: "text-gray-700", bg: "bg-gray-50 border-gray-200" };
  if (result.joomlaInfo) return { label: "Joomla", color: "text-orange-700", bg: "bg-orange-50 border-orange-200" };
  if (result.cmsType) return { label: result.cmsType, color: "text-foreground", bg: "bg-muted border-border" };
  return { label: "Unknown", color: "text-muted-foreground", bg: "bg-muted border-border" };
}

function VersionStatus({ result }: { result: DetectionResult }) {
  const status = result.wordPressVersionStatus;
  const version = result.wordPressVersion;

  if (!result.isWordPress) {
    return (
      <div className="flex items-center gap-2">
        <HelpCircle className="w-5 h-5 text-muted-foreground/40" />
        <span className="text-sm text-muted-foreground">N/A</span>
      </div>
    );
  }

  if (status === "current") {
    return (
      <div className="flex items-center gap-2">
        <CheckCircle className="w-5 h-5 text-green-500" />
        <div>
          <span className="text-sm font-medium text-green-700">Up to date</span>
          {version && <p className="text-xs text-muted-foreground">v{version}</p>}
        </div>
      </div>
    );
  }

  if (status === "outdated") {
    return (
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-amber-500" />
        <div>
          <span className="text-sm font-medium text-amber-700">Outdated</span>
          {version && <p className="text-xs text-muted-foreground">v{version}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <HelpCircle className="w-5 h-5 text-muted-foreground/50" />
      <div>
        <span className="text-sm font-medium text-muted-foreground">Unknown</span>
        {version && <p className="text-xs text-muted-foreground">v{version}</p>}
      </div>
    </div>
  );
}

export default function DashboardView({ result, site }: DashboardViewProps) {
  const platform = detectPlatform(result);
  const pluginCount =
    result.plugins?.length ??
    (result.pluginCount ? parseInt(result.pluginCount, 10) : null);

  const domainLabel = site?.name || site?.domain || result.domain;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">{domainLabel}</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Site overview</p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 gap-3">

        {/* Platform */}
        <div className={`rounded-xl border p-4 ${platform.bg}`}>
          <div className="flex items-center gap-2 mb-2">
            <Layers className={`w-4 h-4 ${platform.color}`} />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Platform</span>
          </div>
          <p className={`text-lg font-bold ${platform.color}`}>{platform.label}</p>
          {result.isWordPress && result.wordPressVersion && (
            <p className="text-xs text-muted-foreground mt-0.5">v{result.wordPressVersion}</p>
          )}
        </div>

        {/* Version status */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Version Status</span>
          </div>
          <VersionStatus result={result} />
        </div>

        {/* Last scanned */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Last Scanned</span>
          </div>
          <p className="text-lg font-bold text-foreground">{formatScanned(result.createdAt)}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {new Date(result.createdAt).toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric",
            })}
          </p>
        </div>

        {/* Plugins */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Puzzle className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Plugins</span>
          </div>
          {pluginCount !== null && pluginCount > 0 ? (
            <>
              <p className="text-lg font-bold text-foreground">{pluginCount}</p>
              <p className="text-xs text-muted-foreground mt-0.5">detected</p>
            </>
          ) : result.isWordPress ? (
            <>
              <p className="text-lg font-bold text-muted-foreground">—</p>
              <p className="text-xs text-muted-foreground mt-0.5">none detected</p>
            </>
          ) : (
            <>
              <p className="text-lg font-bold text-muted-foreground">N/A</p>
              <p className="text-xs text-muted-foreground mt-0.5">WordPress only</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
