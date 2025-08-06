import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

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
    if (location.includes("bohol-nature")) {
      return {
        title: "Nature dive in Bohol for 3 days",
        duration: "August 14-16, 2025",
        price: "PHP 2204 per person",
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

      <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="col-span-2 space-y-8">
          {/* Navigation Tabs */}
          <nav className="flex space-x-8 border-b border-gray-200">
            <button className="pb-3 text-gray-900 font-medium border-b-2 border-[#D4AF37]">Itinerary</button>
            <button className="pb-3 text-gray-700 hover:text-gray-900">Inclusions</button>
            <button className="pb-3 text-gray-700 hover:text-gray-900">Accommodation</button>
            <button className="pb-3 text-gray-700 hover:text-gray-900">Reviews</button>
            <button className="pb-3 text-gray-700 hover:text-gray-900">Things to bring</button>
            <button className="pb-3 text-gray-700 hover:text-gray-900">Reminders</button>
            <button className="pb-3 text-gray-700 hover:text-gray-900">Cancellation Policy</button>
          </nav>

          {/* Itinerary */}
          <div className="space-y-6">
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
          </div>

          {/* Accommodation */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg text-gray-900 mb-4">Accommodation</h3>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {trip.accommodation.images.map((img, index) => (
                <img 
                  key={index}
                  src={img}
                  alt="Accommodation"
                  className="w-full h-24 object-cover rounded-lg"
                />
              ))}
            </div>
            <h4 className="font-medium text-gray-900 mb-2">{trip.accommodation.title}</h4>
            <p className="text-gray-700">{trip.accommodation.description}</p>
          </Card>

          {/* Meeting Place */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg text-gray-900 mb-4">Meeting place</h3>
            <p className="text-gray-700 mb-4">{trip.meetingPlace}</p>
            <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Interactive Map (Location: {trip.meetingPlace})</span>
            </div>
          </Card>
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
    </div>
  );
};