import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { ChatWidget } from "@/components/ChatWidget";
import { TrailMap } from "@/components/TrailMap";
import { AdminAudioModal } from "@/components/AdminAudioModal";
import { MapPin, Star, Clock, Users, Calendar, Shield, AlertTriangle, CheckCircle2, Mountain, TrendingUp, MapIcon, Headphones, Play, Pause, Download, Volume2, Utensils, Package, Brain, Award, Timer, Target, ShoppingCart, Heart, Search, Monitor } from "lucide-react";

interface TripDetailPageProps {
  params?: {
    id?: string;
  };
}

// Type for quiz data
interface QuizTrip {
  title: string;
  duration: string;
  price: string;
  category: string;
  heroImage: string;
  host: { name: string; avatar: string; bio: string; };
  meetingPlace: string;
  mapCenter: { lat: number; lng: number };
  quiz: {
    title: string;
    description: string;
    totalQuestions: number;
    timeLimit: number;
    passingScore: number;
    questions: Array<{
      id: number;
      question: string;
      options: string[];
      correct: number;
      explanation: string;
    }>;
  };
}

export const TripDetailPage = ({ params }: TripDetailPageProps): JSX.Element => {
  const [location] = useLocation();
  const [guests, setGuests] = useState("1 guest");
  const [checkIn, setCheckIn] = useState("09/14/2025");
  const [checkOut, setCheckOut] = useState("09/16/2025");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("Event details");
  const [isBooked, setIsBooked] = useState(false); // Trip booking status
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudioTrack, setCurrentAudioTrack] = useState<number | null>(null);
  const [showAudioModal, setShowAudioModal] = useState(false);
  
  // Mock admin check - in real app this would come from auth context
  const isAdmin = true; // For demo purposes
  const [activeNavTab, setActiveNavTab] = useState("Home");
  
  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  
  const { toast } = useToast();

  // Timer effect for quiz
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (quizStarted && !showResults && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setShowResults(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [quizStarted, showResults, timeLeft]);

  // Check for payment status in URL
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    
    if (paymentStatus === 'success') {
      toast({
        title: "Payment Successful!",
        description: "Your booking has been confirmed. Check your email for details.",
      });
    } else if (paymentStatus === 'cancelled') {
      toast({
        title: "Payment Cancelled",
        description: "Your payment was cancelled. You can try again anytime.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Audio book functionality
  const handlePlayAudio = (trackIndex: number) => {
    if (currentAudioTrack === trackIndex && isPlaying) {
      setIsPlaying(false);
      setCurrentAudioTrack(null);
    } else {
      setIsPlaying(true);
      setCurrentAudioTrack(trackIndex);
    }
    
    // Mock audio playback
    // In a real app, this would control actual audio playback
    toast({
      title: "Audio Playing",
      description: `Playing itinerary day ${trackIndex + 1} audio guide`,
    });
  };

  const handleDownloadAudio = (trackIndex: number) => {
    toast({
      title: "Download Started",
      description: `Downloading audio guide for day ${trackIndex + 1}`,
    });
    // In a real app, this would trigger actual download
  };

  // Comprehensive trip data based on route and category
  const getTripData = () => {
    // HIKING CATEGORY
    if (location.includes("mount-pulag")) {
      return {
        title: "Mount Pulag Sunrise Trek",
        duration: "3 Days 2 Nights",
        price: "PHP 15,500",
        category: "hiking",
        heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
        host: { 
          name: "Maria Santos", 
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          bio: "Certified mountain guide with 8 years experience leading Pulag treks. Expert in high-altitude climbing and wilderness survival."
        },
        itinerary: [
          {
            day: 1,
            title: "Arrival and Base Camp Setup",
            description: "Meet at Babadak Ranger Station, complete registration, and set up base camp. Evening briefing on trail safety and weather conditions.",
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
          },
          {
            day: 2,
            title: "Summit Push and Sunrise",
            description: "Early morning 3AM start for summit push. Watch the spectacular sunrise from the Philippines' second highest peak at 2,926 meters above sea level.",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
          },
          {
            day: 3,
            title: "Descent and Departure",
            description: "Leisurely descent back to base camp, pack up, and departure. Stop at local hot springs for relaxation.",
            image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
          }
        ],
        accommodation: {
          name: "Mountain Lodge & Camping",
          description: "Multi-day camping experience with provided tents, sleeping bags, and mountain cooking equipment."
        },
        meetingPlace: "Babadak Ranger Station, Kabayan, Benguet",
        mapCenter: { lat: 16.5964, lng: 120.8897 },
        trail: {
          difficulty: "Moderate to Difficult",
          distance: "8.5 km",
          elevationGain: "1,200m",
          startElevation: "1,726",
          peakElevation: "2,926",
          trailPoints: [
            {
              name: "Babadak Ranger Station",
              type: "trailhead" as const,
              elevation: "1,726m",
              description: "Registration point and trail start",
              coordinates: { lat: 16.5964, lng: 120.8897 }
            },
            {
              name: "Eddet River",
              type: "checkpoint" as const,
              elevation: "2,000m", 
              description: "First major checkpoint with river crossing",
              coordinates: { lat: 16.5980, lng: 120.8910 }
            },
            {
              name: "Mt. Pulag Summit",
              type: "summit" as const,
              elevation: "2,926m",
              description: "Second highest peak in the Philippines",
              coordinates: { lat: 16.6000, lng: 120.8950 }
            }
          ]
        }
      };
    }

    // Default fallback trip
    return {
      title: "Palawan Beach Experience",
      duration: "3 Days 2 Nights",
      price: "PHP 12,500",
      category: "beach",
      heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      host: { 
        name: "Juan Dela Cruz", 
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        bio: "Local guide specializing in island hopping and beach adventures with 12 years of experience in Palawan tourism."
      },
      itinerary: [
        {
          day: 1,
          title: "Island Hopping Adventure",
          description: "Visit pristine beaches and hidden lagoons around El Nido. Experience crystal clear waters and dramatic limestone cliffs.",
          image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
        },
        {
          day: 2,
          title: "Underground River Tour", 
          description: "Explore the world-famous Puerto Princesa Underground River, a UNESCO World Heritage Site.",
          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
        },
        {
          day: 3,
          title: "Beach Relaxation",
          description: "Free day to relax on white sand beaches, snorkeling, or spa treatments at the resort.",
          image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
        }
      ],
      accommodation: {
        name: "Beachfront Resort",
        description: "Luxury beachfront resort with modern amenities, swimming pool, and direct access to pristine beaches."
      },
      meetingPlace: "El Nido Airport, Palawan",
      mapCenter: { lat: 11.1854, lng: 119.4094 }
    };
  };

  const trip = getTripData();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white px-8 py-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {/* Left: Logo placeholder */}
          <div className="w-8 h-8 bg-black" style={{borderRadius: '1px'}}></div>
          
          {/* Center: Navigation */}
          <nav className="flex items-center space-x-12">
            <Link href="/" className="prada-nav text-gray-700 hover:text-black transition-colors">Home</Link>
            <Link href="/trips" className="prada-nav text-black hover:text-gray-600 transition-colors">Trips</Link>
            <Link href="/chats" className="prada-nav text-gray-700 hover:text-black transition-colors">Chats</Link>
            <Link href="/trails" className="prada-nav text-gray-700 hover:text-black transition-colors">Trails</Link>
            <a href="#" className="prada-nav text-gray-700 hover:text-black transition-colors">Story</a>
            <Link href="/shop" className="prada-nav text-gray-700 hover:text-black transition-colors">Shop</Link>
            <a href="#" className="prada-nav text-gray-700 hover:text-black transition-colors">Corporate</a>
          </nav>
          
          {/* Right: Buttons and Language */}
          <div className="flex items-center space-x-3">
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
            <span className="text-xs text-gray-500 font-light ml-4">EN</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative h-72">
        <img 
          src={trip.heroImage}
          alt={trip.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-8 left-8 text-white">
          <div className="mb-3">
            <Badge 
              className={`text-xs px-3 py-1 font-light tracking-wider prada-corner-radius ${
                trip.category === 'private' ? 'bg-[#D4AF37] text-black' :
                trip.category === 'joiner' ? 'bg-green-600 text-white' :
                trip.category === 'meetup' ? 'bg-blue-500 text-white' :
                trip.category === 'mystery' ? 'bg-purple-600 text-white' :
                trip.category === 'virtual' ? 'bg-indigo-600 text-white' :
                trip.category === 'wellness' ? 'bg-pink-600 text-white' :
                trip.category === 'culinary' ? 'bg-orange-600 text-white' :
                trip.category === 'hiking' ? 'bg-green-700 text-white' :
                trip.category === 'online-quiz' ? 'bg-blue-600 text-white' :
                'bg-gray-600 text-white'
              }`}
            >
              {trip.category.toUpperCase().replace('-', ' ')}
            </Badge>
          </div>
          <h1 className="prada-heading text-4xl font-light mb-3">{trip.title}</h1>
          <p className="text-lg font-light tracking-wide opacity-90">{trip.duration}</p>
        </div>
        
        {/* Admin Audio Generation Button */}
        {isAdmin && (
          <div className="absolute top-4 right-4">
            <Button
              onClick={() => setShowAudioModal(true)}
              className="bg-[#D4AF37] hover:bg-[#B8941F] text-black text-xs font-light tracking-wider prada-corner-radius flex items-center gap-2"
              size="sm"
            >
              <Volume2 className="w-4 h-4" />
              Generate Audio
            </Button>
          </div>
        )}
      </div>

      {/* Main Content with Tabs */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* Tab Navigation */}
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="Event details">Event details</TabsTrigger>
                <TabsTrigger value="Inclusions">Inclusions</TabsTrigger>
                <TabsTrigger value="Reviews">Reviews</TabsTrigger>
                <TabsTrigger value="Things to bring">Things to bring</TabsTrigger>
                <TabsTrigger value="Reminders">Reminders</TabsTrigger>
                <TabsTrigger value="Cancellation">Cancellation</TabsTrigger>
              </TabsList>

              {/* Tab Contents */}
              <TabsContent value="Event details" className="space-y-6">
                {trip.itinerary && trip.itinerary.length > 0 && trip.itinerary.map((day, index) => (
                  <Card key={index} className="p-6">
                    <div className="flex space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-[#D4AF37] text-black rounded-full flex items-center justify-center font-bold text-sm">
                          {day.day}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">{day.title}</h3>
                        <p className="text-gray-700 mb-4">{day.description}</p>
                        <img 
                          src={day.image}
                          alt={day.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="Inclusions" className="space-y-6">
                <Card className="p-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-4">What's Included</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>Professional guide</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>All meals included</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>Transportation</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>Accommodation</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>Equipment rental</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>Travel insurance</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>Entrance fees</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>Certificate</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="Reviews" className="space-y-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-lg text-gray-900">Reviews</h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">4.8 (127 reviews)</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border-b border-gray-200 pb-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <img 
                          src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt="Reviewer"
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <h4 className="font-medium text-sm">Sarah Johnson</h4>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="w-3 h-3 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        Amazing experience! The guide was knowledgeable and the views were breathtaking. 
                        Highly recommended for anyone looking for adventure.
                      </p>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="Things to bring" className="space-y-6">
                <Card className="p-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-4">Essential Items</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-[#D4AF37]" />
                        <span>Comfortable hiking shoes</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-[#D4AF37]" />
                        <span>Weather-appropriate clothing</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-[#D4AF37]" />
                        <span>Personal water bottle</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-[#D4AF37]" />
                        <span>Sunscreen and hat</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-[#D4AF37]" />
                        <span>Personal medications</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-[#D4AF37]" />
                        <span>Camera or smartphone</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-[#D4AF37]" />
                        <span>Small backpack</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-[#D4AF37]" />
                        <span>Valid ID</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="Reminders" className="space-y-6">
                <Card className="p-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-4">Important Reminders</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
                      <p className="text-sm">Please arrive at the meeting point 30 minutes before departure time.</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
                      <p className="text-sm">Weather conditions may affect the itinerary. Alternative arrangements will be made if necessary.</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
                      <p className="text-sm">Please inform us of any medical conditions or dietary restrictions in advance.</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
                      <p className="text-sm">Age and fitness restrictions may apply. Please check with us before booking.</p>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="Cancellation" className="space-y-6">
                <Card className="p-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-4">Cancellation Policy</h3>
                  <div className="space-y-4">
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-medium text-green-700">Full Refund</h4>
                      <p className="text-sm text-gray-600">Cancel up to 7 days before the trip for a full refund</p>
                    </div>
                    <div className="border-l-4 border-yellow-500 pl-4">
                      <h4 className="font-medium text-yellow-700">50% Refund</h4>
                      <p className="text-sm text-gray-600">Cancel 3-7 days before the trip for a 50% refund</p>
                    </div>
                    <div className="border-l-4 border-red-500 pl-4">
                      <h4 className="font-medium text-red-700">No Refund</h4>
                      <p className="text-sm text-gray-600">Cancel within 3 days of the trip for no refund</p>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-semibold">{trip.price}</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm">4.8 (127 reviews)</span>
                </div>
              </div>
              
              {/* Booking Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
                  <Input 
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
                  <Input 
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                  <Select value={guests} onValueChange={setGuests}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1 guest">1 guest</SelectItem>
                      <SelectItem value="2 guests">2 guests</SelectItem>
                      <SelectItem value="3 guests">3 guests</SelectItem>
                      <SelectItem value="4 guests">4 guests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-black"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Book Now"}
                </Button>
              </div>
            </Card>

            {/* Host Information */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">About the host</h3>
              <div className="flex items-center space-x-3 mb-3">
                <img 
                  src={trip.host.avatar}
                  alt={trip.host.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium text-gray-900">{trip.host.name}</h4>
                  <p className="text-sm text-gray-500">Host</p>
                </div>
              </div>
              <p className="text-sm text-gray-700">{trip.host.bio}</p>
            </Card>
          </div>
        </div>
      </div>

      {/* Chat Widget */}
      <ChatWidget />

      {/* Admin Audio Modal */}
      {isAdmin && (
        <AdminAudioModal
          isOpen={showAudioModal}
          onClose={() => setShowAudioModal(false)}
          tripData={{
            title: trip.title,
            duration: trip.duration,
            price: trip.price,
            category: trip.category,
            host: {
              name: trip.host?.name || '',
              bio: trip.host?.bio || ''
            },
            itinerary: trip.itinerary || [],
            meetingPlace: trip.meetingPlace
          }}
        />
      )}
    </div>
  );
};