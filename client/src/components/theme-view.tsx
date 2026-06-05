import { Globe, Palette } from "lucide-react";
import type { DetectionResult } from "@/components/results-display";

interface ThemeViewProps {
  result: DetectionResult | null;
}

export default function ThemeView({ result }: ThemeViewProps) {
  // No scan yet
  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground gap-3">
        <Palette className="w-10 h-10 opacity-30" />
        <p className="text-sm">Run a scan to see theme details.</p>
      </div>
    );
  }

  const { themeInfo, theme, shopifyInfo } = result;

  // WordPress — rich themeInfo
  if (themeInfo) {
    return (
      <div className="max-w-2xl space-y-6">
        <h2 className="text-xl font-semibold text-foreground">Theme</h2>

        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 space-y-5">
          {/* Name + version */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-bold text-purple-900">{themeInfo.name}</h3>
                {themeInfo.isChildTheme && (
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                    Child Theme
                  </span>
                )}
              </div>
              {themeInfo.description && (
                <p className="text-sm text-purple-700 mt-2 leading-relaxed">{themeInfo.description}</p>
              )}
              {themeInfo.author && (
                <div className="flex items-center gap-2 text-sm mt-2">
                  <span className="text-purple-600">By:</span>
                  {themeInfo.authorUri ? (
                    <a
                      href={themeInfo.authorUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-800 font-medium hover:underline"
                    >
                      {themeInfo.author}
                    </a>
                  ) : (
                    <span className="text-purple-800 font-medium">{themeInfo.author}</span>
                  )}
                </div>
              )}
            </div>
            {themeInfo.version && (
              <span className="text-sm text-purple-600 font-mono bg-white border border-purple-200 px-2.5 py-1 rounded shrink-0">
                v{themeInfo.version}
              </span>
            )}
          </div>

          {/* Screenshot */}
          {themeInfo.screenshot && (
            <img
              src={themeInfo.screenshot}
              alt={`${themeInfo.name} screenshot`}
              className="w-full rounded-lg border border-purple-200 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}

          {/* Theme website link */}
          {themeInfo.themeUri && (
            <a
              href={themeInfo.themeUri}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-800 hover:underline"
            >
              <Globe className="w-4 h-4" />
              View Theme Website
            </a>
          )}

          {/* Tags */}
          {themeInfo.tags && themeInfo.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {themeInfo.tags.slice(0, 10).map((tag, i) => (
                <span key={i} className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Parent theme */}
          {themeInfo.isChildTheme && themeInfo.parentThemeInfo && (
            <div className="pt-4 border-t border-purple-200">
              <p className="text-xs font-medium text-purple-500 uppercase tracking-wide mb-2">Parent Theme</p>
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-purple-900">{themeInfo.parentThemeInfo.name}</h4>
                  {themeInfo.parentThemeInfo.version && (
                    <span className="text-xs text-purple-600 font-mono">
                      v{themeInfo.parentThemeInfo.version}
                    </span>
                  )}
                </div>
                {themeInfo.parentThemeInfo.author && (
                  <p className="text-sm text-purple-600 mt-1">By: {themeInfo.parentThemeInfo.author}</p>
                )}
                {themeInfo.parentThemeInfo.themeUri && (
                  <a
                    href={themeInfo.parentThemeInfo.themeUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-purple-500 hover:text-purple-700 hover:underline mt-2"
                  >
                    <Globe className="w-3 h-3" />
                    Theme website
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // WordPress fallback — theme slug only, no style.css parsed
  if (theme) {
    return (
      <div className="max-w-2xl space-y-6">
        <h2 className="text-xl font-semibold text-foreground">Theme</h2>
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
          <p className="text-sm text-purple-600 mb-1">Active Theme</p>
          <p className="text-lg font-semibold text-purple-900">{theme}</p>
        </div>
      </div>
    );
  }

  // Shopify theme
  if (shopifyInfo?.themeName) {
    return (
      <div className="max-w-2xl space-y-6">
        <h2 className="text-xl font-semibold text-foreground">Theme</h2>
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-green-900">{shopifyInfo.themeName}</h3>
              {shopifyInfo.themeId && (
                <p className="text-xs text-green-600 mt-1">Theme ID: {shopifyInfo.themeId}</p>
              )}
            </div>
            {shopifyInfo.themeVersion && (
              <span className="text-sm text-green-600 font-mono bg-white border border-green-200 px-2.5 py-1 rounded shrink-0">
                v{shopifyInfo.themeVersion}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // No theme data for this platform
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground gap-3">
      <Palette className="w-10 h-10 opacity-30" />
      <p className="text-sm">No theme data detected for this site.</p>
      <p className="text-xs opacity-60">Theme detection works for WordPress and Shopify sites.</p>
    </div>
  );
}
