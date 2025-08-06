import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ShoppingCart, Heart, Star, Filter, Search, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import type { Product, Category } from "@shared/schema";

export default function ShopPage() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 20000 });
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Fetch products
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", { 
      category: selectedCategory, 
      search: searchQuery,
      sort: sortBy,
    }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory) params.append("category", selectedCategory.toString());
      if (searchQuery) params.append("search", searchQuery);
      params.append("limit", "50");
      
      const response = await fetch(`/api/products?${params}`);
      return response.json();
    },
  });

  // Get unique brands for filtering
  const brands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesPrice = parseFloat(product.price) >= priceRange.min && parseFloat(product.price) <= priceRange.max;
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand || "");
      return matchesPrice && matchesBrand;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low": return parseFloat(a.price) - parseFloat(b.price);
        case "price-high": return parseFloat(b.price) - parseFloat(a.price);
        case "rating": return parseFloat(b.rating || "0") - parseFloat(a.rating || "0");
        case "name": return a.name.localeCompare(b.name);
        default: return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
      }
    });

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(typeof price === 'string' ? parseFloat(price) : price);
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      onClick={() => setLocation(`/product/${product.slug}`)}
    >
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={product.images?.[0] || "/api/placeholder/300/300"}
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.salePrice && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white">
              SALE
            </Badge>
          )}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-[#D4AF37]">
            {product.name}
          </h3>
          <p className="text-xs text-gray-600 line-clamp-2">{product.shortDescription}</p>
          
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(parseFloat(product.rating || "0"))
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.reviewCount || 0})</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {product.salePrice ? (
                <>
                  <span className="font-bold text-[#D4AF37]">
                    {formatPrice(product.salePrice)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                </>
              ) : (
                <span className="font-bold">{formatPrice(product.price)}</span>
              )}
            </div>
            <Button 
              size="sm" 
              className="bg-[#D4AF37] hover:bg-[#B8941F] text-white h-8"
              onClick={(e) => {
                e.stopPropagation();
                // Add to cart logic here
              }}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ProductListItem = ({ product }: { product: Product }) => (
    <Card 
      className="cursor-pointer transition-all duration-300 hover:shadow-md"
      onClick={() => setLocation(`/product/${product.slug}`)}
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          <img
            src={product.images?.[0] || "/api/placeholder/150/150"}
            alt={product.name}
            className="w-24 h-24 object-cover rounded-lg"
          />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold hover:text-[#D4AF37]">{product.name}</h3>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{product.shortDescription}</p>
            
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(parseFloat(product.rating || "0"))
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">({product.reviewCount || 0})</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {product.salePrice ? (
                  <>
                    <span className="font-bold text-[#D4AF37] text-lg">
                      {formatPrice(product.salePrice)}
                    </span>
                    <span className="text-gray-500 line-through">
                      {formatPrice(product.price)}
                    </span>
                  </>
                ) : (
                  <span className="font-bold text-lg">{formatPrice(product.price)}</span>
                )}
              </div>
              <Button 
                className="bg-[#D4AF37] hover:bg-[#B8941F] text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  // Add to cart logic here
                }}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Shop</h1>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart (0)
              </Button>
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile Filter Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterSidebar 
                    categories={categories}
                    brands={brands}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    selectedBrands={selectedBrands}
                    setSelectedBrands={setSelectedBrands}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-64 space-y-6">
            <FilterSidebar 
              categories={categories}
              brands={brands}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">
                Showing {filteredProducts.length} products
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-lg" />
                    <CardContent className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded" />
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }>
                {filteredProducts.map((product) => (
                  viewMode === "grid" ? 
                    <ProductCard key={product.id} product={product} /> :
                    <ProductListItem key={product.id} product={product} />
                ))}
              </div>
            )}

            {filteredProducts.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSelectedCategory(null);
                    setSearchQuery("");
                    setSelectedBrands([]);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface FilterSidebarProps {
  categories: Category[];
  brands: string[];
  selectedCategory: number | null;
  setSelectedCategory: (category: number | null) => void;
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
  priceRange: { min: number; max: number };
  setPriceRange: (range: { min: number; max: number }) => void;
}

function FilterSidebar({
  categories,
  brands,
  selectedCategory,
  setSelectedCategory,
  selectedBrands,
  setSelectedBrands,
  priceRange,
  setPriceRange,
}: FilterSidebarProps) {
  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand]);
    } else {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    }
  };

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
              selectedCategory === null 
                ? "bg-[#D4AF37] text-white" 
                : "hover:bg-gray-100"
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                selectedCategory === category.id 
                  ? "bg-[#D4AF37] text-white" 
                  : "hover:bg-gray-100"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
            />
            <Input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPriceRange({ min: 0, max: 2000 })}
            >
              Under ₱2,000
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPriceRange({ min: 2000, max: 5000 })}
            >
              ₱2K - ₱5K
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPriceRange({ min: 5000, max: 10000 })}
            >
              ₱5K - ₱10K
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPriceRange({ min: 10000, max: 20000 })}
            >
              ₱10K+
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Brands */}
      {brands.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Brands</h3>
          <div className="space-y-2">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={selectedBrands.includes(brand)}
                  onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
                />
                <label
                  htmlFor={`brand-${brand}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {brand}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}