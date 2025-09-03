import type { DetectionResult } from "@/pages/home";

interface ResultsDisplayProps {
  result: DetectionResult | null;
  isLoading: boolean;
}

export default function ResultsDisplay({ result, isLoading }: ResultsDisplayProps) {
  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl shadow-sm p-8 mb-8" data-testid="loading-state">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
          <span className="text-foreground font-medium">Analyzing website...</span>
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
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8" data-testid="error-state">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <i className="fas fa-exclamation-triangle text-yellow-600 text-lg"></i>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Analysis Error
            </h3>
            <p className="text-yellow-700" data-testid="text-error-message">
              {result.error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // WordPress detected
  if (result.isWordPress) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8" data-testid="wordpress-detected">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <i className="fab fa-wordpress text-green-600 text-lg"></i>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              WordPress Detected!
            </h3>
            <p className="text-green-700 mb-4" data-testid="text-domain">
              <span className="font-medium">{result.domain}</span> is running on WordPress
            </p>
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <h4 className="font-medium text-green-800 mb-2">Detection Details:</h4>
              <ul className="space-y-1 text-sm text-green-700">
                {result.wordPressVersion && (
                  <li data-testid="text-version">• WordPress Version: {result.wordPressVersion}</li>
                )}
                {result.theme && (
                  <li data-testid="text-theme">• Active Theme: {result.theme}</li>
                )}
                {result.pluginCount && (
                  <li data-testid="text-plugins">• Plugins: {result.pluginCount}</li>
                )}
                {!result.wordPressVersion && !result.theme && !result.pluginCount && (
                  <li>• WordPress detected via standard indicators</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // WordPress not detected
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8" data-testid="wordpress-not-detected">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <i className="fas fa-times text-red-600 text-lg"></i>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            WordPress Not Detected
          </h3>
          <p className="text-red-700 mb-4" data-testid="text-domain">
            <span className="font-medium">{result.domain}</span> does not appear to be running WordPress
          </p>
          {result.technologies && result.technologies.length > 0 && (
            <div className="bg-white rounded-lg p-4 border border-red-200">
              <h4 className="font-medium text-red-800 mb-2">Detected Technologies:</h4>
              <ul className="space-y-1 text-sm text-red-700" data-testid="list-technologies">
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
