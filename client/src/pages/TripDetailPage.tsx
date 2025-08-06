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
import { MapPin, Star, Clock, Users, Calendar, Shield, AlertTriangle, CheckCircle2, Mountain, TrendingUp, MapIcon } from "lucide-react";

interface TripDetailPageProps {
  params?: {
    id?: string;
  };
}

export const TripDetailPage = ({ params }: TripDetailPageProps): JSX.Element => {
  const [location] = useLocation();
  const [guests, setGuests] = useState("1 guest");
  const [checkIn, setCheckIn] = useState("09/14/2025");
  const [checkOut, setCheckOut] = useState("09/16/2025");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("itinerary");
  const { toast } = useToast();

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

  // Sample trip data based on route
  const getTripData = () => {
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
            { name: "Babadak Ranger Station", elevation: 1722, lat: 16.5964, lng: 120.8897, type: "trailhead" },
            { name: "Eddet River Crossing", elevation: 1856, lat: 16.5985, lng: 120.8923, type: "checkpoint" },
            { name: "Camp 1 - Bamboo Forest", elevation: 2134, lat: 16.6012, lng: 120.8967, type: "campsite" },
            { name: "Saddle Camp", elevation: 2387, lat: 16.6043, lng: 120.9015, type: "campsite" },
            { name: "Camp 2 - Grassland", elevation: 2654, lat: 16.6067, lng: 120.9052, type: "campsite" },
            { name: "Mount Pulag Summit", elevation: 2922, lat: 16.6089, lng: 120.9089, type: "summit" }
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
    
    // Default fallback
    return {
      title: "Private Island Adventure in Palawan",
      duration: "September 20-23, 2025",
      price: "PHP 15000 per person",
      category: "island",
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
  };

  const trip = getTripData();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white px-8 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="w-8 h-8 bg-gray-300 rounded cursor-pointer"></div>
          </Link>
          
          <nav className="flex items-center space-x-8">
            <Link href="/" className="text-gray-900 font-medium">Home</Link>
            <a href="#" className="text-gray-700 hover:text-gray-900">Trails</a>
            <a href="#" className="text-gray-700 hover:text-gray-900">Story</a>
            <a href="#" className="text-gray-700 hover:text-gray-900">Shop</a>
            <a href="#" className="text-gray-700 hover:text-gray-900">Corporate</a>
            <a href="#" className="text-gray-700 hover:text-gray-900">Explore</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="text-sm">Log in</Button>
            <Button className="bg-[#D4AF37] hover:bg-[#B8941F] text-black text-sm">Register</Button>
            <span className="text-sm text-gray-700">EN</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative h-64">
        <img 
          src={trip.heroImage}
          alt={trip.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-6 left-8 text-white">
          <h1 className="text-3xl font-bold mb-2">{trip.title}</h1>
          <p className="text-lg opacity-90">{trip.duration}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8 grid lg:grid-cols-3 gap-8">
        {/* Trip Details */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className={`grid w-full h-auto p-1 ${trip.category === 'hiking' ? 'grid-cols-8' : 'grid-cols-7'}`}>
              <TabsTrigger value="itinerary" className="text-xs px-2 py-2">Itinerary</TabsTrigger>
              {trip.category === 'hiking' && (
                <TabsTrigger value="trail" className="text-xs px-2 py-2">Trail</TabsTrigger>
              )}
              <TabsTrigger value="inclusions" className="text-xs px-2 py-2">Inclusions</TabsTrigger>
              <TabsTrigger value="accommodation" className="text-xs px-2 py-2">Accommodation</TabsTrigger>
              <TabsTrigger value="reviews" className="text-xs px-2 py-2">Reviews</TabsTrigger>
              <TabsTrigger value="bring" className="text-xs px-2 py-2">Things to bring</TabsTrigger>
              <TabsTrigger value="reminders" className="text-xs px-2 py-2">Reminders</TabsTrigger>
              <TabsTrigger value="cancellation" className="text-xs px-2 py-2">Cancellation</TabsTrigger>
            </TabsList>

            <TabsContent value="itinerary" className="space-y-6">
              {trip.itinerary.map((day, index) => (
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

            {trip.category === 'hiking' && trip.trail && (
              <TabsContent value="trail" className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Mountain className="w-5 h-5 mr-2 text-[#D4AF37]" />
                    3D Trail Visualization
                  </h2>
                  
                  {/* Trail Overview */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900">{trip.trail.name}</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Difficulty:</span>
                          <p className="font-medium text-gray-900">{trip.trail.difficulty}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Distance:</span>
                          <p className="font-medium text-gray-900">{trip.trail.distance}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Duration:</span>
                          <p className="font-medium text-gray-900">{trip.trail.duration}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Elevation Gain:</span>
                          <p className="font-medium text-gray-900">{trip.trail.elevationGain}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Elevation Profile</h4>
                      <div className="w-full h-32 bg-gradient-to-r from-green-200 via-yellow-200 to-red-200 rounded relative">
                        <div className="absolute inset-0 flex items-end justify-between px-2 pb-2 text-xs">
                          <span className="bg-white px-1 rounded">{trip.trail.startElevation}m</span>
                          <span className="bg-white px-1 rounded">{trip.trail.peakElevation}m</span>
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

                  {/* 3D Trail Visualization */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <MapIcon className="w-4 h-4 mr-2" />
                      3D Trail Map
                    </h3>
                    <div className="w-full h-96 bg-gradient-to-b from-blue-100 to-green-100 rounded-lg relative overflow-hidden">
                      <div className="absolute inset-0 p-4">
                        {/* 3D Mountain Visualization */}
                        <div className="w-full h-full relative">
                          {/* Mountain Peaks */}
                          <div 
                            className="absolute w-32 h-32 bg-gradient-to-t from-gray-600 to-gray-300 transform rotate-45 translate-x-32 translate-y-16"
                            style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
                          ></div>
                          <div 
                            className="absolute w-40 h-40 bg-gradient-to-t from-gray-700 to-gray-400 transform rotate-45 translate-x-48 translate-y-8"
                            style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
                          ></div>
                          
                          {/* Trail Path */}
                          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
                            <path 
                              d="M 50,250 Q 100,230 150,200 Q 200,180 250,150 Q 300,130 350,100" 
                              stroke="#D4AF37" 
                              strokeWidth="4" 
                              strokeDasharray="5,5"
                              fill="none"
                              className="animate-pulse"
                            />
                          </svg>
                          
                          {/* Trail Points */}
                          {trip.trail.trailPoints.map((point, index) => (
                            <div 
                              key={index}
                              className={`absolute w-3 h-3 rounded-full border-2 border-white shadow-lg ${
                                point.type === 'trailhead' ? 'bg-green-500' :
                                point.type === 'campsite' ? 'bg-orange-500' :
                                point.type === 'summit' ? 'bg-red-500' :
                                'bg-blue-500'
                              }`}
                              style={{
                                left: `${20 + (index * 60)}px`,
                                top: `${280 - (index * 30)}px`
                              }}
                              title={`${point.name} - ${point.elevation}m`}
                            />
                          ))}
                          
                          {/* Floating Labels */}
                          <div className="absolute top-4 left-4 bg-white bg-opacity-90 p-2 rounded text-xs">
                            <div className="flex items-center space-x-2 mb-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span>Trailhead</span>
                            </div>
                            <div className="flex items-center space-x-2 mb-1">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              <span>Camping Sites</span>
                            </div>
                            <div className="flex items-center space-x-2 mb-1">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span>Checkpoints</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span>Summit</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Trail Points Details */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Trail Points & Camping Sites</h3>
                    <div className="space-y-4">
                      {trip.trail.trailPoints.map((point, index) => (
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
                                {point.elevation}m elevation
                              </span>
                              <span className="flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
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

                  {/* Additional Trail Info */}
                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Trail Conditions</h4>
                      <ul className="space-y-1 text-sm text-blue-700">
                        <li>• Best season: October to February</li>
                        <li>• Weather: Cool temperatures, possible frost</li>
                        <li>• Trail surface: Rocky, grassy sections</li>
                        <li>• Water sources: Available at camps</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">Safety Information</h4>
                      <ul className="space-y-1 text-sm text-green-700">
                        <li>• Altitude sickness possible above 2,500m</li>
                        <li>• Weather changes rapidly</li>
                        <li>• GPS recommended for navigation</li>
                        <li>• Emergency shelter at Camp 2</li>
                      </ul>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            )}

            <TabsContent value="inclusions" className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-600" />
                  What's Included
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-[#D4AF37]" />
                      Transportation
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                        <span>Airport pickup and drop-off</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                        <span>Private boat for island hopping</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                        <span>Land transfers between locations</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Users className="w-4 h-4 mr-2 text-[#D4AF37]" />
                      Guide & Support
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                        <span>Professional English-speaking guide</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                        <span>24/7 support during the trip</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                        <span>Local cultural experiences</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Meals & Refreshments</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                        <span>Daily breakfast</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                        <span>Welcome and farewell dinners</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                        <span>Beach picnic lunch (Day 2)</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                        <span>Fresh drinking water during tours</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Equipment & Gear</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                        <span>Snorkeling equipment</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                        <span>Life jackets and safety gear</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                        <span>Waterproof bags for belongings</span>
                      </li>
                    </ul>
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

            <TabsContent value="accommodation" className="space-y-6">
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

            <TabsContent value="reviews" className="space-y-6">
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

            <TabsContent value="bring" className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">What to Bring</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 text-green-700">Essential Items</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                        <span><strong>Valid passport</strong> - Required for domestic flights</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                        <span><strong>Travel insurance documents</strong> - Highly recommended</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                        <span><strong>Personal medications</strong> - Bring extra supplies</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                        <span><strong>Sunscreen (SPF 50+)</strong> - Tropical sun is intense</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                        <span><strong>Insect repellent</strong> - DEET-based recommended</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 text-blue-700">Clothing & Gear</h3>
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

            <TabsContent value="reminders" className="space-y-6">
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

            <TabsContent value="cancellation" className="space-y-6">
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

        {/* Booking Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="text-center mb-4">
              <span className="text-2xl font-bold text-gray-900">{trip.price}</span>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
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
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check in</label>
                  <Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check out</label>
                  <Input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
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

          {/* Itinerary Map */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg text-gray-900 mb-4">Itinerary Map</h3>
            <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Trip Route Map</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
};