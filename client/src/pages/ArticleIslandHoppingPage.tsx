import React from 'react';
import { Button } from '@/components/ui/button';
import { useLocation, Link } from 'wouter';

export const ArticleIslandHoppingPage = (): JSX.Element => {
  const article = {
    title: "Best Island Hopping Routes in Visayas",
    category: "Adventure Guide",
    author: "Jose Cruz",
    date: "January 12, 2025",
    readTime: "15 min read",
    heroImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=600&fit=crop&auto=format",
    content: [
      {
        type: "paragraph",
        text: "The Visayas region boasts some of the most breathtaking island hopping experiences in Southeast Asia. With over 6,000 islands scattered across crystal-clear waters, this tropical paradise offers endless opportunities for adventure, relaxation, and discovery of pristine beaches and vibrant marine life."
      },
      {
        type: "heading",
        text: "Bohol and Panglao: The Classic Route"
      },
      {
        type: "paragraph",
        text: "Starting from Panglao, this route takes you to Virgin Island's powdery white sands, Balicasag Island's world-class diving spots, and includes dolphin watching at Pamilacan Island. Each stop offers unique experiences from snorkeling with sea turtles to enjoying fresh seafood prepared by local fishermen."
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop&auto=format",
        caption: "Crystal clear waters surrounding Virgin Island in Bohol"
      },
      {
        type: "heading",
        text: "Siquijor: The Mystical Island Circuit"
      },
      {
        type: "paragraph",
        text: "Known as the 'Island of Fire,' Siquijor combines beach hopping with cultural immersion. Visit Salagdoong Beach for cliff jumping, explore the centuries-old Balete Tree, and discover hidden waterfalls like Cambugahay Falls where you can swing on rope swings into turquoise pools."
      },
      {
        type: "quote",
        text: "Island hopping in the Visayas isn't just about the destinations – it's about the journey between pristine waters and the stories shared with fellow travelers.",
        author: "Local Tour Guide"
      },
      {
        type: "heading",
        text: "Planning Your Island Adventure"
      },
      {
        type: "paragraph",
        text: "The best time for island hopping is during the dry season from November to April when seas are calm and visibility is at its peak. Budget around ₱2,500-4,000 per person for a full day tour including boat transfers, snorkeling gear, and fresh seafood lunch prepared on the beach."
      }
    ]
  };

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
            <Link href="/trails" className="text-gray-700 hover:text-gray-900">Trails</Link>
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
            alt="Island Hopping Guide"
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none space-y-8">
          {article.content.map((item, index) => {
            switch (item.type) {
              case 'paragraph':
                return (
                  <p key={index} className="text-gray-700 leading-relaxed text-lg">
                    {item.text}
                  </p>
                );
              case 'heading':
                return (
                  <h2 key={index} className="text-2xl font-bold text-gray-900 mt-12 mb-6">
                    {item.text}
                  </h2>
                );
              case 'image':
                return (
                  <figure key={index} className="my-8">
                    <img 
                      src={item.src} 
                      alt={item.caption}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    {item.caption && (
                      <figcaption className="text-center text-gray-600 text-sm mt-2">
                        {item.caption}
                      </figcaption>
                    )}
                  </figure>
                );
              case 'quote':
                return (
                  <blockquote key={index} className="border-l-4 border-[#D4AF37] pl-6 my-8 italic text-gray-700">
                    <p className="text-xl mb-2">"{item.text}"</p>
                    {item.author && (
                      <cite className="text-sm text-gray-600">— {item.author}</cite>
                    )}
                  </blockquote>
                );
              default:
                return null;
            }
          })}
        </div>


        
        {/* Footer */}
        <footer className="mt-16 pt-12 border-t border-gray-200">
          <div className="text-center">
            <div className="mb-8">
              <div className="flex justify-center items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded"></div>
              </div>
              
              <p className="text-gray-600 max-w-md mx-auto">
                Discover the best island hopping routes and hidden beaches across the beautiful Visayas region with our comprehensive travel guides.
              </p>
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
            <Link href="/article/food-guide">
              <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=400&h=200&fit=crop&auto=format"
                  alt="Food Guide"
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <span className="inline-block px-2 py-1 bg-[#D4AF37] text-black text-xs rounded mb-2">
                    Culinary Guide
                  </span>
                  <h4 className="font-semibold text-gray-900 mb-2">Ultimate Filipino Food Guide for Travelers</h4>
                  <p className="text-gray-600 text-sm">Discover authentic Filipino flavors and hidden culinary gems...</p>
                </div>
              </div>
            </Link>
            
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
          </div>
        </div>
      </section>
    </div>
  );
};