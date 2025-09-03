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

  // Simple trip data function - comprehensive data
  const getTripData = () => {
    if (location.includes("mount-pulag")) {
      return {
        title: "Mount Pulag Sunrise Trek",
        duration: "3 Days 2 Nights",
        price: "PHP 15,500",
        category: "hiking",
        heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3",
        host: { 
          name: "Maria Santos", 
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          bio: "Certified mountain guide with 8 years experience leading Pulag treks"
        },
        meetingPlace: "Babadak Ranger Station, Kabayan, Benguet",
        mapCenter: { lat: 16.5964, lng: 120.8897 },
        itinerary: [
          {
            day: 1,
            title: "Arrival and Base Camp Setup",
            description: "Meet at ranger station, register, and set up camp",
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3"
          },
          {
            day: 2,
            title: "Summit Push and Sunrise",
            description: "Early morning hike to summit for stunning sunrise views",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3"
          }
        ],
        accommodation: {
          name: "Mountain Lodge & Camping",
          description: "Multi-day camping experience with provided tents, sleeping bags, and mountain cooking equipment."
        }
      };
    }
    
    // Default fallback
    return {
      title: "Palawan Beach Experience",
      duration: "3 Days 2 Nights", 
      price: "PHP 12,500",
      category: "beach",
      heroImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3",
      host: { 
        name: "Juan Dela Cruz", 
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        bio: "Local guide specializing in island hopping and beach adventures"
      },
      meetingPlace: "El Nido Airport, Palawan",
      mapCenter: { lat: 11.1854, lng: 119.4094 },
      itinerary: [
        {
          day: 1,
          title: "Island Hopping Adventure",
          description: "Visit pristine beaches and hidden lagoons",
          image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3"
        }
      ],
      accommodation: {
        name: "Beachfront Resort",
        description: "Beachfront resort with modern amenities, swimming pool, and direct access to pristine beaches."
      }
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
              className="text-xs px-3 py-1 font-light tracking-wider prada-corner-radius bg-[#D4AF37] text-black"
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

      {/* Simple Content Section */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Trip Info */}
            <Card className="p-6">
              <h2 className="font-semibold text-lg text-gray-900 mb-4">Trip Overview</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-[#D4AF37]" />
                  <span>Duration: {trip.duration}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-[#D4AF37]" />
                  <span>Meeting Point: {trip.meetingPlace}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-[#D4AF37]" />
                  <span>Host: {trip.host.name}</span>
                </div>
              </div>
            </Card>
            
            {/* Itinerary */}
            {trip.itinerary && trip.itinerary.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-4">Itinerary</h3>
                <div className="space-y-4">
                  {trip.itinerary.map((day, index) => (
                    <div key={index} className="border-l-4 border-[#D4AF37] pl-4">
                      <h4 className="font-medium">Day {day.day}: {day.title}</h4>
                      <p className="text-gray-600 text-sm">{day.description}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
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
                
                <Button className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-black">
                  Book Now
                </Button>
              </div>
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