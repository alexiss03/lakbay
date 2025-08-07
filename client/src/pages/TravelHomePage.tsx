import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { ChatWidget } from "@/components/ChatWidget";
import { TrendingArticlesSection } from "@/components/TrendingArticlesSection";
import { RecommendedSection } from "@/components/RecommendedSection";

export const TravelHomePage = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState("Private");
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
            <Link href="/chats" className="prada-nav text-gray-700 hover:text-black transition-colors">Chats</Link>
            <a href="#" className="prada-nav text-gray-700 hover:text-black transition-colors">Trails</a>
            <a href="#" className="prada-nav text-gray-700 hover:text-black transition-colors">Story</a>
            <Link href="/shop" className="prada-nav text-gray-700 hover:text-black transition-colors">Shop</Link>
            <a href="#" className="prada-nav text-gray-700 hover:text-black transition-colors">Corporate</a>
            <a href="#" className="prada-nav text-gray-700 hover:text-black transition-colors">Explore</a>
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
                <div className="flex space-x-3 overflow-x-auto">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex-shrink-0 w-16 h-16 prada-corner-radius overflow-hidden">
                      <img 
                        src={`https://images.unsplash.com/photo-150617009${i}0-6c4444b7${i}3bc?w=100&h=100&fit=crop&auto=format`}
                        alt={`Tour ${i}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="prada-card p-6">
                <h3 className="prada-heading text-lg mb-3 font-light">Personalized Travel Tips for you</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">
                  Powered by AI
                </p>
              </div>
              
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

            {/* Your Lakbays */}
            <div>
              <h3 className="prada-heading text-xl text-black mb-6 font-light">Your Lakbays</h3>
              <div className="flex space-x-4 text-sm text-gray-600 font-light tracking-wider mb-6">
                <button className="border-b-2 border-[#D4AF37] pb-1">Upcoming</button>
                <button className="pb-1 hover:border-b-2 hover:border-gray-300 transition-all">Past trips</button>
              </div>
              
              <div className="flex space-x-4">
                {[1, 2].map((i) => (
                  <div key={i} className="w-32 h-32 prada-corner-radius overflow-hidden group">
                    <img 
                      src={`https://images.unsplash.com/photo-150617009${i}0-6c4444b7${i}3bc?w=200&h=200&fit=crop&auto=format`}
                      alt={`Lakbay ${i}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
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
                {/* Simplified Philippines Map Placeholder */}
                <div className="w-full h-full bg-gray-200 prada-corner-radius flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-40 mx-auto mb-4 bg-gray-300 prada-corner-radius relative">
                      {/* Basic Philippines shape */}
                      <div className="absolute inset-2 border-2 border-gray-400 prada-corner-radius"></div>
                      <div className="absolute top-1 right-1 w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                      <div className="absolute bottom-3 left-2 w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                    </div>
                    <p className="text-xs text-gray-500 font-light">Interactive Map</p>
                  </div>
                </div>
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
            { name: "Weekend Escapes", icon: "🏕️", description: "Multi-day expeditions", count: "9 events" }
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
          {["Private", "Joiner", "Meetups", "Mystery", "Events", "Virtual", "Online Quizzes"].map((tab) => (
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

          {activeTab === "Online Quizzes" && [
            { title: "Philippine Geography Quiz Challenge", location: "Online Platform", price: "₱99", image: "1609137144813-7d9921338f24", link: "/trip/geography-quiz" },
            { title: "Cultural Heritage Trivia Contest", location: "Interactive Quiz", price: "₱149", image: "1556909114-f6e7ad7d3136", link: "/trip/culture-quiz" },
            { title: "Adventure Travel Knowledge Test", location: "Digital Experience", price: "₱79", image: "1441974231531-c6227db76b6e", link: "/trip/adventure-quiz" }
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
                    <span className="bg-indigo-500 text-white text-xs px-2 py-1 rounded">Quiz</span>
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
                <li>Wildlife & Nature</li>
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
