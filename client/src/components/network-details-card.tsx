import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import type { NetworkDetails } from "@shared/schema";
import { useUserTier } from "@/hooks/use-tier";

function useNetworkDetails(domain: string) {
  const { isPremium } = useUserTier();
  const query = useQuery<NetworkDetails>({
    queryKey: ["/api/network-details", domain],
    queryFn: async () => {
      const response = await fetch(`/api/network-details?domain=${encodeURIComponent(domain)}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Network lookup failed");
      return response.json();
    },
    enabled: isPremium && Boolean(domain),
    staleTime: 0,
    retry: 1,
  });

  return { isPremium, ...query };
}

export function NetworkSummaryCard({ domain }: { domain: string }) {
  const { isPremium, data, isLoading, isError } = useNetworkDetails(domain);
  if (!isPremium) return null;

  return (
    <section className="rounded-xl border border-border bg-card p-4" data-testid="network-summary-card">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Network</p>
      {isLoading ? (
        <div className="h-6 w-40 animate-pulse rounded bg-muted" />
      ) : isError || !data ? (
        <p className="text-sm text-muted-foreground">Network information unavailable</p>
      ) : (
        <>
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">IP address</p>
          {data.addresses[0] ? (
            <p className="break-all font-mono text-sm font-semibold text-foreground">{data.addresses[0].address}</p>
          ) : (
            <p className="text-sm text-muted-foreground">No IP address found</p>
          )}
          {data.dnsProvider && (
            <p className="mt-1 text-xs text-muted-foreground">DNS: {data.dnsProvider}</p>
          )}
        </>
      )}
    </section>
  );
}

export function NetworkDetailsCard({ domain }: { domain: string }) {
  const { isPremium, data, isLoading, isError } = useNetworkDetails(domain);
  if (!isPremium) return null;

  return (
    <section className="rounded-xl border border-border bg-card p-5 sm:p-6" data-testid="premium-network-details">
      <h3 className="text-base font-semibold text-foreground">Network and DNS details</h3>
      {isLoading ? (
        <p className="mt-2 text-sm text-muted-foreground">Looking up DNS and network information…</p>
      ) : isError || !data ? (
        <p className="mt-2 text-sm text-muted-foreground">Network details are unavailable for this domain right now.</p>
      ) : (
        <div className="mt-4 space-y-5 text-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Network owner</p>
              <p className="mt-1 break-words text-foreground">{data.networkOwner || "Not identified"}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">DNS provider</p>
              <p className="mt-1 text-foreground">{data.dnsProvider || "Not identified from nameservers"}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">IP addresses</p>
              {data.addresses.length ? (
                <ul className="mt-1 space-y-1">
                  {data.addresses.map(({ address, family }) => (
                    <li key={`${family}-${address}`} className="flex flex-wrap items-center gap-2">
                      <span className="rounded bg-muted px-1.5 py-0.5 text-xs">IPv{family}</span>
                      <code className="break-all text-xs text-foreground">{address}</code>
                    </li>
                  ))}
                </ul>
              ) : <p className="mt-1 text-foreground">No A or AAAA records found</p>}
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Nameservers</p>
              {data.nameservers.length ? (
                <ul className="mt-1 space-y-1">
                  {data.nameservers.map((nameserver) => (
                    <li key={nameserver} className="break-all font-mono text-xs text-foreground">{nameserver}</li>
                  ))}
                </ul>
              ) : <p className="mt-1 text-foreground">No nameservers found</p>}
            </div>
            {data.mailProvider && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Email provider</p>
                <p className="mt-1 text-foreground">{data.mailProvider}</p>
              </div>
            )}
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">DNS records</p>
            {data.dnsRecords.length ? (
              <ul className="mt-1 space-y-1">
                {data.dnsRecords.map((record, index) => (
                  <li key={`${record.type}-${record.value}-${index}`} className="flex flex-wrap gap-x-2">
                    <span className="w-12 shrink-0 font-semibold text-primary">{record.type}</span>
                    {record.priority !== undefined && <span className="text-muted-foreground">Priority {record.priority}</span>}
                    <code className="min-w-0 break-all text-xs text-foreground">{record.value}</code>
                  </li>
                ))}
              </ul>
            ) : <p className="mt-1 text-foreground">No A, AAAA, MX, or CNAME records found</p>}
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Redirects</p>
            {data.redirects.length ? (
              <ol className="mt-1 space-y-1">
                {data.redirects.map((redirect, index) => (
                  <li key={`${redirect.status}-${redirect.from}-${index}`} className="break-all text-xs text-foreground">
                    <span className="mr-2 rounded bg-muted px-1.5 py-0.5">{redirect.status}</span>
                    {redirect.from} <ArrowRight className="mx-1 inline h-3 w-3" aria-hidden="true" /> {redirect.to}
                  </li>
                ))}
              </ol>
            ) : <p className="mt-1 text-foreground">No HTTP redirects observed</p>}
          </div>
        </div>
      )}
    </section>
  );
}
