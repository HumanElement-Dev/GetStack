import { ArrowLeft, LayoutDashboard, Brain, Layers, Palette, Plug, Globe, Server, Wifi, Code2, Search, ShieldCheck } from "lucide-react";
import type { PinnedSite } from "@shared/schema";

interface SiteDetailSidebarProps {
  site: PinnedSite;
  activeView: string;
  onViewChange: (view: string) => void;
  onBack: () => void;
}

const NAV_SECTIONS = [
  [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", enabled: true },
    { id: "intelligence", icon: Brain, label: "Intelligence", enabled: false },
  ],
  [
    { id: "cms-stack", icon: Layers, label: "CMS Stack", enabled: true },
    { id: "theme", icon: Palette, label: "Theme", enabled: true },
    { id: "plugins", icon: Plug, label: "Plugins", enabled: false },
  ],
  [
    { id: "hosting", icon: Globe, label: "Hosting", enabled: false },
    { id: "infrastructure", icon: Server, label: "IP & Infrastructure", enabled: false },
    { id: "dns", icon: Wifi, label: "DNS", enabled: false },
  ],
  [
    { id: "frontend", icon: Code2, label: "CSS / Frontend", enabled: false },
    { id: "seo", icon: Search, label: "SEO", enabled: false },
    { id: "security", icon: ShieldCheck, label: "Security", enabled: false },
  ],
];

export default function SiteDetailSidebar({ site, activeView, onViewChange, onBack }: SiteDetailSidebarProps) {
  return (
    <aside className="w-56 bg-card border-r border-border flex flex-col shrink-0">
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors border-b border-border text-left"
      >
        <ArrowLeft className="w-4 h-4 shrink-0" />
        Back to Websites
      </button>

      <div className="px-4 py-3 border-b border-border">
        <p className="font-semibold text-sm text-foreground truncate">{site.name || site.domain}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-xs text-muted-foreground">Healthy</span>
        </div>
      </div>

      <nav className="flex-1 py-2 overflow-y-auto">
        {NAV_SECTIONS.map((section, sIdx) => (
          <div key={sIdx}>
            {sIdx > 0 && <div className="mx-3 my-1.5 border-t border-border" />}
            <div className="px-2 space-y-0.5">
              {section.map((item) => {
                const Icon = item.icon;
                const isSelected = activeView === item.id;

                if (!item.enabled) {
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between px-3 py-2 rounded-md cursor-default select-none"
                    >
                      <div className="flex items-center gap-2.5 text-muted-foreground/40">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="text-sm">{item.label}</span>
                      </div>
                      <span className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground/40">
                        Soon
                      </span>
                    </div>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                      isSelected
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
