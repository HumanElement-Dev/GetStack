import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, LogIn, Home, User, LogOut, LayoutDashboard } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";

export default function Header() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
  ];

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "U";
  };

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
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="focus:outline-none">
                    <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
                      <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "User"} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {getInitials(user.firstName || undefined, user.lastName || undefined)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="font-medium">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <Link href="/dashboard">
                    <DropdownMenuItem className="cursor-pointer">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-destructive" onClick={() => logout()}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link 
                href="/login" 
                className="p-2 rounded-lg bg-primary hover:bg-blue-600 text-primary-foreground transition-colors duration-200"
                data-testid="button-login-mobile"
              >
                <LogIn className="w-5 h-5" />
              </Link>
            )}
            
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

                  {/* Dashboard/Login button in mobile menu */}
                  <div className="p-4 border-t border-border">
                    {isAuthenticated ? (
                      <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                        <div className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-primary hover:bg-blue-600 text-primary-foreground rounded-lg transition-colors cursor-pointer font-medium">
                          <LayoutDashboard className="w-5 h-5" />
                          <span>Go to Dashboard</span>
                        </div>
                      </Link>
                    ) : (
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <div className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-primary hover:bg-blue-600 text-primary-foreground rounded-lg transition-colors cursor-pointer font-medium">
                          <LogIn className="w-5 h-5" />
                          <span>Sign In</span>
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-2 focus:outline-none">
                    <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
                      <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "User"} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {getInitials(user.firstName || undefined, user.lastName || undefined)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="font-medium">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <Link href="/dashboard">
                    <DropdownMenuItem className="cursor-pointer">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-destructive" onClick={() => logout()}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login" className="bg-primary hover:bg-blue-600 text-primary-foreground px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm" data-testid="button-login">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
