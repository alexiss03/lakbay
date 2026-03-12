import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  Plus,
  Edit,
  Truck,
  Eye,
  Search,
  Filter,
  Package2,
  ShoppingBag,
  BarChart3,
  Grid3X3,
  List,
  Upload,
  X,
  ImagePlus
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string;
  brand: string | null;
  sku: string;
  price: string;
  costPrice: string;
  stock: number;
  lowStockThreshold: number;
  images: string[];
  weight: string | null;
  dimensions: { length: number; width: number; height: number } | null;
  status: 'active' | 'inactive' | 'discontinued';
  tags: string[];
  shopId: string;
  createdAt: string;
  updatedAt: string;
}

interface ShopOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  shippingAddress: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
  items: {
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  subtotal: string;
  shippingFee: string;
  tax: string;
  total: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string | null;
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingStatus: 'not_shipped' | 'preparing' | 'shipped' | 'delivered';
  trackingNumber: string | null;
  shippingProvider: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

const ShopDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<ShopOrder | null>(null);
  const [productViewMode, setProductViewMode] = useState<'card' | 'list'>('card');
  const [orderViewMode, setOrderViewMode] = useState<'card' | 'list'>('card');
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: 'electronics',
    brand: '',
    sku: '',
    price: '',
    costPrice: '',
    stock: '',
    lowStockThreshold: '5',
    weight: '',
    tags: '',
    images: [] as string[]
  });
  const [editProduct, setEditProduct] = useState({
    id: '',
    name: '',
    description: '',
    category: 'electronics',
    brand: '',
    sku: '',
    price: '',
    costPrice: '',
    stock: '',
    lowStockThreshold: '5',
    weight: '',
    tags: '',
    images: [] as string[]
  });
  const [stockUpdate, setStockUpdate] = useState({
    quantity: '',
    type: 'in',
    reason: 'purchase',
    notes: ''
  });
  const [shippingInfo, setShippingInfo] = useState({
    trackingNumber: '',
    shippingProvider: '',
    notes: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Current shop ID - defaults to demo id when auth context is unavailable
  const currentShopId = user?.id ? `shop_${user.id}` : "shop_1";

  // Fetch shop analytics
  const { data: stats, isLoading: statsLoading } = useQuery<any>({
    queryKey: ['/api/shop/analytics', currentShopId],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/shop/analytics/${currentShopId}`);
      return await response.json();
    },
  });

  // Fetch products
  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/shop/products', currentShopId, selectedFilter, searchTerm],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/shop/products/${currentShopId}?category=${selectedFilter}&search=${searchTerm}&limit=50`);
      return await response.json();
    },
  });

  // Fetch orders
  const { data: orders = [], isLoading: ordersLoading } = useQuery<ShopOrder[]>({
    queryKey: ['/api/shop/orders', currentShopId],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/shop/orders/${currentShopId}?limit=50`);
      return await response.json();
    },
  });

  // Mutations
  const createProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      const response = await apiRequest('POST', '/api/shop/products', { ...productData, shopId: currentShopId });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/shop/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/shop/analytics'] });
      setShowAddProductModal(false);
      setNewProduct({
        name: '',
        description: '',
        category: 'electronics',
        brand: '',
        sku: '',
        price: '',
        costPrice: '',
        stock: '',
        lowStockThreshold: '5',
        weight: '',
        tags: '',
        images: []
      });
      toast({
        title: "Success",
        description: "Product created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create product",
        variant: "destructive",
      });
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: async (productData: any) => {
      const response = await apiRequest('PUT', `/api/shop/products/${productData.id}`, { ...productData, shopId: currentShopId });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/shop/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/shop/analytics'] });
      setShowEditProductModal(false);
      setSelectedProduct(null);
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update product",
        variant: "destructive",
      });
    }
  });

  const updateStockMutation = useMutation({
    mutationFn: async ({ productId, stockData }: { productId: string; stockData: any }) => {
      const response = await apiRequest('PUT', `/api/shop/products/${productId}/stock`, stockData);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/shop/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/shop/analytics'] });
      setShowStockModal(false);
      setSelectedProduct(null);
      setStockUpdate({ quantity: '', type: 'in', reason: 'purchase', notes: '' });
      toast({
        title: "Success",
        description: "Stock updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update stock",
        variant: "destructive",
      });
    }
  });

  const shipOrderMutation = useMutation({
    mutationFn: async ({ orderId, shippingData }: { orderId: string; shippingData: any }) => {
      const response = await apiRequest('POST', `/api/shop/orders/${orderId}/ship`, shippingData);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/shop/orders'] });
      queryClient.invalidateQueries({ queryKey: ['/api/shop/analytics'] });
      setShowShippingModal(false);
      setSelectedOrder(null);
      setShippingInfo({ trackingNumber: '', shippingProvider: '', notes: '' });
      toast({
        title: "Success",
        description: "Order shipped successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to ship order",
        variant: "destructive",
      });
    }
  });

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'discontinued': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockStatus = (stock: number, threshold: number) => {
    if (stock === 0) return { status: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (stock <= threshold) return { status: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { status: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProduct.name || !newProduct.sku || !newProduct.price || !newProduct.costPrice) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const productData = {
      ...newProduct,
      price: parseFloat(newProduct.price),
      costPrice: parseFloat(newProduct.costPrice),
      stock: parseInt(newProduct.stock || '0'),
      lowStockThreshold: parseInt(newProduct.lowStockThreshold),
      weight: parseFloat(newProduct.weight || '0'),
      tags: newProduct.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      images: newProduct.images,
      dimensions: null
    };

    createProductMutation.mutate(productData);
  };

  const handleEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editProduct.name || !editProduct.sku || !editProduct.price || !editProduct.costPrice) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const productData = {
      ...editProduct,
      price: parseFloat(editProduct.price),
      costPrice: parseFloat(editProduct.costPrice),
      stock: parseInt(editProduct.stock || '0'),
      lowStockThreshold: parseInt(editProduct.lowStockThreshold),
      weight: parseFloat(editProduct.weight || '0'),
      tags: editProduct.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      images: editProduct.images,
      dimensions: null
    };

    updateProductMutation.mutate(productData);
  };

  const openEditModal = (product: Product) => {
    setEditProduct({
      id: product.id,
      name: product.name,
      description: product.description || '',
      category: product.category,
      brand: product.brand || '',
      sku: product.sku,
      price: product.price,
      costPrice: product.costPrice,
      stock: product.stock.toString(),
      lowStockThreshold: product.lowStockThreshold.toString(),
      weight: product.weight || '',
      tags: product.tags.join(', '),
      images: product.images
    });
    setSelectedProduct(product);
    setShowEditProductModal(true);
  };

  const addImageUrl = (imageUrl: string, isEdit: boolean = false) => {
    if (isEdit) {
      if (editProduct.images.length < 20 && imageUrl.trim()) {
        setEditProduct({
          ...editProduct,
          images: [...editProduct.images, imageUrl.trim()]
        });
      }
    } else {
      if (newProduct.images.length < 20 && imageUrl.trim()) {
        setNewProduct({
          ...newProduct,
          images: [...newProduct.images, imageUrl.trim()]
        });
      }
    }
  };

  const removeImage = (index: number, isEdit: boolean = false) => {
    if (isEdit) {
      setEditProduct({
        ...editProduct,
        images: editProduct.images.filter((_, i) => i !== index)
      });
    } else {
      setNewProduct({
        ...newProduct,
        images: newProduct.images.filter((_, i) => i !== index)
      });
    }
  };

  const handleStockUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProduct || !stockUpdate.quantity) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    updateStockMutation.mutate({
      productId: selectedProduct.id,
      stockData: {
        ...stockUpdate,
        quantity: parseInt(stockUpdate.quantity)
      }
    });
  };

  const handleShipOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOrder || !shippingInfo.trackingNumber || !shippingInfo.shippingProvider) {
      toast({
        title: "Error",
        description: "Please fill in tracking number and shipping provider",
        variant: "destructive",
      });
      return;
    }

    shipOrderMutation.mutate({
      orderId: selectedOrder.id,
      shippingData: shippingInfo
    });
  };

  if (statsLoading) {
    return (
      <div className="min-h-screen view-shell flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen view-shell">
      {/* Header */}
      <div className="view-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Package className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Shop Manager</h1>
                <p className="text-sm text-gray-600">Manage products, inventory & orders</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setShowAddProductModal(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span>{stats?.activeProducts || 0} active</span>
                <span>•</span>
                <span className="text-red-600">{stats?.outOfStockProducts || 0} out of stock</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₱{(stats?.monthlyRevenue || 0).toLocaleString()}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span>{stats?.monthlySales || 0} sales this month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.pendingOrders || 0}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <span>{stats?.processingOrders || 0} processing</span>
                <span>•</span>
                <span>{stats?.shippingOrders || 0} shipping</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats?.lowStockProducts || 0}</div>
              <div className="text-xs text-muted-foreground">
                Low stock items need restocking
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Low Stock Alert */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <span>Stock Alerts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(products as Product[]).filter(p => p.stock <= p.lowStockThreshold).slice(0, 5).map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{product.stock} left</p>
                          <Button 
                            size="sm" 
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowStockModal(true);
                            }}
                          >
                            Add Stock
                          </Button>
                        </div>
                      </div>
                    ))}
                    {(products as Product[]).filter(p => p.stock <= p.lowStockThreshold).length === 0 && (
                      <p className="text-sm text-gray-500">No low stock items</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ShoppingBag className="w-5 h-5 text-blue-500" />
                    <span>Recent Orders</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(orders as ShopOrder[]).slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{order.orderNumber}</p>
                          <p className="text-sm text-gray-600">{order.customerName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">₱{parseFloat(order.total).toLocaleString()}</p>
                          <Badge className={getStatusColor(order.orderStatus)}>
                            {order.orderStatus}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {(orders as ShopOrder[]).length === 0 && (
                      <p className="text-sm text-gray-500">No recent orders</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="footwear">Footwear</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="home">Home & Garden</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2">
                <Button
                  variant={productViewMode === 'card' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setProductViewMode('card')}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={productViewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setProductViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Products Display */}
            {productViewMode === 'card' ? (
              /* Card View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productsLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded"></div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  (products as Product[]).map((product) => {
                    const stockStatus = getStockStatus(product.stock, product.lowStockThreshold);
                    return (
                      <Card key={product.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          {/* Product Image */}
                          {product.images && product.images.length > 0 && (
                            <div className="mb-4">
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-32 object-cover rounded-lg"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                              {product.images.length > 1 && (
                                <div className="mt-2 flex space-x-1">
                                  {product.images.slice(1, 4).map((img, i) => (
                                    <img
                                      key={i}
                                      src={img}
                                      alt={`${product.name} ${i + 2}`}
                                      className="w-8 h-8 object-cover rounded"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                      }}
                                    />
                                  ))}
                                  {product.images.length > 4 && (
                                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-xs">
                                      +{product.images.length - 4}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{product.name}</h3>
                              <p className="text-sm text-gray-600 mb-2">{product.brand} • {product.sku}</p>
                              {product.description && (
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                              )}
                            </div>
                            <Badge className={getStatusColor(product.status)}>
                              {product.status}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                              <span>Price:</span>
                              <span className="font-medium">₱{parseFloat(product.price).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span>Stock:</span>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{product.stock} units</span>
                                <Badge className={stockStatus.color}>
                                  {stockStatus.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Category:</span>
                              <span className="capitalize">{product.category}</span>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedProduct(product);
                                setShowStockModal(true);
                              }}
                              className="flex-1"
                            >
                              <Package className="w-4 h-4 mr-2" />
                              Stock
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => openEditModal(product)}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            ) : (
              /* List View */
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-4 font-medium">Product</th>
                          <th className="text-left p-4 font-medium">SKU</th>
                          <th className="text-left p-4 font-medium">Category</th>
                          <th className="text-left p-4 font-medium">Price</th>
                          <th className="text-left p-4 font-medium">Stock</th>
                          <th className="text-left p-4 font-medium">Status</th>
                          <th className="text-left p-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productsLoading ? (
                          Array.from({ length: 5 }).map((_, i) => (
                            <tr key={i} className="border-t animate-pulse">
                              <td className="p-4">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                              </td>
                              <td className="p-4">
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                              </td>
                              <td className="p-4">
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                              </td>
                              <td className="p-4">
                                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                              </td>
                              <td className="p-4">
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                              </td>
                              <td className="p-4">
                                <div className="h-6 bg-gray-200 rounded w-16"></div>
                              </td>
                              <td className="p-4">
                                <div className="h-8 bg-gray-200 rounded w-20"></div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          (products as Product[]).map((product) => {
                            const stockStatus = getStockStatus(product.stock, product.lowStockThreshold);
                            return (
                              <tr key={product.id} className="border-t hover:bg-gray-50">
                                <td className="p-4">
                                  <div className="flex items-center space-x-3">
                                    {product.images && product.images.length > 0 && (
                                      <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="w-10 h-10 object-cover rounded"
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                      />
                                    )}
                                    <div>
                                      <p className="font-medium">{product.name}</p>
                                      <p className="text-sm text-gray-600">{product.brand}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4 text-sm">{product.sku}</td>
                                <td className="p-4 text-sm capitalize">{product.category}</td>
                                <td className="p-4 text-sm font-medium">₱{parseFloat(product.price).toLocaleString()}</td>
                                <td className="p-4">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium">{product.stock}</span>
                                    <Badge className={stockStatus.color}>
                                      {stockStatus.status}
                                    </Badge>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <Badge className={getStatusColor(product.status)}>
                                    {product.status}
                                  </Badge>
                                </td>
                                <td className="p-4">
                                  <div className="flex space-x-2">
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => {
                                        setSelectedProduct(product);
                                        setShowStockModal(true);
                                      }}
                                    >
                                      <Package className="w-4 h-4" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => openEditModal(product)}
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                  {(products as Product[]).length === 0 && !productsLoading && (
                    <div className="text-center py-8 text-gray-500">
                      No products found
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Order Management</CardTitle>
                  <CardDescription>
                    Manage customer orders and shipping
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={orderViewMode === 'card' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setOrderViewMode('card')}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={orderViewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setOrderViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {orderViewMode === 'card' ? (
                  /* Card View for Orders */
                  <div className="space-y-4">
                    {ordersLoading ? (
                      <div className="animate-pulse space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="h-20 bg-gray-200 rounded"></div>
                        ))}
                      </div>
                    ) : (
                      (orders as ShopOrder[]).map((order) => (
                        <div key={order.id} className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{order.orderNumber}</h3>
                              <p className="text-sm text-gray-600">{order.customerName} • {order.customerEmail}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(order.createdAt).toLocaleDateString()} • ₱{parseFloat(order.total).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Badge className={getStatusColor(order.paymentStatus)}>
                                {order.paymentStatus}
                              </Badge>
                              <Badge className={getStatusColor(order.orderStatus)}>
                                {order.orderStatus}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="text-sm text-gray-600">
                            <p><strong>Items:</strong> {order.items.map((item: any) => `${item.productName} (${item.quantity}x)`).join(', ')}</p>
                            <p><strong>Address:</strong> {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.province}</p>
                            {order.trackingNumber && (
                              <p><strong>Tracking:</strong> {order.trackingNumber} ({order.shippingProvider})</p>
                            )}
                          </div>

                          <div className="flex space-x-2 pt-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                            {order.paymentStatus === 'paid' && order.shippingStatus !== 'shipped' && (
                              <Button 
                                size="sm"
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setShowShippingModal(true);
                                }}
                              >
                                <Truck className="w-4 h-4 mr-2" />
                                Ship Order
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                    {(orders as ShopOrder[]).length === 0 && !ordersLoading && (
                      <div className="text-center py-8 text-gray-500">
                        No orders found
                      </div>
                    )}
                  </div>
                ) : (
                  /* List View for Orders */
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-4 font-medium">Order</th>
                          <th className="text-left p-4 font-medium">Customer</th>
                          <th className="text-left p-4 font-medium">Date</th>
                          <th className="text-left p-4 font-medium">Total</th>
                          <th className="text-left p-4 font-medium">Payment</th>
                          <th className="text-left p-4 font-medium">Status</th>
                          <th className="text-left p-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ordersLoading ? (
                          Array.from({ length: 5 }).map((_, i) => (
                            <tr key={i} className="border-t animate-pulse">
                              <td className="p-4">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                              </td>
                              <td className="p-4">
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                              </td>
                              <td className="p-4">
                                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                              </td>
                              <td className="p-4">
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                              </td>
                              <td className="p-4">
                                <div className="h-6 bg-gray-200 rounded w-16"></div>
                              </td>
                              <td className="p-4">
                                <div className="h-6 bg-gray-200 rounded w-16"></div>
                              </td>
                              <td className="p-4">
                                <div className="h-8 bg-gray-200 rounded w-20"></div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          (orders as ShopOrder[]).map((order) => (
                            <tr key={order.id} className="border-t hover:bg-gray-50">
                              <td className="p-4">
                                <div>
                                  <p className="font-medium">{order.orderNumber}</p>
                                  <p className="text-xs text-gray-600">
                                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                  </p>
                                </div>
                              </td>
                              <td className="p-4">
                                <div>
                                  <p className="text-sm font-medium">{order.customerName}</p>
                                  <p className="text-xs text-gray-600">{order.customerEmail}</p>
                                </div>
                              </td>
                              <td className="p-4 text-sm">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </td>
                              <td className="p-4 text-sm font-medium">
                                ₱{parseFloat(order.total).toLocaleString()}
                              </td>
                              <td className="p-4">
                                <Badge className={getStatusColor(order.paymentStatus)}>
                                  {order.paymentStatus}
                                </Badge>
                              </td>
                              <td className="p-4">
                                <Badge className={getStatusColor(order.orderStatus)}>
                                  {order.orderStatus}
                                </Badge>
                              </td>
                              <td className="p-4">
                                <div className="flex space-x-2">
                                  <Button size="sm" variant="outline">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  {order.paymentStatus === 'paid' && order.shippingStatus !== 'shipped' && (
                                    <Button 
                                      size="sm"
                                      onClick={() => {
                                        setSelectedOrder(order);
                                        setShowShippingModal(true);
                                      }}
                                    >
                                      <Truck className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                    {(orders as ShopOrder[]).length === 0 && !ordersLoading && (
                      <div className="text-center py-8 text-gray-500">
                        No orders found
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Product Modal */}
      <Dialog open={showAddProductModal} onOpenChange={setShowAddProductModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="footwear">Footwear</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="home">Home & Garden</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={newProduct.brand}
                  onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (₱) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="costPrice">Cost Price (₱) *</Label>
                <Input
                  id="costPrice"
                  type="number"
                  step="0.01"
                  value={newProduct.costPrice}
                  onChange={(e) => setNewProduct({...newProduct, costPrice: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="stock">Initial Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="lowStockThreshold">Low Stock Alert</Label>
                <Input
                  id="lowStockThreshold"
                  type="number"
                  value={newProduct.lowStockThreshold}
                  onChange={(e) => setNewProduct({...newProduct, lowStockThreshold: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  value={newProduct.weight}
                  onChange={(e) => setNewProduct({...newProduct, weight: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={newProduct.tags}
                onChange={(e) => setNewProduct({...newProduct, tags: e.target.value})}
                placeholder="smartphone, premium, apple"
              />
            </div>

            {/* Image Upload Section */}
            <div className="space-y-3">
              <Label>Product Images (up to 20)</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter image URL"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      addImageUrl(input.value, false);
                      input.value = '';
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    const input = (e.target as HTMLElement).parentNode?.querySelector('input') as HTMLInputElement;
                    if (input?.value) {
                      addImageUrl(input.value, false);
                      input.value = '';
                    }
                  }}
                >
                  <ImagePlus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
              {newProduct.images.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {newProduct.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Product ${index + 1}`}
                        className="w-full h-20 object-cover rounded border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiAxNkwyIDZIMjJMMTIgMTZaIiBmaWxsPSIjOUIxMDFEIi8+Cjx0ZXh0IHg9IjEyIiB5PSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSI4IiBmaWxsPSIjOUIxMDFEIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+Cjwvc3ZnPg==';
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index, false)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-sm text-gray-500">{newProduct.images.length}/20 images added</p>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowAddProductModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createProductMutation.isPending}>
                {createProductMutation.isPending ? 'Creating...' : 'Create Product'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Stock Update Modal */}
      <Dialog open={showStockModal} onOpenChange={setShowStockModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Stock - {selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleStockUpdate} className="space-y-4">
            <div className="text-sm text-gray-600">
              Current Stock: <strong>{selectedProduct?.stock} units</strong>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={stockUpdate.quantity}
                  onChange={(e) => setStockUpdate({...stockUpdate, quantity: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={stockUpdate.type} onValueChange={(value) => setStockUpdate({...stockUpdate, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in">Add Stock</SelectItem>
                    <SelectItem value="out">Remove Stock</SelectItem>
                    <SelectItem value="adjustment">Set Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="reason">Reason</Label>
              <Select value={stockUpdate.reason} onValueChange={(value) => setStockUpdate({...stockUpdate, reason: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="return">Return</SelectItem>
                  <SelectItem value="damaged">Damaged</SelectItem>
                  <SelectItem value="adjustment">Adjustment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={stockUpdate.notes}
                onChange={(e) => setStockUpdate({...stockUpdate, notes: e.target.value})}
                rows={2}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowStockModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateStockMutation.isPending}>
                {updateStockMutation.isPending ? 'Updating...' : 'Update Stock'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Shipping Modal */}
      <Dialog open={showShippingModal} onOpenChange={setShowShippingModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ship Order - {selectedOrder?.orderNumber}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleShipOrder} className="space-y-4">
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Customer:</strong> {selectedOrder?.customerName}</p>
              <p><strong>Total:</strong> ₱{selectedOrder?.total ? parseFloat(selectedOrder.total).toLocaleString() : '0'}</p>
              <p><strong>Payment:</strong> {selectedOrder?.paymentStatus}</p>
            </div>

            <div>
              <Label htmlFor="trackingNumber">Tracking Number *</Label>
              <Input
                id="trackingNumber"
                value={shippingInfo.trackingNumber}
                onChange={(e) => setShippingInfo({...shippingInfo, trackingNumber: e.target.value})}
                required
              />
            </div>

            <div>
              <Label htmlFor="shippingProvider">Shipping Provider *</Label>
              <Select value={shippingInfo.shippingProvider} onValueChange={(value) => setShippingInfo({...shippingInfo, shippingProvider: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LBC">LBC</SelectItem>
                  <SelectItem value="J&T Express">J&T Express</SelectItem>
                  <SelectItem value="Shopee Express">Shopee Express</SelectItem>
                  <SelectItem value="Grab Express">Grab Express</SelectItem>
                  <SelectItem value="Lalamove">Lalamove</SelectItem>
                  <SelectItem value="DHL">DHL</SelectItem>
                  <SelectItem value="FedEx">FedEx</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="shippingNotes">Notes</Label>
              <Textarea
                id="shippingNotes"
                value={shippingInfo.notes}
                onChange={(e) => setShippingInfo({...shippingInfo, notes: e.target.value})}
                rows={2}
                placeholder="Special handling instructions..."
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowShippingModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={shipOrderMutation.isPending}>
                {shipOrderMutation.isPending ? 'Shipping...' : 'Ship Order'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={showEditProductModal} onOpenChange={setShowEditProductModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditProduct} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editName">Product Name *</Label>
                <Input
                  id="editName"
                  value={editProduct.name}
                  onChange={(e) => setEditProduct({...editProduct, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="editSku">SKU *</Label>
                <Input
                  id="editSku"
                  value={editProduct.sku}
                  onChange={(e) => setEditProduct({...editProduct, sku: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="editDescription">Description</Label>
              <Textarea
                id="editDescription"
                value={editProduct.description}
                onChange={(e) => setEditProduct({...editProduct, description: e.target.value})}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editCategory">Category</Label>
                <Select value={editProduct.category} onValueChange={(value) => setEditProduct({...editProduct, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="footwear">Footwear</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="home">Home & Garden</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editBrand">Brand</Label>
                <Input
                  id="editBrand"
                  value={editProduct.brand}
                  onChange={(e) => setEditProduct({...editProduct, brand: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editPrice">Price (₱) *</Label>
                <Input
                  id="editPrice"
                  type="number"
                  step="0.01"
                  value={editProduct.price}
                  onChange={(e) => setEditProduct({...editProduct, price: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="editCostPrice">Cost Price (₱) *</Label>
                <Input
                  id="editCostPrice"
                  type="number"
                  step="0.01"
                  value={editProduct.costPrice}
                  onChange={(e) => setEditProduct({...editProduct, costPrice: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="editStock">Stock</Label>
                <Input
                  id="editStock"
                  type="number"
                  value={editProduct.stock}
                  onChange={(e) => setEditProduct({...editProduct, stock: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="editLowStockThreshold">Low Stock Alert</Label>
                <Input
                  id="editLowStockThreshold"
                  type="number"
                  value={editProduct.lowStockThreshold}
                  onChange={(e) => setEditProduct({...editProduct, lowStockThreshold: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="editWeight">Weight (kg)</Label>
                <Input
                  id="editWeight"
                  type="number"
                  step="0.01"
                  value={editProduct.weight}
                  onChange={(e) => setEditProduct({...editProduct, weight: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="editTags">Tags (comma-separated)</Label>
              <Input
                id="editTags"
                value={editProduct.tags}
                onChange={(e) => setEditProduct({...editProduct, tags: e.target.value})}
                placeholder="smartphone, premium, apple"
              />
            </div>

            {/* Image Upload Section for Edit */}
            <div className="space-y-3">
              <Label>Product Images (up to 20)</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter image URL"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.target as HTMLInputElement;
                      addImageUrl(input.value, true);
                      input.value = '';
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    const input = (e.target as HTMLElement).parentNode?.querySelector('input') as HTMLInputElement;
                    if (input?.value) {
                      addImageUrl(input.value, true);
                      input.value = '';
                    }
                  }}
                >
                  <ImagePlus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
              {editProduct.images.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {editProduct.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt={`Product ${index + 1}`}
                        className="w-full h-20 object-cover rounded border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiAxNkwyIDZIMjJMMTIgMTZaIiBmaWxsPSIjOUIxMDFEIi8+Cjx0ZXh0IHg9IjEyIiB5PSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSI4IiBmaWxsPSIjOUIxMDFEIj5JbWFnZSBub3QgZm91bmQ8L3RleHQ+Cjwvc3ZnPg==';
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index, true)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-sm text-gray-500">{editProduct.images.length}/20 images added</p>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowEditProductModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateProductMutation.isPending}>
                {updateProductMutation.isPending ? 'Updating...' : 'Update Product'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShopDashboard;
