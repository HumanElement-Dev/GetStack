export default function Header() {
  return (
    <header className="w-full border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#2563eb00]">
              <i className="fas fa-layer-group text-lg text-[#000000]"></i>
            </div>
            <span className="text-xl font-semibold text-foreground">GetStack</span>
          </div>
          
          {/* Navigation */}
          <button 
            className="bg-primary hover:bg-blue-600 text-primary-foreground px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm"
            data-testid="button-contact"
          >
            Contact Us
          </button>
        </div>
      </div>
    </header>
  );
}
