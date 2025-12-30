import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface TravelHistory {
  province: string;
  region: string;
  visits: number;
  lastVisit: string;
}

interface PhilippinesMapProps {
  visitedProvinces: TravelHistory[];
}

// Province coordinates mapping
const provinceCoordinates: Record<string, { lat: number; lng: number }> = {
  'Bohol': { lat: 9.8349, lng: 124.1436 },
  'Palawan': { lat: 9.5340, lng: 118.7675 },
  'Benguet': { lat: 16.4023, lng: 120.5979 },
  'Siargao': { lat: 9.8349, lng: 126.0392 },
  'Ilocos Sur': { lat: 17.5748, lng: 120.3875 },
  'Cebu': { lat: 10.3157, lng: 123.8854 },
  'Boracay': { lat: 11.9674, lng: 121.9248 },
  'Bataan': { lat: 14.6417, lng: 120.4818 },
  'Zambales': { lat: 15.5074, lng: 120.0822 },
  'Laguna': { lat: 14.2691, lng: 121.4113 },
  'Batangas': { lat: 13.7565, lng: 121.0583 },
  'Davao': { lat: 7.1907, lng: 125.4553 },
  'Bukidnon': { lat: 8.1551, lng: 125.1260 },
  'Albay': { lat: 13.1374, lng: 123.7436 },
  'Sorsogon': { lat: 12.9744, lng: 124.0065 }
};

// Philippines provincial boundaries (simplified polygons)
const provincePolygons: Record<string, { lat: number; lng: number }[]> = {
  'Bohol': [
    { lat: 9.5000, lng: 123.7000 },
    { lat: 10.1000, lng: 123.7000 },
    { lat: 10.1000, lng: 124.6000 },
    { lat: 9.5000, lng: 124.6000 }
  ],
  'Palawan': [
    { lat: 8.5000, lng: 117.0000 },
    { lat: 11.5000, lng: 117.0000 },
    { lat: 11.5000, lng: 120.0000 },
    { lat: 8.5000, lng: 120.0000 }
  ],
  'Benguet': [
    { lat: 16.1000, lng: 120.4000 },
    { lat: 16.7000, lng: 120.4000 },
    { lat: 16.7000, lng: 120.8000 },
    { lat: 16.1000, lng: 120.8000 }
  ],
  'Siargao': [
    { lat: 9.7000, lng: 125.9000 },
    { lat: 10.0000, lng: 125.9000 },
    { lat: 10.0000, lng: 126.2000 },
    { lat: 9.7000, lng: 126.2000 }
  ],
  'Ilocos Sur': [
    { lat: 16.9000, lng: 120.2000 },
    { lat: 17.8000, lng: 120.2000 },
    { lat: 17.8000, lng: 120.6000 },
    { lat: 16.9000, lng: 120.6000 }
  ],
  'Cebu': [
    { lat: 9.8000, lng: 123.3000 },
    { lat: 11.3000, lng: 123.3000 },
    { lat: 11.3000, lng: 124.0000 },
    { lat: 9.8000, lng: 124.0000 }
  ],
  'Metro Manila': [
    { lat: 14.4000, lng: 121.0000 },
    { lat: 14.8000, lng: 121.0000 },
    { lat: 14.8000, lng: 121.3000 },
    { lat: 14.4000, lng: 121.3000 }
  ],
  'Laguna': [
    { lat: 14.0000, lng: 121.2000 },
    { lat: 14.5000, lng: 121.2000 },
    { lat: 14.5000, lng: 121.7000 },
    { lat: 14.0000, lng: 121.7000 }
  ],
  'Batangas': [
    { lat: 13.4000, lng: 121.1000 },
    { lat: 14.0000, lng: 121.1000 },
    { lat: 14.0000, lng: 121.7000 },
    { lat: 13.4000, lng: 121.7000 }
  ],
  'Cavite': [
    { lat: 14.0000, lng: 120.7000 },
    { lat: 14.4000, lng: 120.7000 },
    { lat: 14.4000, lng: 121.1000 },
    { lat: 14.0000, lng: 121.1000 }
  ],
  'Bulacan': [
    { lat: 14.6000, lng: 120.7000 },
    { lat: 15.1000, lng: 120.7000 },
    { lat: 15.1000, lng: 121.3000 },
    { lat: 14.6000, lng: 121.3000 }
  ],
  'Nueva Ecija': [
    { lat: 15.0000, lng: 120.9000 },
    { lat: 15.6000, lng: 120.9000 },
    { lat: 15.6000, lng: 121.6000 },
    { lat: 15.0000, lng: 121.6000 }
  ],
  'Bataan': [
    { lat: 14.6000, lng: 120.3000 },
    { lat: 14.9000, lng: 120.3000 },
    { lat: 14.9000, lng: 120.7000 },
    { lat: 14.6000, lng: 120.7000 }
  ],
  'Zambales': [
    { lat: 15.2000, lng: 120.0000 },
    { lat: 15.9000, lng: 120.0000 },
    { lat: 15.9000, lng: 120.4000 },
    { lat: 15.2000, lng: 120.4000 }
  ],
  'Ilocos Norte': [
    { lat: 17.6000, lng: 120.3000 },
    { lat: 18.3000, lng: 120.3000 },
    { lat: 18.3000, lng: 120.7000 },
    { lat: 17.6000, lng: 120.7000 }
  ],
  'La Union': [
    { lat: 16.8000, lng: 120.3000 },
    { lat: 17.2000, lng: 120.3000 },
    { lat: 17.2000, lng: 120.7000 },
    { lat: 16.8000, lng: 120.7000 }
  ],
  'Pangasinan': [
    { lat: 15.8000, lng: 120.3000 },
    { lat: 16.6000, lng: 120.3000 },
    { lat: 16.6000, lng: 120.9000 },
    { lat: 15.8000, lng: 120.9000 }
  ],
  'Tarlac': [
    { lat: 15.5000, lng: 120.5000 },
    { lat: 16.2000, lng: 120.5000 },
    { lat: 16.2000, lng: 121.1000 },
    { lat: 15.5000, lng: 121.1000 }
  ],
  'Pampanga': [
    { lat: 14.9000, lng: 120.5000 },
    { lat: 15.4000, lng: 120.5000 },
    { lat: 15.4000, lng: 121.2000 },
    { lat: 14.9000, lng: 121.2000 }
  ],
  'Albay': [
    { lat: 13.0000, lng: 123.6000 },
    { lat: 13.4000, lng: 123.6000 },
    { lat: 13.4000, lng: 124.1000 },
    { lat: 13.0000, lng: 124.1000 }
  ],
  'Camarines Norte': [
    { lat: 13.6000, lng: 123.4000 },
    { lat: 14.1000, lng: 123.4000 },
    { lat: 14.1000, lng: 123.9000 },
    { lat: 13.6000, lng: 123.9000 }
  ],
  'Camarines Sur': [
    { lat: 13.2000, lng: 123.9000 },
    { lat: 13.8000, lng: 123.9000 },
    { lat: 13.8000, lng: 124.3000 },
    { lat: 13.2000, lng: 124.3000 }
  ],
  'Catanduanes': [
    { lat: 13.9000, lng: 124.4000 },
    { lat: 14.3000, lng: 124.4000 },
    { lat: 14.3000, lng: 124.9000 },
    { lat: 13.9000, lng: 124.9000 }
  ],
  'Sorsogon': [
    { lat: 12.5000, lng: 124.0000 },
    { lat: 12.9000, lng: 124.0000 },
    { lat: 12.9000, lng: 124.4000 },
    { lat: 12.5000, lng: 124.4000 }
  ],
  'Iloilo': [
    { lat: 10.5000, lng: 122.5000 },
    { lat: 11.5000, lng: 122.5000 },
    { lat: 11.5000, lng: 123.2000 },
    { lat: 10.5000, lng: 123.2000 }
  ],
  'Capiz': [
    { lat: 11.5000, lng: 122.8000 },
    { lat: 12.0000, lng: 122.8000 },
    { lat: 12.0000, lng: 123.5000 },
    { lat: 11.5000, lng: 123.5000 }
  ],
  'Aklan': [
    { lat: 11.8000, lng: 122.0000 },
    { lat: 12.3000, lng: 122.0000 },
    { lat: 12.3000, lng: 122.6000 },
    { lat: 11.8000, lng: 122.6000 }
  ],
  'Antique': [
    { lat: 10.8000, lng: 122.0000 },
    { lat: 11.5000, lng: 122.0000 },
    { lat: 11.5000, lng: 122.5000 },
    { lat: 10.8000, lng: 122.5000 }
  ],
  'Guimaras': [
    { lat: 10.8000, lng: 122.6000 },
    { lat: 11.0000, lng: 122.6000 },
    { lat: 11.0000, lng: 122.9000 },
    { lat: 10.8000, lng: 122.9000 }
  ],
  'Negros Occidental': [
    { lat: 10.4000, lng: 123.2000 },
    { lat: 11.3000, lng: 123.2000 },
    { lat: 11.3000, lng: 123.8000 },
    { lat: 10.4000, lng: 123.8000 }
  ],
  'Negros Oriental': [
    { lat: 10.4000, lng: 123.8000 },
    { lat: 11.3000, lng: 123.8000 },
    { lat: 11.3000, lng: 124.4000 },
    { lat: 10.4000, lng: 124.4000 }
  ],
  'Davao': [
    { lat: 6.8000, lng: 125.3000 },
    { lat: 7.5000, lng: 125.3000 },
    { lat: 7.5000, lng: 125.9000 },
    { lat: 6.8000, lng: 125.9000 }
  ],
  'Davao Occidental': [
    { lat: 7.2000, lng: 124.8000 },
    { lat: 7.6000, lng: 124.8000 },
    { lat: 7.6000, lng: 125.2000 },
    { lat: 7.2000, lng: 125.2000 }
  ],
  'Davao Oriental': [
    { lat: 7.5000, lng: 125.8000 },
    { lat: 8.2000, lng: 125.8000 },
    { lat: 8.2000, lng: 126.4000 },
    { lat: 7.5000, lng: 126.4000 }
  ],
  'Bukidnon': [
    { lat: 7.9000, lng: 124.6000 },
    { lat: 8.5000, lng: 124.6000 },
    { lat: 8.5000, lng: 125.3000 },
    { lat: 7.9000, lng: 125.3000 }
  ],
  'Misamis Oriental': [
    { lat: 8.4000, lng: 124.2000 },
    { lat: 9.0000, lng: 124.2000 },
    { lat: 9.0000, lng: 124.8000 },
    { lat: 8.4000, lng: 124.8000 }
  ],
  'Misamis Occidental': [
    { lat: 8.6000, lng: 123.6000 },
    { lat: 9.1000, lng: 123.6000 },
    { lat: 9.1000, lng: 124.2000 },
    { lat: 8.6000, lng: 124.2000 }
  ],
  'Lanao del Norte': [
    { lat: 8.8000, lng: 123.9000 },
    { lat: 9.3000, lng: 123.9000 },
    { lat: 9.3000, lng: 124.5000 },
    { lat: 8.8000, lng: 124.5000 }
  ],
  'Lanao del Sur': [
    { lat: 8.0000, lng: 123.8000 },
    { lat: 8.6000, lng: 123.8000 },
    { lat: 8.6000, lng: 124.4000 },
    { lat: 8.0000, lng: 124.4000 }
  ],
  'Maguindanao': [
    { lat: 6.9000, lng: 123.9000 },
    { lat: 7.5000, lng: 123.9000 },
    { lat: 7.5000, lng: 124.6000 },
    { lat: 6.9000, lng: 124.6000 }
  ],
  'Sultan Kudarat': [
    { lat: 6.9000, lng: 124.6000 },
    { lat: 7.5000, lng: 124.6000 },
    { lat: 7.5000, lng: 125.2000 },
    { lat: 6.9000, lng: 125.2000 }
  ],
  'South Cotabato': [
    { lat: 6.3000, lng: 124.9000 },
    { lat: 6.9000, lng: 124.9000 },
    { lat: 6.9000, lng: 125.5000 },
    { lat: 6.3000, lng: 125.5000 }
  ],
  'Sarangani': [
    { lat: 5.8000, lng: 125.0000 },
    { lat: 6.3000, lng: 125.0000 },
    { lat: 6.3000, lng: 125.6000 },
    { lat: 5.8000, lng: 125.6000 }
  ],
  'General Santos': [
    { lat: 6.1000, lng: 125.1000 },
    { lat: 6.4000, lng: 125.1000 },
    { lat: 6.4000, lng: 125.4000 },
    { lat: 6.1000, lng: 125.4000 }
  ]
};

export const PhilippinesMap: React.FC<PhilippinesMapProps> = ({ visitedProvinces }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const initializeMap = async () => {
      try {
        // Fetch API key from server endpoint to avoid exposing it in client
        const response = await fetch('/api/config/google-maps-key');
        const { apiKey } = await response.json();
        
        if (!apiKey) {
          throw new Error('Google Maps API key not available');
        }

        const loader = new Loader({
          apiKey: apiKey,
          version: 'weekly',
          libraries: ['geometry', 'places']
        });

        const google = await loader.load();
        
        const mapInstance = new google.maps.Map(mapRef.current!, {
          center: { lat: 12.8797, lng: 121.7740 }, // Center of Philippines
          zoom: 6,
          mapTypeId: 'terrain',
          styles: [
            {
              featureType: 'administrative.country',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#D4AF37' }, { weight: 2 }]
            },
            {
              featureType: 'administrative.province',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#cccccc' }, { weight: 1 }]
            },
            {
              featureType: 'water',
              elementType: 'geometry.fill',
              stylers: [{ color: '#e6f3ff' }]
            },
            {
              featureType: 'landscape',
              elementType: 'geometry.fill',
              stylers: [{ color: '#f8f8f8' }]
            }
          ],
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: 'cooperative'
        });

        setMap(mapInstance);
        setIsLoading(false);

        // Add visited province markers and overlays
        visitedProvinces.forEach((history) => {
          const coordinates = provinceCoordinates[history.province];
          if (coordinates) {
            // Add marker for visited province
            const marker = new google.maps.Marker({
              position: coordinates,
              map: mapInstance,
              title: `${history.province} - ${history.visits} visits`,
              icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="8" fill="#D4AF37" stroke="#fff" stroke-width="2"/>
                    <text x="12" y="16" text-anchor="middle" font-family="Arial" font-size="10" font-weight="bold" fill="white">${history.visits}</text>
                  </svg>
                `),
                scaledSize: new google.maps.Size(24, 24),
                anchor: new google.maps.Point(12, 12)
              }
            });

            // Add info window
            const infoWindow = new google.maps.InfoWindow({
              content: `
                <div class="p-3">
                  <h3 class="font-semibold text-gray-900 mb-2">${history.province}</h3>
                  <div class="space-y-1 text-sm">
                    <div class="flex justify-between">
                      <span class="text-gray-600">Region:</span>
                      <span class="font-medium">${history.region}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Visits:</span>
                      <span class="font-medium text-[#D4AF37]">${history.visits}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600">Last Visit:</span>
                      <span class="font-medium">${new Date(history.lastVisit).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              `
            });

            marker.addListener('click', () => {
              infoWindow.open(mapInstance, marker);
            });

            // Add colored polygon overlay for visited provinces
            const polygonPaths = provincePolygons[history.province];
            if (polygonPaths) {
              // Color intensity based on visit count
              const opacity = Math.min(0.3 + (history.visits * 0.1), 0.7);
              
              const polygon = new google.maps.Polygon({
                paths: polygonPaths,
                strokeColor: '#D4AF37',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#D4AF37',
                fillOpacity: opacity,
                map: mapInstance
              });

              // Add click listener to polygon
              polygon.addListener('click', () => {
                infoWindow.open(mapInstance, marker);
              });
            }
          }
        });

        // Add legend
        const legend = document.createElement('div');
        legend.innerHTML = `
          <div style="background: white; margin: 10px; padding: 10px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); font-family: Arial, sans-serif; font-size: 12px;">
            <div style="font-weight: bold; margin-bottom: 8px; color: #333;">Travel History</div>
            <div style="display: flex; align-items: center; margin-bottom: 4px;">
              <div style="width: 16px; height: 16px; background: #D4AF37; border-radius: 50%; margin-right: 8px; opacity: 0.4;"></div>
              <span>1-2 visits</span>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 4px;">
              <div style="width: 16px; height: 16px; background: #D4AF37; border-radius: 50%; margin-right: 8px; opacity: 0.6;"></div>
              <span>3-4 visits</span>
            </div>
            <div style="display: flex; align-items: center;">
              <div style="width: 16px; height: 16px; background: #D4AF37; border-radius: 50%; margin-right: 8px; opacity: 0.8;"></div>
              <span>5+ visits</span>
            </div>
          </div>
        `;
        
        mapInstance.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);

        // Add all province borders (unvisited provinces)
        Object.keys(provincePolygons).forEach((provinceName) => {
          // Skip if already visited (will be handled above)
          if (visitedProvinces.some(p => p.province === provinceName)) {
            return;
          }
          
          const polygonPaths = provincePolygons[provinceName];
          new google.maps.Polygon({
            paths: polygonPaths,
            strokeColor: '#e0e0e0',
            strokeOpacity: 0.5,
            strokeWeight: 1,
            fillColor: '#f5f5f5',
            fillOpacity: 0.3,
            map: mapInstance
          });
        });

      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError('Failed to load map. Please check your internet connection.');
        setIsLoading(false);
      }
    };

    initializeMap();
  }, [visitedProvinces]);

  if (error) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
          <div className="text-center">
            <div className="animate-spin w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};