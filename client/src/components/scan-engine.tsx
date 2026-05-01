import { useEffect, useState } from "react";

interface ScanEngineProps {
  domain: string;
}

interface LogLine {
  text: string;
  indent?: boolean;
  done?: boolean;
}

const SCAN_STEPS: LogLine[] = [
  { text: "Initializing scan engine…" },
  { text: "Resolving domain… ✓", done: true },
  { text: "Fetching HTTP headers…" },
  { text: "Inspecting HTML structure… ✓", done: true },
  { text: "Detecting CMS platform…" },
  { text: "Scanning theme structure…" },
  { text: "Inspecting stylesheet metadata… ✓", done: true },
  { text: "Mapping plugin ecosystem…" },
  { text: "→ Checking REST API endpoints…", indent: true },
  { text: "→ Scanning asset fingerprints…", indent: true },
  { text: "Analyzing frontend assets…" },
  { text: "→ JavaScript bundles inspected ✓", indent: true, done: true },
  { text: "Building stack profile…" },
  { text: "Finalizing results…" },
];

const LINE_INTERVAL_MS = 420;
const TOTAL_DURATION_MS = LINE_INTERVAL_MS * SCAN_STEPS.length + 1200;

export default function ScanEngine({ domain }: ScanEngineProps) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");

  useEffect(() => {
    setVisibleLines(0);
    setProgress(0);

    // Reveal log lines one by one
    const lineTimers: ReturnType<typeof setTimeout>[] = [];
    SCAN_STEPS.forEach((_, i) => {
      lineTimers.push(
        setTimeout(() => setVisibleLines((n) => Math.max(n, i + 1)), i * LINE_INTERVAL_MS)
      );
    });

    // Smooth progress bar — ticks every 80ms up to ~92%, then stalls until done
    const progressInterval = setInterval(() => {
      setProgress((p) => {
        const target = 92;
        if (p >= target) return p;
        const remaining = target - p;
        return p + remaining * 0.06;
      });
    }, 80);

    return () => {
      lineTimers.forEach(clearTimeout);
      clearInterval(progressInterval);
    };
  }, [domain]);

  const displayedLines = SCAN_STEPS.slice(0, visibleLines);
  const progressPct = Math.min(Math.round(progress), 99);

  return (
    <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden mb-4 md:mb-8">
      {/* Header bar */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
            <div className="w-3 h-3 rounded-full bg-green-400/70" />
          </div>
          <span className="text-xs font-medium text-muted-foreground tracking-wide ml-1">
            GetStack Scan Engine
          </span>
        </div>
        <span className="text-xs text-muted-foreground font-mono">{progressPct}%</span>
      </div>

      {/* Target */}
      <div className="px-5 pt-4 pb-2 border-b border-border/50">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Target</span>
          <span className="text-xs font-mono text-foreground bg-muted px-2 py-0.5 rounded">
            {cleanDomain}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-5 pt-3 pb-3">
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-200 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Log lines */}
      <div className="px-5 pb-5 font-mono text-xs space-y-1.5 min-h-[180px]">
        {displayedLines.map((line, i) => (
          <div
            key={i}
            className={`flex items-start space-x-2 animate-fade-in ${
              line.indent ? "pl-4" : ""
            } ${
              i === visibleLines - 1
                ? "text-foreground"
                : line.done
                ? "text-emerald-600"
                : "text-muted-foreground"
            }`}
            style={{ animationDelay: "0ms" }}
          >
            {!line.indent && (
              <span className="text-muted-foreground/40 select-none pt-px">›</span>
            )}
            <span>{line.indent ? line.text : line.text}</span>
            {i === visibleLines - 1 && !line.done && (
              <span className="inline-block w-1.5 h-3.5 bg-foreground/70 rounded-sm animate-pulse ml-0.5 mt-px" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
