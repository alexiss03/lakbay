import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const TravelHomePage = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-[#f3f1ec]">
      {/* Header */}
      <header className="bg-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-12">
            <div className="text-xl font-bold">Logo</div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-gray-900 text-sm">Destinations</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 text-sm">Experiences</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 text-sm">About</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 text-sm">Contact</a>
            </nav>
          </div>
          
          {/* Right side buttons */}
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="text-sm px-4 py-2">
              Sign In
            </Button>
            <Button size="sm" className="bg-black hover:bg-gray-800 text-white text-sm px-4 py-2">
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Badge */}
          <div className="mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
              Discover • Explore • Adventure • <span className="ml-1">🌿</span>
            </span>
          </div>
          
          {/* Main heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6 max-w-4xl">
            Rediscover the world through<br />
            culture, with our nature and<br />
            culture trips.
          </h1>
          
          {/* Subtext */}
          <p className="text-lg text-gray-600 mb-8 max-w-md">
            Don't just travel. Uncover!
          </p>
        </div>
      </section>

      {/* Featured Destinations Section */}
      <section className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Destinations</h2>
          
          {/* Two large cards side by side */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <Card className="overflow-hidden group cursor-pointer">
              <div className="relative aspect-[4/3]">
                <img 
                  src="https://images.unsplash.com/photo-1464822759844-d150baec0494?w=600&h=400&fit=crop&auto=format" 
                  alt="Mountain landscape"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-semibold mb-1">Mountain Adventure</h3>
                  <p className="text-sm opacity-90">Swiss Alps, Switzerland</p>
                </div>
              </div>
            </Card>
            
            <Card className="overflow-hidden group cursor-pointer">
              <div className="relative aspect-[4/3]">
                <img 
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&auto=format" 
                  alt="Beach paradise"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-semibold mb-1">Beach Paradise</h3>
                  <p className="text-sm opacity-90">Maldives</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Navigation Categories */}
      <section className="px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center space-x-8 mb-12 text-sm">
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Beaches</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Cities</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Heritage</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">History</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Events</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Virtual</a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">Shop</a>
          </div>

          {/* Four landscape cards in a row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
            <Card className="overflow-hidden group cursor-pointer">
              <div className="relative aspect-[16/10]">
                <img 
                  src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop&auto=format" 
                  alt="Landscape 1"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <h4 className="text-sm font-semibold">Mountain Views</h4>
                </div>
              </div>
            </Card>
            
            <Card className="overflow-hidden group cursor-pointer">
              <div className="relative aspect-[16/10]">
                <img 
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=200&fit=crop&auto=format" 
                  alt="Landscape 2"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <h4 className="text-sm font-semibold">Ocean Breeze</h4>
                </div>
              </div>
            </Card>
            
            <Card className="overflow-hidden group cursor-pointer">
              <div className="relative aspect-[16/10]">
                <img 
                  src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop&auto=format" 
                  alt="Landscape 3"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <h4 className="text-sm font-semibold">Forest Trail</h4>
                </div>
              </div>
            </Card>
            
            <Card className="overflow-hidden group cursor-pointer">
              <div className="relative aspect-[16/10]">
                <img 
                  src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop&auto=format" 
                  alt="Landscape 4"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <h4 className="text-sm font-semibold">City Lights</h4>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Best Deals Section */}
      <section className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Best Deals</h2>
          
          <Card className="overflow-hidden max-w-sm">
            <div className="relative aspect-[4/3]">
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format" 
                alt="Best deal destination"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-semibold mb-1">Island Getaway</h3>
                <p className="text-sm opacity-90">Paradise awaits</p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};