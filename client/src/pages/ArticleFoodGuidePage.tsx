import React from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Clock, User, MapPin, Star } from 'lucide-react';

export const ArticleFoodGuidePage = (): JSX.Element => {
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
            src="https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=450&fit=crop&auto=format" 
            alt="Cebu Food Guide"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <span className="inline-block px-3 py-1 bg-[#D4AF37] text-black text-xs font-light tracking-wider mb-3 rounded-sm">
              CULINARY GUIDE
            </span>
            <h1 className="text-4xl font-light mb-2">Ultimate Food Guide to Cebu</h1>
            <p className="text-lg opacity-90">Discover authentic Filipino flavors and hidden culinary gems</p>
          </div>
        </div>

        {/* Article Meta */}
        <div className="flex items-center space-x-6 text-sm text-gray-600 mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            <span>Maria Santos</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span>12 min read</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            <span>Cebu, Philippines</span>
          </div>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Cebu's culinary scene is a vibrant tapestry of flavors that reflects the island's rich history and cultural diversity. From street food stalls to fine dining establishments, the Queen City of the South offers an incredible gastronomic journey that will tantalize your taste buds.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">Must-Try Cebu Specialties</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Star className="w-5 h-5 text-[#D4AF37] mr-2" />
                Lechon Cebu
              </h3>
              <p className="text-gray-700 mb-3">The crown jewel of Cebu cuisine. This roasted pig is known for its crispy skin and flavorful meat that needs no sauce.</p>
              <p className="text-sm text-[#D4AF37] font-medium">Best places: CNT Lechon, Zubuchon, AA BBQ</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Star className="w-5 h-5 text-[#D4AF37] mr-2" />
                Sutukil
              </h3>
              <p className="text-gray-700 mb-3">Fresh seafood prepared three ways: sugba (grilled), tuwa (soup), and kilaw (ceviche-style).</p>
              <p className="text-sm text-[#D4AF37] font-medium">Best places: Larsian BBQ, Mactan Island restaurants</p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">Local Food Markets</h2>
          
          <div className="space-y-6 mb-8">
            <div className="border-l-4 border-[#D4AF37] pl-6">
              <h3 className="text-xl font-semibold mb-2">Carbon Public Market</h3>
              <p className="text-gray-700 mb-2">The oldest and largest market in Cebu, perfect for experiencing local ingredients and street food culture.</p>
              <p className="text-sm text-gray-600">Best time to visit: Early morning (6-9 AM)</p>
            </div>
            
            <div className="border-l-4 border-[#D4AF37] pl-6">
              <h3 className="text-xl font-semibold mb-2">Taboan Public Market</h3>
              <p className="text-gray-700 mb-2">Famous for dried fish (danggit) and other seafood products that make perfect pasalubong.</p>
              <p className="text-sm text-gray-600">Don't miss: Dried mangoes, otap, rosquillos</p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">Food Tour Recommendations</h2>
          
          <div className="bg-[#D4AF37]/10 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold mb-3">Half-Day Food Tour Itinerary</h3>
            <ul className="space-y-2 text-gray-700">
              <li><strong>9:00 AM</strong> - Start at Larsian BBQ for breakfast</li>
              <li><strong>10:30 AM</strong> - Visit Carbon Market for local snacks</li>
              <li><strong>12:00 PM</strong> - Lechon lunch at CNT or Zubuchon</li>
              <li><strong>2:00 PM</strong> - Dessert at Halo-Halo de Ilonggo</li>
              <li><strong>3:30 PM</strong> - Coffee and otap at Casa Gorordo Museum cafe</li>
            </ul>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">Budget-Friendly Eats</h2>
          
          <p className="text-gray-700 mb-6">
            Cebu offers incredible flavors at affordable prices. Street food stalls and local carenderias serve authentic meals for as low as ₱50-150 per dish.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Street Food</h4>
              <p className="text-2xl font-bold text-[#D4AF37] mb-1">₱20-80</p>
              <p className="text-sm text-gray-600">Per item</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Carinderia Meals</h4>
              <p className="text-2xl font-bold text-[#D4AF37] mb-1">₱80-150</p>
              <p className="text-sm text-gray-600">With rice</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Restaurant Dining</h4>
              <p className="text-2xl font-bold text-[#D4AF37] mb-1">₱300-800</p>
              <p className="text-sm text-gray-600">Per person</p>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold mb-3 text-blue-900">Pro Tips for Food Travelers</h3>
            <ul className="space-y-2 text-blue-800">
              <li>• Always ask locals for their favorite spots - they know the hidden gems</li>
              <li>• Try eating where the lines are longest - it's usually worth the wait</li>
              <li>• Don't be afraid of street food, but choose busy stalls with high turnover</li>
              <li>• Bring cash - many local establishments don't accept cards</li>
              <li>• Come hungry and pace yourself - there's so much to try!</li>
            </ul>
          </div>

          <p className="text-gray-700 text-lg leading-relaxed">
            Cebu's food scene is constantly evolving, with new restaurants and food concepts emerging regularly. Whether you're craving traditional Filipino comfort food or innovative fusion cuisine, the Queen City of the South has something to satisfy every palate. Come hungry, leave happy, and take home unforgettable flavors that will have you planning your return trip.
          </p>
        </div>

        {/* Related Articles */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-semibold mb-6">Related Articles</h3>
          <div className="grid md:grid-cols-2 gap-6">
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
            
            <Link href="/article/island-hopping">
              <div className="group cursor-pointer">
                <div className="aspect-[16/9] rounded-lg overflow-hidden mb-3">
                  <img 
                    src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=225&fit=crop&auto=format" 
                    alt="Island Hopping"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="font-semibold group-hover:text-[#D4AF37] transition-colors">Best Island Hopping Routes in Visayas</h4>
                <p className="text-sm text-gray-600 mt-1">Complete guide to exploring pristine islands</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};