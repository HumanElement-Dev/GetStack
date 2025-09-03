export default function FeatureSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
      <div className="text-center p-6">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-bolt text-primary text-lg"></i>
        </div>
        <h3 className="font-semibold text-foreground mb-2">Fast Detection</h3>
        <p className="text-sm text-muted-foreground">
          Get instant results with our advanced WordPress detection algorithms
        </p>
      </div>
      
      <div className="text-center p-6">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-shield-alt text-primary text-lg"></i>
        </div>
        <h3 className="font-semibold text-foreground mb-2">Secure Analysis</h3>
        <p className="text-sm text-muted-foreground">
          Safe and non-intrusive detection that respects website privacy
        </p>
      </div>
      
      <div className="text-center p-6">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-chart-line text-primary text-lg"></i>
        </div>
        <h3 className="font-semibold text-foreground mb-2">Detailed Insights</h3>
        <p className="text-sm text-muted-foreground">
          Get comprehensive information about WordPress installations
        </p>
      </div>
    </div>
  );
}
