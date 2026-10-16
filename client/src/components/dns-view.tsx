import { Wifi } from "lucide-react";
import { DnsDetailsCard } from "@/components/network-details-card";

interface DnsViewProps {
  domain: string | null | undefined;
}

export default function DnsView({ domain }: DnsViewProps) {
  const cleanDomain = domain?.replace(/^https?:\/\//, "").replace(/\/.*$/, "") ?? null;

  if (!cleanDomain) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground gap-3">
        <Wifi className="w-10 h-10 opacity-30" />
        <p className="text-sm">Run a scan to look up DNS details.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">DNS</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{cleanDomain}</p>
      </div>
      <DnsDetailsCard domain={cleanDomain} />
    </div>
  );
}
