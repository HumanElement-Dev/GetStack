import { useState } from "react";
import ScanEngine from "@/components/scan-engine";
import type { Plugin, ThemeInfo, WixInfo, ShopifyInfo, SquarespaceInfo, JoomlaInfo } from "@shared/schema";
import { 
  Layout, ShoppingCart, Mail, Search, TrendingUp, 
  Zap, Shield, ShieldCheck, FileText, Image, Globe, Code, 
  Rocket, Gauge, HardDrive, Lock, Smartphone, Copy, Check,
  Edit, ArrowRight, Puzzle, CreditCard, FileInput, Database,
  AlertTriangle, CheckCircle2, ShieldAlert,
  type LucideIcon
} from "lucide-react";
import { Link } from "wouter";
import { useUserTier } from "@/hooks/use-tier";

const iconMap: Record<string, LucideIcon> = {
  'layout': Layout,
  'shopping-cart': ShoppingCart,
  'mail': Mail,
  'search': Search,
  'trending-up': TrendingUp,
  'zap': Zap,
  'shield': Shield,
  'shield-check': ShieldCheck,
  'file-text': FileText,
  'image': Image,
  'globe': Globe,
  'code': Code,
  'rocket': Rocket,
  'gauge': Gauge,
  'hard-drive': HardDrive,
  'lock': Lock,
  'smartphone': Smartphone,
  'copy': Copy,
  'edit': Edit,
  'arrow-right': ArrowRight,
  'puzzle': Puzzle,
  'credit-card': CreditCard,
  'file-input': FileInput,
  'database': Database,
  'slider': Image,
};

export interface DetectionResult {
  id: string;
  domain: string;
  cmsType?: string | null;
  isWordPress: boolean | null;
  isSquarespace?: boolean | null;
  wordPressVersion?: string | null;
  latestWordPressVersion?: string | null;
  wordPressVersionStatus?: 'current' | 'outdated' | 'unknown' | null;
  wpScore?: number | null;
  detectedIndicators?: string[] | null;
  theme?: string | null;
  themeInfo?: ThemeInfo | null;
  wixInfo?: WixInfo | null;
  shopifyInfo?: ShopifyInfo | null;
  squarespaceInfo?: SquarespaceInfo | null;
  joomlaInfo?: JoomlaInfo | null;
  pluginCount?: string | null;
  plugins?: Plugin[];
  technologies?: string[];
  error?: string;
  createdAt: string;
}

interface ResultsDisplayProps {
  result: DetectionResult | null;
  isLoading: boolean;
  compact?: boolean;
  scanDomain?: string;
}

// ─── WordPress Version Intelligence Card ─────────────────────────────────────
interface WordPressVersionCardProps {
  detectedVersion: string;
  latestVersion: string | null | undefined;
  status: 'current' | 'outdated' | 'unknown' | null | undefined;
}

function getVersionGap(detected: string, latest: string): string {
  const parse = (v: string) => v.split('.').map((p) => parseInt(p, 10) || 0);
  const [dMaj, dMin] = parse(detected);
  const [lMaj, lMin] = parse(latest);
  if (lMaj > dMaj) {
    const n = lMaj - dMaj;
    return `${n} major version${n > 1 ? 's' : ''} behind`;
  }
  if (lMin > dMin) {
    const n = lMin - dMin;
    return `${n} minor version${n > 1 ? 's' : ''} behind`;
  }
  return 'behind the latest release';
}

function WordPressVersionCard({ detectedVersion, latestVersion, status }: WordPressVersionCardProps) {
  const { isPremium } = useUserTier();
  const isOutdated = status === 'outdated';
  const isCurrent = status === 'current';
  const versionGap = isOutdated && latestVersion ? getVersionGap(detectedVersion, latestVersion) : null;

  return (
    <div className="space-y-3">
      {/* Version header row */}
      <div className="bg-white rounded-lg p-4 border border-green-200 space-y-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className="text-xs text-green-600 font-medium uppercase tracking-wide mb-1">WordPress Version</p>
            <p className="text-lg font-bold text-green-900 font-mono" data-testid="text-version">
              {detectedVersion}
            </p>
          </div>
          {/* Status badge */}
          {isCurrent && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold border border-green-200 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Up to date
            </span>
          )}
          {isOutdated && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold border border-amber-200 shrink-0">
              <AlertTriangle className="w-3.5 h-3.5" />
              Outdated{versionGap ? ` · ${versionGap}` : latestVersion ? ` · current is ${latestVersion}` : ''}
            </span>
          )}
          {status === 'unknown' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold border border-gray-200 shrink-0">
              Version status unknown
            </span>
          )}
        </div>

        {/* Interpretation layer */}
        {(isCurrent || isOutdated) && (
          <div className={`pt-2 border-t space-y-1 ${isOutdated ? 'border-amber-100' : 'border-green-100'}`}>
            {isCurrent && (
              <>
                <p className="text-xs font-semibold text-green-700">Status: ✅ Up to date</p>
                <p className="text-xs text-gray-500">→ No known core vulnerabilities</p>
                <p className="text-xs text-gray-500">→ Actively maintained environment</p>
              </>
            )}
            {isOutdated && (
              <>
                <p className="text-xs font-semibold text-amber-700">
                  Status: ⚠️ Outdated{versionGap ? ` (${versionGap})` : ''}
                </p>
                <p className="text-xs text-gray-500">→ Potential security exposure</p>
                <p className="text-xs text-gray-500">→ Missing recent performance updates</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Premium insight teaser */}
      <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50/60 overflow-hidden">
        <div className="px-4 py-2.5 flex items-center gap-2 border-b border-gray-200/70">
          <Lock className="w-3.5 h-3.5 text-gray-400" />
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Premium Insight</p>
        </div>
        {isPremium ? (
          <div className="px-4 py-3">
            <p className="text-xs text-gray-500 italic">
              Detailed vulnerability analysis, CVE references, and fix recommendations are coming soon for premium users.
            </p>
          </div>
        ) : (
          <div className="px-4 py-3 space-y-2.5">
            {/* Blurred placeholder rows */}
            <div className="space-y-1.5 select-none" aria-hidden>
              {[
                { label: 'CVE-2024-XXXX', detail: 'Critical · Remote code execution' },
                { label: 'CVE-2024-YYYY', detail: 'High · Privilege escalation' },
                { label: 'Recommended upgrade', detail: 'Safe version: X.X.X' },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-2 blur-[4px] pointer-events-none">
                  <span className="text-xs font-mono text-red-600">{row.label}</span>
                  <span className="text-xs text-gray-500">{row.detail}</span>
                </div>
              ))}
            </div>
            <Link
              href="/pricing"
              className="mt-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
            >
              <Lock className="w-3 h-3" />
              Unlock full vulnerability analysis
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

function ShareBar({ resultId }: { resultId: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const url = `${window.location.origin}/result/${resultId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg border bg-muted/30 text-sm">
      <span className="text-muted-foreground text-xs">Share these results</span>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5" />
            Copy link
          </>
        )}
      </button>
    </div>
  );
}

export default function ResultsDisplay({ result, isLoading, compact = false, scanDomain }: ResultsDisplayProps) {
  if (isLoading) {
    return <ScanEngine domain={scanDomain || "target"} />;
  }

  if (!result) {
    return null;
  }

  // Error state
  if (result.error) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 md:p-6 mb-4 md:mb-8" data-testid="error-state">
        <div className="flex flex-col sm:flex-row items-start gap-3 sm:space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <i className="fas fa-exclamation-triangle text-yellow-600 text-lg"></i>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-base md:text-lg font-semibold text-yellow-800 mb-2">
              Analysis Error
            </h3>
            <p className="text-sm md:text-base text-yellow-700" data-testid="text-error-message">
              {result.error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // WordPress detected
  if (result.cmsType === 'wordpress' || result.isWordPress) {
    return (
      <div className="space-y-4 md:space-y-6">
        {/* WordPress Confirmation Card */}
        <ShareBar resultId={result.id} />
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 md:p-6" data-testid="wordpress-detected">
          <div className="flex flex-col sm:flex-row items-start gap-3 sm:space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <i className="fab fa-wordpress text-green-600 text-lg"></i>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-bold text-green-800 mb-2 break-all" data-testid="text-domain">
                {result.domain}
              </h3>
              <p className="text-sm md:text-base text-green-700 mb-4">
                This website is running <span className="font-semibold">WordPress</span>
              </p>
              {result.wordPressVersion ? (
                <WordPressVersionCard
                  detectedVersion={result.wordPressVersion}
                  latestVersion={result.latestWordPressVersion}
                  status={result.wordPressVersionStatus}
                />
              ) : (
                <div className="bg-white rounded-lg p-4 border border-green-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                    <p className="text-sm font-semibold text-green-800">WordPress confirmed — version not publicly exposed</p>
                  </div>
                  <p className="text-xs text-green-700 leading-relaxed">
                    This site has removed the WordPress version from its HTML (a recommended security practice). 
                    The version cannot be determined remotely without admin access.
                  </p>
                  {result.detectedIndicators && result.detectedIndicators.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-green-800 mb-1.5">Detection signals found:</p>
                      <ul className="space-y-1">
                        {result.detectedIndicators.map((indicator, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-xs text-green-700">
                            <div className="w-1 h-1 rounded-full bg-green-400 flex-shrink-0"></div>
                            {indicator}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Theme Details Card */}
        {(result.theme || result.themeInfo) && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 md:p-6" data-testid="theme-details">
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-paint-brush text-purple-600 text-lg"></i>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-purple-800 mb-3">
                  Theme Details
                </h3>
                <div className="bg-white rounded-lg p-4 border border-purple-200 space-y-4">
                  {result.themeInfo ? (
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h4 className="font-bold text-purple-900 text-lg" data-testid="text-theme-name">
                                {result.themeInfo.name}
                              </h4>
                              {result.themeInfo.isChildTheme && (
                                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                                  Child Theme
                                </span>
                              )}
                            </div>
                            {result.themeInfo.version && (
                              <span className="text-sm text-purple-600 font-mono bg-purple-50 px-2 py-1 rounded" data-testid="text-theme-version">
                                v{result.themeInfo.version}
                              </span>
                            )}
                          </div>
                          
                          {result.themeInfo.description && (
                            <p className="text-sm text-purple-700 mt-2" data-testid="text-theme-description">
                              {result.themeInfo.description}
                            </p>
                          )}
                          
                          {result.themeInfo.author && (
                            <div className="flex items-center gap-2 text-sm mt-2">
                              <span className="text-purple-600">By:</span>
                              {result.themeInfo.authorUri ? (
                                <a 
                                  href={result.themeInfo.authorUri} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-purple-800 font-medium hover:underline"
                                  data-testid="text-theme-author"
                                >
                                  {result.themeInfo.author}
                                </a>
                              ) : (
                                <span className="text-purple-800 font-medium" data-testid="text-theme-author">
                                  {result.themeInfo.author}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {result.themeInfo.screenshot && (
                        <div className="flex justify-start">
                          <img 
                            src={result.themeInfo.screenshot} 
                            alt={`${result.themeInfo.name} theme screenshot`}
                            className={`${compact ? 'w-full max-w-sm' : 'w-full'} h-auto object-cover rounded-lg border border-purple-200`}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      
                      {result.themeInfo.themeUri && (
                        <a 
                          href={result.themeInfo.themeUri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 hover:underline"
                        >
                          <Globe className="w-4 h-4" />
                          View Theme Website
                        </a>
                      )}
                      
                      {result.themeInfo.tags && result.themeInfo.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {result.themeInfo.tags.slice(0, 8).map((tag, index) => (
                            <span key={index} className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* Parent Theme Info */}
                      {result.themeInfo.isChildTheme && result.themeInfo.parentThemeInfo && (
                        <div className="mt-4 pt-3 border-t border-purple-200">
                          <p className="text-xs text-purple-500 mb-2">Parent Theme</p>
                          <div className="bg-purple-50 rounded-lg p-3">
                            <div className="flex items-start justify-between gap-2">
                              <h5 className="font-semibold text-purple-800" data-testid="text-parent-theme-name">
                                {result.themeInfo.parentThemeInfo.name}
                              </h5>
                              {result.themeInfo.parentThemeInfo.version && (
                                <span className="text-xs text-purple-600 font-mono">
                                  v{result.themeInfo.parentThemeInfo.version}
                                </span>
                              )}
                            </div>
                            {result.themeInfo.parentThemeInfo.author && (
                              <p className="text-xs text-purple-600 mt-1">
                                By: {result.themeInfo.parentThemeInfo.author}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : result.theme && (
                    <div>
                      <span className="font-medium text-purple-800">Active Theme:</span>
                      <p className="text-sm text-purple-700 mt-1" data-testid="text-theme">{result.theme}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Plugin Details Card */}
        {result.pluginCount && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 md:p-6" data-testid="plugin-details">
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Puzzle className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  Detected Plugins
                </h3>
                <div className="bg-white rounded-lg p-4 border border-blue-200 space-y-4">
                  {result.pluginCount && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-blue-800" data-testid="text-plugins">
                          Plugins
                        </span>
                        <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                          {result.pluginCount}
                        </span>
                      </div>
                      {result.plugins && result.plugins.length > 0 && (
                        <div className="space-y-2" data-testid="list-plugins">
                          {(() => {
                            // Organize plugins into parent-child relationships
                            const parentPlugins = result.plugins.filter(p => !p.parent);
                            const childPlugins = result.plugins.filter(p => p.parent);
                            const pluginMap = new Map(result.plugins.map(p => [p.slug, p]));
                            
                            // Sort parent plugins alphabetically
                            const sortedParents = parentPlugins.sort((a, b) => a.name.localeCompare(b.name));
                            
                            // Render plugins with nesting
                            const renderPlugin = (plugin: Plugin, isChild = false) => (
                              <div 
                                key={plugin.slug} 
                                className={`flex items-start gap-3 p-3 bg-gradient-to-r from-white to-blue-50/30 rounded-lg border border-blue-100/50 hover:border-blue-200 transition-colors ${isChild ? 'ml-8 border-l-4' : ''}`}
                                style={isChild ? { borderLeftColor: plugin.color } : {}}
                                data-testid={`plugin-${plugin.slug}`}
                              >
                                <div 
                                  className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
                                  style={{ backgroundColor: plugin.color }}
                                >
                                  {(() => {
                                    const IconComponent = iconMap[plugin.icon] || Puzzle;
                                    return <IconComponent className="w-5 h-5" data-icon={plugin.icon} />;
                                  })()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                      <h4 className="font-semibold text-blue-900 text-sm" data-testid={`text-plugin-name-${plugin.slug}`}>
                                        {plugin.name}
                                      </h4>
                                      <p className="text-xs text-blue-700/80 mt-0.5" data-testid={`text-plugin-description-${plugin.slug}`}>
                                        {plugin.description}
                                      </p>
                                      {plugin.wpOrgUrl && (
                                        <a 
                                          href={plugin.wpOrgUrl} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 hover:underline mt-1"
                                        >
                                          <Globe className="w-3 h-3" />
                                          View on WordPress.org
                                        </a>
                                      )}
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                      <span 
                                        className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium whitespace-nowrap"
                                        data-testid={`text-plugin-category-${plugin.slug}`}
                                      >
                                        {plugin.category}
                                      </span>
                                      {plugin.version && (
                                        <span 
                                          className="text-xs text-blue-600 font-mono"
                                          data-testid={`text-plugin-version-${plugin.slug}`}
                                        >
                                          v{plugin.version}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                            
                            return sortedParents.flatMap(parent => {
                              const children = childPlugins.filter(child => child.parent === parent.slug);
                              return [
                                renderPlugin(parent, false),
                                ...children.map(child => renderPlugin(child, true))
                              ];
                            }).concat(
                              // Add any orphaned child plugins (whose parent wasn't detected)
                              childPlugins
                                .filter(child => !pluginMap.has(child.parent || ''))
                                .map(child => renderPlugin(child, false))
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Wix detected
  if (result.cmsType === 'wix') {
    const wixAppMeta: Record<string, { icon: LucideIcon; description: string; category: string; color: string }> = {
      'Wix Stores':         { icon: ShoppingCart, description: 'Online store & product catalog',     category: 'E-commerce',    color: '#7c3aed' },
      'Wix Blog':           { icon: FileText,     description: 'Blogging & content publishing',      category: 'Content',       color: '#6d28d9' },
      'Wix Bookings':       { icon: Layout,       description: 'Appointments & scheduling',          category: 'Services',      color: '#5b21b6' },
      'Wix Events':         { icon: Rocket,       description: 'Event management & ticketing',       category: 'Events',        color: '#4c1d95' },
      'Wix Restaurants':    { icon: Database,     description: 'Online ordering & menus',            category: 'Food & Drink',  color: '#7c3aed' },
      'Wix Forum':          { icon: Globe,        description: 'Community discussion boards',         category: 'Community',     color: '#6d28d9' },
      'Wix Music':          { icon: Zap,          description: 'Music player & track sales',         category: 'Media',         color: '#5b21b6' },
      'Wix Pro Gallery':    { icon: Image,        description: 'Professional photo galleries',       category: 'Media',         color: '#4c1d95' },
      'Wix Pricing Plans':  { icon: CreditCard,   description: 'Subscription & membership plans',   category: 'Monetization',  color: '#7c3aed' },
      'Wix Members':        { icon: Shield,       description: 'Member login & profiles',            category: 'Membership',    color: '#6d28d9' },
      'Wix Chat':           { icon: Mail,         description: 'Live chat & messaging',              category: 'Support',       color: '#5b21b6' },
      'Wix Forms':          { icon: FileInput,    description: 'Contact forms & lead capture',       category: 'Forms',         color: '#4c1d95' },
    };

    const templateLabel = result.wixInfo?.templateName || 'Custom Wix Build';
    const categoryLabel = result.wixInfo?.siteCategory && result.wixInfo.siteCategory !== 'General'
      ? result.wixInfo.siteCategory
      : null;
    const placeholderLabel = templateLabel;

    return (
      <div className="space-y-4 md:space-y-6">
        {/* Wix Confirmation Card */}
        <ShareBar resultId={result.id} />
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 md:p-6" data-testid="wix-detected">
          <div className="flex flex-col sm:flex-row items-start gap-3 sm:space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <i className="fab fa-wix text-green-600 text-lg"></i>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-bold text-green-800 mb-2 break-all" data-testid="text-domain">
                {result.domain}
              </h3>
              <p className="text-sm md:text-base text-green-700 mb-4">
                This website is running <span className="font-semibold">Wix</span>
              </p>
              <div className="bg-white rounded-lg p-3 md:p-4 border border-green-200">
                <p className="text-sm text-green-700">Wix website builder detected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wix Theme Details Card */}
        {result.wixInfo && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 md:p-6" data-testid="wix-site-details">
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-paint-brush text-purple-600 text-lg"></i>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-purple-800 mb-3">
                  Theme Details
                </h3>
                <div className="bg-white rounded-lg p-4 border border-purple-200 space-y-4">
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-bold text-purple-900 text-lg" data-testid="text-wix-template">
                              {result.wixInfo.templateName || 'Custom Wix Build'}
                            </h4>
                            {result.wixInfo.builderType && (
                              <span className="inline-block text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium mt-1">
                                {result.wixInfo.builderType}
                              </span>
                            )}
                          </div>
                          {result.wixInfo.renderingEngine && (
                            <span className="text-sm text-purple-600 font-mono bg-purple-50 px-2 py-1 rounded" data-testid="text-wix-engine">
                              {result.wixInfo.renderingEngine}
                            </span>
                          )}
                        </div>

                        {categoryLabel && (
                          <p className="text-sm text-purple-700 mt-2" data-testid="text-wix-description">
                            {categoryLabel} Wix Site
                          </p>
                        )}

                        {result.wixInfo.siteDescription && (
                          <p className="text-sm text-purple-600 mt-1" data-testid="text-wix-site-description">
                            {result.wixInfo.siteDescription}
                          </p>
                        )}

                        <div className="flex items-center gap-2 text-sm mt-2">
                          <span className="text-purple-600">By:</span>
                          <a
                            href="https://www.wix.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-800 font-medium hover:underline"
                          >
                            Wix
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Placeholder image — styled like WP theme screenshot */}
                    <div className="flex justify-start">
                      <div
                        className={`${compact ? 'w-full max-w-sm' : 'w-full'} rounded-lg border border-purple-200 overflow-hidden`}
                        style={{ aspectRatio: '16/9' }}
                      >
                        <svg
                          width="100%"
                          height="100%"
                          viewBox="0 0 800 450"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ display: 'block' }}
                        >
                          <defs>
                            <linearGradient id="wixGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#6d28d9" />
                              <stop offset="100%" stopColor="#4c1d95" />
                            </linearGradient>
                          </defs>
                          <rect width="800" height="450" fill="url(#wixGrad)" />
                          <rect x="0" y="0" width="800" height="450" fill="rgba(255,255,255,0.04)" />
                          {/* Decorative circles */}
                          <circle cx="650" cy="80" r="120" fill="rgba(255,255,255,0.05)" />
                          <circle cx="150" cy="370" r="90" fill="rgba(255,255,255,0.05)" />
                          {/* Wix logo text */}
                          <text x="400" y="190" textAnchor="middle" fontFamily="sans-serif" fontSize="28" fontWeight="700" fill="rgba(255,255,255,0.5)" letterSpacing="6">WIX</text>
                          {/* Template label */}
                          <text x="400" y="240" textAnchor="middle" fontFamily="sans-serif" fontSize="22" fontWeight="700" fill="white">{placeholderLabel}</text>
                          {/* Sub label */}
                          <text x="400" y="275" textAnchor="middle" fontFamily="sans-serif" fontSize="14" fill="rgba(255,255,255,0.7)">Website Builder</text>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Wix Apps Card */}
        {result.wixInfo?.wixApps && result.wixInfo.wixApps.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 md:p-6" data-testid="wix-apps-details">
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Puzzle className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  Detected Wix Apps
                </h3>
                <div className="bg-white rounded-lg p-4 border border-blue-200 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-blue-800">Apps</span>
                      <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        {result.wixInfo.wixApps.length} detected
                      </span>
                    </div>
                    <div className="space-y-2" data-testid="list-wix-apps">
                      {result.wixInfo.wixApps.map((app) => {
                        const meta = wixAppMeta[app] || { icon: Puzzle, description: 'Wix application', category: 'App', color: '#6d28d9' };
                        const IconComponent = meta.icon;
                        return (
                          <div
                            key={app}
                            className="flex items-start gap-3 p-3 bg-gradient-to-r from-white to-blue-50/30 rounded-lg border border-blue-100/50 hover:border-blue-200 transition-colors"
                            data-testid={`wix-app-${app.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            <div
                              className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
                              style={{ backgroundColor: meta.color }}
                            >
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-blue-900 text-sm">{app}</h4>
                                  <p className="text-xs text-blue-700/80 mt-0.5">{meta.description}</p>
                                </div>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium whitespace-nowrap">
                                  {meta.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Shopify detected
  if (result.cmsType === 'shopify') {
    const shopifyAppMeta: Record<string, { icon: LucideIcon; description: string; category: string; color: string }> = {
      'Klaviyo':        { icon: Mail,         description: 'Email & SMS marketing automation',      category: 'Marketing',     color: '#059669' },
      'Yotpo':          { icon: Search,        description: 'Reviews, ratings & loyalty programs',   category: 'Social Proof',  color: '#10b981' },
      'Judge.me':       { icon: ShieldCheck,   description: 'Product reviews & ratings platform',    category: 'Social Proof',  color: '#047857' },
      'Tidio':          { icon: Mail,          description: 'Live chat & chatbot support',            category: 'Support',       color: '#059669' },
      'Gorgias':        { icon: Mail,          description: 'Ecommerce helpdesk & support',          category: 'Support',       color: '#10b981' },
      'Loox':           { icon: Image,         description: 'Photo reviews & referral program',      category: 'Social Proof',  color: '#047857' },
      'Recharge':       { icon: CreditCard,    description: 'Subscriptions & recurring payments',    category: 'Subscriptions', color: '#059669' },
      'Smile.io':       { icon: Zap,           description: 'Loyalty, referrals & rewards',          category: 'Loyalty',       color: '#10b981' },
      'Lucky Orange':   { icon: Gauge,         description: 'Conversion rate optimization & heatmaps', category: 'Analytics',   color: '#047857' },
      'Hotjar':         { icon: TrendingUp,    description: 'Behavior analytics & heatmaps',         category: 'Analytics',     color: '#059669' },
      'Privy':          { icon: Mail,          description: 'Popups, email capture & SMS',           category: 'Marketing',     color: '#10b981' },
      'PageFly':        { icon: Layout,        description: 'Advanced page builder & landing pages', category: 'Page Builder',  color: '#047857' },
      'Shogun':         { icon: Layout,        description: 'Landing page & store builder',          category: 'Page Builder',  color: '#059669' },
      'AfterShip':      { icon: Rocket,        description: 'Order tracking & returns management',   category: 'Shipping',      color: '#10b981' },
      'Bold Commerce':  { icon: ShoppingCart,  description: 'Subscriptions, bundles & upsells',     category: 'Commerce',      color: '#047857' },
      'Omnisend':       { icon: Mail,          description: 'Email & SMS marketing platform',        category: 'Marketing',     color: '#059669' },
    };

    const shopifyThemeLabel = result.shopifyInfo?.themeName || 'Shopify Theme';

    return (
      <div className="space-y-4 md:space-y-6">
        {/* Shopify Confirmation Card */}
        <ShareBar resultId={result.id} />
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 md:p-6" data-testid="shopify-detected">
          <div className="flex flex-col sm:flex-row items-start gap-3 sm:space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <i className="fab fa-shopify text-green-600 text-lg"></i>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-bold text-green-800 mb-2 break-all" data-testid="text-domain">
                {result.domain}
              </h3>
              <p className="text-sm md:text-base text-green-700 mb-4">
                This website is running <span className="font-semibold">Shopify</span>
              </p>
              <div className="bg-white rounded-lg p-3 md:p-4 border border-green-200">
                <p className="text-sm text-green-700">Shopify eCommerce platform detected</p>
              </div>
            </div>
          </div>
        </div>

        {/* Shopify Theme Details Card */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 md:p-6" data-testid="shopify-theme-details">
          <div className="flex flex-col sm:flex-row items-start gap-3 sm:space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <i className="fas fa-paint-brush text-purple-600 text-lg"></i>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-purple-800 mb-3">
                Theme Details
              </h3>
              <div className="bg-white rounded-lg p-4 border border-purple-200 space-y-4">
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-purple-900 text-lg" data-testid="text-shopify-theme">
                            {shopifyThemeLabel}
                          </h4>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            <span className="inline-block text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                              Shopify Liquid
                            </span>
                            {result.shopifyInfo?.themeSource && result.shopifyInfo.themeSource !== 'Shopify Theme Store' && (
                              <span className="inline-block text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                                {result.shopifyInfo.themeSource}
                              </span>
                            )}
                            {result.shopifyInfo?.themeCategory && (
                              <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                                {result.shopifyInfo.themeCategory}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          {result.shopifyInfo?.themeVersion && (
                            <span className="text-sm text-purple-600 font-mono bg-purple-50 px-2 py-1 rounded" data-testid="text-shopify-version">
                              v{result.shopifyInfo.themeVersion}
                            </span>
                          )}
                          {result.shopifyInfo?.currency && (
                            <span className="text-xs text-purple-500 font-mono bg-purple-50 px-2 py-0.5 rounded" data-testid="text-shopify-currency">
                              {result.shopifyInfo.currency}
                            </span>
                          )}
                        </div>
                      </div>

                      {result.shopifyInfo?.themeDescription ? (
                        <p className="text-sm text-purple-700 mt-2">{result.shopifyInfo.themeDescription}</p>
                      ) : (
                        <p className="text-sm text-purple-700 mt-2">
                          {result.shopifyInfo?.shopDomain
                            ? `eCommerce Store · ${result.shopifyInfo.shopDomain}`
                            : 'eCommerce Platform'}
                        </p>
                      )}

                      <div className="flex items-center gap-2 text-sm mt-2">
                        <span className="text-purple-600">By:</span>
                        {result.shopifyInfo?.themeDeveloper ? (
                          result.shopifyInfo.themeDeveloperUrl ? (
                            <a
                              href={result.shopifyInfo.themeDeveloperUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-800 font-medium hover:underline"
                            >
                              {result.shopifyInfo.themeDeveloper}
                            </a>
                          ) : (
                            <span className="text-purple-800 font-medium">{result.shopifyInfo.themeDeveloper}</span>
                          )
                        ) : (
                          <a
                            href="https://www.shopify.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-800 font-medium hover:underline"
                          >
                            Shopify
                          </a>
                        )}
                      </div>

                      {result.shopifyInfo?.themeMarketUrl && (
                        <div className="mt-2">
                          <a
                            href={result.shopifyInfo.themeMarketUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 hover:underline"
                          >
                            <Globe className="w-4 h-4" />
                            View on {result.shopifyInfo.themeSource || 'ThemeForest'}
                            {result.shopifyInfo.themePrice && (
                              <span className="text-xs text-purple-500 ml-1">· {result.shopifyInfo.themePrice}</span>
                            )}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Theme screenshot — real image when available, SVG placeholder as fallback */}
                  <div className="flex justify-start">
                    {result.shopifyInfo?.themeScreenshot ? (
                      <img
                        src={result.shopifyInfo.themeScreenshot}
                        alt={`${shopifyThemeLabel} theme screenshot`}
                        className={`${compact ? 'w-full max-w-sm' : 'w-full'} h-auto object-cover rounded-lg border border-purple-200`}
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          const sibling = target.nextElementSibling as HTMLElement | null;
                          if (sibling) sibling.style.display = 'block';
                        }}
                      />
                    ) : null}
                    <div
                      className={`${compact ? 'w-full max-w-sm' : 'w-full'} rounded-lg border border-purple-200 overflow-hidden`}
                      style={{ aspectRatio: '16/9', display: result.shopifyInfo?.themeScreenshot ? 'none' : 'block' }}
                    >
                      <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 800 450"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ display: 'block' }}
                      >
                        <defs>
                          <linearGradient id="shopifyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#059669" />
                            <stop offset="100%" stopColor="#047857" />
                          </linearGradient>
                        </defs>
                        <rect width="800" height="450" fill="url(#shopifyGrad)" />
                        <rect x="0" y="0" width="800" height="450" fill="rgba(255,255,255,0.04)" />
                        <circle cx="650" cy="80" r="120" fill="rgba(255,255,255,0.05)" />
                        <circle cx="150" cy="370" r="90" fill="rgba(255,255,255,0.05)" />
                        <text x="400" y="190" textAnchor="middle" fontFamily="sans-serif" fontSize="28" fontWeight="700" fill="rgba(255,255,255,0.5)" letterSpacing="6">SHOPIFY</text>
                        <text x="400" y="240" textAnchor="middle" fontFamily="sans-serif" fontSize="22" fontWeight="700" fill="white">{shopifyThemeLabel}</text>
                        <text x="400" y="275" textAnchor="middle" fontFamily="sans-serif" fontSize="14" fill="rgba(255,255,255,0.7)">eCommerce Theme</text>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shopify Apps Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 md:p-6" data-testid="shopify-apps-details">
          <div className="flex flex-col sm:flex-row items-start gap-3 sm:space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Puzzle className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                Detected Shopify Apps
              </h3>
              <div className="bg-white rounded-lg p-4 border border-blue-200 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-blue-800">Apps</span>
                    <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      {result.shopifyInfo?.detectedApps?.length ?? 0} detected
                    </span>
                  </div>
                  {result.shopifyInfo?.detectedApps && result.shopifyInfo.detectedApps.length > 0 ? (
                    <div className="space-y-2" data-testid="list-shopify-apps">
                      {result.shopifyInfo.detectedApps.map((app) => {
                        const meta = shopifyAppMeta[app] || { icon: Puzzle, description: 'Shopify application', category: 'App', color: '#059669' };
                        const IconComponent = meta.icon;
                        return (
                          <div
                            key={app}
                            className="flex items-start gap-3 p-3 bg-gradient-to-r from-white to-blue-50/30 rounded-lg border border-blue-100/50 hover:border-blue-200 transition-colors"
                            data-testid={`shopify-app-${app.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            <div
                              className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
                              style={{ backgroundColor: meta.color }}
                            >
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-blue-900 text-sm">{app}</h4>
                                  <p className="text-xs text-blue-700/80 mt-0.5">{meta.description}</p>
                                </div>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium whitespace-nowrap">
                                  {meta.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-blue-600">
                      No third-party apps detected from frontend assets. Apps that load only server-side or use custom domains may not be visible.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Squarespace detected
  if (result.cmsType === 'squarespace') {
    const sqspFeatureMeta: Record<string, { icon: LucideIcon; description: string; category: string; color: string }> = {
      'Store':         { icon: ShoppingCart, description: 'Online store & product catalog',      category: 'E-commerce',   color: '#111111' },
      'Blog':          { icon: FileText,     description: 'Blogging & content publishing',       category: 'Content',      color: '#222222' },
      'Scheduling':    { icon: Layout,       description: 'Appointments & scheduling (Acuity)',  category: 'Services',     color: '#333333' },
      'Member Areas':  { icon: Shield,       description: 'Gated content & member-only pages',   category: 'Membership',   color: '#111111' },
      'Podcast':       { icon: Zap,          description: 'Podcast hosting & audio player',      category: 'Media',        color: '#222222' },
      'Newsletter':    { icon: Mail,         description: 'Email signup & newsletter forms',     category: 'Marketing',    color: '#333333' },
      'Courses':       { icon: Rocket,       description: 'Online courses & digital products',   category: 'Education',    color: '#111111' },
      'Donations':     { icon: CreditCard,   description: 'Donation forms & fundraising',        category: 'Fundraising',  color: '#222222' },
    };

    const sqspTemplateLabel = result.squarespaceInfo?.template || 'Squarespace Site';
    const sqspVersionLabel = result.squarespaceInfo?.version || null;

    return (
      <div className="space-y-4 md:space-y-6">
        {/* Squarespace Confirmation Card */}
        <ShareBar resultId={result.id} />
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 md:p-6" data-testid="squarespace-detected">
          <div className="flex flex-col sm:flex-row items-start gap-3 sm:space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <i className="fab fa-squarespace text-green-600 text-lg"></i>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-bold text-green-800 mb-2 break-all" data-testid="text-domain">
                {result.domain}
              </h3>
              <p className="text-sm md:text-base text-green-700 mb-4">
                This website is running <span className="font-semibold">Squarespace</span>
              </p>
              <div className="bg-white rounded-lg p-3 md:p-4 border border-green-200">
                <p className="text-sm text-green-700">
                  Squarespace website builder detected
                  {sqspVersionLabel && <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">v{sqspVersionLabel}</span>}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Squarespace Site Details Card */}
        {result.squarespaceInfo && (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 md:p-6" data-testid="squarespace-site-details">
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-paint-brush text-purple-600 text-lg"></i>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-purple-800 mb-3">
                  Site Details
                </h3>
                <div className="bg-white rounded-lg p-4 border border-purple-200 space-y-4">
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-bold text-purple-900 text-lg" data-testid="text-sqsp-template">
                              {sqspTemplateLabel}
                            </h4>
                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                              <span className="inline-block text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                                Squarespace
                              </span>
                              {result.squarespaceInfo.siteCategory && result.squarespaceInfo.siteCategory !== 'General' && (
                                <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                                  {result.squarespaceInfo.siteCategory}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            {sqspVersionLabel && (
                              <span className="text-sm text-purple-600 font-mono bg-purple-50 px-2 py-1 rounded" data-testid="text-sqsp-version">
                                v{sqspVersionLabel}
                              </span>
                            )}
                            {result.squarespaceInfo.language && (
                              <span className="text-xs text-purple-500 font-mono bg-purple-50 px-2 py-0.5 rounded" data-testid="text-sqsp-language">
                                {result.squarespaceInfo.language}
                              </span>
                            )}
                          </div>
                        </div>

                        {result.squarespaceInfo.siteDescription ? (
                          <p className="text-sm text-purple-700 mt-2">{result.squarespaceInfo.siteDescription}</p>
                        ) : (
                          <p className="text-sm text-purple-700 mt-2">Website Builder</p>
                        )}

                        <div className="flex items-center gap-2 text-sm mt-2">
                          <span className="text-purple-600">By:</span>
                          <a
                            href="https://www.squarespace.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-800 font-medium hover:underline"
                          >
                            Squarespace
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* SVG placeholder */}
                    <div className="flex justify-start">
                      <div
                        className={`${compact ? 'w-full max-w-sm' : 'w-full'} rounded-lg border border-purple-200 overflow-hidden`}
                        style={{ aspectRatio: '16/9' }}
                      >
                        <svg
                          width="100%"
                          height="100%"
                          viewBox="0 0 800 450"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ display: 'block' }}
                        >
                          <defs>
                            <linearGradient id="sqspGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#1a1a1a" />
                              <stop offset="100%" stopColor="#111111" />
                            </linearGradient>
                          </defs>
                          <rect width="800" height="450" fill="url(#sqspGrad)" />
                          <rect x="0" y="0" width="800" height="450" fill="rgba(255,255,255,0.02)" />
                          <circle cx="650" cy="80" r="120" fill="rgba(255,255,255,0.03)" />
                          <circle cx="150" cy="370" r="90" fill="rgba(255,255,255,0.03)" />
                          <text x="400" y="190" textAnchor="middle" fontFamily="sans-serif" fontSize="28" fontWeight="700" fill="rgba(255,255,255,0.4)" letterSpacing="6">SQUARESPACE</text>
                          <text x="400" y="240" textAnchor="middle" fontFamily="sans-serif" fontSize="22" fontWeight="700" fill="white">{sqspTemplateLabel}</text>
                          <text x="400" y="275" textAnchor="middle" fontFamily="sans-serif" fontSize="14" fill="rgba(255,255,255,0.6)">Website Builder</text>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Squarespace Features Card */}
        {result.squarespaceInfo?.detectedFeatures && result.squarespaceInfo.detectedFeatures.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 md:p-6" data-testid="squarespace-features-details">
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Puzzle className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  Detected Features
                </h3>
                <div className="bg-white rounded-lg p-4 border border-blue-200 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-blue-800">Features</span>
                      <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        {result.squarespaceInfo.detectedFeatures.length} detected
                      </span>
                    </div>
                    <div className="space-y-2" data-testid="list-squarespace-features">
                      {result.squarespaceInfo.detectedFeatures.map((feature) => {
                        const meta = sqspFeatureMeta[feature] || { icon: Puzzle, description: 'Squarespace feature', category: 'Feature', color: '#111111' };
                        const IconComponent = meta.icon;
                        return (
                          <div
                            key={feature}
                            className="flex items-start gap-3 p-3 bg-gradient-to-r from-white to-blue-50/30 rounded-lg border border-blue-100/50 hover:border-blue-200 transition-colors"
                            data-testid={`sqsp-feature-${feature.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            <div
                              className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
                              style={{ backgroundColor: meta.color }}
                            >
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-blue-900 text-sm">{feature}</h4>
                                  <p className="text-xs text-blue-700/80 mt-0.5">{meta.description}</p>
                                </div>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium whitespace-nowrap">
                                  {meta.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Joomla detected
  if (result.cmsType === 'joomla') {
    const joomlaExtensionMeta: Record<string, { icon: LucideIcon; description: string }> = {
      'com_content':   { icon: FileText,     description: 'Core articles & content management' },
      'com_users':     { icon: Shield,       description: 'User management & authentication' },
      'com_contact':   { icon: Mail,         description: 'Contact forms & directories' },
      'com_search':    { icon: Search,       description: 'Site-wide search' },
      'com_k2':        { icon: Layout,       description: 'K2 advanced content component' },
      'com_virtuemart': { icon: ShoppingCart, description: 'VirtueMart e-commerce store' },
      'com_hikashop':  { icon: ShoppingCart, description: 'HikaShop e-commerce' },
      'com_jevents':   { icon: Zap,          description: 'JEvents calendar & events' },
      'com_phocagallery': { icon: Image,     description: 'Phoca image gallery' },
      'mod_menu':      { icon: Layout,       description: 'Navigation menu module' },
      'mod_search':    { icon: Search,       description: 'Search module' },
    };

    const joomlaVersionLabel = result.joomlaInfo?.version || null;

    return (
      <div className="space-y-4 md:space-y-6">
        {/* Joomla Confirmation Card */}
        <ShareBar resultId={result.id} />
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 md:p-6" data-testid="joomla-detected">
          <div className="flex flex-col sm:flex-row items-start gap-3 sm:space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Globe className="text-green-600 w-5 h-5" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-bold text-green-800 mb-2 break-all" data-testid="text-domain">
                {result.domain}
              </h3>
              <p className="text-sm md:text-base text-green-700 mb-4">
                This website is running <span className="font-semibold">Joomla!</span>
              </p>
              <div className="bg-white rounded-lg p-3 md:p-4 border border-green-200">
                <p className="text-sm text-green-700">
                  Joomla! CMS detected
                  {joomlaVersionLabel && (
                    <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      v{joomlaVersionLabel}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Detected Extensions Card */}
        {result.joomlaInfo?.detectedExtensions && result.joomlaInfo.detectedExtensions.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 md:p-6" data-testid="joomla-extensions">
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Puzzle className="text-red-600 w-5 h-5" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-800 mb-3">Detected Extensions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.joomlaInfo.detectedExtensions.map((ext) => {
                    const meta = joomlaExtensionMeta[ext];
                    const Icon = meta?.icon || Puzzle;
                    return (
                      <div key={ext} className="bg-white rounded-lg p-3 border border-red-200 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#fee2e2' }}>
                          <Icon className="w-4 h-4" style={{ color: '#b91c1c' }} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-red-900 font-mono">{ext}</p>
                          {meta?.description && (
                            <p className="text-xs text-red-700 mt-0.5">{meta.description}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Platform not recognized
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 md:p-6 mb-4 md:mb-8" data-testid="platform-not-detected">
      <div className="flex flex-col sm:flex-row items-start gap-3 sm:space-x-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
            <i className="fas fa-question text-amber-600 text-lg"></i>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-base md:text-lg font-semibold text-amber-800 mb-2">
            Platform Not Recognized
          </h3>
          <p className="text-sm md:text-base text-amber-700 mb-4" data-testid="text-domain">
            <span className="font-medium break-all">{result.domain}</span> does not appear to be running WordPress, Wix, Shopify, Squarespace, or Joomla
          </p>
          {result.technologies && result.technologies.length > 0 && (
            <div className="bg-white rounded-lg p-3 md:p-4 border border-amber-200">
              <h4 className="font-medium text-amber-800 mb-2 text-sm md:text-base">Detected Technologies:</h4>
              <ul className="space-y-1 text-xs md:text-sm text-amber-700" data-testid="list-technologies">
                {result.technologies.map((tech, index) => (
                  <li key={index}>• {tech}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
