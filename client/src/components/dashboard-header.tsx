import { Bell, Menu, LogOut, Home, LayoutDashboard, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import DetectionForm from "@/components/detection-form";
import type { DetectionResult } from "@/components/results-display";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import MobileSidebar from "@/components/mobile-sidebar";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";

interface DashboardHeaderProps {
  onResult: (result: DetectionResult | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export default function DashboardHeader({ onResult, isLoading, setIsLoading }: DashboardHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "U";
  };

  return (
    <header className="h-auto min-h-16 bg-card border-b border-border flex flex-col md:flex-row items-center justify-between px-4 md:px-6 py-3 md:py-0 sticky top-0 z-40 gap-3 md:gap-6">
      <div className="flex items-center justify-between w-full md:w-auto">
        {/* Mobile Menu Button */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <button 
              className="p-2 rounded-lg hover:bg-muted transition-colors md:hidden"
              data-testid="button-mobile-menu"
            >
              <Menu className="w-5 h-5 text-muted-foreground" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <MobileSidebar onClose={() => setMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" data-testid="link-header-home">
          <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <i className="fas fa-layer-group text-xl text-primary"></i>
            </div>
            <span className="text-xl font-semibold text-foreground whitespace-nowrap">GetStack</span>
          </div>
        </Link>

        {/* Actions - visible on mobile next to logo */}
        <div className="flex items-center space-x-2 md:hidden">
          <button 
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            data-testid="button-notifications-mobile"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none">
                <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
                  <AvatarImage src={user?.profileImageUrl || undefined} alt={user?.firstName || "User"} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {getInitials(user?.firstName || undefined, user?.lastName || undefined)}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2">
                <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <Link href="/">
                <DropdownMenuItem className="cursor-pointer">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </DropdownMenuItem>
              </Link>
              <Link href="/dashboard">
                <DropdownMenuItem className="cursor-pointer">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </DropdownMenuItem>
              </Link>
              {(user as any)?.role === "super_admin" && (
                <Link href="/admin">
                  <DropdownMenuItem className="cursor-pointer">
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    Admin
                  </DropdownMenuItem>
                </Link>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive" onClick={() => logout()}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search/Detection Form - inline, full width on mobile */}
      <div className="flex-1 w-full md:max-w-2xl">
        <DetectionForm 
          onResult={onResult} 
          isLoading={isLoading} 
          setIsLoading={setIsLoading}
          inline
        />
      </div>

      {/* Actions - hidden on mobile, visible on desktop */}
      <div className="hidden md:flex items-center space-x-2">
        <button 
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          data-testid="button-notifications"
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="focus:outline-none">
              <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
                <AvatarImage src={user?.profileImageUrl || undefined} alt={user?.firstName || "User"} />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {getInitials(user?.firstName || undefined, user?.lastName || undefined)}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-3 py-2">
              <p className="font-medium">{user?.firstName} {user?.lastName}</p>
              <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <Link href="/">
              <DropdownMenuItem className="cursor-pointer">
                <Home className="w-4 h-4 mr-2" />
                Home
              </DropdownMenuItem>
            </Link>
            <Link href="/dashboard">
              <DropdownMenuItem className="cursor-pointer">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </DropdownMenuItem>
            </Link>
            {(user as any)?.role === "super_admin" && (
              <Link href="/admin">
                <DropdownMenuItem className="cursor-pointer">
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Admin
                </DropdownMenuItem>
              </Link>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive" onClick={() => logout()}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}