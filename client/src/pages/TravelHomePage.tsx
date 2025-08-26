import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, Star, Clock, Brain, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { ChatWidget } from "@/components/ChatWidget";
import { TrendingArticlesSection } from "@/components/TrendingArticlesSection";
import { RecommendedSection } from "@/components/RecommendedSection";
import { PhilippinesMap } from "@/components/PhilippinesMap";

export const TravelHomePage = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState("Private");
  
  // Sample travel history data for the interactive map
  const travelHistory = [
    { province: 'Bohol', region: 'Central Visayas', visits: 3, lastVisit: '2024-12-15' },
    { province: 'Palawan', region: 'MIMAROPA', visits: 2, lastVisit: '2024-11-20' },
    { province: 'Benguet', region: 'Cordillera', visits: 1, lastVisit: '2024-10-05' },
    { province: 'Siargao', region: 'Caraga', visits: 2, lastVisit: '2024-09-12' },
    { province: 'Cebu', region: 'Central Visayas', visits: 4, lastVisit: '2024-08-08' },
  ];
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white px-8 py-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {/* Left: Logo placeholder */}
          <div className="w-8 h-8 bg-black" style={{borderRadius: '1px'}}></div>
          
          {/* Center: Navigation */}
          <nav className="flex items-center space-x-12">
            <Link href="/" className="prada-nav text-black hover:text-gray-600 transition-colors">Home</Link>
            <Link href="/trips" className="prada-nav text-gray-700 hover:text-black transition-colors">Trips</Link>
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
      <section className="px-8 py-20 bg-[#fafafa]">
        <div className="max-w-4xl">
          <h1 className="prada-heading text-6xl text-black mb-6 leading-tight">
            Become a premium adventurer
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed font-light tracking-wide">
            Rediscover the world through Lakbay, with our nature and cultural trips.<br />
            Don't just travel, Lakbay!
          </p>
        </div>
      </section>

      {/* Recommended Section */}
      <section className="px-8 py-16 bg-gray-50">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recommended Tours */}
            <div>
              <h2 className="prada-heading text-2xl text-black mb-6 font-light">Recommended</h2>
              <div className="space-y-4">
                <div className="flex items-center text-sm text-gray-600 font-light tracking-wide">
                  <span className="mr-4">JQ Tours</span>
                  <div className="bg-[#D4AF37] text-black px-2 py-1 text-xs font-light tracking-wider prada-corner-radius">
                    POPULAR
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 1, title: 'Sunset Beach Trek', location: 'Boracay', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=120&h=80&fit=crop&auto=format' },
                    { id: 2, title: 'Mountain Sunrise Hike', location: 'Benguet', image: 'https://images.unsplash.com/photo-1464822759844-d150baec0494?w=120&h=80&fit=crop&auto=format' },
                    { id: 3, title: 'Island Hopping Adventure', location: 'Palawan', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=120&h=80&fit=crop&auto=format' },
                    { id: 4, title: 'Cultural Heritage Tour', location: 'Vigan', image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=120&h=80&fit=crop&auto=format' },
                    { id: 5, title: 'Surfing Experience', location: 'Siargao', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=120&h=80&fit=crop&auto=format' },
                    { id: 6, title: 'Tarsier Sanctuary Visit', location: 'Bohol', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=120&h=80&fit=crop&auto=format' }
                  ].map((tour) => (
                    <div key={tour.id} className="group cursor-pointer">
                      <div className="flex-shrink-0 w-full h-16 prada-corner-radius overflow-hidden mb-2">
                        <img 
                          src={tour.image}
                          alt={tour.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-medium text-gray-900 group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                          {tour.title}
                        </h4>
                        <p className="text-xs text-gray-600 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {tour.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="prada-card p-6 cursor-pointer hover:shadow-lg transition-shadow">
                    <h3 className="prada-heading text-lg mb-3 font-light flex items-center">
                      <Brain className="w-5 h-5 mr-2 text-[#D4AF37]" />
                      Personalized Travel Tips for you
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
                              <img
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
                  Connect with other tourist enthusiast
                </p>
              </div>
              
              <div className="prada-card p-6">
                <h3 className="prada-heading text-lg mb-3 font-light">Lakbay Tales</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">
                  Share your island stories. Read your travel memories
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
                <PhilippinesMap visitedProvinces={travelHistory} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Articles */}
      <section className="px-8 py-16">
        <h2 className="prada-heading text-3xl text-black mb-12 font-light">TRENDING ARTICLES</h2>
        
        <div className="grid grid-cols-2 gap-6">
          <Link href="/article/hidden-gems">
            <div className="prada-card overflow-hidden group cursor-pointer">
              <div className="relative aspect-[16/5] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1464822759844-d150baec0494?w=600&h=200&fit=crop&auto=format" 
                  alt="Hidden Gems"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="inline-block px-3 py-1 prada-gold-accent text-xs font-light tracking-wider mb-2" style={{borderRadius: '1px'}}>
                    LAKBAY EXCLUSIVE
                  </span>
                  <h3 className="text-base font-light tracking-wide">Top 5 Hidden Gems in the Philippines</h3>
                </div>
              </div>
            </div>
          </Link>
          
          <Link href="/article/mountain-tribes">
            <div className="prada-card overflow-hidden group cursor-pointer">
              <div className="relative aspect-[16/5] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=200&fit=crop&auto=format" 
                  alt="Cultural Journey"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="inline-block px-3 py-1 prada-gold-accent text-xs font-light tracking-wider mb-2" style={{borderRadius: '1px'}}>
                    CULTURAL GUIDE
                  </span>
                  <h3 className="text-base font-light tracking-wide">Ancient Traditions of Mountain Tribes</h3>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Trip Categories */}
      <section className="px-8 py-16 bg-white">
        <h2 className="prada-heading text-3xl text-black mb-6 font-light">EXPLORE EVENT CATEGORIES</h2>
        <p className="text-gray-600 mb-12 font-light tracking-wide">Join exciting events, meet fellow adventurers, and create unforgettable memories</p>
        
        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { name: "Private Events", icon: "👑", description: "Exclusive VIP experiences", count: "8 events" },
            { name: "Joiner Trips", icon: "👥", description: "Meet new adventurers", count: "15 events" },
            { name: "Community Meetups", icon: "🤝", description: "Local gatherings & activities", count: "12 events" },
            { name: "Mystery Adventures", icon: "❓", description: "Secret destinations revealed", count: "6 events" },
            { name: "Festival Events", icon: "🎉", description: "Cultural celebrations", count: "10 events" },
            { name: "Virtual Experiences", icon: "💻", description: "Online tours & workshops", count: "20 events" },
            { name: "Online Quizzes", icon: "🧠", description: "Interactive knowledge challenges", count: "25 quizzes" },
            { name: "Wellness Retreats", icon: "🧘", description: "Mindfulness & health experiences", count: "14 retreats" }
          ].map((category, index) => (
            <div key={index} className="prada-card p-6 cursor-pointer group transition-all duration-300">
              <div className="text-center">
                <div className="text-3xl mb-3">{category.icon}</div>
                <h3 className="font-light text-black mb-2 group-hover:text-[#D4AF37] transition-colors tracking-wide text-sm">{category.name.toUpperCase()}</h3>
                <p className="text-xs text-gray-600 mb-3 font-light">{category.description}</p>
                <span className="text-xs text-[#D4AF37] font-light tracking-wider">{category.count}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex space-x-12 mb-12 border-b border-gray-100">
          {["Private", "Joiner", "Meetups", "Mystery", "Events", "Virtual", "Wellness", "Online Quizzes"].map((tab) => (
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
        <div className="grid grid-cols-3 gap-6">
          {activeTab === "Private" && [
            { title: "Exclusive Mount Pulag VIP Trek", location: "Benguet", price: "₱25,000", image: "1464822759844-d150baec0494", link: "/trip/mount-pulag-private", category: "private" },
            { title: "Private Bohol Island Tour", location: "Bohol", price: "₱18,000", image: "1506905925346-21bda4d32df4", link: "/trip/bohol-private", category: "private" },
            { title: "Luxury Vigan Heritage Experience", location: "Ilocos Sur", price: "₱22,000", image: "1609137144813-7d9921338f24", link: "/trip/vigan-private", category: "private" }
          ].map((trip, i) => (
            <Link key={i} href={trip.link}>
              <div className="prada-card overflow-hidden group cursor-pointer">
                <div className="relative aspect-[4/3]">
                  <img 
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
                <div className="relative aspect-[4/3]">
                  <img 
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
                <div className="relative aspect-[4/3]">
                  <img 
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
                <div className="relative aspect-[4/3]">
                  <img 
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
                <div className="relative aspect-[4/3]">
                  <img 
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
                <div className="relative aspect-[4/3]">
                  <img 
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
                <div className="relative aspect-[4/3]">
                  <img 
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
                <div className="relative aspect-[4/3]">
                  <img 
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

      {/* Recommended Section - Only for logged in users */}
      <RecommendedSection />

      {/* Trending Articles Section - Only for logged in users */}
      <TrendingArticlesSection />

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
