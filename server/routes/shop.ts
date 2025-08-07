import { Router } from 'express';
import { eq, desc, and, gte, sql } from 'drizzle-orm';
import { db } from '../db';
import {
  products,
  stockMovements,
  shopOrders,
  shopStats,
  type Product,
  type StockMovement,
  type ShopOrder,
  type ShopStats,
  insertProductSchema,
  insertStockMovementSchema,
  insertShopOrderSchema,
} from '../../shared/shop-schema';

const router = Router();

// In-memory storage for demo (replace with database in production)
const createdProducts = new Map<string, Product>();
const createdOrders = new Map<string, ShopOrder>();
const createdStockMovements = new Map<string, StockMovement>();

// Generate mock data
function generateMockProductData(shopId: string): Product[] {
  return [
    {
      id: '1',
      name: 'iPhone 15 Pro',
      description: 'Latest Apple iPhone with Pro features',
      category: 'electronics',
      brand: 'Apple',
      sku: 'APL-IP15P-128',
      price: '52990.00',
      costPrice: '42000.00',
      stock: 25,
      lowStockThreshold: 5,
      images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop'],
      weight: '0.187',
      dimensions: { length: 14.67, width: 7.81, height: 0.83 },
      status: 'active',
      tags: ['smartphone', 'premium', 'apple'],
      shopId,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Samsung Galaxy S24 Ultra',
      description: 'Flagship Samsung smartphone with S Pen',
      category: 'electronics',
      brand: 'Samsung',
      sku: 'SAM-GS24U-256',
      price: '65990.00',
      costPrice: '55000.00',
      stock: 15,
      lowStockThreshold: 3,
      images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop'],
      weight: '0.232',
      dimensions: { length: 16.24, width: 7.9, height: 0.86 },
      status: 'active',
      tags: ['smartphone', 'android', 'premium'],
      shopId,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date(),
    },
    {
      id: '3',
      name: 'MacBook Air M3',
      description: 'Apple MacBook Air with M3 chip',
      category: 'electronics',
      brand: 'Apple',
      sku: 'APL-MBA-M3-256',
      price: '65990.00',
      costPrice: '58000.00',
      stock: 8,
      lowStockThreshold: 2,
      images: ['https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop'],
      weight: '1.24',
      dimensions: { length: 30.41, width: 21.5, height: 1.13 },
      status: 'active',
      tags: ['laptop', 'premium', 'apple'],
      shopId,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date(),
    },
    {
      id: '4',
      name: 'Nike Air Max 270',
      description: 'Comfortable running shoes with Air Max technology',
      category: 'footwear',
      brand: 'Nike',
      sku: 'NIK-AM270-BLK-42',
      price: '7495.00',
      costPrice: '4500.00',
      stock: 0,
      lowStockThreshold: 10,
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'],
      weight: '0.8',
      dimensions: { length: 32, width: 12, height: 10 },
      status: 'active',
      tags: ['shoes', 'running', 'nike'],
      shopId,
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date(),
    },
    {
      id: '5',
      name: 'Sony WH-1000XM5',
      description: 'Noise-canceling wireless headphones',
      category: 'electronics',
      brand: 'Sony',
      sku: 'SNY-WH1000XM5-BLK',
      price: '19990.00',
      costPrice: '15000.00',
      stock: 2,
      lowStockThreshold: 5,
      images: ['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop'],
      weight: '0.25',
      dimensions: { length: 25, width: 20, height: 8 },
      status: 'active',
      tags: ['headphones', 'wireless', 'sony'],
      shopId,
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date(),
    },
  ];
}

function generateMockOrders(shopId: string): ShopOrder[] {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  return [
    {
      id: 'ord_1',
      orderNumber: 'ORD-2025-0001',
      customerId: 'cust_1',
      customerName: 'John Dela Cruz',
      customerEmail: 'john.delacruz@email.com',
      customerPhone: '+63 917 123 4567',
      shippingAddress: {
        street: '123 Rizal St.',
        city: 'Manila',
        province: 'Metro Manila',
        postalCode: '1000',
        country: 'Philippines'
      },
      billingAddress: {
        street: '123 Rizal St.',
        city: 'Manila',
        province: 'Metro Manila',
        postalCode: '1000',
        country: 'Philippines'
      },
      items: [
        {
          productId: '1',
          productName: 'iPhone 15 Pro',
          sku: 'APL-IP15P-128',
          quantity: 1,
          unitPrice: 52990,
          totalPrice: 52990
        }
      ],
      subtotal: '52990.00',
      shippingFee: '200.00',
      tax: '6358.80',
      total: '59548.80',
      paymentStatus: 'paid',
      paymentMethod: 'credit_card',
      paymentId: 'pay_123456789',
      orderStatus: 'processing',
      shippingStatus: 'preparing',
      trackingNumber: '',
      shippingProvider: '',
      notes: 'Handle with care',
      shopId,
      createdAt: oneWeekAgo,
      updatedAt: new Date(),
    },
    {
      id: 'ord_2',
      orderNumber: 'ORD-2025-0002',
      customerId: 'cust_2',
      customerName: 'Maria Santos',
      customerEmail: 'maria.santos@email.com',
      customerPhone: '+63 917 987 6543',
      shippingAddress: {
        street: '456 Bonifacio Ave.',
        city: 'Quezon City',
        province: 'Metro Manila',
        postalCode: '1100',
        country: 'Philippines'
      },
      billingAddress: {
        street: '456 Bonifacio Ave.',
        city: 'Quezon City',
        province: 'Metro Manila',
        postalCode: '1100',
        country: 'Philippines'
      },
      items: [
        {
          productId: '5',
          productName: 'Sony WH-1000XM5',
          sku: 'SNY-WH1000XM5-BLK',
          quantity: 2,
          unitPrice: 19990,
          totalPrice: 39980
        }
      ],
      subtotal: '39980.00',
      shippingFee: '150.00',
      tax: '4797.60',
      total: '44927.60',
      paymentStatus: 'paid',
      paymentMethod: 'paypal',
      paymentId: 'pay_987654321',
      orderStatus: 'confirmed',
      shippingStatus: 'not_shipped',
      trackingNumber: '',
      shippingProvider: '',
      notes: '',
      shopId,
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
  ];
}

// Shop Analytics
router.get('/analytics/:shopId', async (req, res) => {
  try {
    const { shopId } = req.params;
    
    // Get base products and created products
    const baseProducts = generateMockProductData(shopId);
    const createdProductsArray = Array.from(createdProducts.values()).filter(p => p.shopId === shopId);
    const allProducts = [...baseProducts, ...createdProductsArray];
    
    // Get orders
    const baseOrders = generateMockOrders(shopId);
    const createdOrdersArray = Array.from(createdOrders.values()).filter(o => o.shopId === shopId);
    const allOrders = [...baseOrders, ...createdOrdersArray];
    
    // Calculate analytics
    const totalProducts = allProducts.length;
    const activeProducts = allProducts.filter(p => p.status === 'active').length;
    const lowStockProducts = allProducts.filter(p => (p.stock || 0) <= (p.lowStockThreshold || 0) && (p.stock || 0) > 0).length;
    const outOfStockProducts = allProducts.filter(p => (p.stock || 0) === 0).length;
    
    const totalOrders = allOrders.length;
    const paidOrders = allOrders.filter(o => o.paymentStatus === 'paid');
    const pendingOrders = allOrders.filter(o => o.orderStatus === 'pending').length;
    const processingOrders = allOrders.filter(o => o.orderStatus === 'processing').length;
    const shippingOrders = allOrders.filter(o => o.shippingStatus === 'shipped').length;
    
    const totalRevenue = paidOrders.reduce((sum, o) => sum + parseFloat(o.total), 0);
    const averageOrderValue = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;
    
    // Monthly calculations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const monthlyOrders = allOrders.filter(o => new Date(o.createdAt || new Date()) >= thirtyDaysAgo);
    const monthlyRevenue = monthlyOrders
      .filter(o => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + parseFloat(o.total), 0);
    
    const uniqueCustomers = new Set(allOrders.map(o => o.customerEmail)).size;
    
    const analytics = {
      totalProducts,
      activeProducts,
      lowStockProducts,
      outOfStockProducts,
      totalOrders,
      pendingOrders,
      processingOrders,
      shippingOrders,
      totalRevenue: Math.round(totalRevenue),
      monthlyRevenue: Math.round(monthlyRevenue),
      averageOrderValue: Math.round(averageOrderValue),
      totalCustomers: uniqueCustomers,
      monthlySales: monthlyOrders.length,
    };
    
    res.json(analytics);
  } catch (error) {
    console.error("Error fetching shop analytics:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

// Get products
router.get('/products/:shopId', async (req, res) => {
  try {
    const { shopId } = req.params;
    const { category, status, search, limit = '50' } = req.query;
    
    // Get base products and created products
    const baseProducts = generateMockProductData(shopId);
    const createdProductsArray = Array.from(createdProducts.values()).filter(p => p.shopId === shopId);
    const allProducts = [...baseProducts, ...createdProductsArray];
    
    // Apply filters
    let filteredProducts = allProducts;
    
    if (category && category !== 'all') {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    
    if (status && status !== 'all') {
      filteredProducts = filteredProducts.filter(p => p.status === status);
    }
    
    if (search) {
      const searchLower = (search as string).toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.sku.toLowerCase().includes(searchLower) ||
        p.brand?.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort by creation date (newest first)
    filteredProducts.sort((a, b) => new Date(b.createdAt || new Date()).getTime() - new Date(a.createdAt || new Date()).getTime());
    
    // Limit results
    const limitNum = parseInt(limit as string);
    if (limitNum > 0) {
      filteredProducts = filteredProducts.slice(0, limitNum);
    }
    
    res.json(filteredProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Create product
router.post('/products', async (req, res) => {
  try {
    const validatedData = insertProductSchema.parse(req.body);
    
    const productId = `prod_${Date.now()}`;
    const newProduct: Product = {
      id: productId,
      ...validatedData,
      description: validatedData.description || null,
      brand: validatedData.brand || null,
      stock: parseInt(validatedData.stock?.toString() || '0'),
      lowStockThreshold: parseInt(validatedData.lowStockThreshold?.toString() || '5'),
      price: validatedData.price.toString(),
      costPrice: validatedData.costPrice.toString(),
      weight: validatedData.weight?.toString() || '0',
      dimensions: validatedData.dimensions || null,
      status: 'active',
      images: (validatedData.images as string[]) || [],
      tags: (validatedData.tags as string[]) || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    createdProducts.set(productId, newProduct);
    
    console.log('Created new product:', newProduct);
    console.log('Total created products:', createdProducts.size);
    
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(400).json({ error: "Failed to create product" });
  }
});

// Update product
router.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Check if product exists in created products
    const existingProduct = createdProducts.get(id);
    if (existingProduct) {
      const updatedProduct = {
        ...existingProduct,
        ...updates,
        updatedAt: new Date(),
      };
      createdProducts.set(id, updatedProduct);
      return res.json(updatedProduct);
    }
    
    // For base products, just return updated data (in real app, update database)
    const baseProducts = generateMockProductData(req.body.shopId || 'shop_1');
    const baseProduct = baseProducts.find(p => p.id === id);
    if (baseProduct) {
      const updatedProduct = {
        ...baseProduct,
        ...updates,
        updatedAt: new Date(),
      };
      return res.json(updatedProduct);
    }
    
    res.status(404).json({ error: "Product not found" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Update stock
router.put('/products/:id/stock', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, type, reason, notes } = req.body;
    
    // Find the product
    let product = createdProducts.get(id);
    if (!product) {
      const baseProducts = generateMockProductData('shop_1');
      product = baseProducts.find(p => p.id === id);
      if (product) {
        // Move to created products for tracking
        createdProducts.set(id, { ...product });
        product = createdProducts.get(id)!;
      }
    }
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    // Calculate new stock
    let newStock = product.stock || 0;
    if (type === 'in') {
      newStock += quantity;
    } else if (type === 'out') {
      newStock = Math.max(0, newStock - quantity);
    } else if (type === 'adjustment') {
      newStock = quantity;
    }
    
    // Update product stock
    const updatedProduct = {
      ...product,
      stock: newStock,
      updatedAt: new Date(),
    };
    createdProducts.set(id, updatedProduct);
    
    // Create stock movement record
    const movementId = `mov_${Date.now()}`;
    const stockMovement: StockMovement = {
      id: movementId,
      productId: id,
      type,
      quantity,
      reason,
      referenceId: null,
      notes: notes || null,
      performedBy: 'shop_manager',
      createdAt: new Date(),
    };
    createdStockMovements.set(movementId, stockMovement);
    
    console.log('Updated product stock:', updatedProduct);
    console.log('Created stock movement:', stockMovement);
    
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({ error: "Failed to update stock" });
  }
});

// Get orders
router.get('/orders/:shopId', async (req, res) => {
  try {
    const { shopId } = req.params;
    const { status, paymentStatus, limit = '50' } = req.query;
    
    // Get base orders and created orders
    const baseOrders = generateMockOrders(shopId);
    const createdOrdersArray = Array.from(createdOrders.values()).filter(o => o.shopId === shopId);
    const allOrders = [...baseOrders, ...createdOrdersArray];
    
    // Apply filters
    let filteredOrders = allOrders;
    
    if (status && status !== 'all') {
      filteredOrders = filteredOrders.filter(o => o.orderStatus === status);
    }
    
    if (paymentStatus && paymentStatus !== 'all') {
      filteredOrders = filteredOrders.filter(o => o.paymentStatus === paymentStatus);
    }
    
    // Sort by creation date (newest first)
    filteredOrders.sort((a, b) => new Date(b.createdAt || new Date()).getTime() - new Date(a.createdAt || new Date()).getTime());
    
    // Limit results
    const limitNum = parseInt(limit as string);
    if (limitNum > 0) {
      filteredOrders = filteredOrders.slice(0, limitNum);
    }
    
    res.json(filteredOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Update order status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, shippingStatus, trackingNumber, shippingProvider } = req.body;
    
    // Find the order
    let order = createdOrders.get(id);
    if (!order) {
      const baseOrders = generateMockOrders('shop_1');
      order = baseOrders.find(o => o.id === id);
      if (order) {
        // Move to created orders for tracking
        createdOrders.set(id, { ...order });
        order = createdOrders.get(id)!;
      }
    }
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    // Update order
    const updatedOrder = {
      ...order,
      orderStatus: orderStatus || order.orderStatus,
      shippingStatus: shippingStatus || order.shippingStatus,
      trackingNumber: trackingNumber || order.trackingNumber,
      shippingProvider: shippingProvider || order.shippingProvider,
      updatedAt: new Date(),
    };
    createdOrders.set(id, updatedOrder);
    
    console.log('Updated order status:', updatedOrder);
    
    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Failed to update order" });
  }
});

// Ship order
router.post('/orders/:id/ship', async (req, res) => {
  try {
    const { id } = req.params;
    const { trackingNumber, shippingProvider, notes } = req.body;
    
    // Find the order
    let order = createdOrders.get(id);
    if (!order) {
      const baseOrders = generateMockOrders('shop_1');
      order = baseOrders.find(o => o.id === id);
      if (order) {
        createdOrders.set(id, { ...order });
        order = createdOrders.get(id)!;
      }
    }
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    if (order.paymentStatus !== 'paid') {
      return res.status(400).json({ error: "Order must be paid before shipping" });
    }
    
    // Update order to shipped
    const updatedOrder = {
      ...order,
      orderStatus: 'shipped',
      shippingStatus: 'shipped',
      trackingNumber,
      shippingProvider,
      notes: notes || order.notes,
      updatedAt: new Date(),
    };
    createdOrders.set(id, updatedOrder);
    
    console.log('Shipped order:', updatedOrder);
    
    res.json(updatedOrder);
  } catch (error) {
    console.error("Error shipping order:", error);
    res.status(500).json({ error: "Failed to ship order" });
  }
});

export default router;