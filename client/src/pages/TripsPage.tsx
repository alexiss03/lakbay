import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Calendar, MapPin, Users, Clock, Star, Bookmark, Menu, X } from "lucide-react";

export const TripsPage = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "bookmarked">("upcoming");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const upcomingTrips = [
    {
      id: 1,
      title: "El Nido Island Hopping Adventure",
      destination: "Palawan, Philippines",
      date: "March 15-18, 2024",
      status: "Confirmed",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
      participants: 8,
      duration: "4 days",
      price: "₱12,500",
      dateAdded: "January 8, 2025"
    },
    {
      id: 2,
      title: "Bohol Chocolate Hills Trek",
      destination: "Bohol, Philippines",
      date: "April 22-24, 2024",
      status: "Pending Payment",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
      participants: 12,
      duration: "3 days",
      price: "₱8,900",
      dateAdded: "January 5, 2025"
    }
  ];

  const pastTrips = [
    {
      id: 3,
      title: "Sagada Cave Exploration",
      destination: "Mountain Province, Philippines",
      date: "January 10-13, 2024",
      status: "Completed",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
      participants: 6,
      duration: "4 days",
      rating: 4.8,
      price: "₱15,200",
      dateAdded: "December 20, 2023"
    },
    {
      id: 4,
      title: "Siargao Surf & Island Tour",
      destination: "Siargao, Philippines",
      date: "December 5-9, 2023",
      status: "Completed",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
      participants: 10,
      duration: "5 days",
      rating: 4.9,
      price: "₱18,750",
      dateAdded: "November 15, 2023"
    },
    {
      id: 5,
      title: "Batanes Cultural Heritage Tour",
      destination: "Batanes, Philippines",
      date: "November 15-18, 2023",
      status: "Completed",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
      participants: 8,
      duration: "4 days",
      rating: 4.7,
      price: "₱22,400",
      dateAdded: "October 25, 2023"
    }
  ];

  const bookmarkedTrips = [
    {
      id: 6,
      title: "Donsol Whale Shark Swimming",
      destination: "Sorsogon, Philippines",
      date: "Available all year",
      status: "Bookmarked",
      image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=250&fit=crop",
      participants: 15,
      duration: "3 days",
      price: "₱9,200",
      dateAdded: "January 3, 2025"
    },
    {
      id: 7,
      title: "Ilocos Norte Heritage Tour",
      destination: "Ilocos Norte, Philippines",
      date: "Flexible dates",
      status: "Bookmarked",
      image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=400&h=250&fit=crop",
      participants: 10,
      duration: "4 days",
      price: "₱6,800",
      dateAdded: "December 28, 2024"
    },
    {
      id: 8,
      title: "Camiguin Island Paradise",
      destination: "Camiguin, Philippines",
      date: "Peak season recommended",
      status: "Bookmarked",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=250&fit=crop",
      participants: 12,
      duration: "5 days",
      price: "₱14,500",
      dateAdded: "December 22, 2024"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pending Payment":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Bookmarked":
        return "bg-[#D4AF37] bg-opacity-20 text-[#B8941F] border-[#D4AF37]";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

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

      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <h1 className="prada-heading text-4xl text-black font-light mb-2">Your Lakbays</h1>
          <p className="text-gray-600 font-light">Manage your upcoming and past travel experiences</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`text-sm font-light tracking-wider transition-all ${
              activeTab === "upcoming"
                ? "text-black font-medium"
                : "text-gray-500 hover:text-black"
            }`}
          >
            UPCOMING TRIPS ({upcomingTrips.length})
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`text-sm font-light tracking-wider transition-all ${
              activeTab === "past"
                ? "text-black font-medium"
                : "text-gray-500 hover:text-black"
            }`}
          >
            PAST TRIPS ({pastTrips.length})
          </button>
          <button
            onClick={() => setActiveTab("bookmarked")}
            className={`text-sm font-light tracking-wider transition-all ${
              activeTab === "bookmarked"
                ? "text-black font-medium"
                : "text-gray-500 hover:text-black"
            }`}
          >
            BOOKMARKED ({bookmarkedTrips.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 pb-16">
        {activeTab === "upcoming" && (
          <div className="space-y-8">
            {upcomingTrips.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-32 h-32 mx-auto bg-gray-100 prada-corner-radius flex items-center justify-center mb-6">
                  <Calendar className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="prada-heading text-xl text-gray-900 mb-2 font-light">No Upcoming Trips</h3>
                <p className="text-gray-600 font-light mb-6">Start planning your next adventure</p>
                <Link href="/">
                  <Button className="bg-[#D4AF37] hover:bg-[#B8941F] text-black font-light tracking-wider">
                    EXPLORE TRIPS
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-200"></div>
                
                {upcomingTrips.map((trip, index) => (
                  <div key={trip.id} className="relative flex items-start space-x-8 pb-8">
                    {/* Timeline Dot */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-4 h-4 bg-[#D4AF37] rounded-full"></div>
                    </div>
                    
                    {/* Trip Card */}
                    <Card className="flex-1 prada-card p-6 hover:shadow-lg transition-shadow">
                      <div className="grid md:grid-cols-4 gap-6">
                        <div className="md:col-span-1">
                          <img
                            src={trip.image}
                            alt={trip.title}
                            className="w-full h-32 object-cover prada-corner-radius"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-3">
                          <div>
                            <h3 className="prada-heading text-lg text-black font-light mb-1">{trip.title}</h3>
                            <div className="flex items-center text-sm text-gray-600 font-light">
                              <MapPin className="w-4 h-4 mr-1" />
                              {trip.destination}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 font-light">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {trip.date}
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {trip.participants} participants
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {trip.duration}
                            </div>
                          </div>
                          {trip.dateAdded && (
                            <div className="text-xs text-gray-500 font-light">
                              Added to Lakbays: {trip.dateAdded}
                            </div>
                          )}
                          <Badge className={`w-fit ${getStatusColor(trip.status)}`}>
                            {trip.status}
                          </Badge>
                        </div>
                        <div className="md:col-span-1 flex flex-col justify-between">
                          <div className="text-right">
                            <div className="text-lg font-light text-[#D4AF37] mb-1">{trip.price}</div>
                          </div>
                          <div className="space-y-2">
                            <Link href={`/trip/${trip.id}`}>
                              <Button variant="outline" className="w-full font-light tracking-wider">
                                VIEW DETAILS
                              </Button>
                            </Link>
                            {trip.status === "Pending Payment" && (
                              <Button className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-black font-light tracking-wider">
                                COMPLETE PAYMENT
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bookmarked Trips Section */}
        {activeTab === "bookmarked" && (
          <div className="space-y-8">
            {bookmarkedTrips.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-32 h-32 mx-auto bg-gray-100 prada-corner-radius flex items-center justify-center mb-6">
                  <Bookmark className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="prada-heading text-xl text-gray-900 mb-2 font-light">No Bookmarked Trips</h3>
                <p className="text-gray-600 font-light mb-6">Save trips you're interested in to find them here later</p>
                <Link href="/">
                  <Button className="bg-[#D4AF37] hover:bg-[#B8941F] text-black font-light tracking-wider">
                    EXPLORE TRIPS
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-200"></div>
                
                {bookmarkedTrips.map((trip, index) => (
                  <div key={trip.id} className="relative flex items-start space-x-8 pb-8">
                    {/* Timeline Dot */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-4 h-4 bg-[#D4AF37] rounded-full border-2 border-white shadow-sm">
                        <Bookmark className="w-2 h-2 text-white absolute top-0.5 left-0.5" />
                      </div>
                    </div>
                    
                    {/* Trip Card */}
                    <Card className="flex-1 prada-card p-6 hover:shadow-lg transition-shadow">
                      <div className="grid md:grid-cols-4 gap-6">
                        <div className="md:col-span-1">
                          <img
                            src={trip.image}
                            alt={trip.title}
                            className="w-full h-32 object-cover prada-corner-radius"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-3">
                          <div>
                            <h3 className="prada-heading text-lg text-black font-light mb-1">{trip.title}</h3>
                            <div className="flex items-center text-sm text-gray-600 font-light">
                              <MapPin className="w-4 h-4 mr-1" />
                              {trip.destination}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 font-light">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {trip.date}
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {trip.participants} participants
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {trip.duration}
                            </div>
                          </div>
                          {trip.dateAdded && (
                            <div className="text-xs text-gray-500 font-light">
                              Added to Lakbays: {trip.dateAdded}
                            </div>
                          )}
                          <Badge className={`w-fit ${getStatusColor(trip.status)} flex items-center space-x-1`}>
                            <Bookmark className="w-3 h-3" />
                            <span>{trip.status}</span>
                          </Badge>
                        </div>
                        <div className="md:col-span-1 flex flex-col justify-between">
                          <div className="text-right">
                            <div className="text-lg font-light text-[#D4AF37] mb-1">{trip.price}</div>
                          </div>
                          <div className="space-y-2">
                            <Link href={`/trip/${trip.id}`}>
                              <Button variant="outline" className="w-full font-light tracking-wider">
                                VIEW DETAILS
                              </Button>
                            </Link>
                            <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-light tracking-wider">
                              BOOK NOW
                            </Button>
                            <Button variant="outline" className="w-full font-light tracking-wider border-red-300 text-red-600 hover:bg-red-50">
                              REMOVE BOOKMARK
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "past" && (
          <div className="space-y-8">
            {pastTrips.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-32 h-32 mx-auto bg-gray-100 prada-corner-radius flex items-center justify-center mb-6">
                  <MapPin className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="prada-heading text-xl text-gray-900 mb-2 font-light">No Past Trips</h3>
                <p className="text-gray-600 font-light mb-6">Your travel history will appear here</p>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-200"></div>
                
                {pastTrips.map((trip, index) => (
                  <div key={trip.id} className="relative flex items-start space-x-8 pb-8">
                    {/* Timeline Dot */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm">
                        <Star className="w-2 h-2 text-white absolute top-0.5 left-0.5 fill-current" />
                      </div>
                    </div>
                    
                    {/* Trip Card */}
                    <Card className="flex-1 prada-card p-6 hover:shadow-lg transition-shadow">
                      <div className="grid md:grid-cols-4 gap-6">
                        <div className="md:col-span-1">
                          <img
                            src={trip.image}
                            alt={trip.title}
                            className="w-full h-32 object-cover prada-corner-radius"
                          />
                        </div>
                        <div className="md:col-span-2 space-y-3">
                          <div>
                            <h3 className="prada-heading text-lg text-black font-light mb-1">{trip.title}</h3>
                            <div className="flex items-center text-sm text-gray-600 font-light">
                              <MapPin className="w-4 h-4 mr-1" />
                              {trip.destination}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 font-light">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {trip.date}
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {trip.participants} participants
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {trip.duration}
                            </div>
                            {trip.rating && (
                              <div className="flex items-center">
                                <Star className="w-4 h-4 mr-1 fill-current text-yellow-400" />
                                {trip.rating}
                              </div>
                            )}
                          </div>
                          {trip.dateAdded && (
                            <div className="text-xs text-gray-500 font-light">
                              Added to Lakbays: {trip.dateAdded}
                            </div>
                          )}
                          <Badge className={`w-fit ${getStatusColor(trip.status)}`}>
                            {trip.status}
                          </Badge>
                        </div>
                        <div className="md:col-span-1 flex flex-col justify-between">
                          <div className="text-right">
                            <div className="text-lg font-light text-gray-500 mb-1">{trip.price}</div>
                          </div>
                          <div className="space-y-2">
                            <Link href={`/trip/${trip.id}`}>
                              <Button variant="outline" className="w-full font-light tracking-wider">
                                VIEW DETAILS
                              </Button>
                            </Link>
                            <Button variant="outline" className="w-full font-light tracking-wider">
                              WRITE REVIEW
                            </Button>
                            <Button variant="outline" className="w-full font-light tracking-wider">
                              BOOK AGAIN
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};