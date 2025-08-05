import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const TravelHomePage = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-[#f3f1ec]">
      {/* Header - exact match */}
      <header className="bg-white px-4 py-2 border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo placeholder - small rounded square */}
          <div className="w-6 h-6 bg-gray-400 rounded-sm"></div>
          
          {/* Center navigation */}
          <nav className="flex items-center space-x-6">
            <a href="#" className="text-gray-600 text-xs font-medium">Destinations</a>
            <a href="#" className="text-gray-600 text-xs font-medium">Experiences</a>
            <a href="#" className="text-gray-600 text-xs font-medium">Culture</a>
            <a href="#" className="text-gray-600 text-xs font-medium">About</a>
            <a href="#" className="text-gray-600 text-xs font-medium">Contact</a>
          </nav>
          
          {/* Right side buttons - small and compact */}
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="text-xs px-2 py-1 h-6 border-gray-300">
              Sign In
            </Button>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white text-xs px-2 py-1 h-6">
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <div className="px-4 py-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Hero Section - left aligned */}
          <div className="mb-8">
            {/* Badge - small and minimal */}
            <div className="mb-3">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-amber-50 text-amber-700 border border-amber-200">
                Discover • Explore • Adventure • Experience
              </span>
            </div>
            
            {/* Main heading - smaller than before */}
            <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-3 max-w-md">
              Rediscover the world through<br />
              culture, with our nature and<br />
              culture trips.
            </h1>
            
            {/* Subtext - smaller */}
            <p className="text-sm text-gray-600 max-w-xs">
              Don't just travel. Uncover!
            </p>
          </div>

          {/* Featured Destinations - smaller heading */}
          <div className="mb-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Featured Destinations</h2>
            
            {/* Two cards side by side - exact proportions */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* Mountain landscape card - wider aspect ratio */}
              <Card className="overflow-hidden rounded-lg">
                <div className="relative aspect-[3/2]">
                  <img 
                    src="https://images.unsplash.com/photo-1464822759844-d150baec0494?w=400&h=250&fit=crop&auto=format" 
                    alt="Mountain landscape"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute bottom-2 left-2 text-white">
                    <h3 className="text-sm font-medium">Iceland Adventure</h3>
                  </div>
                </div>
              </Card>
              
              {/* Circular G card - matching aspect ratio */}
              <Card className="overflow-hidden rounded-lg">
                <div className="relative aspect-[3/2] bg-amber-50 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-amber-800 flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl font-bold">G</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Navigation Categories - exact spacing */}
          <div className="mb-6">
            <div className="flex space-x-6 mb-4 text-xs">
              <a href="#" className="text-gray-600 hover:text-gray-900">Beaches</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Cities</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Heritage</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">History</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Events</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Virtual</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Shop</a>
            </div>

            {/* Yellow badge with Go text */}
            <div className="mb-4 flex items-center">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-amber-200 text-amber-900">
                Featured Category
              </span>
              <span className="ml-2 text-[10px] text-gray-400">Go</span>
            </div>

            {/* Four landscape cards - exact proportions */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              <Card className="overflow-hidden rounded">
                <div className="relative aspect-[4/3]">
                  <img 
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=180&h=135&fit=crop&auto=format" 
                    alt="Landscape 1"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Card>
              
              <Card className="overflow-hidden rounded">
                <div className="relative aspect-[4/3]">
                  <img 
                    src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=180&h=135&fit=crop&auto=format" 
                    alt="Landscape 2"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Card>
              
              <Card className="overflow-hidden rounded">
                <div className="relative aspect-[4/3]">
                  <img 
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=180&h=135&fit=crop&auto=format" 
                    alt="Landscape 3"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Card>
              
              <Card className="overflow-hidden rounded">
                <div className="relative aspect-[4/3]">
                  <img 
                    src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=180&h=135&fit=crop&auto=format" 
                    alt="Landscape 4"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Card>
            </div>
          </div>

          {/* Best Deals - small single card */}
          <div className="mb-12">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Best Deals</h2>
            
            <Card className="overflow-hidden rounded w-32">
              <div className="relative aspect-square">
                <img 
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=150&fit=crop&auto=format" 
                  alt="Best deal"
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer - black with exact structure */}
      <footer className="bg-black text-white px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-4 gap-6 mb-4">
            <div>
              <h4 className="text-xs font-medium mb-2">Company</h4>
              <div className="space-y-1 text-[10px] text-gray-300">
                <div>About Us</div>
                <div>Contact</div>
                <div>Careers</div>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-medium mb-2">Support</h4>
              <div className="space-y-1 text-[10px] text-gray-300">
                <div>Help Center</div>
                <div>Safety</div>
                <div>Cancellation</div>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-medium mb-2">Community</h4>
              <div className="space-y-1 text-[10px] text-gray-300">
                <div>Blog</div>
                <div>Forum</div>
                <div>Events</div>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-medium mb-2">Legal</h4>
              <div className="space-y-1 text-[10px] text-gray-300">
                <div>Privacy</div>
                <div>Terms</div>
                <div>Cookies</div>
              </div>
            </div>
          </div>
          
          <div className="pt-3 border-t border-gray-800">
            <div className="flex justify-between items-center text-[10px] text-gray-400">
              <div>© 2025 Travel Company. All rights reserved.</div>
              <div className="flex space-x-3">
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