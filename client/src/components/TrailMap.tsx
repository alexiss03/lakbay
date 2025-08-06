import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface TrailPoint {
  name: string;
  type: 'trailhead' | 'campsite' | 'checkpoint' | 'summit';
  elevation: string;
  description: string;
  coordinates: { lat: number; lng: number };
}

interface TrailMapProps {
  trailPoints: TrailPoint[];
  center: { lat: number; lng: number };
  zoom?: number;
}

export const TrailMap = ({ trailPoints, center, zoom = 15 }: TrailMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    const initMap = async () => {
      // Get API key from environment or backend
      let apiKey = '';
      try {
        // Try to fetch from backend endpoint
        const response = await fetch('/api/config/google-maps-key');
        if (response.ok) {
          const data = await response.json();
          apiKey = data.apiKey;
        }
      } catch (error) {
        console.error('Failed to fetch Google Maps API key:', error);
        return;
      }

      const loader = new Loader({
        apiKey: apiKey,
        version: 'weekly',
        libraries: ['places']
      });

      try {
        await loader.load();
        
        if (!mapRef.current) return;

        // Initialize map with satellite view
        const googleMaps = (window as any).google.maps;
        const map = new googleMaps.Map(mapRef.current, {
          center: center,
          zoom: zoom,
          mapTypeId: googleMaps.MapTypeId.SATELLITE,
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: googleMaps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: googleMaps.ControlPosition.TOP_CENTER,
          },
          zoomControl: true,
          streetViewControl: false,
          fullscreenControl: true,
        });

        mapInstanceRef.current = map;

        // Create custom markers for each trail point
        trailPoints.forEach((point, index) => {
          // Define marker colors and icons based on type
          const getMarkerConfig = (type: string) => {
            switch (type) {
              case 'trailhead':
                return { color: '#10B981', icon: '🚀', label: 'Start' };
              case 'campsite':
                return { color: '#F59E0B', icon: '⛺', label: 'Camp' };
              case 'checkpoint':
                return { color: '#3B82F6', icon: '🏁', label: 'Check' };
              case 'summit':
                return { color: '#EF4444', icon: '🏔️', label: 'Summit' };
              default:
                return { color: '#6B7280', icon: '📍', label: 'Point' };
            }
          };

          const config = getMarkerConfig(point.type);

          // Create custom marker
          const marker = new googleMaps.Marker({
            position: point.coordinates,
            map: map,
            title: `${point.name} (${point.elevation})`,
            icon: {
              path: googleMaps.SymbolPath.CIRCLE,
              scale: 12,
              fillColor: config.color,
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 2,
            },
            label: {
              text: config.icon,
              fontSize: '14px',
            }
          });

          // Create info window
          const infoWindow = new googleMaps.InfoWindow({
            content: `
              <div style="padding: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px; color: #1F2937;">
                  ${point.name}
                </div>
                <div style="font-size: 12px; color: #6B7280; margin-bottom: 4px;">
                  ${point.type.charAt(0).toUpperCase() + point.type.slice(1)} • ${point.elevation}
                </div>
                <div style="font-size: 12px; color: #374151;">
                  ${point.description}
                </div>
              </div>
            `
          });

          // Add click listener to marker
          marker.addListener('click', () => {
            infoWindow.open(map, marker);
          });
        });

        // Create trail path if there are multiple points
        if (trailPoints.length > 1) {
          const trailPath = new googleMaps.Polyline({
            path: trailPoints.map(point => point.coordinates),
            geodesic: true,
            strokeColor: '#D4AF37',
            strokeOpacity: 1.0,
            strokeWeight: 4,
          });

          trailPath.setMap(map);
        }

        // Fit bounds to show all markers
        if (trailPoints.length > 0) {
          const bounds = new googleMaps.LatLngBounds();
          trailPoints.forEach(point => {
            bounds.extend(point.coordinates);
          });
          map.fitBounds(bounds);
          
          // Ensure minimum zoom level
          googleMaps.event.addListenerOnce(map, 'bounds_changed', () => {
            if (map.getZoom() && map.getZoom() > 16) {
              map.setZoom(16);
            }
          });
        }

      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initMap();
  }, [trailPoints, center, zoom]);

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};