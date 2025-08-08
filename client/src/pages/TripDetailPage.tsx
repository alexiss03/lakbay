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

  const handlePayMongoPayment = async () => {
    setIsProcessing(true);
    
    try {
      // Calculate total amount
      const guestCount = parseInt(guests.split(" ")[0]);
      const basePrice = parseInt(trip.price.replace(/[^\d]/g, ""));
      const totalAmount = basePrice * guestCount * 100; // PayMongo expects amount in centavos
      
      // Create PayMongo payment intent
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount,
          currency: 'PHP',
          description: `${trip.title} - ${guests}`,
          statement_descriptor: 'Lakbay Travel',
          metadata: {
            trip_id: location.split('/')[2],
            check_in: checkIn,
            check_out: checkOut,
            guests: guestCount
          }
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to PayMongo checkout
        window.location.href = data.checkout_url;
      } else {
        throw new Error(data.error || 'Payment creation failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "Unable to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReservation = async () => {
    setIsProcessing(true);
    
    try {
      // Create reservation without payment
      const response = await fetch('/api/create-reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trip_id: location.split('/')[2],
          check_in: checkIn,
          check_out: checkOut,
          guests: parseInt(guests.split(" ")[0]),
          status: 'reserved'
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsBooked(true); // Mark trip as booked
        toast({
          title: "Reservation Confirmed",
          description: "Your trip has been reserved. Complete payment within 24 hours.",
        });
      } else {
        throw new Error(data.error || 'Reservation failed');
      }
    } catch (error) {
      console.error('Reservation error:', error);
      toast({
        title: "Reservation Error", 
        description: "Unable to create reservation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Audio book functionality
  const handlePlayAudio = (trackIndex: number) => {
    if (currentAudioTrack === trackIndex && isPlaying) {
      setIsPlaying(false);
      setCurrentAudioTrack(null);
    } else {
      setCurrentAudioTrack(trackIndex);
      setIsPlaying(true);
      // In a real app, this would control actual audio playback
      toast({
        title: "Audio Playing",
        description: `Playing itinerary day ${trackIndex + 1} audio guide`,
      });
    }
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
        duration: "April 12-15, 2025",
        price: "PHP 8500 per person",
        category: "hiking",
        heroImage: "https://images.unsplash.com/photo-1464822759844-d150baec0494?w=1200&h=400&fit=crop&auto=format",
        host: {
          name: "Miguel Santos", 
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format",
          bio: "Mountain guide and outdoor enthusiast with 10+ years experience in Luzon's highest peaks."
        },
        itinerary: [
          {
            day: 1,
            title: "Base Camp Setup and Acclimatization",
            description: "Arrive at Babadak Ranger Station and set up base camp. Acclimatization hike to nearby viewpoints and equipment check.",
            image: "https://images.unsplash.com/photo-1464822759844-d150baec0494?w=300&h=200&fit=crop&auto=format"
          },
          {
            day: 2,
            title: "Summit Assault - Sea of Clouds",
            description: "Early morning trek to the summit of Mount Pulag (2,922m). Experience the famous sea of clouds and panoramic views of Northern Luzon.",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop&auto=format"
          },
          {
            day: 3,
            title: "Descent and Departure",
            description: "Gradual descent through mossy forests and grasslands. Final camp breakdown and transfer back to jump-off point.",
            image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop&auto=format"
          }
        ],
        trail: {
          name: "Mount Pulag Summit Trail",
          difficulty: "Moderate to Difficult",
          distance: "8.2 km",
          duration: "6-8 hours",
          elevationGain: "1,200m",
          startElevation: 1722,
          peakElevation: 2922,
          trailPoints: [
            { 
              name: "Babadak Ranger Station", 
              elevation: "1,722m", 
              type: "trailhead" as const,
              coordinates: { lat: 16.5964, lng: 120.8897 },
              description: "Starting point and registration area for Mount Pulag trek"
            },
            { 
              name: "Eddet River Crossing", 
              elevation: "1,856m", 
              type: "checkpoint" as const,
              coordinates: { lat: 16.5985, lng: 120.8923 },
              description: "First major checkpoint with river crossing"
            },
            { 
              name: "Camp 1 - Bamboo Forest", 
              elevation: "2,134m", 
              type: "campsite" as const,
              coordinates: { lat: 16.6012, lng: 120.8967 },
              description: "First camping area surrounded by bamboo groves"
            },
            { 
              name: "Saddle Camp", 
              elevation: "2,387m", 
              type: "campsite" as const,
              coordinates: { lat: 16.6043, lng: 120.9015 },
              description: "Popular overnight camping spot before final ascent"
            },
            { 
              name: "Camp 2 - Grassland", 
              elevation: "2,654m", 
              type: "campsite" as const,
              coordinates: { lat: 16.6067, lng: 120.9052 },
              description: "High-altitude grassland camping area near summit"
            },
            { 
              name: "Mount Pulag Summit", 
              elevation: "2,922m", 
              type: "summit" as const,
              coordinates: { lat: 16.6089, lng: 120.9089 },
              description: "Luzon's highest peak with panoramic views and sea of clouds"
            }
          ]
        },
        accommodation: {
          title: "Mountain Camping Experience",
          images: [
            "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=250&h=150&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=250&h=150&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=250&h=150&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=250&h=150&fit=crop&auto=format"
          ],
          description: "Multi-day camping experience with provided tents, sleeping bags, and mountain cooking equipment."
        },
        meetingPlace: "Babadak Ranger Station, Kabayan, Benguet",
        mapCenter: { lat: 16.5964, lng: 120.8897 }
      };
    }

    if (location.includes("mount-apo")) {
      return {
        title: "Mount Apo Peak Expedition",
        duration: "May 20-24, 2025",
        price: "PHP 12500 per person",
        category: "hiking",
        heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop&auto=format",
        host: {
          name: "Carlos Mendoza",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&auto=format",
          bio: "Certified mountain guide specializing in Mindanao's highest peaks and biodiversity conservation."
        },
        itinerary: [
          {
            day: 1,
            title: "Kapatagan Registration and Trek Start",
            description: "Register at DENR office, meet local guides, and begin trek through farmlands and primary forest towards Lake Venado.",
            image: "https://images.unsplash.com/photo-1464822759844-d150baec0494?w=300&h=200&fit=crop&auto=format"
          },
          {
            day: 2,
            title: "Lake Venado to Boulder Face",
            description: "Trek through mossy forest, cross streams, and reach the challenging boulder face section leading to higher elevations.",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop&auto=format"
          },
          {
            day: 3,
            title: "Summit Day - Philippines' Highest Peak",
            description: "Early morning summit assault to Mount Apo's peak (2,954m). Experience panoramic views of Mindanao and Davao Gulf.",
            image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop&auto=format"
          },
          {
            day: 4,
            title: "Descent and Departure",
            description: "Safe descent through different trail route, wildlife spotting, and departure from jump-off point.",
            image: "https://images.unsplash.com/photo-1464822759844-d150baec0494?w=300&h=200&fit=crop&auto=format"
          }
        ],
        trail: {
          name: "Mount Apo Kapatagan Trail",
          difficulty: "Difficult",
          distance: "16.5 km",
          duration: "3-4 days",
          elevationGain: "2,200m",
          startElevation: 754,
          peakElevation: 2954,
          trailPoints: [
            { 
              name: "Kapatagan DENR Station", 
              elevation: "754m", 
              type: "trailhead" as const,
              coordinates: { lat: 7.0167, lng: 125.2733 },
              description: "Registration point and trail start in Digos City"
            },
            { 
              name: "Mainit Hot Springs", 
              elevation: "1,200m", 
              type: "checkpoint" as const,
              coordinates: { lat: 7.0189, lng: 125.2698 },
              description: "Natural hot springs checkpoint for rest and relaxation"
            },
            { 
              name: "Lake Venado Camp", 
              elevation: "1,845m", 
              type: "campsite" as const,
              coordinates: { lat: 7.0212, lng: 125.2654 },
              description: "Scenic lake camping area with freshwater source"
            },
            { 
              name: "Boulder Face Camp", 
              elevation: "2,456m", 
              type: "campsite" as const,
              coordinates: { lat: 7.0234, lng: 125.2623 },
              description: "High-altitude camping before final summit push"
            },
            { 
              name: "Mount Apo Summit", 
              elevation: "2,954m", 
              type: "summit" as const,
              coordinates: { lat: 7.0245, lng: 125.2611 },
              description: "Philippines' highest peak with panoramic Mindanao views"
            }
          ]
        },
        accommodation: {
          title: "Wilderness Camping",
          images: [
            "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=250&h=150&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=250&h=150&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=250&h=150&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=250&h=150&fit=crop&auto=format"
          ],
          description: "Multi-day camping in designated areas with porter support and mountain cooking facilities."
        },
        meetingPlace: "Kapatagan DENR Station, Digos City",
        mapCenter: { lat: 7.0167, lng: 125.2733 }
      };
    }

    // ISLAND HOPPING CATEGORY  
    if (location.includes("bohol-nature")) {
      return {
        title: "Nature dive in Bohol for 3 days",
        duration: "August 14-16, 2025",
        price: "PHP 2204 per person",
        category: "island",
        heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop&auto=format",
        host: {
          name: "Maria Santos",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&auto=format",
          bio: "Local guide and nature enthusiast with 8 years of experience leading eco-tours in Bohol."
        },
        itinerary: [
          {
            day: 1,
            title: "Check out Hinagdanan Cave",
            description: "Hinagdanan Cave is a beautiful cave on your first shallow diving, it has a boat that very few chose because of how difficult it is to access the cave. There is a walkway inside the cave at the entrance, and there are very old stalactites and stalagmites that were formed over thousands of years.",
            image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop&auto=format"
          },
          {
            day: 2,
            title: "Visit the famous Chocolate Hills",
            description: "The Chocolate Hills is a geological formation in Bohol that consists of at least 1,260 hills spread over an area of more than 50 square kilometers. They are covered in green grass that turns brown during the dry season, giving them their name.",
            image: "https://images.unsplash.com/photo-1464822759844-d150baec0494?w=300&h=200&fit=crop&auto=format"
          },
          {
            day: 3,
            title: "Check out Hinagdanan Cave",
            description: "Return to explore deeper sections of the cave system. Experience advanced cave diving with proper equipment and professional guides. Discover hidden chambers and underground pools.",
            image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop&auto=format"
          }
        ],
        accommodation: {
          title: "Bohol Beach Club Resort",
          images: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=250&h=150&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=250&h=150&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=250&h=150&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=250&h=150&fit=crop&auto=format"
          ],
          description: "Beachfront resort with modern amenities, swimming pool, and direct access to pristine beaches."
        },
        meetingPlace: "Alona Beach, Panglao Island",
        mapCenter: { lat: 9.5340, lng: 123.7675 }
      };
    }

    if (location.includes("siargao-surfing")) {
      return {
        title: "Siargao Surfing & Island Experience",
        duration: "June 10-14, 2025",
        price: "PHP 9800 per person",
        category: "island",
        heroImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=400&fit=crop&auto=format",
        host: {
          name: "Rico Valdez",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format",
          bio: "Professional surfer and island guide with extensive knowledge of Siargao's waves and hidden spots."
        },
        itinerary: [
          {
            day: 1,
            title: "Cloud 9 Surfing Introduction",
            description: "Arrive in General Luna, check-in, and afternoon surf session at the world-famous Cloud 9 break. Perfect for all skill levels.",
            image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop&auto=format"
          },
          {
            day: 2,
            title: "Island Hopping Adventure",
            description: "Explore Naked Island, Daku Island, and Guyam Island. Snorkeling, beach time, and local seafood lunch.",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop&auto=format"
          },
          {
            day: 3,
            title: "Magpupungko Rock Pools",
            description: "Visit the famous rock pools during low tide, explore Sugba Lagoon for kayaking and paddleboarding.",
            image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop&auto=format"
          },
          {
            day: 4,
            title: "Advanced Surfing & Departure",
            description: "Final surf session at different breaks, visit local markets, and departure preparations.",
            image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop&auto=format"
          }
        ],
        accommodation: {
          title: "Beachfront Surf Resort",
          images: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=250&h=150&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=250&h=150&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=250&h=150&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=250&h=150&fit=crop&auto=format"
          ],
          description: "Oceanfront accommodation with surfboard storage, beach access, and tropical garden setting."
        },
        meetingPlace: "Sayak Airport, General Luna",
        mapCenter: { lat: 9.8349, lng: 126.0392 }
      };
    }

    // CULTURAL CATEGORY
    if (location.includes("vigan-heritage")) {
      return {
        title: "Vigan Heritage & Cultural Immersion",
        duration: "July 8-11, 2025",
        price: "PHP 6500 per person",
        category: "cultural",
        heroImage: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1200&h=400&fit=crop&auto=format",
        host: {
          name: "Elena Rodrigues",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b789?w=100&h=100&fit=crop&auto=format",
          bio: "Cultural heritage specialist and historian with deep knowledge of Ilocano traditions and Spanish colonial history."
        },
        itinerary: [
          {
            day: 1,
            title: "Spanish Colonial Architecture Tour",
            description: "Explore UNESCO World Heritage cobblestone streets, ancestral houses, and historic churches of Vigan City.",
            image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=300&h=200&fit=crop&auto=format"
          },
          {
            day: 2,
            title: "Traditional Crafts Workshop",
            description: "Learn pottery making, weaving, and wood carving from local artisans. Visit traditional workshops and markets.",
            image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop&auto=format"
          },
          {
            day: 3,
            title: "Ilocano Cuisine Experience",
            description: "Cooking class featuring authentic Ilocano dishes, visit local farms, and traditional food preparation methods.",
            image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop&auto=format"
          }
        ],
        accommodation: {
          title: "Heritage Hotel in Ancestral House",
          images: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=250&h=150&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=250&h=150&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=250&h=150&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=250&h=150&fit=crop&auto=format"
          ],
          description: "Stay in a restored Spanish colonial house with period furniture and traditional architecture."
        },
        meetingPlace: "Vigan City Plaza, Ilocos Sur",
        mapCenter: { lat: 17.5748, lng: 120.3875 }
      };
    }

    // WILDLIFE CATEGORY
    if (location.includes("bohol-tarsier")) {
      return {
        title: "Bohol Wildlife & Conservation Tour",
        duration: "August 5-8, 2025",
        price: "PHP 7200 per person",
        category: "wildlife",
        heroImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=400&fit=crop&auto=format",
        host: {
          name: "Dr. Jose Martinez",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&auto=format",
          bio: "Marine biologist and wildlife conservationist specializing in Philippine endemic species and coral reef ecosystems."
        },
        itinerary: [
          {
            day: 1,
            title: "Tarsier Sanctuary Visit",
            description: "Meet the world's smallest primates at the Philippine Tarsier Sanctuary. Learn about conservation efforts and habitat protection.",
            image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop&auto=format"
          },
          {
            day: 2,
            title: "Dolphin Watching & Marine Life",
            description: "Early morning dolphin watching tour, visit coral gardens for snorkeling, and marine conservation presentation.",
            image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop&auto=format"
          },
          {
            day: 3,
            title: "Butterfly Garden & Forest Trek",
            description: "Explore native butterfly species, guided forest walk to spot endemic birds and wildlife photography session.",
            image: "https://images.unsplash.com/photo-1464822759844-d150baec0494?w=300&h=200&fit=crop&auto=format"
          }
        ],
        accommodation: {
          title: "Eco-Resort near Tarsier Sanctuary",
          images: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=250&h=150&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=250&h=150&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=250&h=150&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=250&h=150&fit=crop&auto=format"
          ],
          description: "Sustainable eco-resort supporting local conservation efforts with nature-integrated accommodations."
        },
        meetingPlace: "Corella Tarsier Sanctuary, Bohol",
        mapCenter: { lat: 9.6340, lng: 123.9015 }
      };
    }

    // ADVENTURE CATEGORY
    if (location.includes("cagayan-whitewater")) {
      return {
        title: "Cagayan Whitewater Rafting Adventure",
        duration: "September 15-18, 2025",
        price: "PHP 8900 per person",
        category: "adventure",
        heroImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=400&fit=crop&auto=format",
        host: {
          name: "Mark Lim",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&auto=format",
          bio: "Professional rafting guide and adventure sports instructor with 15 years experience in Northern Luzon rivers."
        },
        itinerary: [
          {
            day: 1,
            title: "River Safety Training",
            description: "Comprehensive safety briefing, equipment fitting, and practice sessions on calm water sections of Chico River.",
            image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=200&fit=crop&auto=format"
          },
          {
            day: 2,
            title: "Class III Rapids Challenge",
            description: "Navigate exciting Class III rapids through scenic gorges and pristine wilderness areas of Cagayan Valley.",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop&auto=format"
          },
          {
            day: 3,
            title: "Multi-Day River Expedition",
            description: "Overnight camping by the river, continue rafting through more challenging sections and remote wilderness areas.",
            image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=300&h=200&fit=crop&auto=format"
          }
        ],
        accommodation: {
          title: "Riverside Adventure Camp",
          images: [
            "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=250&h=150&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=250&h=150&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=250&h=150&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=250&h=150&fit=crop&auto=format"
          ],
          description: "Riverside camping with comfortable tents, outdoor cooking facilities, and campfire areas."
        },
        meetingPlace: "Chico River Rafting Center, Kalinga",
        mapCenter: { lat: 17.2463, lng: 121.1232 }
      };
    }

    // WELLNESS CATEGORY
    if (location.includes("tagaytay-wellness")) {
      return {
        title: "Tagaytay Wellness & Meditation Retreat",
        duration: "October 22-25, 2025",
        price: "PHP 11500 per person",
        category: "wellness",
        heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop&auto=format",
        host: {
          name: "Maya Chen",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b789?w=100&h=100&fit=crop&auto=format",
          bio: "Certified yoga instructor and wellness coach specializing in mindfulness, meditation, and holistic healing practices."
        },
        itinerary: [
          {
            day: 1,
            title: "Arrival & Mindfulness Introduction",
            description: "Welcome ceremony, mindfulness orientation, gentle yoga session overlooking Taal Lake, and healthy farm-to-table dinner.",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop&auto=format"
          },
          {
            day: 2,
            title: "Meditation & Spa Treatments",
            description: "Morning meditation, therapeutic massage sessions, organic garden tour, and cooking class with healthy local ingredients.",
            image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300&h=200&fit=crop&auto=format"
          },
          {
            day: 3,
            title: "Yoga & Nature Connection",
            description: "Sunrise yoga, nature walk in cool mountain air, sound healing therapy, and wellness workshop sessions.",
            image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=300&h=200&fit=crop&auto=format"
          }
        ],
        accommodation: {
          title: "Mountain Wellness Resort",
          images: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=250&h=150&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=250&h=150&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=250&h=150&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=250&h=150&fit=crop&auto=format"
          ],
          description: "Tranquil mountain resort with spa facilities, yoga pavilions, and panoramic views of Taal Lake."
        },
        meetingPlace: "Sky Ranch, Tagaytay City",
        mapCenter: { lat: 14.1127, lng: 120.9601 }
      };
    }

    // CULINARY CATEGORY
    if (location.includes("iloilo-culinary")) {
      return {
        title: "Iloilo Culinary Heritage Tour",
        duration: "November 12-15, 2025",
        price: "PHP 5800 per person",
        category: "culinary",
        heroImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=400&fit=crop&auto=format",
        host: {
          name: "Chef Roberto Santos",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&auto=format",
          bio: "Award-winning chef and culinary historian specializing in Ilonggo cuisine and traditional cooking methods."
        },
        itinerary: [
          {
            day: 1,
            title: "Market Tour & Cooking Class",
            description: "Explore Iloilo Central Market, learn about local ingredients, and hands-on cooking class for traditional Ilonggo dishes.",
            image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop&auto=format"
          },
          {
            day: 2,
            title: "Street Food Adventure",
            description: "Guided street food tour, visit famous food stalls, learn about regional specialties and food preparation techniques.",
            image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop&auto=format"
          },
          {
            day: 3,
            title: "Farm-to-Table Experience",
            description: "Visit organic farms, harvest fresh ingredients, and prepare meals using traditional cooking methods and recipes.",
            image: "https://images.unsplash.com/photo-1464822759844-d150baec0494?w=300&h=200&fit=crop&auto=format"
          }
        ],
        accommodation: {
          title: "Boutique Hotel in City Center",
          images: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=250&h=150&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=250&h=150&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=250&h=150&fit=crop&auto=format",
            "https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=250&h=150&fit=crop&auto=format"
          ],
          description: "Centrally located boutique hotel with easy access to markets, restaurants, and cultural sites."
        },
        meetingPlace: "Iloilo Central Market, Iloilo City",
        mapCenter: { lat: 10.7202, lng: 122.5621 }
      };
    }
    
    // Default fallback
    return {
      title: "Palawan Beach Experience",
      duration: "September 20-23, 2025",
      price: "PHP 12500 per person",
      category: "beach",
      heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop&auto=format",
      host: {
        name: "Juan Dela Cruz",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&auto=format",
        bio: "Professional dive master and island guide with 12 years of experience in Palawan waters."
      },
      itinerary: [
        {
          day: 1,
          title: "Island Hopping Tour",
          description: "Explore hidden lagoons and pristine beaches. Visit Snake Island, Helicopter Island, and Secret Beach. Snorkeling gear and lunch included.",
          image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop&auto=format"
        },
        {
          day: 2,
          title: "Underground River Adventure",
          description: "UNESCO World Heritage Site tour through the famous Puerto Princesa Underground River. Marvel at stunning rock formations and diverse wildlife.",
          image: "https://images.unsplash.com/photo-1464822759844-d150baec0494?w=300&h=200&fit=crop&auto=format"
        },
        {
          day: 3,
          title: "Diving at Tubbataha Reef",
          description: "World-class diving experience at one of the Philippines' most pristine coral reefs. See whale sharks, manta rays, and colorful marine life.",
          image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop&auto=format"
        }
      ],
      accommodation: {
        title: "El Nido Resorts",
        images: [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=250&h=150&fit=crop&auto=format",
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=250&h=150&fit=crop&auto=format",
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=250&h=150&fit=crop&auto=format",
          "https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=250&h=150&fit=crop&auto=format"
        ],
        description: "Luxury eco-resort with overwater villas, spa services, and sustainable practices."
      },
      meetingPlace: "El Nido Airport",
      mapCenter: { lat: 11.1854, lng: 119.4094 }
    };
  }
  
  // ONLINE QUIZ CATEGORY
  if (location.includes("philippines-geography-quiz") || location.includes("quiz")) {
    return {
      title: "Philippines Geography & Culture Quiz",
      duration: "5 minutes",
      price: "FREE",
      category: "online-quiz",
      heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop&auto=format",
      host: {
        name: "Lakbay Education Team", 
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&auto=format",
        bio: "Educational content creators specializing in Philippine geography, culture, and tourism."
      },
      meetingPlace: "Online Platform",
      mapCenter: { lat: 14.5995, lng: 120.9842 },
      quiz: {
        title: "Test Your Philippines Knowledge",
        description: "Challenge yourself with questions about Philippine geography, culture, history, and tourism destinations.",
        totalQuestions: 10,
        timeLimit: 300, // 5 minutes
        passingScore: 70,
        questions: [
          {
            id: 1,
            question: "What is the highest mountain in the Philippines?",
            options: [
              "Mount Mayon",
              "Mount Apo",
              "Mount Pulag",
              "Mount Makiling"
            ],
            correct: 1,
            explanation: "Mount Apo in Davao is the highest peak in the Philippines at 2,954 meters above sea level."
          },
          {
            id: 2,
            question: "Which island group contains the most islands in the Philippines?",
            options: [
              "Luzon",
              "Visayas", 
              "Mindanao",
              "Sulu Archipelago"
            ],
            correct: 1,
            explanation: "The Visayas region contains over 6,000 islands and islets, making it the most island-dense region."
          },
          {
            id: 3,
            question: "Banaue Rice Terraces are located in which province?",
            options: [
              "Baguio",
              "Ifugao",
              "Mountain Province",
              "Benguet"
            ],
            correct: 1,
            explanation: "The famous Banaue Rice Terraces are located in Ifugao province and are considered the 8th Wonder of the World."
          },
          {
            id: 4,
            question: "What is the traditional Filipino bamboo dance called?",
            options: [
              "Singkil",
              "Tinikling",
              "Pandanggo",
              "Carinosa"
            ],
            correct: 1,
            explanation: "Tinikling is the traditional Filipino folk dance that mimics the movements of tikling birds."
          },
          {
            id: 5,
            question: "Which city is known as the 'Summer Capital of the Philippines'?",
            options: [
              "Tagaytay",
              "Baguio",
              "Sagada",
              "La Trinidad"
            ],
            correct: 1,
            explanation: "Baguio City is known as the Summer Capital due to its cool climate and mountainous location."
          }
        ]
      }
    };
  }

  const trip = getTripData();
  
  // Ensure we have a valid trip object
  if (!trip || typeof trip !== 'object') {
    return <div>Loading...</div>;
  }

  // Type guard for quiz trips
  const isQuizTrip = (trip: any): trip is QuizTrip => {
    return trip.category === "online-quiz" && trip.quiz;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white px-8 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="w-8 h-8 bg-black prada-corner-radius cursor-pointer"></div>
          </Link>
          
          <Tabs value={activeNavTab} onValueChange={setActiveNavTab} className="flex-1">
            <TabsList className="bg-transparent h-auto p-0 space-x-12 border-none">
              <TabsTrigger 
                value="Home" 
                className="prada-nav-link data-[state=active]:text-black data-[state=inactive]:text-gray-700 hover:text-black font-light tracking-wider text-xs uppercase bg-transparent border-none shadow-none p-0"
              >
                Home
              </TabsTrigger>
              <TabsTrigger 
                value="Trips" 
                className="prada-nav-link data-[state=active]:text-black data-[state=inactive]:text-gray-700 hover:text-black font-light tracking-wider text-xs uppercase bg-transparent border-none shadow-none p-0"
              >
                Trips
              </TabsTrigger>
              <TabsTrigger 
                value="Chats" 
                className="prada-nav-link data-[state=active]:text-black data-[state=inactive]:text-gray-700 hover:text-black font-light tracking-wider text-xs uppercase bg-transparent border-none shadow-none p-0"
              >
                Chats
              </TabsTrigger>
              <TabsTrigger 
                value="Trails" 
                className="prada-nav-link data-[state=active]:text-black data-[state=inactive]:text-gray-700 hover:text-black font-light tracking-wider text-xs uppercase bg-transparent border-none shadow-none p-0"
                onClick={() => window.location.href = '/trails'}
              >
                Trails
              </TabsTrigger>
              <TabsTrigger 
                value="Story" 
                className="prada-nav-link data-[state=active]:text-black data-[state=inactive]:text-gray-700 hover:text-black font-light tracking-wider text-xs uppercase bg-transparent border-none shadow-none p-0"
              >
                Story
              </TabsTrigger>
              <TabsTrigger 
                value="Shop" 
                className="prada-nav-link data-[state=active]:text-black data-[state=inactive]:text-gray-700 hover:text-black font-light tracking-wider text-xs uppercase bg-transparent border-none shadow-none p-0"
              >
                Shop
              </TabsTrigger>
              <TabsTrigger 
                value="Corporate" 
                className="prada-nav-link data-[state=active]:text-black data-[state=inactive]:text-gray-700 hover:text-black font-light tracking-wider text-xs uppercase bg-transparent border-none shadow-none p-0"
              >
                Corporate
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="prada-button border-black text-xs font-light tracking-wider">LOG IN</Button>
            <Button className="prada-button prada-gold-accent text-xs font-light tracking-wider">REGISTER</Button>
            <span className="text-xs text-gray-700 font-light tracking-wider">EN</span>
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
                trip.category === 'event' ? 'bg-orange-500 text-white' :
                trip.category === 'virtual' ? 'bg-red-500 text-white' :
                trip.category === 'wellness' ? 'bg-emerald-500 text-white' :
                trip.category === 'online-quiz' ? 'bg-[#D4AF37] text-black' :
                trip.category === 'culinary' ? 'bg-pink-500 text-white' :
                trip.category === 'hiking' ? 'bg-teal-600 text-white' :
                trip.category === 'island' ? 'bg-cyan-500 text-white' :
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

      {/* Navigation Tab Content */}
      <Tabs value={activeNavTab} onValueChange={setActiveNavTab} className="max-w-7xl mx-auto px-8">
        <TabsContent value="Home">
          <div className="py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Quiz Interface for Online Quiz Category */}
        {isQuizTrip(trip) ? (
          <div className="lg:col-span-2">
            <Card className="prada-card p-8">
              {!quizStarted ? (
                // Quiz Introduction
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <Brain className="w-16 h-16 text-[#D4AF37]" />
                  </div>
                  <h2 className="prada-heading text-3xl font-light">{trip.quiz.title}</h2>
                  <p className="text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
                    {trip.quiz.description}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-6 max-w-md mx-auto">
                    <div className="text-center">
                      <div className="flex justify-center mb-2">
                        <Target className="w-8 h-8 text-[#D4AF37]" />
                      </div>
                      <p className="text-sm text-gray-600 font-light">Questions</p>
                      <p className="text-lg font-medium">{(trip as QuizTrip).quiz.totalQuestions}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex justify-center mb-2">
                        <Timer className="w-8 h-8 text-[#D4AF37]" />
                      </div>
                      <p className="text-sm text-gray-600 font-light">Time Limit</p>
                      <p className="text-lg font-medium">{Math.floor((trip as QuizTrip).quiz.timeLimit / 60)} min</p>
                    </div>
                    <div className="text-center">
                      <div className="flex justify-center mb-2">
                        <Award className="w-8 h-8 text-[#D4AF37]" />
                      </div>
                      <p className="text-sm text-gray-600 font-light">Pass Score</p>
                      <p className="text-lg font-medium">{(trip as QuizTrip).quiz.passingScore}%</p>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => setQuizStarted(true)}
                    className="bg-[#D4AF37] hover:bg-[#B8941F] text-black font-light tracking-wider text-sm px-8 py-3"
                  >
                    Start Quiz
                  </Button>
                </div>
              ) : !showResults ? (
                // Quiz Questions
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <h3 className="prada-heading text-xl font-light">
                        Question {currentQuestion + 1} of {(trip as QuizTrip).quiz.questions.length}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(((currentQuestion + 1) / (trip as QuizTrip).quiz.questions.length) * 100)}% Complete
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-6 prada-corner-radius">
                    <h4 className="text-lg font-medium mb-4">
                      {(trip as QuizTrip).quiz.questions[currentQuestion]?.question}
                    </h4>
                    
                    <div className="space-y-3">
                      {(trip as QuizTrip).quiz.questions[currentQuestion]?.options.map((option: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => {
                            const newAnswers = [...selectedAnswers];
                            newAnswers[currentQuestion] = index;
                            setSelectedAnswers(newAnswers);
                          }}
                          className={`w-full text-left p-4 prada-corner-radius border transition-colors ${
                            selectedAnswers[currentQuestion] === index
                              ? 'border-[#D4AF37] bg-yellow-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              selectedAnswers[currentQuestion] === index
                                ? 'border-[#D4AF37] bg-[#D4AF37]'
                                : 'border-gray-300'
                            }`}>
                              {selectedAnswers[currentQuestion] === index && (
                                <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1" />
                              )}
                            </div>
                            <span className="font-light">{option}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                      disabled={currentQuestion === 0}
                      className="font-light"
                    >
                      Previous
                    </Button>
                    
                    {currentQuestion === (trip as QuizTrip).quiz.questions.length - 1 ? (
                      <Button
                        onClick={() => setShowResults(true)}
                        disabled={selectedAnswers[currentQuestion] === undefined}
                        className="bg-[#D4AF37] hover:bg-[#B8941F] text-black font-light"
                      >
                        Finish Quiz
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setCurrentQuestion(currentQuestion + 1)}
                        disabled={selectedAnswers[currentQuestion] === undefined}
                        className="bg-[#D4AF37] hover:bg-[#B8941F] text-black font-light"
                      >
                        Next
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                // Quiz Results
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <Award className="w-16 h-16 text-[#D4AF37]" />
                  </div>
                  <h2 className="prada-heading text-3xl font-light">Quiz Complete!</h2>
                  
                  {(() => {
                    const correctAnswers = selectedAnswers.reduce((count, answer, index) => {
                      return answer === (trip as QuizTrip).quiz.questions[index]?.correct ? count + 1 : count;
                    }, 0);
                    const percentage = Math.round((correctAnswers / (trip as QuizTrip).quiz.questions.length) * 100);
                    const passed = percentage >= (trip as QuizTrip).quiz.passingScore;
                    
                    return (
                      <div className="space-y-4">
                        <div className={`text-6xl font-light ${passed ? 'text-green-600' : 'text-red-500'}`}>
                          {percentage}%
                        </div>
                        <p className="text-lg font-light">
                          You got {correctAnswers} out of {(trip as QuizTrip).quiz.questions.length} questions correct
                        </p>
                        <div className={`inline-flex items-center space-x-2 px-4 py-2 prada-corner-radius ${
                          passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {passed ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                          <span className="font-light">
                            {passed ? 'Congratulations! You passed!' : 'Try again to improve your score'}
                          </span>
                        </div>
                        
                        <div className="flex justify-center space-x-4 mt-8">
                          <Button
                            onClick={() => {
                              setQuizStarted(false);
                              setCurrentQuestion(0);
                              setSelectedAnswers([]);
                              setShowResults(false);
                              setTimeLeft((trip as QuizTrip).quiz.timeLimit);
                            }}
                            variant="outline"
                            className="font-light"
                          >
                            Retake Quiz
                          </Button>
                          <Link href="/">
                            <Button className="bg-[#D4AF37] hover:bg-[#B8941F] text-black font-light">
                              Back to Home
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </Card>
          </div>
        ) : (
          // Regular Trip Details
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              {(() => {
                // Different tabs for each category
                const defaultTabs = ["Event details", "Inclusions", "Reviews", "Things to bring", "Reminders", "Cancellation"];
                const hikingTabs = ["Event details", "Trail", "Inclusions", "Reviews", "Things to bring", "Reminders", "Cancellation"];
                const privateTabs = ["Event details", "VIP Experience", "Inclusions", "Reviews", "Things to bring", "Reminders", "Cancellation"];
                const wellnessTabs = ["Event details", "Wellness Program", "Inclusions", "Reviews", "Things to bring", "Reminders", "Cancellation"];
                const mysteryTabs = ["Event details", "Mystery Clues", "Inclusions", "Reviews", "Things to bring", "Reminders", "Cancellation"];
                const virtualTabs = ["Event details", "Tech Requirements", "Inclusions", "Reviews", "Cancellation"];
                
                const tabs = 
                  trip.category === 'hiking' ? hikingTabs :
                  trip.category === 'private' ? privateTabs :
                  trip.category === 'wellness' ? wellnessTabs :
                  trip.category === 'mystery' ? mysteryTabs :
                  trip.category === 'virtual' ? virtualTabs :
                  defaultTabs;

                return (
                  <TabsList className="flex space-x-8 bg-transparent border-none shadow-none p-0 h-auto">
                    {tabs.map((tab) => (
                      <TabsTrigger 
                        key={tab} 
                        value={tab} 
                        className="prada-nav-link data-[state=active]:text-black data-[state=inactive]:text-gray-700 hover:text-black font-light tracking-wider text-xs uppercase bg-transparent border-none shadow-none p-0"
                      >
                        {tab.toUpperCase()}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                );
              })()}
              <TabsContent value="Event details" className="space-y-6">
                {trip.itinerary && trip.itinerary.map((day, index) => (
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
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">{trip.trail?.name || "Trail Name"}</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Difficulty:</span>
                          <p className="font-medium text-gray-900">{trip.trail?.difficulty || "Moderate"}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Distance:</span>
                          <p className="font-medium text-gray-900">{trip.trail?.distance || "8 km"}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Duration:</span>
                          <p className="font-medium text-gray-900">{trip.trail?.duration || "4-6 hours"}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Elevation Gain:</span>
                          <p className="font-medium text-gray-900">{trip.trail?.elevationGain || "500m"}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Elevation Profile</h4>
                      <div className="w-full h-32 bg-gradient-to-r from-green-200 via-yellow-200 to-red-200 rounded relative">
                        <div className="absolute inset-0 flex items-end justify-between px-2 pb-2 text-xs">
                          <span className="bg-white px-1 rounded">{trip.trail?.startElevation || "200"}m</span>
                          <span className="bg-white px-1 rounded">{trip.trail?.peakElevation || "700"}m</span>
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
                    <TrailMap 
                      trailPoints={trip.trail?.trailPoints || []}
                      center={trip.mapCenter}
                      zoom={14}
                    />
                    
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
                    <h3 className="font-semibold text-gray-900 mb-4">Trail Points & Camping Sites</h3>
                    <div className="space-y-4">
                      {(trip.trail?.trailPoints || []).map((point, index) => (
                        <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                            point.type === 'trailhead' ? 'bg-green-500' :
                            point.type === 'campsite' ? 'bg-orange-500' :
                            point.type === 'summit' ? 'bg-red-500' :
                            'bg-blue-500'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{point.name}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span className="flex items-center">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                {point.elevation} elevation
                              </span>
                              <span className="flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {point.coordinates.lat.toFixed(4)}, {point.coordinates.lng.toFixed(4)}
                              </span>
                            </div>
                          </div>
                          {point.type === 'campsite' && (
                            <Badge variant="outline" className="text-orange-600 border-orange-600">
                              Camping Available
                            </Badge>
                          )}
                          {point.type === 'summit' && (
                            <Badge className="bg-red-500 text-white">
                              Peak
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>


                </Card>
            </TabsContent>

            {/* VIP Experience Tab - for private category */}
            <TabsContent value="VIP Experience" className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-[#D4AF37]" />
                  Exclusive VIP Experience
                </h2>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h3 className="font-semibold text-yellow-800 mb-3">Private Transfers</h3>
                      <ul className="space-y-2 text-sm text-yellow-700">
                        <li>• Luxury vehicle with professional driver</li>
                        <li>• Airport pickup and drop-off included</li>
                        <li>• Flexible scheduling to your preference</li>
                        <li>• Complimentary refreshments during transfer</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h3 className="font-semibold text-yellow-800 mb-3">Exclusive Access</h3>
                      <ul className="space-y-2 text-sm text-yellow-700">
                        <li>• Private beach areas and secluded spots</li>
                        <li>• Skip-the-line access to attractions</li>
                        <li>• Reserved seating at restaurants</li>
                        <li>• Access to VIP lounges and facilities</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Wellness Program Tab - for wellness category */}
            <TabsContent value="Wellness Program" className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-emerald-500" />
                  Wellness Program Schedule
                </h2>
                <div className="space-y-6">
                  <div className="grid gap-4">
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <h3 className="font-semibold text-emerald-800 mb-3">Daily Wellness Activities</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-emerald-700">6:00 AM - Morning Meditation</span>
                          <span className="text-xs bg-emerald-100 px-2 py-1 rounded">45 min</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-emerald-700">7:00 AM - Sunrise Yoga</span>
                          <span className="text-xs bg-emerald-100 px-2 py-1 rounded">60 min</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-emerald-700">2:00 PM - Spa Treatment</span>
                          <span className="text-xs bg-emerald-100 px-2 py-1 rounded">90 min</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-emerald-700">6:00 PM - Mindfulness Workshop</span>
                          <span className="text-xs bg-emerald-100 px-2 py-1 rounded">60 min</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Mystery Clues Tab - for mystery category */}
            <TabsContent value="Mystery Clues" className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Search className="w-5 h-5 mr-2 text-purple-600" />
                  Mystery Adventure Clues
                </h2>
                <div className="space-y-6">
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h3 className="font-semibold text-purple-800 mb-3">What We Can Reveal</h3>
                    <ul className="space-y-2 text-sm text-purple-700">
                      <li>• The destination is a hidden gem in Luzon</li>
                      <li>• You'll experience both adventure and cultural immersion</li>
                      <li>• The location has historical significance</li>
                      <li>• Outdoor activities and indoor discoveries await</li>
                      <li>• Local cuisine will be a highlight of the experience</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-3">The Full Reveal</h3>
                    <p className="text-sm text-gray-700">The complete destination and detailed itinerary will be revealed 24 hours before departure. Pack for warm weather and comfortable walking!</p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Tech Requirements Tab - for virtual category */}
            <TabsContent value="Tech Requirements" className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Monitor className="w-5 h-5 mr-2 text-red-500" />
                  Technical Requirements
                </h2>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h3 className="font-semibold text-red-800 mb-3">System Requirements</h3>
                      <ul className="space-y-2 text-sm text-red-700">
                        <li>• Stable internet connection (minimum 10 Mbps)</li>
                        <li>• Computer/laptop with webcam and microphone</li>
                        <li>• Latest version of Zoom installed</li>
                        <li>• Quiet environment for best experience</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h3 className="font-semibold text-red-800 mb-3">Platform Access</h3>
                      <ul className="space-y-2 text-sm text-red-700">
                        <li>• Zoom meeting link sent 1 hour before</li>
                        <li>• WhatsApp group for real-time chat</li>
                        <li>• Digital materials accessible via email</li>
                        <li>• Recording available for 7 days after</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="Inclusions" className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-600" />
                  What's Included
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-[#D4AF37]" />
                      Transportation
                    </h3>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Airport pickup and drop-off</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Private boat for island hopping</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Land transfers between locations</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Users className="w-4 h-4 mr-2 text-[#D4AF37]" />
                      Guide & Support
                    </h3>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Professional English-speaking guide</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>24/7 support during the trip</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Local cultural experiences</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Utensils className="w-4 h-4 mr-2 text-[#D4AF37]" />
                      Meals & Refreshments
                    </h3>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Daily breakfast</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Welcome and farewell dinners</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Beach picnic lunch (Day 2)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Fresh drinking water during tours</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Package className="w-4 h-4 mr-2 text-[#D4AF37]" />
                      Equipment & Gear
                    </h3>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Snorkeling equipment</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Life jackets and safety gear</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Waterproof bags for belongings</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-2">Not Included</h3>
                  <ul className="space-y-1 text-sm text-red-700">
                    <li>• Airfare to/from Palawan</li>
                    <li>• Travel insurance</li>
                    <li>• Personal expenses and souvenirs</li>
                    <li>• Additional meals not mentioned</li>
                    <li>• Tips for guides and drivers</li>
                  </ul>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="Accommodation" className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Accommodation Details</h2>
                
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <img 
                        src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=250&fit=crop" 
                        alt="El Nido Resort" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">El Nido Beachfront Resort</h3>
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(4)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                          <Star className="w-4 h-4 text-gray-300" />
                        </div>
                        <span className="text-sm text-gray-600 ml-2">4.6/5 (324 reviews)</span>
                      </div>
                      <p className="text-gray-700 text-sm mb-4">
                        Oceanfront accommodation with modern amenities and stunning sunset views. 
                        Located just steps from the beach and El Nido town center.
                      </p>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>Corong-Corong Beach, El Nido</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Room Features</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Air conditioning</li>
                        <li>• Private bathroom</li>
                        <li>• Ocean or garden view</li>
                        <li>• Mini-refrigerator</li>
                        <li>• Free WiFi</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Resort Amenities</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Swimming pool</li>
                        <li>• Restaurant & bar</li>
                        <li>• Beach access</li>
                        <li>• Tour desk</li>
                        <li>• Laundry service</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Nearby</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• El Nido town (5 min walk)</li>
                        <li>• Las Cabanas Beach (10 min)</li>
                        <li>• Restaurants & shops</li>
                        <li>• Boat tour operators</li>
                        <li>• ATM & convenience stores</li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Room Type: Deluxe Ocean View</h4>
                    <p className="text-sm text-blue-700">
                      Spacious rooms with king or twin beds, featuring panoramic ocean views from private balconies. 
                      Each room is equipped with modern amenities and traditional Filipino design elements.
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="Reviews" className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Guest Reviews</h2>
                  <div className="flex items-center space-x-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                    <span className="text-lg font-semibold">4.9</span>
                    <span className="text-gray-600">(47 reviews)</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Cleanliness</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-[95%] h-full bg-[#D4AF37] rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">4.9</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Communication</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-[98%] h-full bg-[#D4AF37] rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">4.9</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Check-in</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-[92%] h-full bg-[#D4AF37] rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">4.8</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Accuracy</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-[96%] h-full bg-[#D4AF37] rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">4.9</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Location</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-[94%] h-full bg-[#D4AF37] rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">4.8</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Value</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div className="w-[90%] h-full bg-[#D4AF37] rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">4.7</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-6">
                    <div className="flex items-start space-x-4">
                      <img 
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=face" 
                        alt="Miguel Santos" 
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">Miguel Santos</h4>
                            <p className="text-sm text-gray-600">Manila, Philippines</p>
                          </div>
                          <div className="text-right">
                            <div className="flex text-yellow-400 mb-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-current" />
                              ))}
                            </div>
                            <p className="text-sm text-gray-600">March 2024</p>
                          </div>
                        </div>
                        <p className="text-gray-700">
                          "Absolutely incredible experience! Sarah was an amazing guide and the locations were breathtaking. 
                          The snorkeling was world-class and the hidden beaches were like something out of a dream. 
                          This trip exceeded all my expectations and I'm already planning to come back."
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-b border-gray-200 pb-6">
                    <div className="flex items-start space-x-4">
                      <img 
                        src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=48&h=48&fit=crop&crop=face" 
                        alt="Lisa Rodriguez" 
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">Lisa Rodriguez</h4>
                            <p className="text-sm text-gray-600">Cebu, Philippines</p>
                          </div>
                          <div className="text-right">
                            <div className="flex text-yellow-400 mb-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-current" />
                              ))}
                            </div>
                            <p className="text-sm text-gray-600">February 2024</p>
                          </div>
                        </div>
                        <p className="text-gray-700">
                          "Perfect blend of adventure and relaxation. The accommodation was comfortable and the food was outstanding. 
                          Sarah's knowledge of local culture made this trip special. Highly recommend for solo travelers - 
                          felt safe and welcomed throughout the entire experience."
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-start space-x-4">
                      <img 
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face" 
                        alt="James Chen" 
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">James Chen</h4>
                            <p className="text-sm text-gray-600">Singapore</p>
                          </div>
                          <div className="text-right">
                            <div className="flex text-yellow-400 mb-1">
                              {[...Array(4)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-current" />
                              ))}
                              <Star className="w-4 h-4 text-gray-300" />
                            </div>
                            <p className="text-sm text-gray-600">January 2024</p>
                          </div>
                        </div>
                        <p className="text-gray-700">
                          "Great experience overall! The boat trips were fantastic and we saw some amazing marine life. 
                          Only minor issue was some delays due to weather, but that's understandable. 
                          Would definitely book with Lakbay again for future trips to the Philippines."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="Things to bring" className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">What to Bring</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 text-green-700">Essential Items</h3>
                    <div className="grid grid-cols-1 gap-1.5 text-sm">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Valid passport - Required for domestic flights</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Travel insurance documents - Highly recommended</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Personal medications - Bring extra supplies</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Sunscreen (SPF 50+) - Tropical sun is intense</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>Insect repellent - DEET-based recommended</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 text-blue-700">Clothing & Gear</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                        <span><strong>Swimwear</strong> - 2-3 sets recommended</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                        <span><strong>Quick-dry shirts</strong> - Lightweight materials</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                        <span><strong>Shorts and light pants</strong> - Cotton or synthetic</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                        <span><strong>Water shoes</strong> - For rocky beaches</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                        <span><strong>Hat and sunglasses</strong> - UV protection essential</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 text-purple-700">Electronics & Tech</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-purple-600 flex-shrink-0" />
                        <span><strong>Waterproof phone case</strong> - For underwater photos</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-purple-600 flex-shrink-0" />
                        <span><strong>Power bank</strong> - Limited charging opportunities</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-purple-600 flex-shrink-0" />
                        <span><strong>Camera</strong> - GoPro or underwater camera</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-purple-600 flex-shrink-0" />
                        <span><strong>Universal adapter</strong> - Type A, B, C plugs</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 text-orange-700">Optional Items</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-orange-600 flex-shrink-0" />
                        <span><strong>Snorkeling mask</strong> - Personal fit preference</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-orange-600 flex-shrink-0" />
                        <span><strong>Reef-safe sunscreen</strong> - Protect marine life</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-orange-600 flex-shrink-0" />
                        <span><strong>Dry bag</strong> - Extra protection for valuables</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-orange-600 flex-shrink-0" />
                        <span><strong>First aid kit</strong> - Basic medical supplies</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-2 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Packing Tips
                  </h3>
                  <ul className="space-y-1 text-sm text-yellow-700">
                    <li>• Pack light - you'll be moving between boats and locations frequently</li>
                    <li>• Bring quick-dry materials - high humidity means slow drying times</li>
                    <li>• Leave valuable jewelry at home - saltwater and sand can damage items</li>
                    <li>• Pack extra plastic bags - useful for wet clothes and gear</li>
                  </ul>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="Reminders" className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-[#D4AF37]" />
                  Important Reminders
                </h2>
                
                <div className="space-y-6">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h3 className="font-semibold text-red-800 mb-3 flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Safety & Health
                    </h3>
                    <ul className="space-y-2 text-sm text-red-700">
                      <li>• <strong>Travel insurance is mandatory</strong> - Must cover water activities and medical evacuation</li>
                      <li>• <strong>Swimming ability required</strong> - Intermediate level recommended for open water activities</li>
                      <li>• <strong>Sun protection critical</strong> - UV index is extreme, reapply sunscreen every 2 hours</li>
                      <li>• <strong>Stay hydrated</strong> - Drink water regularly, avoid excessive alcohol</li>
                      <li>• <strong>Follow guide instructions</strong> - Marine conditions can change rapidly</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Pre-Trip Preparation
                    </h3>
                    <ul className="space-y-2 text-sm text-blue-700">
                      <li>• <strong>Confirm flight details</strong> - Share arrival/departure times 48 hours before</li>
                      <li>• <strong>Weather monitoring</strong> - Tours may be rescheduled due to weather conditions</li>
                      <li>• <strong>Physical preparation</strong> - Light exercise recommended for boat activities</li>
                      <li>• <strong>Currency exchange</strong> - Bring Philippine Peso for local purchases</li>
                      <li>• <strong>Emergency contacts</strong> - Save local emergency numbers to your phone</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Environmental Responsibility
                    </h3>
                    <ul className="space-y-2 text-sm text-green-700">
                      <li>• <strong>Reef-safe sunscreen only</strong> - Protect coral ecosystems</li>
                      <li>• <strong>No touching marine life</strong> - Look but don't disturb wildlife</li>
                      <li>• <strong>Pack out all trash</strong> - Leave no trace principles apply</li>
                      <li>• <strong>Respect local communities</strong> - Follow cultural guidelines and dress codes</li>
                      <li>• <strong>Support local economy</strong> - Purchase from local vendors when possible</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h3 className="font-semibold text-purple-800 mb-3 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Day of Travel
                    </h3>
                    <ul className="space-y-2 text-sm text-purple-700">
                      <li>• <strong>Early departure times</strong> - Tours start early to avoid crowds and heat</li>
                      <li>• <strong>Boat schedule flexibility</strong> - Departure times may vary based on tides and weather</li>
                      <li>• <strong>Group communication</strong> - Join WhatsApp group for real-time updates</li>
                      <li>• <strong>Backup plans</strong> - Alternative activities available for bad weather days</li>
                      <li>• <strong>Equipment check</strong> - Verify all provided gear before departure</li>
                    </ul>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Emergency Contacts</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li><strong>Tour Guide:</strong> +63 917 123 4567</li>
                        <li><strong>Local Emergency:</strong> 911</li>
                        <li><strong>Coast Guard:</strong> +63 917 842 8400</li>
                        <li><strong>Hospital:</strong> +63 48 434 8517</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Useful Apps</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li><strong>Grab:</strong> Transportation and food delivery</li>
                        <li><strong>GCash:</strong> Digital payments</li>
                        <li><strong>Google Translate:</strong> Local language support</li>
                        <li><strong>Offline Maps:</strong> Download before departure</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="Cancellation" className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Cancellation Policy</h2>
                
                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                      <h3 className="font-semibold text-green-800 mb-2">30+ Days</h3>
                      <p className="text-2xl font-bold text-green-600 mb-1">100%</p>
                      <p className="text-sm text-green-700">Full refund</p>
                    </div>
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                      <h3 className="font-semibold text-yellow-800 mb-2">15-29 Days</h3>
                      <p className="text-2xl font-bold text-yellow-600 mb-1">75%</p>
                      <p className="text-sm text-yellow-700">Partial refund</p>
                    </div>
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                      <h3 className="font-semibold text-red-800 mb-2">0-14 Days</h3>
                      <p className="text-2xl font-bold text-red-600 mb-1">25%</p>
                      <p className="text-sm text-red-700">Limited refund</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Detailed Cancellation Terms</h3>
                      <div className="space-y-3 text-sm text-gray-700">
                        <div className="flex items-start space-x-3">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                          <div>
                            <strong>30+ days before departure:</strong> Full refund minus 3% processing fee. 
                            Cancellation must be submitted in writing via email or through the Lakbay platform.
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 text-yellow-600 flex-shrink-0" />
                          <div>
                            <strong>15-29 days before departure:</strong> 75% refund of total trip cost. 
                            Accommodation and transport costs may be non-refundable depending on supplier policies.
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 text-red-600 flex-shrink-0" />
                          <div>
                            <strong>0-14 days before departure:</strong> 25% refund of trip cost. 
                            Most accommodation and transport costs are non-refundable at this point.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h3 className="font-semibold text-blue-800 mb-3">Weather-Related Cancellations</h3>
                      <ul className="space-y-2 text-sm text-blue-700">
                        <li>• <strong>Typhoon/Storm:</strong> Full refund or reschedule option at no additional cost</li>
                        <li>• <strong>Rough seas:</strong> Alternative activities provided or partial refund</li>
                        <li>• <strong>Airport closures:</strong> Trip can be rescheduled without penalty</li>
                        <li>• <strong>Force majeure:</strong> Case-by-case evaluation for refunds</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <h3 className="font-semibold text-orange-800 mb-3">Medical Emergency Cancellations</h3>
                      <ul className="space-y-2 text-sm text-orange-700">
                        <li>• <strong>Medical certificate required:</strong> From licensed physician</li>
                        <li>• <strong>Covered conditions:</strong> Serious illness, injury, or family emergency</li>
                        <li>• <strong>Refund amount:</strong> Up to 90% with valid medical documentation</li>
                        <li>• <strong>Travel insurance:</strong> Recommended to cover remaining costs</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Modification Policy</h3>
                      <div className="space-y-2 text-sm text-gray-700">
                        <div className="flex items-start space-x-3">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                          <div>
                            <strong>Date changes:</strong> Subject to availability, ₱2,500 modification fee applies
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                          <div>
                            <strong>Group size changes:</strong> Price adjustment based on final participant count
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <CheckCircle2 className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                          <div>
                            <strong>Accommodation upgrades:</strong> Available for additional cost, subject to availability
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Refund Processing</h3>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Refunds processed within 7-14 business days</li>
                        <li>• Returned to original payment method</li>
                        <li>• Bank processing may take additional 3-5 days</li>
                        <li>• Email confirmation sent once refund is initiated</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Booking Sidebar or Audio Book Section */}
        <div className="space-y-6">
          {!isBooked ? (
            /* Original Booking Section */
            <div className="prada-card p-8">
              {/* Category Badge */}
              <div className="mb-4">
                <Badge 
                  className={`text-xs px-3 py-1 font-light tracking-wider prada-corner-radius ${
                    trip.category === 'private' ? 'bg-[#D4AF37] text-black' :
                    trip.category === 'joiner' ? 'bg-green-600 text-white' :
                    trip.category === 'meetup' ? 'bg-blue-500 text-white' :
                    trip.category === 'mystery' ? 'bg-purple-600 text-white' :
                    trip.category === 'event' ? 'bg-orange-500 text-white' :
                    trip.category === 'virtual' ? 'bg-red-500 text-white' :
                    trip.category === 'wellness' ? 'bg-emerald-500 text-white' :
                    trip.category === 'online-quiz' ? 'bg-[#D4AF37] text-black' :
                    trip.category === 'culinary' ? 'bg-pink-500 text-white' :
                    trip.category === 'hiking' ? 'bg-teal-600 text-white' :
                    trip.category === 'island' ? 'bg-cyan-500 text-white' :
                    'bg-gray-600 text-white'
                  }`}
                >
                  {trip.category.toUpperCase().replace('-', ' ')}
                </Badge>
              </div>
              
              <div className="text-center mb-6">
                <span className="prada-heading text-2xl font-light text-black">{trip.price}</span>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-light text-gray-600 tracking-wider uppercase mb-2">Guests</label>
                  <Select value={guests} onValueChange={setGuests}>
                    <SelectTrigger className="prada-input h-12">
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
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-light text-gray-600 tracking-wider uppercase mb-2">Check in</label>
                    <Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="prada-input h-12" />
                  </div>
                  <div>
                    <label className="block text-xs font-light text-gray-600 tracking-wider uppercase mb-2">Check out</label>
                    <Input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="prada-input h-12" />
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{trip.price} x {guests}</span>
                    <span>₱{(parseInt(trip.price.replace(/[^\d]/g, "")) * parseInt(guests.split(" ")[0])).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₱{(parseInt(trip.price.replace(/[^\d]/g, "")) * parseInt(guests.split(" ")[0])).toLocaleString()}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleReservation}
                  disabled={isProcessing}
                  className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-black font-medium"
                >
                  {isProcessing ? "Processing..." : "Reserve (24h hold)"}
                </Button>
                
                <Button 
                  onClick={handlePayMongoPayment}
                  disabled={isProcessing}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium"
                >
                  {isProcessing ? "Processing..." : "Book Now with PayMongo"}
                </Button>
                
                {/* Demo button to test audio book feature */}
                <Button 
                  onClick={() => setIsBooked(true)}
                  variant="outline"
                  className="w-full text-sm text-gray-600 border-dashed"
                >
                  🎧 Demo: Show Audio Book
                </Button>

                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-2">Secure payment powered by</p>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="bg-[#1a56db] text-white px-3 py-1 rounded text-xs font-semibold">
                      PayMongo
                    </div>
                    <span className="text-xs text-gray-400">SSL Encrypted</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3 mt-2">
                    <span className="text-xs text-gray-500">Accepts:</span>
                    <div className="flex space-x-1">
                      <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs">GCash</div>
                      <div className="bg-green-600 text-white px-2 py-1 rounded text-xs">Maya</div>
                      <div className="bg-purple-600 text-white px-2 py-1 rounded text-xs">Cards</div>
                      <div className="bg-orange-600 text-white px-2 py-1 rounded text-xs">GrabPay</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Audio Book Section for Booked Trips */
            <Card className="p-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-3">
                  <Headphones className="w-8 h-8 text-[#D4AF37] mr-2" />
                  <h2 className="text-xl font-bold text-gray-900">Audio Guide Available</h2>
                </div>
                <p className="text-sm text-gray-600">AI-generated itinerary audio guides for your booked trip</p>
              </div>

              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center justify-center text-green-700">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">Trip Confirmed</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <Volume2 className="w-4 h-4 mr-2 text-[#D4AF37]" />
                    Daily Audio Guides
                  </h3>
                  
                  {trip.itinerary.map((day, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-[#D4AF37] text-black rounded-full flex items-center justify-center text-xs font-bold mr-3">
                            {day.day}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm">{day.title}</h4>
                            <p className="text-xs text-gray-600">Duration: 8-12 min</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePlayAudio(index)}
                            className="flex items-center p-2"
                          >
                            {currentAudioTrack === index && isPlaying ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadAudio(index)}
                            className="flex items-center p-2"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {currentAudioTrack === index && isPlaying && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                          <div className="flex items-center text-blue-700 text-sm">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                            Now playing: AI-generated guide for {day.title}
                          </div>
                          <div className="w-full bg-blue-200 rounded-full h-1 mt-2">
                            <div className="bg-blue-500 h-1 rounded-full animate-pulse" style={{width: '45%'}}></div>
                          </div>
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                        AI-generated audio description covering {day.description.toLowerCase()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <div className="flex items-start">
                      <Headphones className="w-4 h-4 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-amber-700">
                        <p className="font-medium mb-1">Audio Guide Features:</p>
                        <ul className="space-y-0.5">
                          <li>• AI-powered narration with local insights</li>
                          <li>• Offline download for areas with poor connectivity</li>
                          <li>• Personalized content based on your interests</li>
                          <li>• Available in multiple languages</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

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

          {/* Itinerary Map */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg text-gray-900 mb-4">Itinerary Map</h3>
            <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Trip Route Map</span>
            </div>
          </Card>
        </div>
          </div>
        </div>
        </TabsContent>
      </Tabs>

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
            host: trip.host,
            itinerary: trip.itinerary || [],
            meetingPlace: trip.meetingPlace
          }}
        />
      )}
    </div>
  );
};