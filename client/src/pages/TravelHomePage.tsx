import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const TravelHomePage = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-[#f3f1ec]">
      {/* Header */}
      <header className="bg-white px-6 py-3 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo placeholder */}
          <div className="w-8 h-8 bg-gray-300 rounded"></div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 text-sm">Destinations</a>
            <a href="#" className="text-gray-700 text-sm">Experiences</a>
            <a href="#" className="text-gray-700 text-sm">Culture</a>
            <a href="#" className="text-gray-700 text-sm">About</a>
            <a href="#" className="text-gray-700 text-sm">Contact</a>
          </nav>
          
          {/* Right side buttons */}
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="text-xs px-3 py-1 h-8">
              Sign In
            </Button>
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white text-xs px-3 py-1 h-8">
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Hero Section */}
          <div className="mb-12">
            {/* Badge */}
            <div className="mb-4">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">
                Discover • Explore • Adventure • Experience
              </span>
            </div>
            
            {/* Main heading */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4 max-w-lg">
              Rediscover the world through<br />
              culture, with our nature and<br />
              culture trips.
            </h1>
            
            {/* Subtext */}
            <p className="text-lg text-gray-600 max-w-md">
              Don't just travel. Uncover!
            </p>
          </div>

          {/* Featured Destinations */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Featured Destinations</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Mountain landscape card */}
              <Card className="overflow-hidden">
                <div className="relative aspect-[4/3]">
                  <img 
                    src="https://images.unsplash.com/photo-1464822759844-d150baec0494?w=500&h=300&fit=crop&auto=format" 
                    alt="Mountain landscape"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold">Iceland Adventure</h3>
                  </div>
                </div>
              </Card>
              
              {/* Circular image card */}
              <Card className="overflow-hidden">
                <div className="relative aspect-[4/3] bg-amber-100 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-amber-700 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">G</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Navigation Categories */}
          <div className="mb-8">
            <div className="flex justify-start space-x-8 mb-6 text-sm">
              <a href="#" className="text-gray-700 hover:text-gray-900">Beaches</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Cities</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Heritage</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">History</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Events</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Virtual</a>
              <a href="#" className="text-gray-700 hover:text-gray-900">Shop</a>
            </div>

            {/* Yellow badge */}
            <div className="mb-6">
              <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-amber-200 text-amber-800">
                Featured Category
              </span>
              <span className="ml-2 text-xs text-gray-500">Go</span>
            </div>

            {/* Four landscape cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="overflow-hidden">
                <div className="relative aspect-[16/10]">
                  <img 
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=250&h=150&fit=crop&auto=format" 
                    alt="Landscape 1"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Card>
              
              <Card className="overflow-hidden">
                <div className="relative aspect-[16/10]">
                  <img 
                    src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=250&h=150&fit=crop&auto=format" 
                    alt="Landscape 2"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Card>
              
              <Card className="overflow-hidden">
                <div className="relative aspect-[16/10]">
                  <img 
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=250&h=150&fit=crop&auto=format" 
                    alt="Landscape 3"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Card>
              
              <Card className="overflow-hidden">
                <div className="relative aspect-[16/10]">
                  <img 
                    src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=250&h=150&fit=crop&auto=format" 
                    alt="Landscape 4"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Card>
            </div>
          </div>

          {/* Best Deals */}
          <div className="mb-16">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Best Deals</h2>
            
            <Card className="overflow-hidden max-w-xs">
              <div className="relative aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop&auto=format" 
                  alt="Best deal"
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Company</h3>
              <div className="space-y-2 text-sm">
                <div>About Us</div>
                <div>Contact</div>
                <div>Careers</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Support</h3>
              <div className="space-y-2 text-sm">
                <div>Help Center</div>
                <div>Safety</div>
                <div>Cancellation</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Community</h3>
              <div className="space-y-2 text-sm">
                <div>Blog</div>
                <div>Forum</div>
                <div>Events</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <div className="space-y-2 text-sm">
                <div>Privacy</div>
                <div>Terms</div>
                <div>Cookies</div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t border-gray-700">
            <div className="flex justify-between items-center text-sm">
              <div>© 2025 Travel Company. All rights reserved.</div>
              <div className="flex space-x-4">
                <span>English</span>
                <span>USD</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};