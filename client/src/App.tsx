import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import SubmitReport from "@/pages/submit-report";
import AnalyticsView from "@/pages/analytics.jsx";
import { MapIcon, BarChart3, FileInput, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { ThemeProvider } from "@/components/theme-provider";

function Navigation() {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="bg-background border-b sticky top-0 z-50 shadow-sm backdrop-blur-sm bg-background/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Road Safety Analytics
            </h1>
          </div>
          <div className="flex items-center space-x-8">
            <a 
              href="/" 
              className="text-foreground/80 hover:text-primary font-medium transition-colors flex items-center gap-2"
            >
              <MapIcon className="w-4 h-4" />
              Dashboard
            </a>
            <a 
              href="/submit" 
              className="text-foreground/80 hover:text-primary font-medium transition-colors flex items-center gap-2"
            >
              <FileInput className="w-4 h-4" />
              Data Collection
            </a>
            <a 
              href="/analytics" 
              className="text-foreground/80 hover:text-primary font-medium transition-colors flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Analysis
            </a>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="min-h-[calc(100vh-4rem)] bg-muted/10">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/analytics" component={AnalyticsView} />
          <Route path="/submit" component={SubmitReport} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="app-theme">
      <QueryClientProvider client={queryClient}>
        <Router />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;