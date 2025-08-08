import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PhilippinesMap } from '@/components/PhilippinesMap';
import { MapPin, TrendingUp, Award, Clock } from 'lucide-react';

interface TravelHistory {
  province: string;
  region: string;
  visits: number;
  lastVisit: string;
}

interface InteractiveMapSectionProps {
  travelHistory: TravelHistory[];
}

export const InteractiveMapSection: React.FC<InteractiveMapSectionProps> = ({ travelHistory }) => {
  const [selectedProvince, setSelectedProvince] = useState<TravelHistory | null>(null);

  const totalVisits = travelHistory.reduce((sum, history) => sum + history.visits, 0);
  const uniqueProvinces = travelHistory.length;
  const recentVisits = travelHistory.filter(h => {
    const visitDate = new Date(h.lastVisit);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return visitDate > threeMonthsAgo;
  }).length;

  return (
    <div className="space-y-6">
      {/* Map Container */}
      <div className="prada-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="prada-heading text-lg font-light">Philippines Travel Map</h3>
          <Badge variant="outline" className="prada-gold-accent text-xs">
            Interactive
          </Badge>
        </div>
        
        <div className="aspect-square relative mb-6">
          <PhilippinesMap visitedProvinces={travelHistory} />
        </div>

        {/* Travel Statistics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <MapPin className="w-4 h-4 text-[#D4AF37] mr-1" />
              <span className="text-2xl font-light text-black">{uniqueProvinces}</span>
            </div>
            <p className="text-xs text-gray-600 font-light">Provinces Visited</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-4 h-4 text-[#D4AF37] mr-1" />
              <span className="text-2xl font-light text-black">{totalVisits}</span>
            </div>
            <p className="text-xs text-gray-600 font-light">Total Trips</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-4 h-4 text-[#D4AF37] mr-1" />
              <span className="text-2xl font-light text-black">{recentVisits}</span>
            </div>
            <p className="text-xs text-gray-600 font-light">Recent Visits</p>
          </div>
        </div>

        {/* Recent Travel History */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Destinations</h4>
          <div className="space-y-2">
            {travelHistory.slice(0, 3).map((history, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{history.province}</p>
                  <p className="text-xs text-gray-500">{history.region}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-[#D4AF37]">{history.visits} visits</p>
                  <p className="text-xs text-gray-500">{new Date(history.lastVisit).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Badge */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Award className="w-4 h-4 text-[#D4AF37] mr-2" />
              <span className="text-sm font-medium text-gray-900">Explorer Badge</span>
            </div>
            <Badge className="bg-[#D4AF37] text-white text-xs">
              {uniqueProvinces >= 5 ? 'Advanced' : uniqueProvinces >= 3 ? 'Intermediate' : 'Beginner'}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};