import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface NavigationBarProps {
  currentPage?: string;
}

export const NavigationBar = ({ currentPage }: NavigationBarProps): JSX.Element => {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const newQuery = searchQuery.trim();
      setSearchQuery(""); // Clear input after search
      setLocation(`/search?q=${encodeURIComponent(newQuery)}`);
    }
  };

  return (
    <div className="flex items-center justify-center w-full relative">
      {/* Search Bar - Positioned on the left */}
      <form onSubmit={handleSearch} className="hidden xl:flex items-center space-x-2 absolute left-0">
        <Input
          type="text"
          placeholder="Search tours..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64 h-10 text-sm border-[#ece9e9] rounded-full bg-white/90"
          data-testid="input-search"
        />
        <Button
          type="submit"
          size="sm"
          className="h-10 px-5 prada-button prada-gold-accent text-sm"
          data-testid="button-search"
        >
          <Search className="w-4 h-4 mr-1" />
          Search
        </Button>
      </form>

      {/* Navigation Links - Centered */}
      <nav className="flex max-w-full items-center justify-center gap-5 overflow-x-auto whitespace-nowrap px-2 lg:gap-8">
        <Link 
          href="/" 
          className={`prada-nav transition-colors ${
            currentPage === 'home' 
              ? 'text-[#1f2537] underline decoration-[#ff6c2f] underline-offset-8' 
              : 'text-gray-700 hover:text-black'
          }`}
        >
          Home
        </Link>
        <Link 
          href="/trips" 
          className={`prada-nav transition-colors ${
            currentPage === 'trips' 
              ? 'text-[#1f2537] underline decoration-[#ff6c2f] underline-offset-8' 
              : 'text-gray-700 hover:text-black'
          }`}
        >
          Trips
        </Link>
        <Link 
          href="/chats" 
          className={`prada-nav transition-colors ${
            currentPage === 'chats' 
              ? 'text-[#1f2537] underline decoration-[#ff6c2f] underline-offset-8' 
              : 'text-gray-700 hover:text-black'
          }`}
        >
          Chats
        </Link>
        <Link 
          href="/trails" 
          className={`prada-nav transition-colors ${
            currentPage === 'trails' 
              ? 'text-[#1f2537] underline decoration-[#ff6c2f] underline-offset-8' 
              : 'text-gray-700 hover:text-black'
          }`}
        >
          Trails
        </Link>
        <Link 
          href="/story" 
          className={`prada-nav transition-colors ${
            currentPage === 'story' 
              ? 'text-[#1f2537] underline decoration-[#ff6c2f] underline-offset-8' 
              : 'text-gray-700 hover:text-black'
          }`}
        >
          Story
        </Link>
        <Link 
          href="/shop" 
          className={`prada-nav transition-colors ${
            currentPage === 'shop' 
              ? 'text-[#1f2537] underline decoration-[#ff6c2f] underline-offset-8' 
              : 'text-gray-700 hover:text-black'
          }`}
        >
          Shop
        </Link>
        <Link 
          href="/corporate" 
          className={`prada-nav transition-colors ${
            currentPage === 'corporate' 
              ? 'text-[#1f2537] underline decoration-[#ff6c2f] underline-offset-8' 
              : 'text-gray-700 hover:text-black'
          }`}
        >
          Corporate
        </Link>
      </nav>
    </div>
  );
};
