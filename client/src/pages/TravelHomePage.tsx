import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export const TravelHomePage = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white px-8 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {/* Left: Logo placeholder */}
          <div className="w-8 h-8 bg-gray-300 rounded"></div>
          
          {/* Center: Navigation */}
          <nav className="flex items-center space-x-8">
            <a href="#" className="text-gray-900 font-medium">Home</a>
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
          <Card className="overflow-hidden rounded-lg group cursor-pointer">
            <div className="relative aspect-[16/10]">
              <img 
                src="https://images.unsplash.com/photo-1464822759844-d150baec0494?w=600&h=400&fit=crop&auto=format" 
                alt="Hidden Gems"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <span className="inline-block px-2 py-1 bg-[#D4AF37] text-black text-xs rounded mb-2">
                  Lakbay Exclusive
                </span>
                <h3 className="text-lg font-semibold">Top 5 Hidden Gems in the Philippines</h3>
              </div>
            </div>
          </Card>
          
          <Card className="overflow-hidden rounded-lg group cursor-pointer">
            <div className="relative aspect-[16/10]">
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&auto=format" 
                alt="Cultural Journey"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <span className="inline-block px-2 py-1 bg-[#D4AF37] text-black text-xs rounded mb-2">
                  Cultural Guide
                </span>
                <h3 className="text-lg font-semibold">Ancient Traditions of Mountain Tribes</h3>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Trip Categories */}
      <section className="px-8 py-12 bg-gray-50">
        <div className="flex space-x-8 mb-8 border-b border-gray-200">
          <a href="#" className="text-gray-900 font-medium pb-3 border-b-2 border-[#D4AF37]">Private</a>
          <a href="#" className="text-gray-700 hover:text-gray-900 pb-3">Joiner</a>
          <a href="#" className="text-gray-700 hover:text-gray-900 pb-3">Meetups</a>
          <a href="#" className="text-gray-700 hover:text-gray-900 pb-3">Mystery</a>
          <a href="#" className="text-gray-700 hover:text-gray-900 pb-3">Events</a>
          <a href="#" className="text-gray-700 hover:text-gray-900 pb-3">Virtual</a>
          <a href="#" className="text-gray-700 hover:text-gray-900 pb-3">Shop</a>
        </div>
      </section>

      {/* Exclusive Offer */}
      <section className="px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Exclusive offer</h2>
        
        <div className="grid grid-cols-4 gap-6">
          {[
            { title: "Banaue Rice Terraces", image: "1464822759844-d150baec0494" },
            { title: "Palawan Underground River", image: "1506905925346-21bda4d32df4" },
            { title: "Chocolate Hills", image: "1441974231531-c6227db76b6e" },
            { title: "Mayon Volcano", image: "1507525428034-b723cf961d3e" }
          ].map((item, i) => (
            <Card key={i} className="overflow-hidden rounded-lg group cursor-pointer">
              <div className="relative aspect-[4/3]">
                <img 
                  src={`https://images.unsplash.com/photo-${item.image}?w=300&h=225&fit=crop&auto=format`}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <div className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center">
                    <span className="text-xs">⭐</span>
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 text-white">
                  <h3 className="text-sm font-medium">{item.title}</h3>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Story Trails */}
      <section className="px-8 py-12 bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Story trails</h2>
        
        <Card className="overflow-hidden rounded-lg max-w-sm group cursor-pointer">
          <div className="relative aspect-[3/4]">
            <img 
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=400&fit=crop&auto=format"
              alt="Story trail"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black mb-2">
                View more entries
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Footer with Booking CTA */}
      <footer className="bg-black text-white px-8 py-12">
        <div className="grid grid-cols-2 gap-12">
          {/* Booking Form */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Book your Lakbay now</h3>
            <div className="space-y-4">
              <Input 
                type="email" 
                placeholder="Email address" 
                className="bg-white text-black"
              />
              <Select>
                <SelectTrigger className="bg-white text-black">
                  <SelectValue placeholder="Select trip" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="banaue">Banaue Rice Terraces</SelectItem>
                  <SelectItem value="palawan">Palawan Underground River</SelectItem>
                  <SelectItem value="chocolate">Chocolate Hills</SelectItem>
                  <SelectItem value="mayon">Mayon Volcano</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-[#D4AF37] hover:bg-[#B8941F] text-black w-full">
                Start
              </Button>
            </div>
          </div>
          
          {/* Footer Links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div>About Lakbay</div>
                <div>Contact Us</div>
                <div>Careers</div>
                <div>Press</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-4">Support</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div>Help Center</div>
                <div>Safety</div>
                <div>Cancellation</div>
                <div>Community Guidelines</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-gray-800">
          <div className="flex justify-between items-center text-sm text-gray-400">
            <div>© 2025 Lakbay. All rights reserved.</div>
            <div className="flex space-x-6">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};