import React from 'react';
import { Button } from '@/components/ui/button';
import { useLocation, Link } from 'wouter';

export const ArticleFoodGuidePage = (): JSX.Element => {
  const article = {
    title: "Ultimate Filipino Food Guide for Travelers",
    category: "Culinary Guide",
    author: "Maria Santos",
    date: "January 15, 2025",
    readTime: "12 min read",
    heroImage: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=1200&h=600&fit=crop&auto=format",
    content: [
      {
        type: "paragraph",
        text: "The Philippines offers one of the world's most diverse and flavorful cuisines, blending indigenous ingredients with Spanish, Chinese, and American influences. From street food stalls to high-end restaurants, every meal tells a story of cultural fusion and culinary innovation."
      },
      {
        type: "heading",
        text: "Essential Filipino Dishes Every Traveler Must Try"
      },
      {
        type: "paragraph",
        text: "Adobo, often considered the national dish, showcases the perfect balance of soy sauce, vinegar, and spices. Each region has its own variation, making it a delicious way to explore local flavors across the archipelago."
      },
      {
        type: "image",
        src: "https://images.unsplash.com/photo-1609501676725-7186f34a4bb3?w=800&h=500&fit=crop&auto=format",
        caption: "Traditional Filipino adobo with rice and vegetables"
      },
      {
        type: "heading",
        text: "Regional Specialties Worth the Journey"
      },
      {
        type: "paragraph",
        text: "Cebu's lechon is renowned worldwide for its crispy skin and succulent meat that requires no sauce. Bicol Express from the south brings the heat with its coconut milk and chili base, while Ilocos longganisa offers a unique garlicky sweetness that pairs perfectly with garlic rice."
      },
      {
        type: "quote",
        text: "Food is the thread that weaves Filipino families and communities together, turning every meal into a celebration of culture and connection.",
        author: "Local Food Writer"
      },
      {
        type: "heading",
        text: "Street Food Adventures: A Guide to Safe Eating"
      },
      {
        type: "paragraph",
        text: "Filipino street food offers incredible flavors at budget-friendly prices. Look for stalls with high turnover, fresh ingredients, and locals in line. Popular choices include balut, isaw, and taho – each offering a unique window into Filipino culture and taste preferences."
      }
    ]
  };

  return (
    <div className="min-h-screen view-shell">
      {/* Header */}
      <header className="view-header">
        <div className="flex items-center justify-between">
          {/* Left: Logo placeholder */}
          <div className="w-8 h-8 bg-black" style={{borderRadius: '1px'}}></div>
          
          {/* Center: Navigation */}
          <nav className="flex items-center space-x-12">
            <Link href="/" className="prada-nav text-black hover:text-gray-600 transition-colors">Home</Link>
            <Link href="/trips" className="prada-nav text-gray-700 hover:text-black transition-colors">Trips</Link>
            <Link href="/chats" className="prada-nav text-gray-700 hover:text-black transition-colors">Chats</Link>
            <Link href="/trails" className="prada-nav text-gray-700 hover:text-black transition-colors">Trails</Link>
            <Link href="/story" className="prada-nav text-gray-700 hover:text-black transition-colors">Story</Link>
            <Link href="/shop" className="prada-nav text-gray-700 hover:text-black transition-colors">Shop</Link>
            <Link href="/corporate" className="prada-nav text-gray-700 hover:text-black transition-colors">Corporate</Link>
          </nav>
          
          {/* Right: Buttons and Language */}
          <div className="flex items-center space-x-3">
            <Link href="/login">
              <Button variant="outline" className="prada-button h-9 px-6 text-xs font-light border-black text-black hover:bg-black hover:text-white">
                LOG IN
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="prada-button prada-gold-accent h-9 px-6 text-xs font-light">
                REGISTER
              </Button>
            </Link>
            <span className="text-xs text-gray-500 font-light ml-4">EN</span>
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
            alt="Filipino Food Guide"
            className="w-full h-72 md:h-80 object-cover rounded-lg"
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
                      className="w-full h-52 object-cover rounded-lg"
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
                Discover authentic Filipino cuisine and hidden culinary gems across the archipelago with our comprehensive food guides and local insights.
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
    </div>
  );
};
