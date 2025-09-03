import React from 'react';
import { Link } from 'wouter';
import { ArrowLeft, Clock, User, MapPin, Mountain } from 'lucide-react';

export const ArticleMountainTribesPage = (): JSX.Element => {
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
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop&auto=format" 
            alt="Mountain Tribes"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <span className="inline-block px-3 py-1 bg-[#D4AF37] text-black text-xs font-light tracking-wider mb-3 rounded-sm">
              CULTURAL GUIDE
            </span>
            <h1 className="text-4xl font-light mb-2">Ancient Traditions of Mountain Tribes</h1>
            <p className="text-lg opacity-90">Discover the living heritage of Northern Luzon's indigenous communities</p>
          </div>
        </div>

        {/* Article Meta */}
        <div className="flex items-center space-x-6 text-sm text-gray-600 mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            <span>Jose Rizal Jr.</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span>8 min read</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            <span>Cordillera Mountains, Luzon</span>
          </div>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Deep within the Cordillera Mountains of Northern Luzon, ancient traditions continue to thrive among indigenous communities who have preserved their cultural heritage for over a thousand years. These mountain tribes offer visitors a rare glimpse into pre-colonial Filipino life, where spirituality, community, and harmony with nature remain at the heart of daily existence.
          </p>

          <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">The Ifugao: Masters of Terraced Agriculture</h2>
          
          <div className="bg-green-50 p-6 rounded-lg mb-8">
            <div className="flex items-center mb-4">
              <Mountain className="w-6 h-6 text-green-600 mr-3" />
              <h3 className="text-xl font-semibold">The Banaue Rice Terraces: Living Heritage</h3>
            </div>
            <p className="text-gray-700 mb-4">
              Often called the "Eighth Wonder of the World," the Banaue Rice Terraces represent more than agricultural ingenuity. They embody a complex social system, spiritual beliefs, and sustainable farming practices that modern agriculture is only beginning to understand.
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2 text-green-800">Cultural Significance:</h4>
                <ul className="text-gray-700 space-y-1">
                  <li>• UNESCO World Heritage Site</li>
                  <li>• 2,000+ years of continuous cultivation</li>
                  <li>• Integrated ecosystem management</li>
                  <li>• Sacred spiritual landscape</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-green-800">Traditional Practices:</h4>
                <ul className="text-gray-700 space-y-1">
                  <li>• Bayanihan (community cooperation)</li>
                  <li>• Hudhud epic chanting</li>
                  <li>• Ancestor veneration rituals</li>
                  <li>• Sustainable water management</li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">The Kalinga: Warriors of Peace</h2>
          
          <div className="space-y-6 mb-8">
            <p className="text-gray-700 leading-relaxed">
              The Kalinga people, once known as fierce warriors, have transformed their warrior tradition into a commitment to peace and cultural preservation. Their intricate body art, traditional textiles, and peace pact ceremonies continue to play vital roles in their society.
            </p>
            
            <div className="border-l-4 border-[#D4AF37] pl-6">
              <h3 className="text-xl font-semibold mb-2">Traditional Arts and Crafts</h3>
              <p className="text-gray-700 mb-4">
                Kalinga artisans are renowned for their exceptional weaving skills, creating textiles with geometric patterns that tell stories of their ancestry, victories, and spiritual beliefs.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-1">Batok Tattoos</h4>
                  <p className="text-sm text-gray-600">Sacred body art symbols</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-1">Woven Textiles</h4>
                  <p className="text-sm text-gray-600">Intricate patterns & designs</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-1">Peace Pacts</h4>
                  <p className="text-sm text-gray-600">Bodong conflict resolution</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">The Igorot: Guardians of the Mountains</h2>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            The collective term "Igorot," meaning "people of the mountains," encompasses several distinct ethnic groups including the Bontoc, Kankanaey, and Ibaloi. Each maintains unique customs while sharing common values of environmental stewardship and community solidarity.
          </p>

          <div className="bg-amber-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold mb-4 text-amber-900">Traditional Festivals and Ceremonies</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-amber-400 pl-4">
                <h4 className="font-semibold mb-1">Panagbenga Festival</h4>
                <p className="text-sm text-gray-700">The "Flower Festival" celebrates the blooming season and honors the city's cultural diversity.</p>
              </div>
              <div className="border-l-4 border-amber-400 pl-4">
                <h4 className="font-semibold mb-1">Cañao Ritual</h4>
                <p className="text-sm text-gray-700">Sacred thanksgiving ceremony involving community feasting and spiritual offerings.</p>
              </div>
              <div className="border-l-4 border-amber-400 pl-4">
                <h4 className="font-semibold mb-1">Adivay Festival</h4>
                <p className="text-sm text-gray-700">Benguet's celebration of unity, featuring traditional dances and native costumes.</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">Responsible Cultural Tourism</h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Do's for Visitors</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Respect sacred sites and follow local customs
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Support local artisans by purchasing authentic crafts
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Engage respectfully with community members
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Learn about traditional practices before visiting
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Cultural Etiquette</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Ask permission before photographing people
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Dress modestly when visiting villages
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Participate in community activities if invited
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Avoid touching or moving ritual objects
                </li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mt-12 mb-6">Planning Your Cultural Journey</h2>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold mb-4">Recommended Itinerary: 5-Day Cultural Immersion</h3>
            <div className="space-y-3">
              <div className="flex">
                <span className="bg-[#D4AF37] text-white text-xs px-2 py-1 rounded mr-3 mt-0.5">Day 1</span>
                <div>
                  <h4 className="font-semibold">Banaue Rice Terraces</h4>
                  <p className="text-sm text-gray-600">Explore the terraces, visit local museum, overnight in traditional hut</p>
                </div>
              </div>
              <div className="flex">
                <span className="bg-[#D4AF37] text-white text-xs px-2 py-1 rounded mr-3 mt-0.5">Day 2</span>
                <div>
                  <h4 className="font-semibold">Bontoc Cultural Experience</h4>
                  <p className="text-sm text-gray-600">Traditional weaving workshop, cultural performances, local cuisine</p>
                </div>
              </div>
              <div className="flex">
                <span className="bg-[#D4AF37] text-white text-xs px-2 py-1 rounded mr-3 mt-0.5">Day 3</span>
                <div>
                  <h4 className="font-semibold">Kalinga Village Visit</h4>
                  <p className="text-sm text-gray-600">Traditional tattoo demonstration, textile crafting, peace pact ceremony</p>
                </div>
              </div>
              <div className="flex">
                <span className="bg-[#D4AF37] text-white text-xs px-2 py-1 rounded mr-3 mt-0.5">Day 4</span>
                <div>
                  <h4 className="font-semibold">Sagada Ancestral Caves</h4>
                  <p className="text-sm text-gray-600">Cave exploration, hanging coffins, traditional burial practices</p>
                </div>
              </div>
              <div className="flex">
                <span className="bg-[#D4AF37] text-white text-xs px-2 py-1 rounded mr-3 mt-0.5">Day 5</span>
                <div>
                  <h4 className="font-semibold">Benguet Highlands</h4>
                  <p className="text-sm text-gray-600">Strawberry farms, traditional markets, farewell ceremony</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-[#D4AF37]">₱8,500</p>
                  <p className="text-sm text-gray-600">Budget tour per person</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#D4AF37]">₱12,500</p>
                  <p className="text-sm text-gray-600">Standard tour per person</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#D4AF37]">₱18,000</p>
                  <p className="text-sm text-gray-600">Premium tour per person</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-semibold mb-3 text-blue-900">Supporting Indigenous Communities</h3>
            <p className="text-blue-800 mb-4">
              When visiting mountain tribes, remember that tourism can be a powerful force for cultural preservation and economic empowerment when done responsibly.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2 text-blue-800">How Your Visit Helps:</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Provides sustainable income for families</li>
                  <li>• Encourages cultural preservation</li>
                  <li>• Supports traditional craft industries</li>
                  <li>• Funds community development projects</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-blue-800">Ways to Give Back:</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Stay in community-owned lodges</li>
                  <li>• Eat at local family restaurants</li>
                  <li>• Buy directly from artisan cooperatives</li>
                  <li>• Donate to education and health initiatives</li>
                </ul>
              </div>
            </div>
          </div>

          <p className="text-gray-700 text-lg leading-relaxed">
            The mountain tribes of Northern Luzon offer more than just a travel destination—they provide a profound connection to humanity's relationship with nature, community, and tradition. By visiting with respect, understanding, and genuine curiosity, travelers become part of the ongoing story of cultural preservation and sustainable development that ensures these ancient traditions will continue to thrive for generations to come.
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