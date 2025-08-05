import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const TravelHomePage = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-[#f3f1ec]">
      {/* Header */}
      <header className="bg-white px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - small square */}
          <div className="w-4 h-4 bg-gray-500 rounded-sm"></div>
          
          {/* Center navigation */}
          <nav className="flex items-center space-x-8">
            <a href="#" className="text-gray-700 text-sm">Destinations</a>
            <a href="#" className="text-gray-700 text-sm">Experiences</a>
            <a href="#" className="text-gray-700 text-sm">Culture</a>
            <a href="#" className="text-gray-700 text-sm">About</a>
            <a href="#" className="text-gray-700 text-sm">Contact</a>
          </nav>
          
          {/* Right buttons */}
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="text-sm px-4 py-1.5 h-8">
              Sign In
            </Button>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white text-sm px-4 py-1.5 h-8">
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="px-8 py-8">
        {/* Hero Section */}
        <div className="mb-10">
          {/* Badge */}
          <div className="mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-amber-100 text-amber-800">
              Discover • Explore • Adventure • Experience
            </span>
          </div>
          
          {/* Main heading */}
          <div className="flex items-start justify-between">
            <div className="max-w-lg">
              <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
                Rediscover the world through<br />
                culture, with our nature and<br />
                culture trips.
              </h1>
              
              <p className="text-lg text-gray-600">
                Don't just travel. Uncover!
              </p>
            </div>
          </div>
        </div>

        {/* Featured Destinations */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Featured Destinations</h2>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Mountain landscape card */}
            <Card className="overflow-hidden rounded-lg shadow-sm">
              <div className="relative aspect-[5/3]">
                <img 
                  src="https://images.unsplash.com/photo-1464822759844-d150baec0494?w=500&h=300&fit=crop&auto=format" 
                  alt="Mountain landscape"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-base font-semibold">Iceland Adventure</h3>
                </div>
              </div>
            </Card>
            
            {/* Circular G card */}
            <Card className="overflow-hidden rounded-lg shadow-sm">
              <div className="relative aspect-[5/3] bg-amber-50 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-amber-800 flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">G</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="mb-6">
          <div className="flex space-x-8 mb-6 text-sm border-b border-gray-200">
            <a href="#" className="text-gray-700 pb-2 border-b-2 border-amber-600">Beaches</a>
            <a href="#" className="text-gray-700 pb-2">Cities</a>
            <a href="#" className="text-gray-700 pb-2">Heritage</a>
            <a href="#" className="text-gray-700 pb-2">History</a>
            <a href="#" className="text-gray-700 pb-2">Events</a>
            <a href="#" className="text-gray-700 pb-2">Virtual</a>
            <a href="#" className="text-gray-700 pb-2">Shop</a>
          </div>

          {/* Featured category badge */}
          <div className="mb-6 flex items-center">
            <span className="inline-flex items-center px-3 py-1 rounded text-xs bg-amber-200 text-amber-900">
              Featured Category
            </span>
            <span className="ml-3 text-xs text-gray-500">Go</span>
          </div>

          {/* Four landscape cards */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="overflow-hidden rounded-lg shadow-sm">
                <div className="relative aspect-[3/2]">
                  <img 
                    src={`https://images.unsplash.com/photo-${
                      i === 1 ? '1506905925346-21bda4d32df4' : 
                      i === 2 ? '1441974231531-c6227db76b6e' :
                      i === 3 ? '1507525428034-b723cf961d3e' :
                      '1449824913935-59a10b8d2000'
                    }?w=300&h=200&fit=crop&auto=format`}
                    alt={`Landscape ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Best Deals */}
        <div className="mb-16">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Best Deals</h2>
          
          <Card className="overflow-hidden rounded-lg shadow-sm w-48">
            <div className="relative aspect-[4/3]">
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop&auto=format" 
                alt="Best deal"
                className="w-full h-full object-cover"
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white px-8 py-12">
        <div className="grid grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-sm font-medium mb-4">Company</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div>About Us</div>
              <div>Contact</div>
              <div>Careers</div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-4">Support</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div>Help Center</div>
              <div>Safety</div>
              <div>Cancellation</div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-4">Community</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div>Blog</div>
              <div>Forum</div>
              <div>Events</div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-4">Legal</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div>Privacy</div>
              <div>Terms</div>
              <div>Cookies</div>
            </div>
          </div>
        </div>
        
        <div className="pt-6 border-t border-gray-800">
          <div className="flex justify-between items-center text-sm text-gray-400">
            <div>© 2025 Travel Company. All rights reserved.</div>
            <div className="flex space-x-6">
              <span>English</span>
              <span>USD</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};