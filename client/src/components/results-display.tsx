import type { Plugin, ThemeInfo } from "@shared/schema";
import { 
  Layout, ShoppingCart, Mail, Search, TrendingUp, 
  Zap, Shield, ShieldCheck, FileText, Image, Globe, Code, 
  Rocket, Gauge, HardDrive, Lock, Smartphone, Copy, 
  Edit, ArrowRight, Puzzle, CreditCard, FileInput, Database,
  type LucideIcon
} from "lucide-react";

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
  wordPressVersion?: string | null;
  theme?: string | null;
  themeInfo?: ThemeInfo | null;
  pluginCount?: string | null;
  plugins?: Plugin[];
  technologies?: string[];
  error?: string;
  createdAt: string;
}

interface ResultsDisplayProps {
  result: DetectionResult | null;
  isLoading: boolean;
}

export default function ResultsDisplay({ result, isLoading }: ResultsDisplayProps) {
  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl shadow-sm p-4 md:p-8 mb-4 md:mb-8" data-testid="loading-state">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
          <span className="text-foreground font-medium text-sm md:text-base">Analyzing website...</span>
        </div>
      </div>
    );
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
              {result.wordPressVersion && (
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2">WordPress Version:</h4>
                  <p className="text-sm text-green-700" data-testid="text-version">
                    {result.wordPressVersion}
                  </p>
                </div>
              )}
              {!result.wordPressVersion && (
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <p className="text-sm text-green-700">WordPress detected via standard indicators</p>
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
                        {result.themeInfo.screenshot && (
                          <div className="flex-shrink-0">
                            <img 
                              src={result.themeInfo.screenshot} 
                              alt={`${result.themeInfo.name} theme screenshot`}
                              className="w-32 h-24 md:w-40 md:h-28 object-cover rounded-lg border border-purple-200"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                        )}
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
    return (
      <div className="space-y-4 md:space-y-6">
        {/* Wix Confirmation Card */}
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
      </div>
    );
  }

  // Shopify detected
  if (result.cmsType === 'shopify') {
    return (
      <div className="space-y-4 md:space-y-6">
        {/* Shopify Confirmation Card */}
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
            <span className="font-medium break-all">{result.domain}</span> does not appear to be running WordPress, Wix, or Shopify
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
