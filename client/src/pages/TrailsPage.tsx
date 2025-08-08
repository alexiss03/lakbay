import React from 'react';
import { Link } from 'wouter';
import { InteractiveTrailMap } from '@/components/InteractiveTrailMap';
import { Button } from '@/components/ui/button';

export const TrailsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white px-8 py-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {/* Left: Logo placeholder */}
          <Link href="/">
            <div className="w-8 h-8 bg-black prada-corner-radius cursor-pointer"></div>
          </Link>
          
          {/* Center: Navigation */}
          <nav className="flex items-center space-x-12">
            <Link href="/" className="prada-nav text-gray-700 hover:text-black transition-colors">Home</Link>
            <Link href="/trips" className="prada-nav text-gray-700 hover:text-black transition-colors">Trips</Link>
            <Link href="/chats" className="prada-nav text-gray-700 hover:text-black transition-colors">Chats</Link>
            <span className="prada-nav text-black font-medium">Trails</span>
            <a href="#" className="prada-nav text-gray-700 hover:text-black transition-colors">Story</a>
            <Link href="/shop" className="prada-nav text-gray-700 hover:text-black transition-colors">Shop</Link>
            <a href="#" className="prada-nav text-gray-700 hover:text-black transition-colors">Corporate</a>
          </nav>
          
          {/* Right: Buttons */}
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="prada-button h-9 px-6 text-xs font-light border-black text-black hover:bg-black hover:text-white">
              LOG IN
            </Button>
            <select className="h-9 px-3 text-xs border-none bg-transparent font-light">
              <option>EN</option>
            </select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-light text-black mb-4">Interactive Trail Maps</h1>
          <p className="text-gray-600 font-light leading-relaxed max-w-2xl">
            Explore detailed trail maps, elevation profiles, and interactive points of interest for hiking destinations across the Philippines. Plan your next adventure with comprehensive trail information.
          </p>
        </div>

        <InteractiveTrailMap />
      </main>
    </div>
  );
};