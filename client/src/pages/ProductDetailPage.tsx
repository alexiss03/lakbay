import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useParams } from "wouter";
import { ArrowLeft, ShoppingCart, Star, Truck, Shield, RotateCcw, Heart, Share2, Minus, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  sku: string;
  price: string;
  stock: number;
  images: string[];
  tags: string[];
  status: string;
  weight?: string;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const shopId = user?.id ? `shop_${user.id}` : "shop_1";
  const customerId = user?.id ? String(user.id) : "guest_user";
  const customerName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username
    : "Guest Customer";
  const customerEmail = user?.email || "guest@lakbay.local";

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: [`/api/shop/products/${shopId}`],
  });

  const product = (products as Product[]).find((p: Product) => p.id === id);

  const addToCartMutation = useMutation({
    mutationFn: async (payload: { productId: string; quantity: number }) => {
      const response = await apiRequest("POST", "/api/shop/cart", {
        shopId,
        userId: customerId,
        productId: payload.productId,
        quantity: payload.quantity,
      });
      return response.json();
    },
    onSuccess: () => {
      if (!product) return;
      toast({
        title: "Added to Cart",
        description: `${quantity} × ${product.name} added to your cart`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Unable to add to cart",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const buyNowMutation = useMutation({
    mutationFn: async (payload: { productId: string; quantity: number }) => {
      const response = await apiRequest("POST", "/api/shop/checkout", {
        shopId,
        userId: customerId,
        customerName,
        customerEmail,
        items: [
          {
            productId: payload.productId,
            quantity: payload.quantity,
          },
        ],
        paymentMethod: "cod",
      });
      return response.json();
    },
    onSuccess: (order: { orderNumber?: string }) => {
      toast({
        title: "Order Created",
        description: `Checkout started for ${order.orderNumber || "your order"}.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Checkout failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddToCart = () => {
    if (!product) return;
    addToCartMutation.mutate({
      productId: product.id,
      quantity,
    });
  };

  const handleBuyNow = () => {
    if (!product) return;
    buyNowMutation.mutate({
      productId: product.id,
      quantity,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen view-shell p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-32 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-96 bg-gray-300 rounded-lg"></div>
                <div className="flex gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-20 w-20 bg-gray-300 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-300 rounded w-3/4"></div>
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                <div className="h-10 bg-gray-300 rounded w-1/3"></div>
                <div className="h-32 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen view-shell flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link href="/shop">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=600&fit=crop'];
  const inStock = product.stock > 0;

  return (
    <div className="min-h-screen view-shell">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span>→</span>
          <Link href="/shop" className="hover:text-gray-900">Shop</Link>
          <span>→</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden border">
              <img loading="lazy" decoding="async"
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=600&fit=crop';
                }}
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img loading="lazy" decoding="async"
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <Badge variant="outline" className="mb-2">{product.category}</Badge>
                  <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                  <p className="text-lg text-gray-600">{product.brand}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={isFavorite ? 'text-red-500' : ''}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(42 reviews)</span>
              </div>

              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  ₱{parseFloat(product.price).toLocaleString()}
                </span>
                <span className={`text-sm font-medium ${inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {inStock ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Product Details */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Product Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">SKU:</span>
                  <span className="ml-2 font-medium">{product.sku}</span>
                </div>
                <div>
                  <span className="text-gray-600">Brand:</span>
                  <span className="ml-2 font-medium">{product.brand}</span>
                </div>
                {product.weight && (
                  <div>
                    <span className="text-gray-600">Weight:</span>
                    <span className="ml-2 font-medium">{product.weight} kg</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-600">Category:</span>
                  <span className="ml-2 font-medium">{product.category}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Quantity</label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <span className="text-sm text-gray-600">
                    Max: {product.stock}
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!inStock || addToCartMutation.isPending}
                  variant="outline"
                  className="flex-1"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
                </Button>
                <Button
                  onClick={handleBuyNow}
                  disabled={!inStock || buyNowMutation.isPending}
                  className="flex-1"
                >
                  {buyNowMutation.isPending ? "Processing..." : "Buy Now"}
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Truck className="w-4 h-4" />
                  <span>Free shipping over ₱2,000</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <RotateCcw className="w-4 h-4" />
                  <span>30-day returns</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span>2-year warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
