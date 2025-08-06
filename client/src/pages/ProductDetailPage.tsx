import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Star, Heart, ShoppingCart, Minus, Plus, ArrowLeft, Share2, Truck, Shield, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarContent, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Product, ProductVariant, Review } from "@shared/schema";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: productData, isLoading } = useQuery<Product & { variants: ProductVariant[], reviews: Review[] }>({
    queryKey: ["/api/products/slug", slug],
    queryFn: async () => {
      const response = await fetch(`/api/products/slug/${slug}`);
      if (!response.ok) throw new Error("Product not found");
      return response.json();
    },
    enabled: !!slug,
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, variantId, quantity, price }: { 
      productId: number; 
      variantId?: number; 
      quantity: number; 
      price: number;
    }) => {
      return apiRequest("POST", "/api/cart", {
        userId: 1, // TODO: Get from auth context
        productId,
        variantId,
        quantity,
        price,
      });
    },
    onSuccess: () => {
      toast({
        title: "Added to Cart",
        description: "Product has been added to your cart successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add product to cart. Please try again.",
        variant: "destructive",
      });
    },
  });

  const addToWishlistMutation = useMutation({
    mutationFn: async ({ productId }: { productId: number }) => {
      return apiRequest("POST", "/api/wishlist", {
        userId: 1, // TODO: Get from auth context
        productId,
      });
    },
    onSuccess: () => {
      toast({
        title: "Added to Wishlist",
        description: "Product has been saved to your wishlist!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add to wishlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-lg" />
              <div className="flex gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-gray-200 rounded" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-8 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-6 bg-gray-200 rounded w-1/2" />
              <div className="h-12 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
        <Button onClick={() => setLocation("/shop")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Shop
        </Button>
      </div>
    );
  }

  const formatPrice = (price: string | number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(typeof price === 'string' ? parseFloat(price) : price);
  };

  const getCurrentPrice = () => {
    if (selectedVariant?.price) {
      return parseFloat(selectedVariant.price);
    }
    return parseFloat(productData.salePrice || productData.price);
  };

  const getOriginalPrice = () => {
    if (selectedVariant?.price) {
      return parseFloat(selectedVariant.price);
    }
    return parseFloat(productData.price);
  };

  const isOnSale = () => {
    return !!productData.salePrice && !selectedVariant?.price;
  };

  const handleAddToCart = () => {
    addToCartMutation.mutate({
      productId: productData.id,
      variantId: selectedVariant?.id,
      quantity,
      price: getCurrentPrice().toString(),
    });
  };

  const handleAddToWishlist = () => {
    addToWishlistMutation.mutate({ productId: productData.id });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
        <button onClick={() => setLocation("/shop")} className="hover:text-[#D4AF37]">
          Shop
        </button>
        <span>/</span>
        <span className="text-gray-900">{productData.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={productData.images?.[selectedImage] || "/api/placeholder/600/600"}
              alt={productData.name}
              className="w-full h-full object-cover"
            />
          </div>
          {productData.images && productData.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {productData.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${
                    selectedImage === index ? "border-[#D4AF37]" : "border-gray-200"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${productData.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{productData.name}</h1>
            <p className="text-gray-600">{productData.shortDescription}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {renderStars(parseFloat(productData.rating || "0"))}
              <span className="text-sm font-medium ml-1">
                {productData.rating || "0"}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              ({productData.reviewCount || 0} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-[#D4AF37]">
              {formatPrice(getCurrentPrice())}
            </span>
            {isOnSale() && (
              <span className="text-xl text-gray-500 line-through">
                {formatPrice(getOriginalPrice())}
              </span>
            )}
            {isOnSale() && (
              <Badge className="bg-red-500 text-white">
                SALE
              </Badge>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              (productData.stock || 0) > 0 ? "bg-green-500" : "bg-red-500"
            }`} />
            <span className={`text-sm font-medium ${
              (productData.stock || 0) > 0 ? "text-green-600" : "text-red-600"
            }`}>
              {(productData.stock || 0) > 0 ? `${productData.stock} in stock` : "Out of stock"}
            </span>
          </div>

          {/* Color Selection */}
          {productData.colors && productData.colors.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">Color:</h3>
              <div className="flex gap-2">
                {productData.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-md text-sm transition-colors ${
                      selectedColor === color 
                        ? "border-[#D4AF37] bg-[#D4AF37] text-white" 
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {productData.sizes && productData.sizes.length > 0 && (
            <div>
              <h3 className="font-medium mb-3">Size:</h3>
              <div className="flex gap-2">
                {productData.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md text-sm transition-colors ${
                      selectedSize === size 
                        ? "border-[#D4AF37] bg-[#D4AF37] text-white" 
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <h3 className="font-medium mb-3">Quantity:</h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= (productData.stock || 0)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-sm text-gray-500">
                Max: {productData.stock || 0}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              className="flex-1 bg-[#D4AF37] hover:bg-[#B8941F] text-white"
              onClick={handleAddToCart}
              disabled={(productData.stock || 0) === 0 || addToCartMutation.isPending}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
            </Button>
            <Button
              variant="outline"
              onClick={handleAddToWishlist}
              disabled={addToWishlistMutation.isPending}
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Features */}
          <div className="flex items-center gap-6 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Truck className="h-4 w-4" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="h-4 w-4" />
              <span>1 Year Warranty</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <RotateCcw className="h-4 w-4" />
              <span>30 Day Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({productData.reviewCount || 0})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="description" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-700 leading-relaxed">
                {productData.description}
              </p>
              {productData.features && productData.features.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Key Features:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {productData.features.map((feature, index) => (
                      <li key={index} className="text-gray-700">{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="specifications" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Product Details</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Brand:</dt>
                      <dd className="font-medium">{productData.brand || "N/A"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">SKU:</dt>
                      <dd className="font-medium">{productData.sku || "N/A"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Weight:</dt>
                      <dd className="font-medium">{productData.weight || "N/A"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Dimensions:</dt>
                      <dd className="font-medium">{productData.dimensions || "N/A"}</dd>
                    </div>
                  </dl>
                </div>
                {productData.materials && productData.materials.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Materials</h3>
                    <ul className="space-y-1">
                      {productData.materials.map((material, index) => (
                        <li key={index} className="text-gray-700">• {material}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reviews" className="mt-6">
          <div className="space-y-6">
            {productData.reviews && productData.reviews.length > 0 ? (
              productData.reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {review.userId?.toString().slice(0, 2) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">Customer Review</p>
                          <div className="flex items-center gap-1">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt!).toLocaleDateString()}
                      </span>
                    </div>
                    {review.title && (
                      <h4 className="font-medium mb-2">{review.title}</h4>
                    )}
                    <p className="text-gray-700">{review.comment}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}