import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, LogIn, X, Home } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
  ];

  return (
    <header className="w-full border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" data-testid="link-home">
            <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#2563eb00]">
                <i className="fas fa-layer-group text-lg text-[#000000]"></i>
              </div>
              <span className="text-xl font-semibold text-foreground">GetStack</span>
            </div>
          </Link>
          
          {/* Mobile Navigation */}
          <div className="flex items-center space-x-2 md:hidden">
            {/* Dashboard icon button */}
            <Link 
              href="/dashboard" 
              className="p-2 rounded-lg bg-primary hover:bg-blue-600 text-primary-foreground transition-colors duration-200"
              data-testid="button-dashboard-mobile"
            >
              <LogIn className="w-5 h-5" />
            </Link>
            
            {/* Hamburger menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button 
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                  data-testid="button-hamburger"
                >
                  <Menu className="w-6 h-6 text-foreground" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] p-0">
                <div className="flex flex-col h-full bg-card">
                  {/* Mobile menu header */}
                  <div className="p-6 border-b border-border">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                        <i className="fas fa-layer-group text-xl text-primary"></i>
                      </div>
                      <span className="text-xl font-semibold text-foreground">GetStack</span>
                    </div>
                  </div>

                  {/* Navigation links */}
                  <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = location === item.path;
                      
                      return (
                        <Link key={item.label} href={item.path} onClick={() => setIsOpen(false)}>
                          <div
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                              isActive
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            <span>{item.label}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </nav>

                  {/* Dashboard button in mobile menu */}
                  <div className="p-4 border-t border-border">
                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                      <div className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-primary hover:bg-blue-600 text-primary-foreground rounded-lg transition-colors cursor-pointer font-medium">
                        <LogIn className="w-5 h-5" />
                        <span>Go to Dashboard</span>
                      </div>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/dashboard" className="bg-primary hover:bg-blue-600 text-primary-foreground px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm" data-testid="button-dashboard">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
