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
    // EL NIDO ISLAND HOPPING
    if (location.includes("el-nido-island-hopping")) {
      return {
        title: "El Nido Island Hopping Adventure",
        duration: "4 days",
        price: "₱12,500",
        category: "Island Hopping",
        heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
        host: { 
          name: "Captain Miguel Santos", 
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          bio: "Professional boat captain and island hopping guide with 15 years of experience exploring El Nido's pristine lagoons."
        },
        itinerary: [
          {
            day: 1,
            title: "Arrival and Lagoon Tour A",
            description: "Explore the pristine lagoons and hidden beaches of El Nido. Visit Big Lagoon, Small Lagoon, Secret Lagoon, and Shimizu Island.",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop"
          },
          {
            day: 2,
            title: "Island Tour B - Beaches",
            description: "Visit Snake Island, Entalula Beach, Cathedral Cave, and Cudugnon Cave. Experience crystal clear waters and stunning limestone cliffs.",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop"
          },
          {
            day: 3,
            title: "Island Tour C - Hidden Gems",
            description: "Discover Helicopter Island, Dilumacad Beach, Tapiutan Beach, and Secret Beach. Perfect for snorkeling and photography.",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop"
          },
          {
            day: 4,
            title: "Island Tour D and Departure",
            description: "Final island tour to Cadlao Lagoon, Pasandigan Beach, and Nat Nat Beach before departure.",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop"
          }
        ],
        accommodation: {
          name: "El Nido Beach Resort",
          description: "Comfortable beachfront accommodation with modern amenities and ocean views."
        },
        meetingPlace: "El Nido Public Market, El Nido, Palawan",
        mapCenter: { lat: 11.1949, lng: 119.4013 }
      };
    }

    // BOHOL CHOCOLATE HILLS
    if (location.includes("bohol-chocolate-hills")) {
      return {
        title: "Bohol Chocolate Hills Trek",
        duration: "3 days",
        price: "₱8,900",
        category: "Hiking",
        heroImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
        host: { 
          name: "Elena Rodriguez", 
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5e5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          bio: "Local Bohol guide specializing in geological tours and wildlife conservation. Expert on Chocolate Hills formation and Tarsier habitats."
        },
        itinerary: [
          {
            day: 1,
            title: "Arrival and Chocolate Hills Viewpoint",
            description: "Arrive in Carmen and visit the famous Chocolate Hills viewing deck. Learn about the geological formation of these unique limestone hills.",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop"
          },
          {
            day: 2,
            title: "Tarsier Sanctuary and River Cruise",
            description: "Visit the Philippine Tarsier Sanctuary to see the world's smallest primates. Enjoy a peaceful Loboc River cruise with local lunch.",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop"
          },
          {
            day: 3,
            title: "Heritage Sites and Departure",
            description: "Explore Baclayon Church, Blood Compact Monument, and local markets before departure.",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop"
          }
        ],
        accommodation: {
          name: "Bohol Beach Club",
          description: "Comfortable resort accommodation with access to Alona Beach and local amenities."
        },
        meetingPlace: "Tagbilaran Airport, Bohol",
        mapCenter: { lat: 9.8349, lng: 124.1569 }
      };
    }

    // HIKING CATEGORY - MOUNT PULAG
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

    // SAGADA CAVE EXPLORATION
    if (location.includes("sagada-caves")) {
      return {
        title: "Sagada Cave Exploration",
        duration: "4 days",
        price: "₱15,200",
        category: "Adventure",
        heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
        host: { 
          name: "Carlos Banaag", 
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          bio: "Local Sagada guide specializing in cave exploration and cultural heritage tours. Expert on Igorot traditions and mountain trekking."
        },
        itinerary: [
          {
            day: 1,
            title: "Arrival and Sumaguing Cave",
            description: "Arrive in Sagada and explore the famous Sumaguing Cave with its impressive limestone formations and underground chambers.",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop"
          },
          {
            day: 2,
            title: "Hanging Coffins and Echo Valley",
            description: "Visit the iconic hanging coffins and learn about ancient burial traditions. Explore Echo Valley and its mystical atmosphere.",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop"
          },
          {
            day: 3,
            title: "Rice Terraces and Local Culture",
            description: "Trek through ancient rice terraces and visit local Igorot communities. Experience traditional mountain life and customs.",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop"
          },
          {
            day: 4,
            title: "Sunrise at Kiltepan and Departure",
            description: "Early morning trek to Kiltepan viewpoint for spectacular sunrise views over the Cordillera mountains before departure.",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop"
          }
        ],
        accommodation: {
          name: "Sagada Mountain Lodge",
          description: "Traditional mountain lodge with cozy accommodations and local hospitality."
        },
        meetingPlace: "Sagada Town Center, Mountain Province",
        mapCenter: { lat: 17.0827, lng: 120.9063 }
      };
    }

    // SIARGAO SURF & ISLAND TOUR
    if (location.includes("siargao-surf")) {
      return {
        title: "Siargao Surf & Island Tour",
        duration: "5 days",
        price: "₱18,750",
        category: "Surfing",
        heroImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
        host: { 
          name: "Jake Mendoza", 
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          bio: "Professional surf instructor and island guide with 10 years of experience riding the waves of Cloud 9 and exploring Siargao's hidden gems."
        },
        itinerary: [
          {
            day: 1,
            title: "Arrival and Surf Lesson at Cloud 9",
            description: "Welcome to Siargao! Start with surf lessons at the world-famous Cloud 9 break. Perfect waves for beginners and experienced surfers.",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop"
          },
          {
            day: 2,
            title: "Island Hopping - Naked and Daku Islands",
            description: "Explore the pristine islands around Siargao. Visit Naked Island's sandbar and Daku Island's palm-fringed beaches.",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop"
          },
          {
            day: 3,
            title: "Sugba Lagoon and Magpupungko Pools",
            description: "Paddle through the enchanting Sugba Lagoon and relax at the natural Magpupungko rock pools during low tide.",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop"
          },
          {
            day: 4,
            title: "Advanced Surf Session and Local Culture",
            description: "Practice advanced surfing techniques and explore local fishing villages. Experience authentic Siargao hospitality.",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop"
          },
          {
            day: 5,
            title: "Final Surf and Departure",
            description: "Last surf session at Cloud 9 and farewell breakfast before departure.",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop"
          }
        ],
        accommodation: {
          name: "Siargao Bleu Resort",
          description: "Beachfront resort with modern amenities and easy access to Cloud 9 surf break."
        },
        meetingPlace: "Sayak Airport, Siargao Island",
        mapCenter: { lat: 9.8601, lng: 126.0581 }
      };
    }

    // SUNSET BEACH TREK
    if (location.includes("boracay-sunset-trek")) {
      return {
        title: "Sunset Beach Trek",
        duration: "1 day",
        price: "₱2,500",
        category: "Beach",
        heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
        host: { 
          name: "Anna Reyes", 
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          bio: "Local Boracay guide specializing in beach photography and sunset tours. Knows all the best hidden spots on the island."
        },
        itinerary: [
          {
            day: 1,
            title: "Boracay Beach Trek and Sunset",
            description: "Trek along Boracay's famous white sand beaches, explore hidden coves, and watch the spectacular sunset from the best viewpoints.",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop"
          }
        ],
        accommodation: {
          name: "Day Tour - No Accommodation",
          description: "This is a day tour package. Accommodation not included."
        },
        meetingPlace: "White Beach Station 1, Boracay",
        mapCenter: { lat: 11.9674, lng: 121.9270 }
      };
    }

    // BATANES CULTURAL HERITAGE TOUR
    if (location.includes("batanes-heritage")) {
      return {
        title: "Batanes Cultural Heritage Tour",
        duration: "4 days",
        price: "₱22,400",
        category: "Cultural",
        heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
        host: { 
          name: "Maria Valdez", 
          avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          bio: "Local Ivatan guide born and raised in Batanes. Expert on Ivatan culture, traditional architecture, and the unique heritage of the northernmost province."
        },
        itinerary: [
          {
            day: 1,
            title: "Arrival in Basco and North Batan Tour",
            description: "Arrive in Basco and explore traditional Ivatan stone houses, Vayang Rolling Hills, and the iconic Naidi Lighthouse.",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop"
          },
          {
            day: 2,
            title: "South Batan Cultural Sites",
            description: "Visit Mahatao Church, traditional villages, and learn about Ivatan craftsmanship including vakul weaving and stone construction.",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop"
          },
          {
            day: 3,
            title: "Sabtang Island Day Trip",
            description: "Ferry to Sabtang Island to see perfectly preserved traditional villages, stone houses, and experience authentic Ivatan hospitality.",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop"
          },
          {
            day: 4,
            title: "Marlboro Country and Departure",
            description: "Final morning at the dramatic Marlboro Country hills before departure from Basco Airport.",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop"
          }
        ],
        accommodation: {
          name: "Fundacion Pacita Lodge",
          description: "Boutique lodge with traditional Ivatan architecture and stunning views of the Pacific Ocean."
        },
        meetingPlace: "Basco Airport, Batanes",
        mapCenter: { lat: 20.4488, lng: 121.9678 }
      };
    }

    // VIGAN CULTURAL HERITAGE TOUR
    if (location.includes("vigan-heritage")) {
      return {
        title: "Vigan Cultural Heritage Tour",
        duration: "2 days",
        price: "₱2,800",
        category: "Cultural",
        heroImage: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=400&h=250&fit=crop",
        host: { 
          name: "Luis Crisologo", 
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
          bio: "Local historian and cultural guide specializing in Spanish colonial heritage and Vigan's UNESCO World Heritage significance."
        },
        itinerary: [
          {
            day: 1,
            title: "Historic Vigan Walking Tour",
            description: "Walk through cobblestone streets of Calle Crisologo, visit colonial houses, museums, and traditional pottery workshops.",
            image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=400&h=250&fit=crop"
          },
          {
            day: 2,
            title: "Cultural Immersion and Local Crafts",
            description: "Experience traditional Ilocano weaving, cooking classes, and kalesa (horse carriage) tours before departure.",
            image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=400&h=250&fit=crop"
          }
        ],
        accommodation: {
          name: "Villa Angela Heritage House",
          description: "Historic colonial mansion converted into a boutique hotel within the heritage district."
        },
        meetingPlace: "Vigan City Plaza, Ilocos Sur",
        mapCenter: { lat: 17.5756, lng: 120.3888 }
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
              {/* Dynamic Tab Navigation based on category */}
              {(() => {
                const defaultTabs = ["Event details", "Inclusions", "Reviews", "Things to bring", "Reminders", "Cancellation"];
                const hikingTabs = ["Event details", "Trail", "Inclusions", "Reviews", "Things to bring", "Reminders", "Cancellation"];
                
                const tabs = trip.category === 'hiking' ? hikingTabs : defaultTabs;

                return (
                  <TabsList className={`grid w-full ${tabs.length === 6 ? 'grid-cols-6' : 'grid-cols-7'}`}>
                    {tabs.map((tab) => (
                      <TabsTrigger key={tab} value={tab}>{tab}</TabsTrigger>
                    ))}
                  </TabsList>
                );
              })()}

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

              {/* Trail Tab - for hiking category */}
              <TabsContent value="Trail" className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Mountain className="w-5 h-5 mr-2 text-[#D4AF37]" />
                    3D Trail Visualization
                  </h2>
                  
                  {/* Trail Overview */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Trail Statistics</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Difficulty:</span>
                          <p className="font-medium text-gray-900">{trip.trail?.difficulty || "Moderate"}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Distance:</span>
                          <p className="font-medium text-gray-900">{trip.trail?.distance || "8.5 km"}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Elevation Gain:</span>
                          <p className="font-medium text-gray-900">{trip.trail?.elevationGain || "1,200m"}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Elevation Profile</h4>
                      <div className="w-full h-32 bg-gradient-to-r from-green-200 via-yellow-200 to-red-200 rounded relative">
                        <div className="absolute inset-0 flex items-end justify-between px-2 pb-2 text-xs">
                          <span className="bg-white px-1 rounded">{trip.trail?.startElevation || "1,726"}m</span>
                          <span className="bg-white px-1 rounded">{trip.trail?.peakElevation || "2,926"}m</span>
                        </div>
                        <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                          <path 
                            d="M 10,80 Q 50,70 80,60 Q 120,45 150,35 Q 180,30 220,25 Q 260,20 290,15" 
                            stroke="#D4AF37" 
                            strokeWidth="2" 
                            fill="none"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Google Maps Satellite Trail Visualization */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <MapIcon className="w-4 h-4 mr-2" />
                      Trail Map - Satellite View
                    </h3>
                    {trip.mapCenter && trip.mapCenter.lat && trip.mapCenter.lng ? (
                      <TrailMap 
                        trailPoints={trip.trail?.trailPoints || []}
                        center={trip.mapCenter}
                        zoom={14}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500">Trail Map Loading...</span>
                      </div>
                    )}
                    
                    {/* Legend */}
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">Trail Markers</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">🚀</span>
                          <span className="text-gray-700">Trailhead</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">⛺</span>
                          <span className="text-gray-700">Camping Sites</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">🏁</span>
                          <span className="text-gray-700">Checkpoints</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">🏔️</span>
                          <span className="text-gray-700">Summit</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trail Points Details */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Trail Points</h3>
                    <div className="space-y-4">
                      {(trip.trail?.trailPoints || []).map((point, index) => (
                        <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                            point.type === 'trailhead' ? 'bg-green-500' :
                            point.type === 'campsite' ? 'bg-orange-500' :
                            point.type === 'summit' ? 'bg-red-500' :
                            'bg-blue-500'
                          }`}>
                            {point.type === 'campsite' && (
                              <span className="text-xs">⛺</span>
                            )}
                            {point.type === 'summit' && (
                              <span className="text-xs">🏔️</span>
                            )}
                            {(point.type === 'trailhead' || point.type === 'checkpoint') && (
                              <span className="text-xs">{index + 1}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{point.name}</h4>
                            <p className="text-sm text-gray-600">{point.description}</p>
                            <p className="text-xs text-gray-500">Elevation: {point.elevation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
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