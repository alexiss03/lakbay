import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PhilippinesMap } from '@/components/PhilippinesMap';
import { useAuth } from '@/hooks/useAuth';
import { MapPin } from 'lucide-react';

interface TravelHistory {
  province: string;
  region: string;
  visits: number;
  lastVisit: string;
}

export const RecommendedSection = (): JSX.Element => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  
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
    return <></>;
  }

  return (
    <section className="px-8 py-12 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Recommended & Features */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recommended Tours */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommended</h2>
              <div className="mb-4">
                <div className="flex space-x-4 text-sm">
                  <span className="text-gray-600">101 tours</span>
                  <button className="text-[#D4AF37] hover:underline">explore</button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {recommendedTours.map((tour) => (
                  <div key={tour.id} className="group cursor-pointer">
                    <div className="relative mb-2">
                      <img
                        src={tour.image}
                        alt={tour.title}
                        className="w-full h-20 object-cover rounded-lg group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/20 rounded-lg group-hover:bg-black/10 transition-colors" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                        {tour.title}
                      </h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-600">
                          <MapPin className="w-3 h-3 mr-1" />
                          {tour.location}
                        </div>
                        <span className="text-xs font-medium text-[#D4AF37]">{tour.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              {/* Personalized Travel Tips */}
              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Personalized travel tips for you</h3>
                <p className="text-sm text-gray-600 mb-3">powered by AI</p>
                <Button size="sm" variant="outline" className="text-xs">
                  Get Tips
                </Button>
              </Card>

              {/* Join Tala */}
              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Join Tala</h3>
                <p className="text-sm text-gray-600 mb-3">connect with other travel enthusiast</p>
                <p className="text-xs text-gray-500 mb-3">set your travel goals</p>
                <Button size="sm" variant="outline" className="text-xs">
                  Join Community
                </Button>
              </Card>

              {/* Lakbay Tales */}
              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Lakbay Tales</h3>
                <p className="text-sm text-gray-600 mb-3">share way to journal your travel memories</p>
                <p className="text-xs text-gray-500 mb-3">request story books</p>
                <Button size="sm" variant="outline" className="text-xs">
                  Start Writing
                </Button>
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
          </div>

          {/* Right Column - Philippines Map */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">Philippines</h2>
              
              {/* Philippines Map */}
              <div className="mb-6">
                <PhilippinesMap visitedProvinces={userTravelHistory} />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};