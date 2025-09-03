import React from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Clock, User, MapPin, Anchor } from 'lucide-react';

export const ArticleIslandHoppingPage = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 bg-white border-b border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/">
                <span className="text-2xl font-bold text-[#D4AF37] cursor-pointer">Lakbay</span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-[#D4AF37] transition-colors">Home</Link>
              <Link href="/trips" className="text-gray-700 hover:text-[#D4AF37] transition-colors">Trips</Link>
              <Link href="/chats" className="text-gray-700 hover:text-[#D4AF37] transition-colors">Chats</Link>
              <Link href="/trails" className="text-gray-700 hover:text-[#D4AF37] transition-colors">Trails</Link>
              <Link href="/story" className="text-gray-700 hover:text-[#D4AF37] transition-colors">Story</Link>
              <Link href="/shop" className="text-gray-700 hover:text-[#D4AF37] transition-colors">Shop</Link>
              <Link href="/corporate" className="text-gray-700 hover:text-[#D4AF37] transition-colors">Corporate</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back Button */}
        <Link href="/">
          <button className="flex items-center text-gray-600 hover:text-[#D4AF37] mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </button>
        </Link>

        {/* Hero Image */}
        <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-8">
          <img 
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=450&fit=crop&auto=format" 
            alt="Island Hopping Visayas"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <span className="inline-block px-3 py-1 bg-[#D4AF37] text-black text-xs font-light tracking-wider mb-3 rounded-sm">
              ADVENTURE GUIDE
            </span>
            <h1 className="text-4xl font-light mb-2">Best Island Hopping Routes in Visayas</h1>
            <p className="text-lg opacity-90">Explore pristine islands and crystal clear waters</p>
          </div>
        </div>

        {/* Article Meta */}
        <div className="flex items-center space-x-6 text-sm text-gray-600 mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            <span>Jose Cruz</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span>15 min read</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            <span>Visayas, Philippines</span>
          </div>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            The Visayas region offers some of the most spectacular island hopping experiences in the Philippines. With over 6,000 islands scattered across crystal-clear waters, this tropical paradise provides endless opportunities for adventure, relaxation, and discovery.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">Classic Island Hopping Routes</h2>
          
          <div className="space-y-8 mb-12">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Anchor className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold">Bohol Island Hopping Circuit</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Start from Panglao and explore the stunning islands around Bohol. This route combines white sand beaches, snorkeling spots, and cultural experiences.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 text-blue-800">Route Highlights:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Virgin Island (Pungtud Island)</li>
                    <li>• Balicasag Island Marine Sanctuary</li>
                    <li>• Dolphin watching at Pamilacan</li>
                    <li>• Hinagdanan Cave exploration</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-blue-800">Duration & Cost:</h4>
                  <p className="text-sm text-gray-700">Full day tour (8-10 hours)</p>
                  <p className="text-lg font-bold text-[#D4AF37]">₱2,500-3,500 per person</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Anchor className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold">Siquijor Mystical Island Tour</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Discover the enchanting "Island of Fire" with its pristine beaches, mystical folklore, and healing traditions.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 text-green-800">Route Highlights:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Salagdoong Beach cliff jumping</li>
                    <li>• Cambugahay Falls swimming</li>
                    <li>• Lazi Church and Convent</li>
                    <li>• Balete Tree healing sanctuary</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-green-800">Duration & Cost:</h4>
                  <p className="text-sm text-gray-700">Full day island tour (10-12 hours)</p>
                  <p className="text-lg font-bold text-[#D4AF37]">₱3,000-4,200 per person</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Anchor className="w-6 h-6 text-orange-600 mr-3" />
                <h3 className="text-xl font-semibold">Negros Oriental Coastal Adventure</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Explore the diverse coastline of Negros Oriental, from marine sanctuaries to volcanic lakes and hot springs.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 text-orange-800">Route Highlights:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Apo Island Marine Reserve</li>
                    <li>• Manjuyod White Sandbar</li>
                    <li>• Twin Lakes of Balinsasayao</li>
                    <li>• Pulangbato Falls</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-orange-800">Duration & Cost:</h4>
                  <p className="text-sm text-gray-700">2-3 day adventure tour</p>
                  <p className="text-lg font-bold text-[#D4AF37]">₱8,500-12,000 per person</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">Planning Your Island Hopping Adventure</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Best Time to Visit</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-[#D4AF37] pl-4">
                  <h4 className="font-semibold text-green-700">Dry Season (Nov-May)</h4>
                  <p className="text-sm text-gray-600">Ideal weather, calm seas, perfect visibility</p>
                </div>
                <div className="border-l-4 border-gray-300 pl-4">
                  <h4 className="font-semibold text-orange-600">Wet Season (Jun-Oct)</h4>
                  <p className="text-sm text-gray-600">Lower prices, fewer crowds, occasional storms</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">What to Pack</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Waterproof bags for electronics</li>
                <li>• Reef-safe sunscreen (SPF 50+)</li>
                <li>• Snorkeling gear (optional)</li>
                <li>• Quick-dry clothing</li>
                <li>• Underwater camera</li>
                <li>• Cash for entrance fees and meals</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">Budget Breakdown</h2>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <h4 className="font-semibold mb-2">Budget Tour</h4>
                <p className="text-3xl font-bold text-[#D4AF37] mb-2">₱2,000</p>
                <p className="text-xs text-gray-600 mb-3">per person/day</p>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>Shared boat tours</li>
                  <li>Basic snorkeling gear</li>
                  <li>Local lunch included</li>
                  <li>3-4 island stops</li>
                </ul>
              </div>
              
              <div className="text-center border-2 border-[#D4AF37] rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-[#D4AF37]">Standard Tour</h4>
                <p className="text-3xl font-bold text-[#D4AF37] mb-2">₱3,500</p>
                <p className="text-xs text-gray-600 mb-3">per person/day</p>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>Private boat option</li>
                  <li>Quality snorkeling gear</li>
                  <li>Seafood lunch</li>
                  <li>5-6 island stops</li>
                  <li>Photo service</li>
                </ul>
              </div>
              
              <div className="text-center">
                <h4 className="font-semibold mb-2">Luxury Tour</h4>
                <p className="text-3xl font-bold text-[#D4AF37] mb-2">₱6,000</p>
                <p className="text-xs text-gray-600 mb-3">per person/day</p>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>Premium yacht charter</li>
                  <li>Professional gear</li>
                  <li>Gourmet meals</li>
                  <li>Unlimited stops</li>
                  <li>Drone photography</li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">Marine Life & Snorkeling Spots</h2>
          
          <div className="space-y-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-blue-900">Top Snorkeling Destinations</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Balicasag Island</h4>
                  <p className="text-sm text-gray-700 mb-1">Marine sanctuary with sea turtles, colorful coral gardens, and diverse fish species.</p>
                  <p className="text-xs text-blue-600">Visibility: 15-25 meters</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Apo Island</h4>
                  <p className="text-sm text-gray-700 mb-1">Protected marine reserve known for sea turtle encounters and pristine coral reefs.</p>
                  <p className="text-xs text-blue-600">Visibility: 20-30 meters</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold mb-3 text-yellow-900">Safety & Conservation Tips</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 text-yellow-800">Safety Guidelines</h4>
                <ul className="space-y-1 text-sm text-yellow-700">
                  <li>• Always wear life jackets on boats</li>
                  <li>• Check weather conditions before departure</li>
                  <li>• Stay with your group while snorkeling</li>
                  <li>• Inform guides of swimming ability</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-yellow-800">Eco-Friendly Practices</h4>
                <ul className="space-y-1 text-sm text-yellow-700">
                  <li>• Use reef-safe sunscreen only</li>
                  <li>• Don't touch or step on coral</li>
                  <li>• Take only photos, leave only bubbles</li>
                  <li>• Support local conservation efforts</li>
                </ul>
              </div>
            </div>
          </div>

          <p className="text-gray-700 text-lg leading-relaxed">
            Island hopping in the Visayas is more than just a vacation—it's a journey through some of the world's most biodiverse marine ecosystems and culturally rich communities. Whether you're seeking adventure, relaxation, or cultural immersion, these island routes offer unforgettable experiences that will leave you planning your next Philippine adventure before you've even returned home.
          </p>
        </div>

        {/* Related Articles */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-semibold mb-6">Related Articles</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/article/food-guide">
              <div className="group cursor-pointer">
                <div className="aspect-[16/9] rounded-lg overflow-hidden mb-3">
                  <img 
                    src="https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&h=225&fit=crop&auto=format" 
                    alt="Food Guide"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="font-semibold group-hover:text-[#D4AF37] transition-colors">Ultimate Food Guide to Cebu</h4>
                <p className="text-sm text-gray-600 mt-1">Taste authentic Filipino flavors and local specialties</p>
              </div>
            </Link>
            
            <Link href="/article/hidden-gems">
              <div className="group cursor-pointer">
                <div className="aspect-[16/9] rounded-lg overflow-hidden mb-3">
                  <img 
                    src="https://images.unsplash.com/photo-1464822759844-d150baec0494?w=400&h=225&fit=crop&auto=format" 
                    alt="Hidden Gems"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="font-semibold group-hover:text-[#D4AF37] transition-colors">Top 5 Hidden Gems in the Philippines</h4>
                <p className="text-sm text-gray-600 mt-1">Discover untouched destinations off the beaten path</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};