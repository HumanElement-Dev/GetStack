import { Puzzle } from "lucide-react";
import type { DetectionResult } from "@/components/results-display";

export default function PluginsView({ result }: { result: DetectionResult | null }) {
  if (!result) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-center text-muted-foreground">
        <Puzzle className="h-10 w-10 opacity-30" />
        <p className="text-sm">Run a scan to see plugin details.</p>
      </div>
    );
  }

  const plugins = result.plugins ?? [];
  const detectedCount = result.pluginCount ? Number.parseInt(result.pluginCount, 10) : plugins.length;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Plugins</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{result.domain}</p>
      </div>

      {plugins.length ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {Number.isFinite(detectedCount) ? `${detectedCount} detected` : `${plugins.length} detected`}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {plugins.map((plugin) => (
              <article key={plugin.slug} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground">{plugin.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{plugin.category}</p>
                  </div>
                  {plugin.version && (
                    <span className="shrink-0 rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
                      v{plugin.version}
                    </span>
                  )}
                </div>
                {plugin.description && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{plugin.description}</p>}
                {plugin.wpOrgUrl && (
                  <a
                    href={plugin.wpOrgUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-xs font-medium text-primary hover:underline"
                  >
                    WordPress.org details
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
          {result.isWordPress
            ? "No plugin details were returned for this scan."
            : "Plugin detection is available for WordPress sites."}
        </div>
      )}
    </div>
  );
}
