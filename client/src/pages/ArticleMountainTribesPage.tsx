import React from 'react';
import { Button } from '@/components/ui/button';
import { useLocation, Link } from 'wouter';

export const ArticleMountainTribesPage = (): JSX.Element => {
  const article = {
    title: "Ancient Traditions of Mountain Tribes",
    category: "Cultural Guide",
    author: "Jose Rizal Jr.",
    date: "January 10, 2025",
    readTime: "8 min read",
    heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop&auto=format",
    content: [
      {
        type: "paragraph",
        text: "Deep within the Cordillera Mountains of Northern Luzon, ancient traditions continue to thrive among indigenous communities who have preserved their cultural heritage for over a thousand years. These mountain tribes offer visitors a rare glimpse into pre-colonial Filipino life, where spirituality, community, and harmony with nature remain central to daily existence."
      },
      {
        type: "heading",
        text: "The Ifugao: Masters of Terraced Agriculture"
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
        text: "The Kalinga: Warriors Turned Peace Keepers"
      },
      {
        type: "paragraph",
        text: "Once known as fierce warriors, the Kalinga people have transformed their warrior tradition into a commitment to peace and cultural preservation. Their intricate body art, traditional textiles, and peace pact ceremonies continue to play vital roles in maintaining harmony between communities."
      },
      {
        type: "quote",
        text: "Our ancestors taught us that the mountain provides for those who respect it, and tradition guides those who honor it.",
        author: "Ifugao Elder"
      },
      {
        type: "heading",
        text: "Preserving Culture Through Responsible Tourism"
      },
      {
        type: "paragraph",
        text: "Responsible cultural tourism provides economic opportunities for mountain communities while ensuring their traditions remain authentic and respected. Visitors learn traditional weaving, participate in harvest festivals, and gain insight into sustainable living practices that have endured for centuries."
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
            alt="Mountain Tribes Cultural Guide"
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
                Explore the rich cultural heritage of Philippine mountain tribes and learn about sustainable tourism practices that support indigenous communities.
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
            
            <Link href="/article/island-hopping">
              <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=200&fit=crop&auto=format"
                  alt="Island Hopping"
                  className="w-full h-32 object-cover"
                />
                <div className="p-4">
                  <span className="inline-block px-2 py-1 bg-[#D4AF37] text-black text-xs rounded mb-2">
                    Adventure Guide
                  </span>
                  <h4 className="font-semibold text-gray-900 mb-2">Best Island Hopping Routes in Visayas</h4>
                  <p className="text-gray-600 text-sm">Explore pristine islands and crystal clear waters across the Visayas region...</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};