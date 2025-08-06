import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { ChatWidget } from "@/components/ChatWidget";

export const TravelHomePage = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState("Featured Trips");
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white px-8 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {/* Left: Logo placeholder */}
          <div className="w-8 h-8 bg-gray-300 rounded"></div>
          
          {/* Center: Navigation */}
          <nav className="flex items-center space-x-8">
            <Link href="/" className="text-gray-900 font-medium">Home</Link>
            <Link href="/chats" className="text-gray-700 hover:text-gray-900">Chats</Link>
            <a href="#" className="text-gray-700 hover:text-gray-900">Trails</a>
            <a href="#" className="text-gray-700 hover:text-gray-900">Story</a>
            <a href="#" className="text-gray-700 hover:text-gray-900">Shop</a>
            <a href="#" className="text-gray-700 hover:text-gray-900">Corporate</a>
            <a href="#" className="text-gray-700 hover:text-gray-900">Explore</a>
          </nav>
          
          {/* Right: Buttons and Language */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="text-sm">
              Log in
            </Button>
            <Button className="bg-[#D4AF37] hover:bg-[#B8941F] text-black text-sm">
              Register
            </Button>
            <span className="text-sm text-gray-700">EN</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-8 py-16 bg-[#f8f7f4]">
        <div className="max-w-4xl">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Become a premium adventurer
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            Rediscover the world through Lakbay, with our nature and cultural trips.<br />
            Don't just travel, Lakbay!
          </p>
        </div>
      </section>

      {/* Trending Articles */}
      <section className="px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Trending articles</h2>
        
        <div className="grid grid-cols-2 gap-6">
          <Link href="/article/hidden-gems">
            <Card className="overflow-hidden rounded-xl group cursor-pointer shadow-sm">
              <div className="relative aspect-[16/5] rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1464822759844-d150baec0494?w=600&h=200&fit=crop&auto=format" 
                  alt="Hidden Gems"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl" />
                <div className="absolute bottom-3 left-3 text-white">
                  <span className="inline-block px-2 py-1 bg-[#D4AF37] text-black text-xs rounded-md mb-1">
                    Lakbay Exclusive
                  </span>
                  <h3 className="text-base font-semibold">Top 5 Hidden Gems in the Philippines</h3>
                </div>
              </div>
            </Card>
          </Link>
          
          <Link href="/article/mountain-tribes">
            <Card className="overflow-hidden rounded-xl group cursor-pointer shadow-sm">
              <div className="relative aspect-[16/5] rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=200&fit=crop&auto=format" 
                  alt="Cultural Journey"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl" />
                <div className="absolute bottom-3 left-3 text-white">
                  <span className="inline-block px-2 py-1 bg-[#D4AF37] text-black text-xs rounded-md mb-1">
                    Cultural Guide
                  </span>
                  <h3 className="text-base font-semibold">Ancient Traditions of Mountain Tribes</h3>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </section>

      {/* Trip Categories */}
      <section className="px-8 py-12 bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Discover Your Adventure</h2>
        <p className="text-gray-600 mb-8">Choose from our diverse range of authentic Philippine travel experiences</p>
        
        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { name: "Hiking & Trekking", icon: "🏔️", description: "Mountain peaks and trails", count: "12 trips" },
            { name: "Island Hopping", icon: "🏝️", description: "Tropical islands and beaches", count: "8 trips" },
            { name: "Cultural Tours", icon: "🏛️", description: "Heritage and traditions", count: "6 trips" },
            { name: "Wildlife & Nature", icon: "🦋", description: "Endemic species and conservation", count: "5 trips" },
            { name: "Adventure Sports", icon: "🚣", description: "Thrilling outdoor activities", count: "7 trips" },
            { name: "Wellness Retreats", icon: "🧘", description: "Mindfulness and relaxation", count: "4 trips" },
            { name: "Culinary Tours", icon: "🍲", description: "Local cuisine and cooking", count: "5 trips" },
            { name: "Diving & Marine", icon: "🤿", description: "Underwater adventures", count: "6 trips" }
          ].map((category, index) => (
            <Card key={index} className="p-4 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="text-center">
                <div className="text-3xl mb-2">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-[#D4AF37] transition-colors">{category.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                <span className="text-xs text-[#D4AF37] font-medium">{category.count}</span>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="flex space-x-8 mb-8 border-b border-gray-200">
          {["Featured Trips", "Hiking Adventures", "Island Escapes", "Cultural Heritage", "Wildlife Tours"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 transition-colors ${
                activeTab === tab
                  ? "text-gray-900 font-medium border-b-2 border-[#D4AF37]"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-3 gap-6">
          {activeTab === "Featured Trips" && [
            { title: "Mount Pulag Sunrise Trek", location: "Benguet", price: "₱8,500", image: "1464822759844-d150baec0494", link: "/trip/mount-pulag", category: "hiking" },
            { title: "Bohol Nature Discovery", location: "Bohol", price: "₱2,204", image: "1506905925346-21bda4d32df4", link: "/trip/bohol-nature", category: "island" },
            { title: "Vigan Heritage Tour", location: "Ilocos Sur", price: "₱6,500", image: "1609137144813-7d9921338f24", link: "/trip/vigan-heritage", category: "cultural" }
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
                    <span className="bg-[#D4AF37] text-black text-xs px-2 py-1 rounded capitalize">{trip.category}</span>
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

          {activeTab === "Hiking Adventures" && [
            { title: "Mount Pulag Sunrise Trek", location: "Benguet", price: "₱8,500", image: "1464822759844-d150baec0494", link: "/trip/mount-pulag" },
            { title: "Mount Apo Peak Expedition", location: "Davao", price: "₱12,500", image: "1506905925346-21bda4d32df4", link: "/trip/mount-apo" },
            { title: "Annapurna Circuit Trek", location: "Cordillera", price: "₱15,000", image: "1441974231531-c6227db76b6e", link: "/trip/annapurna-trek" }
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
                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded">Hiking</span>
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

          {activeTab === "Island Escapes" && [
            { title: "Siargao Surfing Adventure", location: "Siargao", price: "₱9,800", image: "1544551763-46a013bb70d5", link: "/trip/siargao-surfing" },
            { title: "Bohol Nature Discovery", location: "Bohol", price: "₱2,204", image: "1506905925346-21bda4d32df4", link: "/trip/bohol-nature" },
            { title: "Palawan Island Hopping", location: "Palawan", price: "₱7,500", image: "1507525428034-b723cf961d3e", link: "/trip/palawan-hopping" }
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
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Island</span>
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

          {activeTab === "Cultural Heritage" && [
            { title: "Vigan Heritage Tour", location: "Ilocos Sur", price: "₱6,500", image: "1609137144813-7d9921338f24", link: "/trip/vigan-heritage" },
            { title: "Batanes Cultural Experience", location: "Batanes", price: "₱8,800", image: "1441974231531-c6227db76b6e", link: "/trip/batanes-culture" },
            { title: "Iloilo Culinary Heritage", location: "Iloilo", price: "₱5,800", image: "1556909114-f6e7ad7d3136", link: "/trip/iloilo-culinary" }
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
                    <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">Cultural</span>
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

          {activeTab === "Wildlife Tours" && [
            { title: "Bohol Tarsier Conservation", location: "Bohol", price: "₱7,200", image: "1441974231531-c6227db76b6e", link: "/trip/bohol-tarsier" },
            { title: "Donsol Whale Shark Tour", location: "Sorsogon", price: "₱6,800", image: "1544551763-46a013bb70d5", link: "/trip/donsol-whalesharks" },
            { title: "Tubbataha Reef Diving", location: "Palawan", price: "₱18,500", image: "1507525428034-b723cf961d3e", link: "/trip/tubbataha-diving" }
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
                    <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded">Wildlife</span>
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
