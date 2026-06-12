import { Globe, Copy, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface IpViewProps {
  domain: string | null | undefined;
}

export default function IpView({ domain }: IpViewProps) {
  const [copied, setCopied] = useState(false);

  const cleanDomain = domain?.replace(/^https?:\/\//, "").replace(/\/.*$/, "") ?? null;

  const { data, isLoading, isError } = useQuery<{ ip: string }>({
    queryKey: ["/api/ip-lookup", cleanDomain],
    enabled: !!cleanDomain,
  });

  const handleCopy = () => {
    if (!data?.ip) return;
    navigator.clipboard.writeText(data.ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!cleanDomain) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground gap-3">
        <Globe className="w-10 h-10 opacity-30" />
        <p className="text-sm">Run a scan to look up the IP address.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">IP & Infrastructure</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{cleanDomain}</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">IP Address</p>

        {isLoading && (
          <div className="h-8 w-36 bg-muted animate-pulse rounded" />
        )}

        {isError && (
          <p className="text-sm text-destructive">Could not resolve IP for this domain.</p>
        )}

        {data?.ip && (
          <div className="flex items-center gap-3">
            <span className="text-2xl font-mono font-bold text-foreground">{data.ip}</span>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Copy IP"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
