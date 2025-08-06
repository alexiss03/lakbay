import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PhilippinesMap } from '@/components/PhilippinesMap';
import { useAuth } from '@/hooks/useAuth';
import { MapPin, Book, Clock, User, Star } from 'lucide-react';

interface TravelHistory {
  province: string;
  region: string;
  visits: number;
  lastVisit: string;
}

interface Article {
  id: string;
  title: string;
  category: string;
  author: string;
  readTime: string;
  image: string;
  excerpt: string;
  isPopular?: boolean;
}

export const TrendingArticlesSection = (): JSX.Element => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState('recommended');
  
  // Mock user travel history - in real app, this would come from backend
  const userTravelHistory: TravelHistory[] = [
    { province: 'Bohol', region: 'Central Visayas', visits: 3, lastVisit: '2024-12-15' },
    { province: 'Palawan', region: 'MIMAROPA', visits: 2, lastVisit: '2024-11-20' },
    { province: 'Benguet', region: 'Cordillera', visits: 1, lastVisit: '2024-10-05' },
    { province: 'Siargao', region: 'Caraga', visits: 2, lastVisit: '2024-09-12' },
    { province: 'Ilocos Sur', region: 'Ilocos', visits: 1, lastVisit: '2024-08-03' }
  ];

  const recommendedTours = [
    {
      id: '1',
      title: 'Sunset Beach Trek',
      location: 'Boracay',
      price: '₱2,500',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=120&fit=crop&auto=format',
      category: 'explore'
    },
    {
      id: '2', 
      title: 'Mountain Sunrise Hike',
      location: 'Benguet',
      price: '₱3,800',
      image: 'https://images.unsplash.com/photo-1464822759844-d150baec0494?w=200&h=120&fit=crop&auto=format',
      category: 'explore'
    },
    {
      id: '3',
      title: 'Island Hopping Adventure',
      location: 'Palawan',
      price: '₱4,200',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=120&fit=crop&auto=format',
      category: 'explore'
    },
    {
      id: '4',
      title: 'Cultural Heritage Tour',
      location: 'Vigan',
      price: '₱2,800',
      image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=200&h=120&fit=crop&auto=format',
      category: 'explore'
    },
    {
      id: '5',
      title: 'Surfing Experience',
      location: 'Siargao',
      price: '₱3,500',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=120&fit=crop&auto=format',
      category: 'explore'
    },
    {
      id: '6',
      title: 'Tarsier Sanctuary Visit',
      location: 'Bohol',
      price: '₱1,800',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=120&fit=crop&auto=format',
      category: 'explore'
    }
  ];

  const trendingArticles: Article[] = [
    {
      id: '1',
      title: 'Hidden Gems of Northern Luzon',
      category: 'Travel Guide',
      author: 'Maria Santos',
      readTime: '8 min',
      image: 'https://images.unsplash.com/photo-1464822759844-d150baec0494?w=300&h=200&fit=crop&auto=format',
      excerpt: 'Discover the untouched beauty of mountain provinces and their rich cultural heritage.',
      isPopular: true
    },
    {
      id: '2',
      title: 'Best Island Hopping Routes in Visayas',
      category: 'Adventure',
      author: 'Jose Cruz',
      readTime: '12 min',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop&auto=format',
      excerpt: 'Complete guide to exploring the pristine islands and crystal clear waters.',
      isPopular: false
    },
    {
      id: '3',
      title: 'Sustainable Travel in Mindanao',
      category: 'Eco-Tourism',
      author: 'Ana Reyes',
      readTime: '6 min',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop&auto=format',
      excerpt: 'How to explore Mindanao responsibly while supporting local communities.',
      isPopular: false
    }
  ];

  const lakbayTales = [
    {
      id: '1',
      title: 'Journey Through Time',
      author: 'Elena Rodriguez',
      excerpt: 'Stories from ancient trade routes and Spanish colonial heritage.',
      category: 'Historical'
    },
    {
      id: '2',
      title: 'Mountains and Myths',
      author: 'Carlos Mendoza',
      excerpt: 'Legends from the Cordillera and indigenous wisdom.',
      category: 'Cultural'
    },
    {
      id: '3',
      title: 'Ocean Adventures',
      author: 'Sofia Aquino',
      excerpt: 'Tales of island life and marine conservation efforts.',
      category: 'Marine'
    }
  ];

  const upcomingTrips = [
    {
      id: '1',
      title: 'Sunrise at Mount Pulag',
      date: 'Jan 25, 2025',
      location: 'Benguet',
      image: 'https://images.unsplash.com/photo-1464822759844-d150baec0494?w=150&h=100&fit=crop&auto=format'
    },
    {
      id: '2',
      title: 'Bohol Countryside Tour',
      date: 'Feb 10, 2025',
      location: 'Bohol',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=150&h=100&fit=crop&auto=format'
    }
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <section className="px-8 py-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Trending Articles & Features */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recommended Tours */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommended</h2>
              <div className="mb-4">
                <div className="flex space-x-4 text-sm">
                  <span className="text-gray-600">101 tours</span>
                  <button className="text-[#D4AF37] hover:underline">explore</button>
                </div>
              </div>
              <div className="grid grid-cols-6 gap-2 mb-6">
                {recommendedTours.map((tour) => (
                  <div key={tour.id} className="relative group cursor-pointer">
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className="w-full h-16 object-cover rounded-lg group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/20 rounded-lg group-hover:bg-black/10 transition-colors" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              {/* Personalized Travel Tips */}
              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Personalized travel tips for you</h3>
                <p className="text-sm text-gray-600 mb-3">Get customized recommendations based on your travel history</p>
                <Button size="sm" variant="outline" className="text-xs">
                  Get Tips
                </Button>
              </Card>

              {/* Join Tala */}
              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Join Tala</h3>
                <p className="text-sm text-gray-600 mb-3">Connect with other travel enthusiasts and share experiences</p>
                <Button size="sm" variant="outline" className="text-xs">
                  Join Community
                </Button>
              </Card>

              {/* Lakbay Tales */}
              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Lakbay Tales</h3>
                <p className="text-sm text-gray-600 mb-3">Stories from fellow travelers about their adventures</p>
                <div className="space-y-2">
                  {lakbayTales.slice(0, 2).map((tale) => (
                    <div key={tale.id} className="text-xs text-gray-700">
                      <span className="font-medium">{tale.title}</span>
                      <span className="text-gray-500"> by {tale.author}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Your Lakbays */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Your Lakbays</h2>
                <div className="flex space-x-4 text-sm">
                  <button 
                    className={`hover:underline ${activeTab === 'upcoming' ? 'text-[#D4AF37] font-medium' : 'text-gray-600'}`}
                    onClick={() => setActiveTab('upcoming')}
                  >
                    Upcoming
                  </button>
                  <button 
                    className={`hover:underline ${activeTab === 'past' ? 'text-[#D4AF37] font-medium' : 'text-gray-600'}`}
                    onClick={() => setActiveTab('past')}
                  >
                    Past trips
                  </button>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {upcomingTrips.map((trip) => (
                  <div key={trip.id} className="flex space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <img
                      src={trip.image}
                      alt={trip.title}
                      className="w-16 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{trip.title}</h4>
                      <p className="text-xs text-gray-600">{trip.date}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {trip.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Trending Articles */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Book className="w-5 h-5 mr-2 text-[#D4AF37]" />
                Trending Articles
              </h2>
              
              <div className="space-y-6">
                {trendingArticles.map((article) => (
                  <div key={article.id} className="flex space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-24 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className="text-xs">{article.category}</Badge>
                        {article.isPopular && (
                          <Badge className="bg-[#D4AF37] text-black text-xs">Popular</Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1 hover:text-[#D4AF37] transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{article.excerpt}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {article.author}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {article.readTime} read
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Philippines Map */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">Philippines</h2>
              
              {/* Travel Stats */}
              <div className="mb-6 text-center space-y-2">
                <div className="text-2xl font-bold text-[#D4AF37]">{userTravelHistory.length}</div>
                <div className="text-sm text-gray-600">Provinces Visited</div>
                <div className="text-xs text-gray-500">
                  {userTravelHistory.reduce((total, history) => total + history.visits, 0)} total trips
                </div>
              </div>

              {/* Philippines Map */}
              <div className="mb-6">
                <PhilippinesMap visitedProvinces={userTravelHistory} />
              </div>

              {/* Travel History List */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900 text-sm">Recent Visits</h3>
                {userTravelHistory.slice(0, 3).map((history, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-[#D4AF37] rounded-full"></div>
                      <span className="font-medium text-gray-900">{history.province}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {history.visits} {history.visits === 1 ? 'visit' : 'visits'}
                    </div>
                  </div>
                ))}
                
                {userTravelHistory.length > 3 && (
                  <button className="text-xs text-[#D4AF37] hover:underline">
                    View all ({userTravelHistory.length} provinces)
                  </button>
                )}
              </div>

              {/* Achievement Badge */}
              <div className="mt-6 p-3 bg-gradient-to-r from-[#D4AF37]/10 to-[#D4AF37]/20 rounded-lg text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-4 h-4 text-[#D4AF37] mr-1" />
                  <span className="text-sm font-medium text-gray-900">Explorer Badge</span>
                </div>
                <p className="text-xs text-gray-600">
                  Visit 3 more provinces to unlock "Island Hopper" status
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};