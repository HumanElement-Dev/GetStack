import { Globe } from "lucide-react";
import { NetworkDetailsCard } from "@/components/network-details-card";

interface IpViewProps {
  domain: string | null | undefined;
}

export default function IpView({ domain }: IpViewProps) {
  const cleanDomain = domain?.replace(/^https?:\/\//, "").replace(/\/.*$/, "") ?? null;

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
      <NetworkDetailsCard domain={cleanDomain} />
    </div>
  );
}
