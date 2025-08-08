import React from "react";
import { Button } from "@/components/ui/button";
import { useLocation, Link } from "wouter";
import { ChatWidget } from "@/components/ChatWidget";

interface ArticlePageProps {
  params?: {
    slug?: string;
  };
}

export const ArticlePage = ({ params }: ArticlePageProps): JSX.Element => {
  const [location] = useLocation();
  
  // Extract article data based on URL or default to first article
  const getArticleData = () => {
    if (location.includes("hidden-gems")) {
      return {
        title: "Top 5 Hidden Gems in the Philippines",
        category: "Lakbay Exclusive",
        author: "Maria Santos",
        date: "January 15, 2025",
        readTime: "8 min read",
        heroImage: "https://images.unsplash.com/photo-1464822759844-d150baec0494?w=1200&h=600&fit=crop&auto=format",
        content: [
          {
            type: "paragraph",
            text: "The Philippines, an archipelago of over 7,000 islands, harbors secrets that even the most seasoned travelers have yet to uncover. Beyond the well-trodden paths of Boracay and Palawan lies a world of untouched beauty, where nature's artistry remains unspoiled by mass tourism."
          },
          {
            type: "heading",
            text: "1. Siquijor Island: The Mystical Escape"
          },
          {
            type: "paragraph",
            text: "Known locally as the 'Island of Fire,' Siquijor enchants visitors with its mystical aura and pristine beaches. This small island province in the Central Visayas offers an intimate glimpse into Filipino folklore, where traditional healers still practice ancient arts passed down through generations."
          },
          {
            type: "image",
            src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop&auto=format",
            caption: "The pristine shores of Siquijor Island at sunset"
          },
          {
            type: "heading",
            text: "2. Batanes: The Northern Frontier"
          },
          {
            type: "paragraph",
            text: "At the northernmost tip of the Philippines, Batanes stands as a testament to resilience and natural beauty. Its rolling hills, traditional stone houses, and dramatic coastlines create a landscape so unique it feels like stepping into another world entirely."
          },
          {
            type: "heading",
            text: "3. Camiguin: The Island Born of Fire"
          },
          {
            type: "paragraph",
            text: "With more volcanoes than towns, Camiguin offers adventurers a chance to explore hot springs, waterfalls, and volcanic landscapes. The island's compact size makes it perfect for those seeking an immersive cultural experience without the crowds."
          },
          {
            type: "quote",
            text: "Travel is not about the destination, it's about the stories you collect along the way.",
            author: "Local Proverb"
          },
          {
            type: "heading",
            text: "Planning Your Hidden Gem Adventure"
          },
          {
            type: "paragraph",
            text: "The best time to visit these hidden gems is during the dry season from November to April. Each destination offers unique experiences that reward the curious traveler with memories that last a lifetime."
          }
        ]
      };
    } else {
      return {
        title: "Ancient Traditions of Mountain Tribes",
        category: "Cultural Guide",
        author: "Jose Rizal Jr.",
        date: "January 12, 2025",
        readTime: "6 min read",
        heroImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=600&fit=crop&auto=format",
        content: [
          {
            type: "paragraph",
            text: "Deep within the Cordillera Mountains of Northern Luzon, ancient traditions continue to thrive among indigenous communities who have preserved their cultural heritage for over a thousand years."
          },
          {
            type: "heading",
            text: "The Ifugao Rice Terraces: Living Heritage"
          },
          {
            type: "paragraph",
            text: "The Banaue Rice Terraces, often called the 'Eighth Wonder of the World,' represent more than agricultural ingenuity. They embody a complex social system, spiritual beliefs, and sustainable farming practices that modern agriculture is only beginning to understand."
          },
          {
            type: "image",
            src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop&auto=format",
            caption: "Traditional Ifugao rice terraces carved into the mountainside"
          },
          {
            type: "heading",
            text: "Preserving Culture Through Tourism"
          },
          {
            type: "paragraph",
            text: "Responsible cultural tourism provides economic opportunities for mountain communities while ensuring their traditions remain authentic and respected. Visitors learn traditional weaving, participate in harvest festivals, and gain insight into sustainable living practices."
          }
        ]
      };
    }
  };

  const article = getArticleData();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white px-8 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="w-8 h-8 bg-gray-300 rounded cursor-pointer"></div>
          </Link>
          
          <nav className="flex items-center space-x-8">
            <Link href="/" className="text-gray-900 font-medium">Home</Link>
            <Link href="/trips" className="text-gray-700 hover:text-gray-900">Trips</Link>
            <Link href="/chats" className="text-gray-700 hover:text-gray-900">Chats</Link>
            <a href="#" className="text-gray-700 hover:text-gray-900">Trails</a>
            <a href="#" className="text-gray-700 hover:text-gray-900">Story</a>
            <Link href="/shop" className="text-gray-700 hover:text-gray-900">Shop</Link>
            <a href="#" className="text-gray-700 hover:text-gray-900">Corporate</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="text-sm">Log in</Button>
            <Button className="bg-[#D4AF37] hover:bg-[#B8941F] text-black text-sm">Register</Button>
            <span className="text-sm text-gray-700">EN</span>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-8 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <span className="mx-2">/</span>
          <span>Articles</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{article.title}</span>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-[#D4AF37] text-black text-sm rounded">
              {article.category}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {article.title}
          </h1>
          
          <div className="flex items-center text-gray-600 text-sm space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <span>By {article.author}</span>
            </div>
            <span>{article.date}</span>
            <span>{article.readTime}</span>
          </div>
        </header>

        {/* Hero Image */}
        <div className="mb-12">
          <img 
            src={article.heroImage}
            alt={article.title}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>

        {/* Article Body */}
        <div className="prose prose-lg max-w-none">
          {article.content.map((block, index) => {
            switch (block.type) {
              case 'paragraph':
                return (
                  <p key={index} className="text-gray-700 leading-relaxed mb-6 text-lg">
                    {block.text}
                  </p>
                );
              case 'heading':
                return (
                  <h2 key={index} className="text-2xl font-bold text-gray-900 mt-10 mb-4">
                    {block.text}
                  </h2>
                );
              case 'image':
                return (
                  <figure key={index} className="my-8">
                    <img 
                      src={block.src}
                      alt={block.caption}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <figcaption className="text-center text-gray-500 text-sm mt-2 italic">
                      {block.caption}
                    </figcaption>
                  </figure>
                );
              case 'quote':
                return (
                  <blockquote key={index} className="border-l-4 border-[#D4AF37] pl-6 my-8 italic text-xl text-gray-700">
                    <p>"{block.text}"</p>
                    {block.author && (
                      <cite className="text-gray-500 text-base not-italic">— {block.author}</cite>
                    )}
                  </blockquote>
                );
              default:
                return null;
            }
          })}
        </div>

        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Share this article:</span>
              <div className="flex space-x-3">
                <Button variant="outline" size="sm">Facebook</Button>
                <Button variant="outline" size="sm">Twitter</Button>
                <Button variant="outline" size="sm">LinkedIn</Button>
              </div>
            </div>
            
            <Link href="/">
              <Button className="bg-[#D4AF37] hover:bg-[#B8941F] text-black">
                Back to Home
              </Button>
            </Link>
          </div>
        </footer>
      </article>

      {/* Related Articles */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/article/hidden-gems">
              <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1464822759844-d150baec0494?w=400&h=200&fit=crop&auto=format"
                  alt="Hidden Gems"
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <span className="inline-block px-2 py-1 bg-[#D4AF37] text-black text-xs rounded mb-2">
                    Lakbay Exclusive
                  </span>
                  <h4 className="font-semibold text-gray-900 mb-2">Top 5 Hidden Gems in the Philippines</h4>
                  <p className="text-gray-600 text-sm">Discover untouched destinations that showcase the country's natural beauty...</p>
                </div>
              </div>
            </Link>
            
            <Link href="/article/mountain-tribes">
              <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop&auto=format"
                  alt="Mountain Tribes"
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <span className="inline-block px-2 py-1 bg-[#D4AF37] text-black text-xs rounded mb-2">
                    Cultural Guide
                  </span>
                  <h4 className="font-semibold text-gray-900 mb-2">Ancient Traditions of Mountain Tribes</h4>
                  <p className="text-gray-600 text-sm">Explore the rich cultural heritage preserved by indigenous communities...</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
};