import { Router } from 'express';
import {
  type Product,
  type StockMovement,
  type ShopOrder,
  insertProductSchema,
} from '../../shared/shop-schema';
import { requireAuth, requireRole } from '../auth';

const router = Router();

// In-memory storage for demo (replace with database in production)
const createdProducts = new Map<string, Product>();
const createdOrders = new Map<string, ShopOrder>();
const createdStockMovements = new Map<string, StockMovement>();
type ShopCartItem = {
  id: string;
  userId: string;
  shopId: string;
  productId: string;
  productName: string;
  sku: string;
  price: string;
  quantity: number;
  total: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
};
const createdCartItems = new Map<string, ShopCartItem>();

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

function getProductsForShop(shopId: string): Product[] {
  const baseProducts = generateMockProductData(shopId);
  const createdProductsArray = Array.from(createdProducts.values()).filter(
    (product) => product.shopId === shopId,
  );
  const createdProductIds = new Set(createdProductsArray.map((product) => product.id));

  return [
    ...baseProducts.filter((product) => !createdProductIds.has(product.id)),
    ...createdProductsArray,
  ];
}

function getOrdersForShop(shopId: string): ShopOrder[] {
  const baseOrders = generateMockOrders(shopId);
  const createdOrdersArray = Array.from(createdOrders.values()).filter(
    (order) => order.shopId === shopId,
  );
  const createdOrderIds = new Set(createdOrdersArray.map((order) => order.id));

  return [...baseOrders.filter((order) => !createdOrderIds.has(order.id)), ...createdOrdersArray];
}

function getOrTrackProduct(shopId: string, productId: string): Product | undefined {
  const tracked = createdProducts.get(productId);
  if (tracked) {
    return tracked;
  }

  const baseProduct = generateMockProductData(shopId).find((product) => product.id === productId);
  if (!baseProduct) {
    return undefined;
  }

  const copied = { ...baseProduct, updatedAt: new Date() };
  createdProducts.set(productId, copied);
  return copied;
}

// Shop Analytics
router.get('/analytics/:shopId', requireAuth, requireRole('host', 'admin'), async (req, res) => {
  try {
    const { shopId } = req.params;
    
    // Get products and orders
    const allProducts = getProductsForShop(shopId);
    const allOrders = getOrdersForShop(shopId);
    
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
    
    const allProducts = getProductsForShop(shopId);
    
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

// Get cart items for a user in a shop
router.get('/cart/:shopId/:userId', requireAuth, async (req, res) => {
  try {
    const { shopId, userId } = req.params;
    const items = Array.from(createdCartItems.values())
      .filter((item) => item.shopId === shopId && item.userId === userId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    res.json(items);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Failed to fetch cart items" });
  }
});

// Add an item to cart
router.post('/cart', requireAuth, async (req, res) => {
  try {
    const {
      shopId,
      userId,
      productId,
      quantity = 1,
    } = req.body as {
      shopId?: string;
      userId?: string;
      productId?: string;
      quantity?: number;
    };

    if (!shopId || !userId || !productId) {
      return res.status(400).json({ error: "shopId, userId, and productId are required" });
    }

    const parsedQuantity = Number(quantity);
    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      return res.status(400).json({ error: "quantity must be a positive number" });
    }

    const product = getProductsForShop(shopId).find((item) => item.id === productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const existingCartItem = Array.from(createdCartItems.values()).find(
      (item) =>
        item.shopId === shopId &&
        item.userId === userId &&
        item.productId === productId,
    );

    if (existingCartItem) {
      const nextQuantity = existingCartItem.quantity + parsedQuantity;
      const updatedItem: ShopCartItem = {
        ...existingCartItem,
        quantity: nextQuantity,
        total: (parseFloat(existingCartItem.price) * nextQuantity).toFixed(2),
        updatedAt: new Date(),
      };
      createdCartItems.set(existingCartItem.id, updatedItem);
      return res.json(updatedItem);
    }

    const cartItem: ShopCartItem = {
      id: `cart_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      shopId,
      userId,
      productId,
      productName: product.name,
      sku: product.sku,
      price: product.price,
      quantity: parsedQuantity,
      total: (parseFloat(product.price) * parsedQuantity).toFixed(2),
      image: product.images?.[0] || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    createdCartItems.set(cartItem.id, cartItem);
    res.status(201).json(cartItem);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});

// Update cart item quantity
router.put('/cart/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body as { quantity?: number };

    const existing = createdCartItems.get(id);
    if (!existing) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    const parsedQuantity = Number(quantity);
    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      return res.status(400).json({ error: "quantity must be a positive number" });
    }

    const updated: ShopCartItem = {
      ...existing,
      quantity: parsedQuantity,
      total: (parseFloat(existing.price) * parsedQuantity).toFixed(2),
      updatedAt: new Date(),
    };
    createdCartItems.set(id, updated);

    res.json(updated);
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ error: "Failed to update cart item" });
  }
});

// Remove cart item
router.delete('/cart/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    createdCartItems.delete(id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({ error: "Failed to remove cart item" });
  }
});

// Create an order from selected products or current cart
router.post('/checkout', requireAuth, async (req, res) => {
  try {
    const {
      shopId,
      userId,
      items,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      billingAddress,
      paymentMethod,
      paymentStatus,
      notes,
    } = req.body as {
      shopId?: string;
      userId?: string;
      items?: Array<{ productId: string; quantity: number }>;
      customerName?: string;
      customerEmail?: string;
      customerPhone?: string;
      shippingAddress?: {
        street: string;
        city: string;
        province: string;
        postalCode: string;
        country: string;
      };
      billingAddress?: {
        street: string;
        city: string;
        province: string;
        postalCode: string;
        country: string;
      };
      paymentMethod?: string;
      paymentStatus?: ShopOrder["paymentStatus"];
      notes?: string;
    };

    if (!shopId || !userId) {
      return res.status(400).json({ error: "shopId and userId are required" });
    }

    const inputItems =
      items && items.length > 0
        ? items
        : Array.from(createdCartItems.values())
            .filter((item) => item.shopId === shopId && item.userId === userId)
            .map((item) => ({ productId: item.productId, quantity: item.quantity }));

    if (inputItems.length === 0) {
      return res.status(400).json({ error: "No items provided for checkout" });
    }

    const normalizedItems: ShopOrder["items"] = [];
    let subtotal = 0;

    for (const item of inputItems) {
      const quantity = Number(item.quantity);
      if (!Number.isFinite(quantity) || quantity <= 0) {
        return res.status(400).json({ error: "Invalid quantity in checkout items" });
      }

      const product = getOrTrackProduct(shopId, item.productId);
      if (!product) {
        return res.status(404).json({ error: `Product ${item.productId} not found` });
      }

      const availableStock = product.stock || 0;
      if (availableStock < quantity) {
        return res.status(400).json({
          error: `${product.name} has only ${availableStock} items in stock`,
        });
      }

      const unitPrice = parseFloat(product.price);
      const lineTotal = unitPrice * quantity;
      subtotal += lineTotal;

      normalizedItems.push({
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        quantity,
        unitPrice,
        totalPrice: lineTotal,
      });
    }

    const shippingFee = subtotal > 0 ? 150 : 0;
    const tax = subtotal * 0.12;
    const total = subtotal + shippingFee + tax;
    const now = new Date();
    const orderId = `ord_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const resolvedShippingAddress = shippingAddress || {
      street: 'N/A',
      city: 'N/A',
      province: 'N/A',
      postalCode: '0000',
      country: 'Philippines',
    };
    const resolvedBillingAddress = billingAddress || resolvedShippingAddress;

    const order: ShopOrder = {
      id: orderId,
      orderNumber: `ORD-${now.getFullYear()}-${String(createdOrders.size + 1).padStart(4, '0')}`,
      customerId: userId,
      customerName: customerName || 'Guest Customer',
      customerEmail: customerEmail || `${userId}@guest.local`,
      customerPhone: customerPhone || null,
      shippingAddress: resolvedShippingAddress,
      billingAddress: resolvedBillingAddress,
      items: normalizedItems,
      subtotal: subtotal.toFixed(2),
      shippingFee: shippingFee.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
      paymentStatus: paymentStatus || 'pending',
      paymentMethod: paymentMethod || 'cod',
      paymentId: null,
      orderStatus: paymentStatus === 'paid' ? 'confirmed' : 'pending',
      shippingStatus: 'not_shipped',
      trackingNumber: null,
      shippingProvider: null,
      notes: notes || null,
      shopId,
      createdAt: now,
      updatedAt: now,
    };

    createdOrders.set(order.id, order);

    for (const orderItem of normalizedItems) {
      const product = getOrTrackProduct(shopId, orderItem.productId);
      if (!product) continue;

      const nextStock = Math.max(0, (product.stock || 0) - orderItem.quantity);
      createdProducts.set(product.id, {
        ...product,
        stock: nextStock,
        updatedAt: new Date(),
      });

      const stockMovement: StockMovement = {
        id: `mov_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        productId: product.id,
        type: 'out',
        quantity: orderItem.quantity,
        reason: 'sale',
        referenceId: order.id,
        notes: `Order ${order.orderNumber}`,
        performedBy: userId,
        createdAt: new Date(),
      };
      createdStockMovements.set(stockMovement.id, stockMovement);
    }

    for (const cartItem of Array.from(createdCartItems.values())) {
      if (
        cartItem.shopId === shopId &&
        cartItem.userId === userId &&
        inputItems.some((item) => item.productId === cartItem.productId)
      ) {
        createdCartItems.delete(cartItem.id);
      }
    }

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating checkout order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Create product
router.post('/products', requireAuth, requireRole('host', 'admin'), async (req, res) => {
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
router.put('/products/:id', requireAuth, requireRole('host', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const shopId = updates.shopId || 'shop_1';
    
    const existingProduct = createdProducts.get(id) || getOrTrackProduct(shopId, id);
    if (existingProduct) {
      const updatedProduct: Product = {
        ...existingProduct,
        ...updates,
        price: updates.price ? String(updates.price) : existingProduct.price,
        costPrice: updates.costPrice ? String(updates.costPrice) : existingProduct.costPrice,
        weight: updates.weight ? String(updates.weight) : existingProduct.weight,
        stock: Number.isFinite(Number(updates.stock))
          ? Number(updates.stock)
          : existingProduct.stock,
        lowStockThreshold: Number.isFinite(Number(updates.lowStockThreshold))
          ? Number(updates.lowStockThreshold)
          : existingProduct.lowStockThreshold,
        updatedAt: new Date(),
      };
      createdProducts.set(id, updatedProduct);
      return res.json(updatedProduct);
    }
    
    res.status(404).json({ error: "Product not found" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Update stock
router.put('/products/:id/stock', requireAuth, requireRole('host', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, type, reason, notes, shopId = 'shop_1' } = req.body;
    
    // Find the product
    let product = createdProducts.get(id) || getOrTrackProduct(shopId, id);
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const parsedQuantity = Number(quantity);
    if (!Number.isFinite(parsedQuantity) || parsedQuantity < 0) {
      return res.status(400).json({ error: "quantity must be a non-negative number" });
    }
    
    // Calculate new stock
    let newStock = product.stock || 0;
    if (type === 'in') {
      newStock += parsedQuantity;
    } else if (type === 'out') {
      newStock = Math.max(0, newStock - parsedQuantity);
    } else if (type === 'adjustment') {
      newStock = parsedQuantity;
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
      quantity: parsedQuantity,
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
router.get('/orders/:shopId', requireAuth, requireRole('host', 'admin'), async (req, res) => {
  try {
    const { shopId } = req.params;
    const { status, paymentStatus, limit = '50' } = req.query;
    
    const allOrders = getOrdersForShop(shopId);
    
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
router.put('/orders/:id/status', requireAuth, requireRole('host', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      orderStatus,
      shippingStatus,
      trackingNumber,
      shippingProvider,
      shopId = 'shop_1',
    } = req.body;
    
    // Find the order
    let order = createdOrders.get(id);
    if (!order) {
      const baseOrders = getOrdersForShop(shopId);
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
router.post('/orders/:id/ship', requireAuth, requireRole('host', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { trackingNumber, shippingProvider, notes, shopId = 'shop_1' } = req.body;
    
    // Find the order
    let order = createdOrders.get(id);
    if (!order) {
      const baseOrders = getOrdersForShop(shopId);
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
      trackingNumber: trackingNumber || order.trackingNumber || null,
      shippingProvider: shippingProvider || order.shippingProvider || null,
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
