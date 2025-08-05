import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { Box } from "@/pages/Box";
import { TravelHomePage } from "@/pages/TravelHomePage";
import { ArticlePage } from "@/pages/ArticlePage";
import { TripDetailPage } from "@/pages/TripDetailPage";

function Router() {
  return (
    <Switch>
      {/* Add pages below */}
      <Route path="/" component={TravelHomePage} />
      <Route path="/article/:slug" component={ArticlePage} />
      <Route path="/trip/:id" component={TripDetailPage} />
      <Route path="/welcome" component={Box} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
