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
import { TripsPage } from "@/pages/TripsPage";
import { ChatPage } from "@/pages/ChatPage";
import { LoginPage } from "@/pages/LoginPage";
import { SignupPage } from "@/pages/SignupPage";
import ShopPage from "@/pages/ShopPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import AdminDashboard from "@/pages/AdminDashboard";
import HostDashboard from "@/pages/HostDashboard";
import AccommodationDashboard from "@/pages/AccommodationDashboard";

function Router() {
  return (
    <Switch>
      {/* Add pages below */}
      <Route path="/" component={TravelHomePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/trips" component={TripsPage} />
      <Route path="/chats" component={ChatPage} />
      <Route path="/article/:slug" component={ArticlePage} />
      <Route path="/trip/:id" component={TripDetailPage} />
      <Route path="/shop" component={ShopPage} />
      <Route path="/product/:slug" component={ProductDetailPage} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/host" component={HostDashboard} />
      <Route path="/accommodation" component={AccommodationDashboard} />
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
