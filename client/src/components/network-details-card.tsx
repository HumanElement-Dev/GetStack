import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Globe, Server, Wifi, type LucideIcon } from "lucide-react";
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

function NetworkSummaryCardItem({
  label,
  summary,
  icon: Icon,
  onClick,
  testId,
}: {
  label: string;
  summary: string;
  icon: LucideIcon;
  onClick: () => void;
  testId: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group min-h-24 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/40 hover:bg-primary/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      data-testid={testId}
    >
      <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Icon className="h-4 w-4" aria-hidden="true" />
        {label}
      </span>
      <span className="mt-2 block break-all font-mono text-sm font-semibold text-foreground">{summary}</span>
    </button>
  );
}

export function NetworkSummaryCards({ domain, onNavigate }: { domain: string; onNavigate: (view: string) => void }) {
  const { isPremium, data, isLoading, isError } = useNetworkDetails(domain);
  if (!isPremium) return null;

  const cards = isLoading || isError || !data
    ? [
        { label: "Network", summary: isLoading ? "Checking…" : "Unavailable", icon: Globe, view: "infrastructure" },
        { label: "IP address", summary: isLoading ? "Checking…" : "Unavailable", icon: Server, view: "infrastructure" },
        { label: "DNS", summary: isLoading ? "Checking…" : "Unavailable", icon: Wifi, view: "dns" },
      ]
    : [
        { label: "Network", summary: data.networkOwner || "Not identified", icon: Globe, view: "infrastructure" },
        { label: "IP address", summary: data.addresses[0]?.address || "Not found", icon: Server, view: "infrastructure" },
        { label: "DNS", summary: data.dnsProvider || `${data.dnsRecords.length} records`, icon: Wifi, view: "dns" },
      ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3" data-testid="dashboard-network-summary">
      {cards.map((card) => (
        <NetworkSummaryCardItem
          key={card.label}
          label={card.label}
          summary={card.summary}
          icon={card.icon}
          onClick={() => onNavigate(card.view)}
          testId={`dashboard-${card.label.toLowerCase().replace(/\s+/g, "-")}-summary`}
        />
      ))}
    </div>
  );
}

export function InfrastructureDetailsCard({ domain }: { domain: string }) {
  const { isPremium, data, isLoading, isError } = useNetworkDetails(domain);
  if (!isPremium) return null;

  return (
    <section className="rounded-xl border border-border bg-card p-5 sm:p-6" data-testid="premium-network-details">
      <h3 className="text-base font-semibold text-foreground">Infrastructure details</h3>
      {isLoading ? (
        <p className="mt-2 text-sm text-muted-foreground">Looking up infrastructure information…</p>
      ) : isError || !data ? (
        <p className="mt-2 text-sm text-muted-foreground">Infrastructure details are unavailable for this domain right now.</p>
      ) : (
        <div className="mt-4 space-y-5 text-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Network owner</p>
              <p className="mt-1 break-words text-foreground">{data.networkOwner || "Not identified"}</p>
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

export function DnsDetailsCard({ domain }: { domain: string }) {
  const { isPremium, data, isLoading, isError } = useNetworkDetails(domain);
  if (!isPremium) return null;

  return (
    <section className="rounded-xl border border-border bg-card p-5 sm:p-6" data-testid="premium-dns-details">
      <h3 className="text-base font-semibold text-foreground">DNS details</h3>
      {isLoading ? (
        <p className="mt-2 text-sm text-muted-foreground">Looking up DNS information…</p>
      ) : isError || !data ? (
        <p className="mt-2 text-sm text-muted-foreground">DNS details are unavailable for this domain right now.</p>
      ) : (
        <div className="mt-4 space-y-5 text-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">DNS provider</p>
              <p className="mt-1 text-foreground">{data.dnsProvider || "Not identified from nameservers"}</p>
            </div>
            {data.mailProvider && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Email provider</p>
                <p className="mt-1 text-foreground">{data.mailProvider}</p>
              </div>
            )}
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
        </div>
      )}
    </section>
  );
}
