import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, ArrowLeft, Shield, Sparkles, Clock } from "lucide-react";
import { SiGoogle } from "react-icons/si";
import { trackEvent } from "@/lib/analytics";
import { Separator } from "@/components/ui/separator";

export default function Login() {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 to-secondary/5">
      <header className="p-4">
        <Button variant="ghost" onClick={() => setLocation("/")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-2">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Welcome to GetStack</CardTitle>
              <CardDescription className="text-base">
                Sign in to access your dashboard and saved sites
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>Access your premium dashboard</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>Save & monitor up to 100 sites</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Secure authentication</span>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <a 
                  href="/api/auth/google" 
                  className="block w-full"
                  onClick={() => trackEvent('login_click', 'auth', 'google_login')}
                >
                  <Button variant="outline" className="w-full h-12 text-base" size="lg">
                    <SiGoogle className="w-5 h-5 mr-2" />
                    Sign in with Google
                  </Button>
                </a>

                <div className="flex items-center gap-3">
                  <Separator className="flex-1" />
                  <span className="text-xs text-muted-foreground">or</span>
                  <Separator className="flex-1" />
                </div>

                <a 
                  href="/api/login" 
                  className="block w-full"
                  onClick={() => trackEvent('login_click', 'auth', 'replit_login')}
                >
                  <Button className="w-full h-12 text-base" size="lg">
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign in with Replit
                  </Button>
                </a>
              </div>

              <p className="text-xs text-center text-muted-foreground pt-2">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
