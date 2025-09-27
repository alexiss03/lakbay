import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NavigationBar } from "@/components/NavigationBar";
import { MapPin, Clock, Users, Star, ArrowLeft, Search } from "lucide-react";

interface Tour {
  id: string;
  title: string;
  location: string;
  destination: string;
  price: string;
  image: string;
  category: string;
  slug: string;
  duration: string;
  participants: number;
  rating?: number;
  description: string;
}

export const SearchResultsPage = (): JSX.Element => {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Sample tour data for search
  const allTours: Tour[] = [
    {
      id: '1',
      title: 'El Nido Island Hopping Adventure',
      location: 'Palawan',
      destination: 'Palawan, Philippines',
      price: '₱12,500',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
      category: 'Island Hopping',
      slug: 'el-nido-island-hopping',
      duration: '4 days',
      participants: 8,
      rating: 4.8,
      description: 'Explore the pristine lagoons and hidden beaches of El Nido with crystal clear waters and stunning limestone cliffs.'
    },
    {
      id: '2',
      title: 'Bohol Chocolate Hills Trek',
      location: 'Bohol',
      destination: 'Bohol, Philippines',
      price: '₱8,900',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop',
      category: 'Hiking',
      slug: 'bohol-chocolate-hills',
      duration: '3 days',
      participants: 12,
      rating: 4.6,
      description: 'Experience the iconic Chocolate Hills and visit the adorable Tarsier sanctuary in this unique Bohol adventure.'
    },
    {
      id: '3',
      title: 'Sagada Cave Exploration',
      location: 'Mountain Province',
      destination: 'Mountain Province, Philippines',
      price: '₱15,200',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
      category: 'Adventure',
      slug: 'sagada-caves',
      duration: '4 days',
      participants: 6,
      rating: 4.9,
      description: 'Discover ancient burial caves, stunning rice terraces, and breathtaking mountain views in mystical Sagada.'
    },
    {
      id: '4',
      title: 'Siargao Surf & Island Tour',
      location: 'Siargao',
      destination: 'Siargao, Philippines',
      price: '₱18,750',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop',
      category: 'Surfing',
      slug: 'siargao-surf',
      duration: '5 days',
      participants: 10,
      rating: 4.9,
      description: 'Ride the waves at Cloud 9 and explore the magical islands around Siargao in this ultimate surf adventure.'
    },
    {
      id: '5',
      title: 'Batanes Cultural Heritage Tour',
      location: 'Batanes',
      destination: 'Batanes, Philippines',
      price: '₱22,400',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
      category: 'Cultural',
      slug: 'batanes-heritage',
      duration: '4 days',
      participants: 8,
      rating: 4.7,
      description: 'Immerse yourself in Ivatan culture while exploring the dramatic landscapes and traditional stone houses of Batanes.'
    },
    {
      id: '6',
      title: 'Sunset Beach Trek',
      location: 'Boracay',
      destination: 'Boracay, Philippines',
      price: '₱2,500',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
      category: 'Beach',
      slug: 'boracay-sunset-trek',
      duration: '1 day',
      participants: 15,
      rating: 4.5,
      description: 'Watch spectacular sunsets while trekking along Boracay\'s famous white sand beaches and hidden coves.'
    },
    {
      id: '7',
      title: 'Mountain Sunrise Hike',
      location: 'Benguet',
      destination: 'Benguet, Philippines',
      price: '₱3,800',
      image: 'https://images.unsplash.com/photo-1464822759844-d150baec0494?w=400&h=250&fit=crop',
      category: 'Hiking',
      slug: 'mount-pulag',
      duration: '2 days',
      participants: 20,
      rating: 4.8,
      description: 'Experience the breathtaking sea of clouds and sunrise views from the Philippines\' second highest peak.'
    },
    {
      id: '8',
      title: 'Vigan Cultural Heritage Tour',
      location: 'Vigan',
      destination: 'Ilocos Sur, Philippines',
      price: '₱2,800',
      image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=400&h=250&fit=crop',
      category: 'Cultural',
      slug: 'vigan-heritage',
      duration: '2 days',
      participants: 12,
      rating: 4.4,
      description: 'Step back in time exploring UNESCO World Heritage cobblestone streets and Spanish colonial architecture.'
    }
  ];

  // Effect to handle initial URL and popstate changes
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const query = params.get('q') || '';
      
      setSearchQuery(query);

      if (query) {
        performSearch(query);
      } else {
        setSearchResults([]);
      }
    };

    // Handle initial load
    handleUrlChange();

    // Listen for browser back/forward
    window.addEventListener('popstate', handleUrlChange);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []); // Empty dependency array - only run on mount

  // Effect to handle wouter location changes  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q') || '';
    
    if (query !== searchQuery) {
      setSearchQuery(query);
      if (query) {
        performSearch(query);
      } else {
        setSearchResults([]);
      }
    }
  }, [location]); // Depend on wouter location changes

  const performSearch = (query: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const results = allTours.filter(tour =>
        tour.title.toLowerCase().includes(query.toLowerCase()) ||
        tour.location.toLowerCase().includes(query.toLowerCase()) ||
        tour.category.toLowerCase().includes(query.toLowerCase()) ||
        tour.description.toLowerCase().includes(query.toLowerCase()) ||
        tour.slug.toLowerCase().includes(query.toLowerCase()) ||
        tour.destination.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults(results);
      setIsLoading(false);
    }, 500);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-black">
                LAKBAY
              </Link>
            </div>

            {/* Navigation with Search */}
            <NavigationBar currentPage="search" />

            {/* User Account */}
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="prada-button">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="prada-button prada-gold-accent">
                  Join Lakbay
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="flex items-center text-gray-600 hover:text-black"
            data-testid="button-back"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Search Results Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-black mb-2">
            Search Results
          </h1>
          {searchQuery && (
            <p className="text-gray-600">
              {isLoading ? (
                "Searching..."
              ) : (
                `Found ${searchResults.length} ${searchResults.length === 1 ? 'tour' : 'tours'} for "${searchQuery}"`
              )}
            </p>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* Search Results */}
        {!isLoading && searchResults.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((tour) => (
              <Card key={tour.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="relative">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-white text-black">
                    {tour.category}
                  </Badge>
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium text-lg mb-2 line-clamp-2">
                    {tour.title}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{tour.location}</span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {tour.duration}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {tour.participants}
                      </div>
                    </div>
                    
                    {tour.rating && (
                      <div className="flex items-center space-x-1">
                        <div className="flex">
                          {renderStars(tour.rating)}
                        </div>
                        <span className="text-sm text-gray-600">
                          {tour.rating}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {tour.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xl font-semibold text-black">
                      {tour.price}
                    </span>
                    <Button
                      size="sm"
                      className="bg-black hover:bg-gray-800 text-white"
                      onClick={() => setLocation(`/trip/${tour.slug}`)}
                      data-testid={`button-view-${tour.id}`}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && searchQuery && searchResults.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-light text-gray-900 mb-2">
              No tours found
            </h2>
            <p className="text-gray-600 mb-6">
              We couldn't find any tours matching "{searchQuery}". Try searching with different keywords.
            </p>
            <Button
              onClick={() => setLocation("/")}
              className="bg-black hover:bg-gray-800 text-white"
            >
              Browse All Tours
            </Button>
          </div>
        )}

        {/* Empty Search State */}
        {!isLoading && !searchQuery && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-light text-gray-900 mb-2">
              Start your search
            </h2>
            <p className="text-gray-600">
              Use the search bar above to find amazing tours and adventures.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};