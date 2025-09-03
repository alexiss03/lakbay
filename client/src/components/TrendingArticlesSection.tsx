import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Book, Clock, User } from 'lucide-react';

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
  const { isAuthenticated } = useAuth();

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
    },
    {
      id: '4',
      title: 'Ultimate Food Guide to Cebu',
      category: 'Culinary',
      author: 'Carlos Mendoza',
      readTime: '10 min',
      image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=300&h=200&fit=crop&auto=format',
      excerpt: 'Taste authentic Filipino flavors and discover local food markets and restaurants.',
      isPopular: true
    },
    {
      id: '5',
      title: 'Photography Tips for Philippine Landscapes',
      category: 'Photography',
      author: 'Sofia Aquino',
      readTime: '7 min',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=300&h=200&fit=crop&auto=format',
      excerpt: 'Capture stunning sunrise and sunset shots across the archipelago.',
      isPopular: false
    },
    {
      id: '6',
      title: 'Budget Travel Hacks for Solo Backpackers',
      category: 'Budget Travel',
      author: 'Miguel Torres',
      readTime: '9 min',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=200&fit=crop&auto=format',
      excerpt: 'Save money while exploring the Philippines with these insider tips.',
      isPopular: true
    }
  ];

  if (!isAuthenticated) {
    return <></>;
  }

  return (
    <section className="px-8 py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <Card className="p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <Book className="w-7 h-7 mr-3 text-[#D4AF37]" />
            Trending Articles
          </h2>
          <p className="text-gray-600 mb-8">Discover the latest travel insights and stories from fellow adventurers</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingArticles.map((article) => (
              <div key={article.id} className="group cursor-pointer">
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="relative">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3 flex space-x-2">
                      <Badge variant="outline" className="bg-white/90 text-xs">
                        {article.category}
                      </Badge>
                      {article.isPopular && (
                        <Badge className="bg-[#D4AF37] text-black text-xs">
                          Popular
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-4">
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
                </Card>
              </div>
            ))}
          </div>

          {/* View All Articles Button */}
          <div className="text-center mt-8">
            <button className="bg-[#D4AF37] hover:bg-[#B8941F] text-black px-6 py-3 rounded-lg font-medium transition-colors">
              View All Articles
            </button>
          </div>
        </Card>
      </div>
    </section>
  );
};