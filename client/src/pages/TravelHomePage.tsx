import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star } from "lucide-react";

export const TravelHomePage = (): JSX.Element => {
  const featuredDestinations = [
    {
      id: 1,
      title: "Mountain Adventure",
      location: "Swiss Alps",
      image: "https://images.unsplash.com/photo-1464822759844-d150baec0494?w=400&h=300&fit=crop",
      rating: 4.8,
      price: "$1,299"
    },
    {
      id: 2,
      title: "Beach Paradise",
      location: "Maldives",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      rating: 4.9,
      price: "$2,199"
    }
  ];

  const travelCategories = [
    {
      id: 1,
      title: "Mountains",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
      description: "Discover breathtaking peaks"
    },
    {
      id: 2,
      title: "Beaches",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=200&fit=crop",
      description: "Relax on pristine shores"
    },
    {
      id: 3,
      title: "Cities",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop",
      description: "Explore urban adventures"
    },
    {
      id: 4,
      title: "Nature",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop",
      description: "Connect with wilderness"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f3f1ec]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-gray-900">TravelCo</h1>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-gray-700 hover:text-gray-900">Home</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Destinations</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Tours</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">About</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Contact</a>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">Sign In</Button>
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700">Sign Up</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-4 bg-amber-100 text-amber-800 hover:bg-amber-100">
            Discover • Explore • Adventure
          </Badge>
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Rediscover the world through<br />
            culture, with our nature and<br />
            culture trips.
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Don't just travel. Uncover!
          </p>
          <div className="flex justify-center space-x-4">
            <Button className="bg-amber-600 hover:bg-amber-700 px-8 py-3">
              Start Exploring
            </Button>
            <Button variant="outline" className="px-8 py-3">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Featured Destinations
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {featuredDestinations.map((destination) => (
              <Card key={destination.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={destination.image} 
                    alt={destination.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xl font-semibold text-gray-900">{destination.title}</h4>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">{destination.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{destination.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">{destination.price}</span>
                    <Button className="bg-amber-600 hover:bg-amber-700">Book Now</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation Categories */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center space-x-8 mb-12">
            <a href="#" className="text-gray-700 hover:text-amber-600 font-medium">Beaches</a>
            <a href="#" className="text-gray-700 hover:text-amber-600 font-medium">Cities</a>
            <a href="#" className="text-gray-700 hover:text-amber-600 font-medium">Heritage</a>
            <a href="#" className="text-gray-700 hover:text-amber-600 font-medium">History</a>
            <a href="#" className="text-gray-700 hover:text-amber-600 font-medium">Events</a>
            <a href="#" className="text-gray-700 hover:text-amber-600 font-medium">Virtual</a>
            <a href="#" className="text-gray-700 hover:text-amber-600 font-medium">Shop</a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {travelCategories.map((category) => (
              <Card key={category.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">{category.title}</h4>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Best Deals Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Best Deals
          </h3>
          <Card className="overflow-hidden">
            <div className="aspect-[16/9] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop" 
                alt="Best Deal Destination"
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">Island Paradise Getaway</h4>
                  <p className="text-gray-600">7 days of luxury in tropical paradise</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 line-through">$2,999</div>
                  <div className="text-3xl font-bold text-gray-900">$1,999</div>
                  <Button className="mt-2 bg-amber-600 hover:bg-amber-700">Book Deal</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};