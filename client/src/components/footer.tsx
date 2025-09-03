export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <i className="fas fa-layer-group text-primary-foreground text-xs"></i>
            </div>
            <span className="text-foreground font-medium">GetStack</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 GetStack. A [HumanElement] Idea</p>
        </div>
      </div>
    </footer>
  );
}
