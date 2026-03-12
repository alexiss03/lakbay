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
import { ProtectedRoute } from "@/components/ProtectedRoute";
import ShopPage from "@/pages/ShopPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import AdminDashboard from "@/pages/AdminDashboard";
import HostDashboard from "@/pages/HostDashboard";
import AccommodationDashboard from "@/pages/AccommodationDashboard";
import ShopDashboard from "@/pages/ShopDashboard";
import AudioStudioPage from "@/pages/AudioStudioPage";
import { TrailsPage } from "@/pages/TrailsPage";
import { SearchResultsPage } from "@/pages/SearchResultsPage";
import { ArticleFoodGuidePage } from "@/pages/ArticleFoodGuidePage";
import { ArticleIslandHoppingPage } from "@/pages/ArticleIslandHoppingPage";
import { ArticleMountainTribesPage } from "@/pages/ArticleMountainTribesPage";
import { StoryPage } from "@/pages/StoryPage";
import { CorporatePage } from "@/pages/CorporatePage";
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage";
import { TermsPage } from "@/pages/TermsPage";
import { PrivacyPage } from "@/pages/PrivacyPage";

function Router() {
  return (
    <Switch>
      {/* Add pages below */}
      <Route path="/" component={TravelHomePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/forgot-password" component={ForgotPasswordPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/trips">
        <ProtectedRoute>
          <TripsPage />
        </ProtectedRoute>
      </Route>
      <Route path="/chats">
        <ProtectedRoute>
          <ChatPage />
        </ProtectedRoute>
      </Route>
      <Route path="/trails" component={TrailsPage} />
      <Route path="/story" component={StoryPage} />
      <Route path="/corporate" component={CorporatePage} />
      <Route path="/search" component={SearchResultsPage} />
      <Route path="/article/food-guide" component={ArticleFoodGuidePage} />
      <Route path="/article/island-hopping" component={ArticleIslandHoppingPage} />
      <Route path="/article/mountain-tribes" component={ArticleMountainTribesPage} />
      <Route path="/article/:slug" component={ArticlePage} />
      <Route path="/trip/:id" component={TripDetailPage} />
      <Route path="/shop" component={ShopPage} />
      <Route path="/shop/product/:id" component={ProductDetailPage} />
      <Route path="/admin">
        <ProtectedRoute requireAdmin={true}>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/host">
        <ProtectedRoute requireHost={true}>
          <HostDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/accommodation">
        <ProtectedRoute requireHost={true}>
          <AccommodationDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/shop-manager">
        <ProtectedRoute requireHost={true}>
          <ShopDashboard />
        </ProtectedRoute>
      </Route>
      <Route path="/audio-studio" component={AudioStudioPage} />
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
        <div className="app-shell page-reveal">
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
