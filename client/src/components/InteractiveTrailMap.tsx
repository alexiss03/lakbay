import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrailMap } from '@/components/TrailMap';
import { 
  Mountain, 
  MapPin, 
  TrendingUp, 
  Clock, 
  Users, 
  Star,
  Navigation,
  Camera,
  Compass,
  Heart
} from 'lucide-react';

interface TrailPoint {
  name: string;
  type: 'trailhead' | 'campsite' | 'checkpoint' | 'summit';
  elevation: string;
  description: string;
  coordinates: { lat: number; lng: number };
}

interface Trail {
  id: string;
  name: string;
  difficulty: 'Easy' | 'Moderate' | 'Difficult' | 'Expert';
  distance: string;
  elevation: string;
  duration: string;
  region: string;
  description: string;
  features: string[];
  trailPoints: TrailPoint[];
  center: { lat: number; lng: number };
  images: string[];
}

const sampleTrails: Trail[] = [
  {
    id: 'mt-pulag',
    name: 'Mount Pulag Trail',
    difficulty: 'Moderate',
    distance: '8.5 km',
    elevation: '+1,247m',
    duration: '6-8 hours',
    region: 'Benguet',
    description: 'The third highest peak in the Philippines, famous for its sea of clouds and grassland summit.',
    features: ['Sea of Clouds', 'Grassland Summit', 'Pine Forests', 'Mossy Forest'],
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop&auto=format'
    ],
    center: { lat: 16.5967, lng: 120.8861 },
    trailPoints: [
      {
        name: 'Ranger Station',
        type: 'trailhead',
        elevation: '2,207m',
        description: 'Starting point with registration and guides',
        coordinates: { lat: 16.5850, lng: 120.8750 }
      },
      {
        name: 'Camp 1',
        type: 'campsite',
        elevation: '2,450m', 
        description: 'First camping area with basic facilities',
        coordinates: { lat: 16.5900, lng: 120.8800 }
      },
      {
        name: 'Mount Pulag Summit',
        type: 'summit',
        elevation: '2,922m',
        description: 'Third highest peak in the Philippines with panoramic views',
        coordinates: { lat: 16.5967, lng: 120.8861 }
      }
    ]
  },
  {
    id: 'mt-apo',
    name: 'Mount Apo Trail',
    difficulty: 'Expert',
    distance: '16 km',
    elevation: '+1,954m',
    duration: '2-3 days',
    region: 'Davao',
    description: 'The highest peak in the Philippines with diverse ecosystems and endemic species.',
    features: ['Highest Peak', 'Endemic Wildlife', 'Sulfur Springs', 'Ancient Trees'],
    images: [
      'https://images.unsplash.com/photo-1464822759844-d150baec0494?w=300&h=200&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop&auto=format'
    ],
    center: { lat: 7.0031, lng: 125.2731 },
    trailPoints: [
      {
        name: 'Kapatagan Base',
        type: 'trailhead',
        elevation: '968m',
        description: 'Main jump-off point with guides and porters',
        coordinates: { lat: 6.9900, lng: 125.2600 }
      },
      {
        name: 'Boulder Face',
        type: 'checkpoint',
        elevation: '1,800m',
        description: 'Challenging rock formation section',
        coordinates: { lat: 6.9950, lng: 125.2650 }
      },
      {
        name: 'Mount Apo Summit',
        type: 'summit',
        elevation: '2,954m',
        description: 'Highest point in the Philippines with volcanic crater',
        coordinates: { lat: 7.0031, lng: 125.2731 }
      }
    ]
  }
];

export const InteractiveTrailMap: React.FC = () => {
  const [selectedTrail, setSelectedTrail] = useState<Trail>(sampleTrails[0]);
  const [activeTab, setActiveTab] = useState('map');
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (trailId: string) => {
    setFavorites(prev => 
      prev.includes(trailId) 
        ? prev.filter(id => id !== trailId)
        : [...prev, trailId]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800';
      case 'Difficult': return 'bg-orange-100 text-orange-800';
      case 'Expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-[calc(100vh-240px)] gap-6">
      {/* Left: Trail Selection List */}
      <div className="w-1/3 flex flex-col">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Available Trails</h3>
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {sampleTrails.map((trail) => (
            <Card 
              key={trail.id} 
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedTrail.id === trail.id ? 'ring-2 ring-[#D4AF37] bg-[#D4AF37]/5' : ''
              }`}
              onClick={() => setSelectedTrail(trail)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{trail.name}</h3>
                  <p className="text-sm text-gray-600">{trail.region}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getDifficultyColor(trail.difficulty)}>
                    {trail.difficulty}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(trail.id);
                    }}
                    className="p-1 h-auto"
                  >
                    <Heart 
                      className={`w-4 h-4 ${
                        favorites.includes(trail.id) 
                          ? 'fill-red-500 text-red-500' 
                          : 'text-gray-400'
                      }`} 
                    />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-1 text-xs text-gray-600 mb-3">
                <div className="flex items-center">
                  <Navigation className="w-3 h-3 mr-1" />
                  {trail.distance}
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {trail.elevation}
                </div>
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {trail.duration}
                </div>
              </div>
              
              <p className="text-sm text-gray-700 line-clamp-2">{trail.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Right: Selected Trail Details */}
      <div className="flex-1 flex flex-col">
        <Card className="p-6 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedTrail.name}</h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Mountain className="w-4 h-4 mr-1" />
                  {selectedTrail.region}
                </div>
                <Badge className={getDifficultyColor(selectedTrail.difficulty)}>
                  {selectedTrail.difficulty}
                </Badge>
              </div>
            </div>
            <Button className="bg-[#D4AF37] hover:bg-[#B8941F] text-white">
              Plan This Hike
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-4 w-full mb-6">
              <TabsTrigger value="map">Trail Map</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="points">Trail Points</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto">
              <TabsContent value="map" className="space-y-4 m-0">
                <div className="aspect-video relative rounded-lg overflow-hidden">
                  <TrailMap 
                    trailPoints={selectedTrail.trailPoints}
                    center={selectedTrail.center}
                    zoom={13}
                  />
                </div>
                
                <div className="grid grid-cols-4 gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#D4AF37]">{selectedTrail.distance}</div>
                    <p className="text-sm text-gray-600">Distance</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#D4AF37]">{selectedTrail.elevation}</div>
                    <p className="text-sm text-gray-600">Elevation Gain</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#D4AF37]">{selectedTrail.duration}</div>
                    <p className="text-sm text-gray-600">Duration</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#D4AF37]">{selectedTrail.trailPoints.length}</div>
                    <p className="text-sm text-gray-600">Trail Points</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-6 m-0">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedTrail.description}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedTrail.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <Star className="w-4 h-4 text-[#D4AF37] mr-2" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="points" className="space-y-4 m-0">
                {selectedTrail.trailPoints.map((point, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white mr-3 ${
                          point.type === 'trailhead' ? 'bg-green-500' :
                          point.type === 'campsite' ? 'bg-orange-500' :
                          point.type === 'checkpoint' ? 'bg-blue-500' :
                          'bg-red-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{point.name}</h4>
                          <p className="text-sm text-gray-600 mb-1">Elevation: {point.elevation}</p>
                          <p className="text-sm text-gray-700">{point.description}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {point.type.charAt(0).toUpperCase() + point.type.slice(1)}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="gallery" className="space-y-4 m-0">
                <div className="grid grid-cols-2 gap-4">
                  {selectedTrail.images.map((image, index) => (
                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer">
                      <img 
                        src={image} 
                        alt={`${selectedTrail.name} ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};