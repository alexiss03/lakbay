import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, Star, Clock, Brain, Sparkles, LogOut, Trophy, Target, Zap } from "lucide-react";
import { Link, useLocation } from "wouter";
import { ChatWidget } from "@/components/ChatWidget";
import { RecommendedSection } from "@/components/RecommendedSection";
import { PhilippinesMap } from "@/components/PhilippinesMap";
import { NavigationBar } from "@/components/NavigationBar";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiJsonRequest } from "@/lib/queryClient";

type TravelGoalAction =
  | "trip_completed"
  | "province_visited"
  | "travel_day"
  | "exploration_day"
  | "bonus_points"
  | "adventure_activity"
  | "wellness_activity";

interface TravelGoalSummary {
  goal: {
    year: number;
    targetTrips: number;
    targetProvinces: number;
    targetTravelDays: number;
    targetAdventure?: number;
    targetWellness?: number;
    targetExplorationDays?: number;
    targetPoints: number;
    currentTrips: number;
    currentProvinces: number;
    currentTravelDays: number;
    currentAdventure?: number;
    currentWellness?: number;
    currentExplorationDays?: number;
    currentPoints: number;
    notes?: string | null;
  };
  progress: {
    trips: { current: number; target: number; percent: number };
    provinces: { current: number; target: number; percent: number };
    travelDays: { current: number; target: number; percent: number };
    adventure?: { current: number; target: number; percent: number };
    wellness?: { current: number; target: number; percent: number };
    explorationDays?: { current: number; target: number; percent: number };
    points: { current: number; target: number; percent: number };
    overallCompletion: number;
  };
  gamification: {
    level: number;
    nextLevelPoints: number;
    xpToNextLevel: number;
    badges: string[];
    rank: string;
  };
}

export const TravelHomePage = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState("Private");
  const [nicheActiveTab, setNicheActiveTab] = useState("Astronomy");
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const currentYear = new Date().getFullYear();
  const [goalForm, setGoalForm] = useState({
    targetTrips: "6",
    targetProvinces: "8",
    targetTravelDays: "20",
  });

  const travelGoalQueryKey = ["/api/travel-goals", currentYear] as const;
  const { data: travelGoalData, isLoading: isTravelGoalLoading } = useQuery<TravelGoalSummary>({
    queryKey: travelGoalQueryKey,
    queryFn: () => apiJsonRequest("GET", `/api/travel-goals?year=${currentYear}`),
    enabled: isAuthenticated,
  });

  const saveGoalMutation = useMutation({
    mutationFn: (payload: {
      year: number;
      targetAdventure: number;
      targetWellness: number;
      targetExplorationDays: number;
      targetPoints: number;
    }) => apiJsonRequest("PUT", "/api/travel-goals", payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: travelGoalQueryKey });
      toast({
        title: "Goals Updated",
        description: `Your ${currentYear} travel goals are saved.`,
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Unable to save travel goals. Try again.",
        variant: "destructive",
      });
    },
  });

  const progressMutation = useMutation({
    mutationFn: (payload: { year: number; action: TravelGoalAction; amount: number }) =>
      apiJsonRequest("POST", "/api/travel-goals/progress", payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: travelGoalQueryKey });
    },
    onError: () => {
      toast({
        title: "Progress Update Failed",
        description: "Unable to update travel progress right now.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (!travelGoalData) return;
    setGoalForm({
      targetTrips: String(travelGoalData.goal.targetAdventure ?? travelGoalData.goal.targetTrips),
      targetProvinces: String(travelGoalData.goal.targetWellness ?? travelGoalData.goal.targetProvinces),
      targetTravelDays: String(
        travelGoalData.goal.targetExplorationDays ?? travelGoalData.goal.targetTravelDays,
      ),
    });
  }, [travelGoalData]);

  const computedTargetPoints =
    Math.max(1, Number(goalForm.targetTrips || 0)) * 120 +
    Math.max(1, Number(goalForm.targetProvinces || 0)) * 80 +
    Math.max(1, Number(goalForm.targetTravelDays || 0)) * 20;

  const handleSaveGoals = () => {
    const targetTrips = Math.max(1, Number(goalForm.targetTrips || 0));
    const targetProvinces = Math.max(1, Number(goalForm.targetProvinces || 0));
    const targetTravelDays = Math.max(1, Number(goalForm.targetTravelDays || 0));
    const targetPoints = targetTrips * 120 + targetProvinces * 80 + targetTravelDays * 20;

    saveGoalMutation.mutate({
      year: currentYear,
      targetAdventure: targetTrips,
      targetWellness: targetProvinces,
      targetExplorationDays: targetTravelDays,
      targetPoints,
    });
  };

  const logProgress = (action: TravelGoalAction) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Sign in to track travel goal progress.",
      });
      return;
    }
    progressMutation.mutate({ year: currentYear, action, amount: 1 });
  };
  
  // Sample travel history data for the interactive map
  const travelHistory = [
    { province: 'Bohol', region: 'Central Visayas', visits: 3, lastVisit: '2024-12-15' },
    { province: 'Palawan', region: 'MIMAROPA', visits: 2, lastVisit: '2024-11-20' },
    { province: 'Benguet', region: 'Cordillera', visits: 1, lastVisit: '2024-10-05' },
    { province: 'Siargao', region: 'Caraga', visits: 2, lastVisit: '2024-09-12' },
    { province: 'Cebu', region: 'Central Visayas', visits: 4, lastVisit: '2024-08-08' },
  ];

  // Handle auth success from OAuth redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authStatus = urlParams.get('auth');
    
    if (authStatus === 'success') {
      toast({
        title: "Welcome to Lakbay!",
        description: "You have successfully logged in with Google.",
      });
      // Clear the URL parameter
      setLocation('/');
    }
  }, [toast, setLocation]);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        toast({
          title: "Logged Out",
          description: "You have been successfully logged out.",
        });
        window.location.reload(); // Refresh to update auth state
      }
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "Unable to log out. Please try again.",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="min-h-screen view-shell fit-screen">
      {/* Header */}
      <header className="view-header">
        <div className="flex items-center justify-between">
          {/* Left: Logo placeholder */}
          <div className="w-8 h-8 bg-black" style={{borderRadius: '1px'}}></div>
          
          {/* Center: Navigation with Search */}
          <NavigationBar currentPage="home" />
          
          {/* Right: Buttons and Language */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-700">Welcome, {user?.firstName || user?.username}!</span>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="prada-button h-9 px-6 text-xs font-light border-black text-black hover:bg-black hover:text-white flex items-center"
                >
                  <LogOut className="w-3 h-3 mr-2" />
                  LOG OUT
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" className="prada-button h-9 px-6 text-xs font-light border-black text-black hover:bg-black hover:text-white">
                    LOG IN
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="prada-button prada-gold-accent h-9 px-6 text-xs font-light">
                    REGISTER
                  </Button>
                </Link>
              </>
            )}
            <span className="text-xs text-gray-500 font-light ml-4">EN</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-8 py-14">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-[#ff6a2c] mb-3">ACTIVITY-STYLE EXPERIENCE</p>
            <h1 className="prada-heading text-6xl text-[#1e2434] mb-6 leading-[1.04]">
              Track your travel goals like a pro
            </h1>
            <p className="text-lg text-[#5d6476] leading-relaxed font-medium max-w-xl mb-8">
              Clean mobile-card layouts, bold orange highlights, and quick actions across your Lakbay journeys.
            </p>
            <div className="flex items-center gap-3">
              <Link href="/trips">
                <Button className="prada-button prada-gold-accent px-7 py-6 text-sm">Start Exploring</Button>
              </Link>
              <Link href="/shop">
                <Button variant="outline" className="prada-button px-7 py-6 text-sm border-[#ff6c2f] text-[#ff6c2f]">
                  Open Shop
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Card className="fit-panel fit-mobile-card fit-orange p-6 flex flex-col justify-between">
              <div>
                <p className="text-xs tracking-[0.2em] opacity-80">WELLNESS + ADVENTURE</p>
                <h3 className="text-3xl font-bold mt-2">5 Activities</h3>
                <p className="text-sm opacity-85 mt-2">Your weekly mindful and adventurous streak</p>
              </div>
              <div className="mt-10 fit-grid-dots rounded-2xl p-4 bg-white/10">
                <div className="flex items-end gap-2 h-16">
                  {[30, 40, 35, 52, 58, 45, 60].map((v, i) => (
                    <div key={i} className="flex-1 rounded-md bg-white/80" style={{ height: `${v}%` }}></div>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="fit-panel fit-mobile-card p-6 flex flex-col justify-between">
              <div>
                <p className="text-xs tracking-[0.2em] text-[#D4AF37] font-semibold">YEARLY TRAVEL GOAL</p>
                <h3 className="text-3xl font-bold mt-2">
                  {isAuthenticated ? `${travelGoalData?.progress.overallCompletion ?? 0}%` : "Login"}
                </h3>
                <p className="text-sm mt-2">
                  {isAuthenticated
                    ? `Level ${travelGoalData?.gamification.level ?? 1} • ${travelGoalData?.goal.currentPoints ?? 0} XP`
                    : "Sign in to set and track your yearly goals"}
                </p>
              </div>

              <div className="rounded-3xl p-5 fit-soft border border-[#ffe1d3] space-y-4">
                {!isAuthenticated ? (
                  <div className="space-y-3">
                    <p className="text-sm">Build your travel streak, unlock badges, and track annual milestones.</p>
                    <Link href="/login">
                      <Button className="w-full prada-button prada-gold-accent">Log In to Start</Button>
                    </Link>
                  </div>
                ) : isTravelGoalLoading || !travelGoalData ? (
                  <p className="text-sm">Loading your goal progress...</p>
                ) : (
                  <>
                    <div className="space-y-2">
                      {[
                        {
                          key: "trips",
                          label: "Adventure Quests",
                          data: travelGoalData.progress.adventure ?? travelGoalData.progress.trips,
                          icon: <Target className="w-3 h-3" />,
                        },
                        {
                          key: "provinces",
                          label: "Wellness Sessions",
                          data: travelGoalData.progress.wellness ?? travelGoalData.progress.provinces,
                          icon: <MapPin className="w-3 h-3" />,
                        },
                        {
                          key: "days",
                          label: "Exploration Days",
                          data: travelGoalData.progress.explorationDays ?? travelGoalData.progress.travelDays,
                          icon: <Calendar className="w-3 h-3" />,
                        },
                        {
                          key: "xp",
                          label: "XP",
                          data: travelGoalData.progress.points,
                          icon: <Zap className="w-3 h-3" />,
                        },
                      ].map((item) => (
                        <div key={item.key}>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="flex items-center gap-1">
                              {item.icon}
                              {item.label}
                            </span>
                            <span>
                              {item.data.current}/{item.data.target}
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-black/10 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#D4AF37]"
                              style={{ width: `${item.data.percent}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {(travelGoalData.gamification.badges.length ? travelGoalData.gamification.badges : ["No badge yet"])
                        .slice(0, 3)
                        .map((badge) => (
                          <Badge key={badge} className="text-[10px] px-2 py-0.5 bg-[#D4AF37]/20 text-black border border-[#D4AF37]/40">
                            <Trophy className="w-2.5 h-2.5 mr-1" />
                            {badge}
                          </Badge>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="prada-button text-xs">
                            Set Goals
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle className="prada-heading text-xl">Set {currentYear} Goals</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            <div className="space-y-2">
                              <label className="text-xs uppercase tracking-wide">Adventure target</label>
                              <Input
                                type="number"
                                min={1}
                                value={goalForm.targetTrips}
                                onChange={(e) => setGoalForm((prev) => ({ ...prev, targetTrips: e.target.value }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs uppercase tracking-wide">Wellness target</label>
                              <Input
                                type="number"
                                min={1}
                                value={goalForm.targetProvinces}
                                onChange={(e) =>
                                  setGoalForm((prev) => ({ ...prev, targetProvinces: e.target.value }))
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs uppercase tracking-wide">Exploration days target</label>
                              <Input
                                type="number"
                                min={1}
                                value={goalForm.targetTravelDays}
                                onChange={(e) =>
                                  setGoalForm((prev) => ({ ...prev, targetTravelDays: e.target.value }))
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span>Computed XP target</span>
                              <span className="font-semibold">{computedTargetPoints.toLocaleString()} XP</span>
                            </div>
                            <Button
                              className="w-full prada-button prada-gold-accent"
                              onClick={handleSaveGoals}
                              disabled={saveGoalMutation.isPending}
                            >
                              {saveGoalMutation.isPending ? "Saving..." : "Save Goal"}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        className="prada-button prada-gold-accent text-xs"
                        onClick={() => logProgress("adventure_activity")}
                        disabled={progressMutation.isPending}
                      >
                        +1 Adventure
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        className="prada-button text-xs"
                        onClick={() => logProgress("wellness_activity")}
                        disabled={progressMutation.isPending}
                      >
                        +1 Wellness
                      </Button>
                      <Button
                        variant="outline"
                        className="prada-button text-xs"
                        onClick={() => logProgress("exploration_day")}
                        disabled={progressMutation.isPending}
                      >
                        +1 Exploration Day
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Recommended Section */}
      <section className="px-8 py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="prada-card p-6 cursor-pointer hover:shadow-lg transition-shadow">
                    <h3 className="prada-heading text-lg mb-3 font-light flex items-center">
                      <Brain className="w-5 h-5 mr-2 text-[#D4AF37]" />
                      Personalized Travel Tips for You
                    </h3>
                    <p className="text-sm text-gray-600 font-light leading-relaxed">
                      Powered by AI
                    </p>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="prada-heading text-2xl font-light flex items-center">
                      <Sparkles className="w-6 h-6 mr-2 text-[#D4AF37]" />
                      AI-Powered Trip Recommendations
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-6 mt-6">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 prada-corner-radius">
                      <h3 className="prada-heading text-lg mb-3 font-light">Based on Your Travel Profile</h3>
                      <p className="text-sm text-gray-600 font-light leading-relaxed">
                        Our AI analyzed your preferences for adventure travel, cultural experiences, and island destinations to create these personalized recommendations.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {[
                        {
                          id: 1,
                          title: "Siargao Surf & Culture Immersion",
                          location: "Siargao, Philippines",
                          duration: "5 days",
                          participants: "8-12 people",
                          price: "₱18,500",
                          rating: 4.9,
                          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
                          highlights: ["World-class surfing", "Local fishing village tour", "Island hopping", "Traditional Filipino cooking class"],
                          aiReason: "Perfect match for your love of water sports and cultural experiences",
                          confidence: 95
                        },
                        {
                          id: 2,
                          title: "Bohol Hidden Gems Explorer",
                          location: "Bohol, Philippines",
                          duration: "4 days",
                          participants: "6-10 people",
                          price: "₱12,800",
                          rating: 4.7,
                          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
                          highlights: ["Chocolate Hills trek", "Tarsier sanctuary visit", "Underground river exploration", "Local market tour"],
                          aiReason: "Ideal blend of nature adventure and wildlife experiences you enjoy",
                          confidence: 88
                        },
                        {
                          id: 3,
                          title: "Batanes Untouched Paradise",
                          location: "Batanes, Philippines",
                          duration: "6 days",
                          participants: "4-8 people",
                          price: "₱24,200",
                          rating: 4.8,
                          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
                          highlights: ["Rolling hills landscape", "Traditional stone houses", "Lighthouse trail", "Ivatan cultural immersion"],
                          aiReason: "Matches your preference for remote destinations and authentic cultural experiences",
                          confidence: 92
                        },
                        {
                          id: 4,
                          title: "Palawan Underground Wonders",
                          location: "Palawan, Philippines",
                          duration: "7 days",
                          participants: "10-14 people",
                          price: "₱19,750",
                          rating: 4.9,
                          image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
                          highlights: ["Underground river expedition", "El Nido island hopping", "Coron wreck diving", "Wildlife sanctuary visit"],
                          aiReason: "Combines adventure activities with natural wonders you've shown interest in",
                          confidence: 90
                        }
                      ].map((trip) => (
                        <Card key={trip.id} className="prada-card p-6 hover:shadow-lg transition-shadow">
                          <div className="space-y-4">
                            <div className="relative">
                              <img loading="lazy" decoding="async"
                                src={trip.image}
                                alt={trip.title}
                                className="w-full h-40 object-cover prada-corner-radius"
                              />
                              <Badge className="absolute top-2 right-2 bg-[#D4AF37] text-black">
                                {trip.confidence}% Match
                              </Badge>
                            </div>
                            
                            <div>
                              <h4 className="prada-heading text-lg font-light mb-2">{trip.title}</h4>
                              <div className="flex items-center text-sm text-gray-600 font-light mb-3">
                                <MapPin className="w-4 h-4 mr-1" />
                                {trip.location}
                              </div>
                              
                              <div className="flex flex-wrap gap-3 text-xs text-gray-600 font-light mb-3">
                                <div className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {trip.duration}
                                </div>
                                <div className="flex items-center">
                                  <Users className="w-3 h-3 mr-1" />
                                  {trip.participants}
                                </div>
                                <div className="flex items-center">
                                  <Star className="w-3 h-3 mr-1 fill-current text-yellow-400" />
                                  {trip.rating}
                                </div>
                              </div>
                              
                              <div className="bg-blue-50 p-3 prada-corner-radius mb-3">
                                <p className="text-xs text-blue-800 font-light italic">
                                  <Brain className="w-3 h-3 inline mr-1" />
                                  {trip.aiReason}
                                </p>
                              </div>
                              
                              <div className="mb-4">
                                <h5 className="text-sm font-medium text-gray-900 mb-2">Trip Highlights:</h5>
                                <ul className="space-y-1">
                                  {trip.highlights.map((highlight, index) => (
                                    <li key={index} className="text-xs text-gray-600 font-light flex items-center">
                                      <div className="w-1 h-1 bg-[#D4AF37] rounded-full mr-2" />
                                      {highlight}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="text-lg font-light text-[#D4AF37]">{trip.price}</div>
                                <Link href={`/trip/${trip.id}`}>
                                  <Button className="bg-[#D4AF37] hover:bg-[#B8941F] text-black font-light tracking-wider text-xs px-4 py-2">
                                    VIEW DETAILS
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                    
                    <div className="bg-gray-50 p-6 prada-corner-radius">
                      <h3 className="prada-heading text-lg mb-3 font-light">How AI Recommendations Work</h3>
                      <div className="grid md:grid-cols-3 gap-4 text-sm font-light">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Travel History Analysis</h4>
                          <p className="text-gray-600">AI analyzes your past bookings, ratings, and preferences</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Behavioral Patterns</h4>
                          <p className="text-gray-600">Learns from your browsing behavior and trip interactions</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Real-time Updates</h4>
                          <p className="text-gray-600">Recommendations improve with every trip and review you provide</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              
              <div className="prada-card p-6">
                <h3 className="prada-heading text-lg mb-3 font-light">Join Tala</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">
                  Connect with fellow travel enthusiasts.
                </p>
              </div>
              
              <div className="prada-card p-6">
                <h3 className="prada-heading text-lg mb-3 font-light">Lakbay Tales</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">
                  Share your island stories. Keep your travel memories.
                </p>
              </div>
            </div>


          </div>

          {/* Right Column - Philippines Map */}
          <div className="lg:col-span-1">
            <div className="prada-card p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="prada-heading text-lg font-light">Philippines</h3>
              </div>
              <div className="aspect-square relative">
                {/* Interactive Philippines Map */}
                <PhilippinesMap visitedProvinces={travelHistory} className="h-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Tabs */}
      <section className="px-8 py-16 bg-white">
        <div className="mx-auto flex max-w-7xl space-x-8 overflow-x-auto mb-12 border-b border-gray-100">
          {["Private", "Joiner", "Meetups", "Mystery", "Events", "Virtual", "Wellness", "Online Quizzes", "Niche Events"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`prada-nav pb-4 transition-all duration-200 ${
                activeTab === tab
                  ? "text-black font-light border-b border-[#D4AF37]"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {activeTab === "Private" && [
            { title: "Exclusive Mount Pulag VIP Trek", location: "Benguet", price: "₱25,000", image: "1464822759844-d150baec0494", link: "/trip/mount-pulag-private", category: "private" },
            { title: "Private Bohol Island Tour", location: "Bohol", price: "₱18,000", image: "1506905925346-21bda4d32df4", link: "/trip/bohol-private", category: "private" },
            { title: "Luxury Vigan Heritage Experience", location: "Ilocos Sur", price: "₱22,000", image: "1609137144813-7d9921338f24", link: "/trip/vigan-private", category: "private" }
          ].map((trip, i) => (
            <Link key={i} href={trip.link}>
              <div className="prada-card overflow-hidden group cursor-pointer">
                <div className="relative h-36 sm:h-40">
                  <img loading="lazy" decoding="async" 
                    src={`https://images.unsplash.com/photo-${trip.image}?w=400&h=300&fit=crop&auto=format`}
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="prada-gold-accent text-xs px-3 py-1 font-light tracking-wider" style={{borderRadius: '1px'}}>{trip.category.toUpperCase()}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-light text-sm mb-1 tracking-wide">{trip.title}</h3>
                    <p className="text-xs opacity-90 font-light">{trip.location}</p>
                    <p className="text-sm font-light tracking-wider mt-1">{trip.price}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {activeTab === "Joiner" && [
            { title: "Mount Pulag Group Trek", location: "Benguet", price: "₱3,500", image: "1464822759844-d150baec0494", link: "/trip/mount-pulag-joiner" },
            { title: "Siargao Surf Camp", location: "Siargao", price: "₱4,800", image: "1544551763-46a013bb70d5", link: "/trip/siargao-joiner" },
            { title: "Palawan Island Hopping", location: "Palawan", price: "₱5,200", image: "1507525428034-b723cf961d3e", link: "/trip/palawan-joiner" }
          ].map((trip, i) => (
            <Link key={i} href={trip.link}>
              <div className="prada-card overflow-hidden group cursor-pointer">
                <div className="relative h-36 sm:h-40">
                  <img loading="lazy" decoding="async" 
                    src={`https://images.unsplash.com/photo-${trip.image}?w=400&h=300&fit=crop&auto=format`}
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-600 text-white text-xs px-3 py-1 font-light tracking-wider" style={{borderRadius: '1px'}}>JOINER</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-light text-sm mb-1 tracking-wide">{trip.title}</h3>
                    <p className="text-xs opacity-90 font-light">{trip.location}</p>
                    <p className="text-sm font-light tracking-wider mt-1">{trip.price}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {activeTab === "Meetups" && [
            { title: "Manila Hiking Meetup", location: "Metro Manila", price: "₱500", image: "1441974231531-c6227db76b6e", link: "/trip/manila-meetup" },
            { title: "Cebu Photography Walk", location: "Cebu City", price: "₱300", image: "1506905925346-21bda4d32df4", link: "/trip/cebu-meetup" },
            { title: "Baguio Coffee Tour", location: "Baguio", price: "₱800", image: "1609137144813-7d9921338f24", link: "/trip/baguio-meetup" }
          ].map((trip, i) => (
            <Link key={i} href={trip.link}>
              <Card className="overflow-hidden rounded-lg group cursor-pointer">
                <div className="relative h-36 sm:h-40">
                  <img loading="lazy" decoding="async" 
                    src={`https://images.unsplash.com/photo-${trip.image}?w=400&h=300&fit=crop&auto=format`}
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Meetup</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <h3 className="font-semibold text-sm mb-1">{trip.title}</h3>
                    <p className="text-xs opacity-90">{trip.location}</p>
                    <p className="text-sm font-bold">{trip.price}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}

          {activeTab === "Mystery" && [
            { title: "Secret Island Adventure", location: "??? Philippines", price: "₱12,000", image: "1507525428034-b723cf961d3e", link: "/trip/mystery-island" },
            { title: "Hidden Waterfalls Quest", location: "??? Luzon", price: "₱8,500", image: "1441974231531-c6227db76b6e", link: "/trip/mystery-waterfalls" },
            { title: "Underground Cave Expedition", location: "??? Mindanao", price: "₱15,000", image: "1544551763-46a013bb70d5", link: "/trip/mystery-caves" }
          ].map((trip, i) => (
            <Link key={i} href={trip.link}>
              <Card className="overflow-hidden rounded-lg group cursor-pointer">
                <div className="relative h-36 sm:h-40">
                  <img loading="lazy" decoding="async" 
                    src={`https://images.unsplash.com/photo-${trip.image}?w=400&h=300&fit=crop&auto=format`}
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">Mystery</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <h3 className="font-semibold text-sm mb-1">{trip.title}</h3>
                    <p className="text-xs opacity-90">{trip.location}</p>
                    <p className="text-sm font-bold">{trip.price}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}

          {activeTab === "Events" && [
            { title: "Sinulog Festival Experience", location: "Cebu", price: "₱6,500", image: "1556909114-f6e7ad7d3136", link: "/trip/sinulog-festival" },
            { title: "Ati-Atihan Cultural Festival", location: "Aklan", price: "₱7,200", image: "1609137144813-7d9921338f24", link: "/trip/ati-atihan" },
            { title: "Masskara Festival Tour", location: "Bacolod", price: "₱5,800", image: "1506905925346-21bda4d32df4", link: "/trip/masskara" }
          ].map((trip, i) => (
            <Link key={i} href={trip.link}>
              <Card className="overflow-hidden rounded-lg group cursor-pointer">
                <div className="relative h-36 sm:h-40">
                  <img loading="lazy" decoding="async" 
                    src={`https://images.unsplash.com/photo-${trip.image}?w=400&h=300&fit=crop&auto=format`}
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">Event</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <h3 className="font-semibold text-sm mb-1">{trip.title}</h3>
                    <p className="text-xs opacity-90">{trip.location}</p>
                    <p className="text-sm font-bold">{trip.price}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}

          {activeTab === "Virtual" && [
            { title: "360° Banaue Rice Terraces Tour", location: "Virtual Experience", price: "₱299", image: "1441974231531-c6227db76b6e", link: "/trip/virtual-banaue" },
            { title: "VR Underwater Tubbataha Reef", location: "Virtual Diving", price: "₱199", image: "1507525428034-b723cf961d3e", link: "/trip/virtual-tubbataha" },
            { title: "Online Manila Heritage Walk", location: "Virtual Tour", price: "₱150", image: "1609137144813-7d9921338f24", link: "/trip/virtual-manila" }
          ].map((trip, i) => (
            <Link key={i} href={trip.link}>
              <Card className="overflow-hidden rounded-lg group cursor-pointer">
                <div className="relative h-36 sm:h-40">
                  <img loading="lazy" decoding="async" 
                    src={`https://images.unsplash.com/photo-${trip.image}?w=400&h=300&fit=crop&auto=format`}
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">Virtual</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <h3 className="font-semibold text-sm mb-1">{trip.title}</h3>
                    <p className="text-xs opacity-90">{trip.location}</p>
                    <p className="text-sm font-bold">{trip.price}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}

          {activeTab === "Wellness" && [
            { title: "Baguio Yoga & Meditation Retreat", location: "Baguio City", price: "₱8,500", image: "1506905925346-21bda4d32df4", link: "/trip/baguio-wellness" },
            { title: "Palawan Spa & Beach Wellness", location: "El Nido", price: "₱12,000", image: "1507525428034-b723cf961d3e", link: "/trip/palawan-wellness" },
            { title: "Mount Makiling Forest Therapy", location: "Laguna", price: "₱4,800", image: "1441974231531-c6227db76b6e", link: "/trip/makiling-wellness" }
          ].map((retreat, i) => (
            <Link key={i} href={retreat.link}>
              <div className="prada-card overflow-hidden group cursor-pointer">
                <div className="relative h-36 sm:h-40">
                  <img loading="lazy" decoding="async" 
                    src={`https://images.unsplash.com/photo-${retreat.image}?w=400&h=300&fit=crop&auto=format`}
                    alt={retreat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-emerald-500 text-white text-xs px-3 py-1 font-light tracking-wider prada-corner-radius">WELLNESS</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-light text-sm mb-1 tracking-wide">{retreat.title}</h3>
                    <p className="text-xs opacity-90 font-light">{retreat.location}</p>
                    <p className="text-sm font-light tracking-wider mt-1">{retreat.price}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {activeTab === "Online Quizzes" && [
            { title: "Philippines Geography & Culture Quiz", location: "5 minutes • 5 questions", price: "FREE", image: "1506905925346-21bda4d32df4", link: "/trip/philippines-geography-quiz", difficulty: "Beginner", passingScore: "70%" },
            { title: "Filipino Heritage & Traditions", location: "7 minutes • 8 questions", price: "FREE", image: "1609137144813-7d9921338f24", link: "/trip/heritage-quiz", difficulty: "Intermediate", passingScore: "75%" },
            { title: "Adventure Travel Safety Quiz", location: "10 minutes • 12 questions", price: "FREE", image: "1441974231531-c6227db76b6e", link: "/trip/safety-quiz", difficulty: "Advanced", passingScore: "80%" }
          ].map((quiz, i) => (
            <Link key={i} href={quiz.link}>
              <div className="prada-card overflow-hidden group cursor-pointer">
                <div className="relative h-36 sm:h-40">
                  <img loading="lazy" decoding="async" 
                    src={`https://images.unsplash.com/photo-${quiz.image}?w=400&h=300&fit=crop&auto=format`}
                    alt={quiz.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-[#D4AF37] text-black text-xs px-3 py-1 font-light tracking-wider prada-corner-radius">QUIZ</span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className={`text-xs px-2 py-1 prada-corner-radius font-light ${
                      quiz.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                      quiz.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {quiz.difficulty.toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-light text-sm mb-1 tracking-wide">{quiz.title}</h3>
                    <p className="text-xs opacity-90 font-light">{quiz.location}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm font-light tracking-wider text-[#D4AF37]">{quiz.price}</p>
                      <span className="text-xs opacity-75">Pass: {quiz.passingScore}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Discover Niche Events Section */}
      <section className="px-8 py-16 bg-gray-50">
        <h2 className="mx-auto max-w-7xl prada-heading text-3xl text-black mb-6 font-light">DISCOVER NICHE EVENTS</h2>
        <p className="mx-auto max-w-7xl text-gray-600 mb-12 font-light tracking-wide">Experience unique, specialized adventures tailored for passionate enthusiasts and curious explorers</p>
        
        {/* Niche Categories Navigation */}
        <div className="mx-auto flex max-w-7xl space-x-8 mb-12 border-b border-gray-100 overflow-x-auto">
          {[
            { name: "Astronomy", label: "Astronomical Tours", icon: "🌟" },
            { name: "Foraging", label: "Foraging Expeditions", icon: "🍄" },
            { name: "Archaeology", label: "Archaeological Digs", icon: "🏺" },
            { name: "Photography", label: "Bird Photography", icon: "📸" },
            { name: "Spelunking", label: "Cave Spelunking", icon: "🕳️" },
            { name: "Crafts", label: "Traditional Crafts", icon: "🎨" },
            { name: "Marine", label: "Marine Biology", icon: "🐠" },
            { name: "Language", label: "Language Immersion", icon: "🗣️" }
          ].map((tab) => (
            <button
              key={tab.name}
              onClick={() => setNicheActiveTab(tab.name)}
              className={`flex items-center space-x-2 pb-4 transition-all duration-200 whitespace-nowrap ${
                nicheActiveTab === tab.name
                  ? "text-black font-light border-b border-[#D4AF37]"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="prada-nav text-xs tracking-wider">{tab.label.toUpperCase()}</span>
            </button>
          ))}
        </div>

        {/* Niche Events Content */}
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {nicheActiveTab === "Astronomy" && [
            { title: "Perseid Meteor Shower Observatory", location: "Benguet Observatory", price: "₱4,500", image: "1464822759844-d150baec0494", link: "/trip/meteor-shower", category: "astronomy" },
            { title: "Solar Eclipse Viewing Expedition", location: "Batanes", price: "₱8,000", image: "1506905925346-21bda4d32df4", link: "/trip/solar-eclipse", category: "astronomy" },
            { title: "Dark Sky Photography Workshop", location: "Mount Pulag", price: "₱6,200", image: "1609137144813-7d9921338f24", link: "/trip/dark-sky-photo", category: "astronomy" }
          ].map((event, i) => (
            <Link key={i} href={event.link}>
              <div className="prada-card overflow-hidden group cursor-pointer">
                <div className="relative h-36 sm:h-40">
                  <img loading="lazy" decoding="async" 
                    src={`https://images.unsplash.com/photo-${event.image}?w=400&h=300&fit=crop&auto=format`}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-purple-600 text-white text-xs px-3 py-1 font-light tracking-wider" style={{borderRadius: '1px'}}>{event.category.toUpperCase()}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-light text-sm mb-1 tracking-wide">{event.title}</h3>
                    <p className="text-xs opacity-90 font-light">{event.location}</p>
                    <p className="text-sm font-light tracking-wider mt-1">{event.price}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {nicheActiveTab === "Foraging" && [
            { title: "Wild Mushroom Hunting Expedition", location: "Cordillera Mountains", price: "₱3,800", image: "1464822759844-d150baec0494", link: "/trip/mushroom-foraging", category: "foraging" },
            { title: "Edible Plant Identification Tour", location: "Bohol Forest", price: "₱2,900", image: "1544551763-46a013bb70d5", link: "/trip/plant-foraging", category: "foraging" },
            { title: "Traditional Herbal Medicine Walk", location: "Palawan Rainforest", price: "₱4,200", image: "1507525428034-b723cf961d3e", link: "/trip/herbal-walk", category: "foraging" }
          ].map((event, i) => (
            <Link key={i} href={event.link}>
              <div className="prada-card overflow-hidden group cursor-pointer">
                <div className="relative h-36 sm:h-40">
                  <img loading="lazy" decoding="async" 
                    src={`https://images.unsplash.com/photo-${event.image}?w=400&h=300&fit=crop&auto=format`}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-700 text-white text-xs px-3 py-1 font-light tracking-wider" style={{borderRadius: '1px'}}>{event.category.toUpperCase()}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-light text-sm mb-1 tracking-wide">{event.title}</h3>
                    <p className="text-xs opacity-90 font-light">{event.location}</p>
                    <p className="text-sm font-light tracking-wider mt-1">{event.price}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {nicheActiveTab === "Archaeology" && [
            { title: "Pre-Colonial Site Excavation", location: "Cagayan Valley", price: "₱5,500", image: "1441974231531-c6227db76b6e", link: "/trip/archaeological-dig", category: "archaeology" },
            { title: "Spanish Colonial Ruins Tour", location: "Intramuros", price: "₱3,200", image: "1609137144813-7d9921338f24", link: "/trip/colonial-ruins", category: "archaeology" },
            { title: "Ancient Pottery Workshop", location: "Vigan", price: "₱2,800", image: "1506905925346-21bda4d32df4", link: "/trip/pottery-archaeology", category: "archaeology" }
          ].map((event, i) => (
            <Link key={i} href={event.link}>
              <div className="prada-card overflow-hidden group cursor-pointer">
                <div className="relative h-36 sm:h-40">
                  <img loading="lazy" decoding="async" 
                    src={`https://images.unsplash.com/photo-${event.image}?w=400&h=300&fit=crop&auto=format`}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-amber-600 text-white text-xs px-3 py-1 font-light tracking-wider" style={{borderRadius: '1px'}}>{event.category.toUpperCase()}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-light text-sm mb-1 tracking-wide">{event.title}</h3>
                    <p className="text-xs opacity-90 font-light">{event.location}</p>
                    <p className="text-sm font-light tracking-wider mt-1">{event.price}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {nicheActiveTab === "Photography" && [
            { title: "Endemic Bird Photography Safari", location: "Mount Makiling", price: "₱4,800", image: "1544551763-46a013bb70d5", link: "/trip/bird-photography", category: "photography" },
            { title: "Underwater Macro Photography", location: "Anilao", price: "₱6,500", image: "1507525428034-b723cf961d3e", link: "/trip/macro-photography", category: "photography" },
            { title: "Cultural Portrait Documentation", location: "Ifugao", price: "₱5,200", image: "1464822759844-d150baec0494", link: "/trip/portrait-documentation", category: "photography" }
          ].map((event, i) => (
            <Link key={i} href={event.link}>
              <div className="prada-card overflow-hidden group cursor-pointer">
                <div className="relative h-36 sm:h-40">
                  <img loading="lazy" decoding="async" 
                    src={`https://images.unsplash.com/photo-${event.image}?w=400&h=300&fit=crop&auto=format`}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-indigo-600 text-white text-xs px-3 py-1 font-light tracking-wider" style={{borderRadius: '1px'}}>{event.category.toUpperCase()}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-light text-sm mb-1 tracking-wide">{event.title}</h3>
                    <p className="text-xs opacity-90 font-light">{event.location}</p>
                    <p className="text-sm font-light tracking-wider mt-1">{event.price}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {nicheActiveTab === "Spelunking" && [
            { title: "Underground River Cave System", location: "Palawan", price: "₱7,200", image: "1441974231531-c6227db76b6e", link: "/trip/cave-spelunking", category: "spelunking" },
            { title: "Limestone Cave Exploration", location: "Sagada", price: "₱3,800", image: "1506905925346-21bda4d32df4", link: "/trip/limestone-caves", category: "spelunking" },
            { title: "Advanced Cave Photography Tour", location: "Bohol", price: "₱5,400", image: "1609137144813-7d9921338f24", link: "/trip/cave-photography", category: "spelunking" }
          ].map((event, i) => (
            <Link key={i} href={event.link}>
              <div className="prada-card overflow-hidden group cursor-pointer">
                <div className="relative h-36 sm:h-40">
                  <img loading="lazy" decoding="async" 
                    src={`https://images.unsplash.com/photo-${event.image}?w=400&h=300&fit=crop&auto=format`}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-gray-700 text-white text-xs px-3 py-1 font-light tracking-wider" style={{borderRadius: '1px'}}>{event.category.toUpperCase()}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-light text-sm mb-1 tracking-wide">{event.title}</h3>
                    <p className="text-xs opacity-90 font-light">{event.location}</p>
                    <p className="text-sm font-light tracking-wider mt-1">{event.price}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {nicheActiveTab === "Crafts" && [
            { title: "Ifugao Basket Weaving Workshop", location: "Banaue", price: "₱2,800", image: "1464822759844-d150baec0494", link: "/trip/basket-weaving", category: "crafts" },
            { title: "Traditional Pottery Making", location: "Vigan", price: "₱3,200", image: "1609137144813-7d9921338f24", link: "/trip/pottery-making", category: "crafts" },
            { title: "Mindanao Textile Artisan Course", location: "Davao", price: "₱4,500", image: "1506905925346-21bda4d32df4", link: "/trip/textile-crafts", category: "crafts" }
          ].map((event, i) => (
            <Link key={i} href={event.link}>
              <div className="prada-card overflow-hidden group cursor-pointer">
                <div className="relative h-36 sm:h-40">
                  <img loading="lazy" decoding="async" 
                    src={`https://images.unsplash.com/photo-${event.image}?w=400&h=300&fit=crop&auto=format`}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-pink-600 text-white text-xs px-3 py-1 font-light tracking-wider" style={{borderRadius: '1px'}}>{event.category.toUpperCase()}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-light text-sm mb-1 tracking-wide">{event.title}</h3>
                    <p className="text-xs opacity-90 font-light">{event.location}</p>
                    <p className="text-sm font-light tracking-wider mt-1">{event.price}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {nicheActiveTab === "Marine" && [
            { title: "Coral Research Expedition", location: "Apo Island", price: "₱8,500", image: "1507525428034-b723cf961d3e", link: "/trip/coral-research", category: "marine" },
            { title: "Marine Species Documentation", location: "Batangas", price: "₱6,200", image: "1544551763-46a013bb70d5", link: "/trip/marine-documentation", category: "marine" },
            { title: "Underwater Ecosystem Study", location: "Donsol", price: "₱7,800", image: "1441974231531-c6227db76b6e", link: "/trip/ecosystem-study", category: "marine" }
          ].map((event, i) => (
            <Link key={i} href={event.link}>
              <div className="prada-card overflow-hidden group cursor-pointer">
                <div className="relative h-36 sm:h-40">
                  <img loading="lazy" decoding="async" 
                    src={`https://images.unsplash.com/photo-${event.image}?w=400&h=300&fit=crop&auto=format`}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-blue-600 text-white text-xs px-3 py-1 font-light tracking-wider" style={{borderRadius: '1px'}}>{event.category.toUpperCase()}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-light text-sm mb-1 tracking-wide">{event.title}</h3>
                    <p className="text-xs opacity-90 font-light">{event.location}</p>
                    <p className="text-sm font-light tracking-wider mt-1">{event.price}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {nicheActiveTab === "Language" && [
            { title: "Tagalog Immersion Experience", location: "Manila", price: "₱2,500", image: "1609137144813-7d9921338f24", link: "/trip/tagalog-immersion", category: "language" },
            { title: "Cebuano Cultural Language Tour", location: "Cebu", price: "₱3,200", image: "1506905925346-21bda4d32df4", link: "/trip/cebuano-language", category: "language" },
            { title: "Ilocano Heritage Language Study", location: "Vigan", price: "₱2,800", image: "1464822759844-d150baec0494", link: "/trip/ilocano-heritage", category: "language" }
          ].map((event, i) => (
            <Link key={i} href={event.link}>
              <div className="prada-card overflow-hidden group cursor-pointer">
                <div className="relative h-36 sm:h-40">
                  <img loading="lazy" decoding="async" 
                    src={`https://images.unsplash.com/photo-${event.image}?w=400&h=300&fit=crop&auto=format`}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-teal-600 text-white text-xs px-3 py-1 font-light tracking-wider" style={{borderRadius: '1px'}}>{event.category.toUpperCase()}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-light text-sm mb-1 tracking-wide">{event.title}</h3>
                    <p className="text-xs opacity-90 font-light">{event.location}</p>
                    <p className="text-sm font-light tracking-wider mt-1">{event.price}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recommended Section - Only for logged in users */}
      <RecommendedSection />

      {/* Footer */}
      <footer className="bg-gray-900 text-white px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">About Lakbay</h3>
              <p className="text-gray-400 text-sm">
                Discover the Philippines through authentic travel experiences with local guides and fellow adventurers.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Categories</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Hiking & Trekking</li>
                <li>Island Hopping</li>
                <li>Cultural Tours</li>
                <li>Wellness Retreats</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Help Center</li>
                <li>Safety Guidelines</li>
                <li>Cancellation Policy</li>
                <li>Contact Us</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Facebook</li>
                <li>Instagram</li>
                <li>Twitter</li>
                <li>YouTube</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-400">
            <p>&copy; 2025 Lakbay. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
};
