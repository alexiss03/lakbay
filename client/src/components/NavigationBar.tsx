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
      <form onSubmit={handleSearch} className="flex items-center space-x-2 absolute left-0">
        <Input
          type="text"
          placeholder="Search tours..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64 h-9 text-sm border-gray-300 focus:border-black focus:ring-0"
          data-testid="input-search"
        />
        <Button
          type="submit"
          size="sm"
          className="h-9 px-4 bg-black hover:bg-gray-800 text-white text-sm"
          data-testid="button-search"
        >
          <Search className="w-4 h-4 mr-1" />
          Search
        </Button>
      </form>

      {/* Navigation Links - Centered */}
      <nav className="flex items-center justify-center space-x-8">
        <Link 
          href="/" 
          className={`prada-nav transition-colors ${
            currentPage === 'home' 
              ? 'text-black hover:text-gray-600' 
              : 'text-gray-700 hover:text-black'
          }`}
        >
          Home
        </Link>
        <Link 
          href="/trips" 
          className={`prada-nav transition-colors ${
            currentPage === 'trips' 
              ? 'text-black hover:text-gray-600' 
              : 'text-gray-700 hover:text-black'
          }`}
        >
          Trips
        </Link>
        <Link 
          href="/chats" 
          className={`prada-nav transition-colors ${
            currentPage === 'chats' 
              ? 'text-black hover:text-gray-600' 
              : 'text-gray-700 hover:text-black'
          }`}
        >
          Chats
        </Link>
        <Link 
          href="/trails" 
          className={`prada-nav transition-colors ${
            currentPage === 'trails' 
              ? 'text-black hover:text-gray-600' 
              : 'text-gray-700 hover:text-black'
          }`}
        >
          Trails
        </Link>
        <a 
          href="#" 
          className={`prada-nav transition-colors ${
            currentPage === 'story' 
              ? 'text-black hover:text-gray-600' 
              : 'text-gray-700 hover:text-black'
          }`}
        >
          Story
        </a>
        <Link 
          href="/shop" 
          className={`prada-nav transition-colors ${
            currentPage === 'shop' 
              ? 'text-black hover:text-gray-600' 
              : 'text-gray-700 hover:text-black'
          }`}
        >
          Shop
        </Link>
        <a 
          href="#" 
          className={`prada-nav transition-colors ${
            currentPage === 'corporate' 
              ? 'text-black hover:text-gray-600' 
              : 'text-gray-700 hover:text-black'
          }`}
        >
          Corporate
        </a>
      </nav>
    </div>
  );
};