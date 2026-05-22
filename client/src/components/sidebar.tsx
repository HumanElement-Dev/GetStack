import { Plus, LogOut, Globe, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { PinnedSite } from "@shared/schema";
import type { DetectionResult } from "@/components/results-display";

interface SitesSidebarProps {
  collapsed: boolean;
  selectedSiteId: string | null;
  onSelectSite: (site: PinnedSite) => void;
  currentResult: DetectionResult | null;
}

const CMS_COLORS: Record<string, string> = {
  wordpress: "bg-blue-600",
  wix: "bg-purple-600",
  shopify: "bg-green-600",
  squarespace: "bg-gray-700",
  joomla: "bg-orange-600",
};

function getInitial(domain: string) {
  return domain.replace(/^(https?:\/\/)?(www\.)?/, "").charAt(0).toUpperCase();
}

function CmsBadge({ cmsType }: { cmsType: string | null }) {
  if (!cmsType) return null;
  const color = CMS_COLORS[cmsType.toLowerCase()] ?? "bg-muted-foreground/40";
  return (
    <span className={`text-[9px] font-bold text-white px-1.5 py-0.5 rounded uppercase tracking-wide ${color}`}>
      {cmsType.slice(0, 3)}
    </span>
  );
}

export default function SitesSidebar({ collapsed, selectedSiteId, onSelectSite, currentResult }: SitesSidebarProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data } = useQuery<{ pins: PinnedSite[]; allowed: boolean; current: number; limit: number }>({
    queryKey: ["/api/pins"],
  });
  const pins = data?.pins ?? [];

  const pinMutation = useMutation({
    mutationFn: async ({ domain, cmsType }: { domain: string; cmsType?: string }) => {
      const res = await apiRequest("POST", "/api/pins", { domain, name: domain, cmsType });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pins"] });
      toast({ title: "Site pinned", description: "Added to your websites list." });
    },
    onError: (e: any) => {
      toast({ title: "Could not pin site", description: e.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (pinId: string) => {
      await apiRequest("DELETE", `/api/pins/${pinId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pins"] });
    },
    onError: () => {
      toast({ title: "Could not remove site", variant: "destructive" });
    },
  });

  const isAlreadyPinned = currentResult
    ? pins.some((p) => p.domain === currentResult.domain)
    : false;

  const canPin = !!currentResult && !isAlreadyPinned;

  // ── Collapsed (icon-only) mode ─────────────────────────────────────────────
  if (collapsed) {
    return (
      <aside className="w-14 bg-card border-r border-border flex flex-col items-center py-3 gap-1.5 shrink-0">
        {pins.map((site) => (
          <button
            key={site.id}
            onClick={() => onSelectSite(site)}
            title={site.domain}
            className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold transition-colors ${
              selectedSiteId === site.id
                ? "bg-primary text-primary-foreground"
                : `${CMS_COLORS[site.cmsType?.toLowerCase() ?? ""] ?? "bg-muted"} text-white`
            }`}
          >
            {getInitial(site.domain)}
          </button>
        ))}

        {canPin && (
          <button
            onClick={() =>
              pinMutation.mutate({
                domain: currentResult!.domain,
                cmsType: currentResult!.cmsType ?? undefined,
              })
            }
            disabled={pinMutation.isPending}
            title="Pin this site"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-primary hover:bg-primary/10 transition-colors mt-1 border border-dashed border-primary/40"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}

        <div className="flex-1" />

        <Link href="/">
          <button title="Leave Dashboard" className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </Link>
      </aside>
    );
  }

  // ── Expanded mode ──────────────────────────────────────────────────────────
  return (
    <aside className="w-60 bg-card border-r border-border flex flex-col shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Websites
        </span>
        {canPin && (
          <button
            onClick={() =>
              pinMutation.mutate({
                domain: currentResult!.domain,
                cmsType: currentResult!.cmsType ?? undefined,
              })
            }
            disabled={pinMutation.isPending}
            title="Pin current site"
            className="p-1 rounded hover:bg-muted text-primary transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Sites list */}
      <div className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {pins.length === 0 ? (
          <div className="px-3 py-10 text-center">
            <Globe className="w-7 h-7 mx-auto mb-3 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground">No websites pinned yet.</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Scan a site then click&nbsp;
              <Plus className="inline w-3 h-3" /> to save it here.
            </p>
            <Link href="/">
              <button className="mt-4 flex items-center gap-1.5 mx-auto px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
                <Plus className="w-3.5 h-3.5" />
                Add site
              </button>
            </Link>
          </div>
        ) : (
          pins.map((site) => {
            const isSelected = selectedSiteId === site.id;
            return (
              <div key={site.id} className="group relative">
                <button
                  onClick={() => onSelectSite(site)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    isSelected
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                      CMS_COLORS[site.cmsType?.toLowerCase() ?? ""] ?? "bg-muted-foreground/40"
                    }`}
                  >
                    {getInitial(site.domain)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate leading-tight">
                      {site.name || site.domain}
                    </p>
                    <div className="mt-0.5">
                      <CmsBadge cmsType={site.cmsType} />
                    </div>
                  </div>
                </button>

                {/* Delete on hover */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteMutation.mutate(site.id);
                  }}
                  title="Remove"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <Link href="/">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer text-sm">
            <LogOut className="w-4 h-4" />
            Leave Dashboard
          </div>
        </Link>
      </div>
    </aside>
  );
}
