import { db } from "./db";
import { eq, and, desc, asc, sql } from "drizzle-orm";
import {
  users, categories, products, productVariants, cartItems, orders, orderItems, reviews, wishlistItems, travelGoals,
  type User, type InsertUser, type Category, type InsertCategory, type Product, type InsertProduct,
  type ProductVariant, type InsertProductVariant, type CartItem, type InsertCartItem,
  type Order, type InsertOrder, type OrderItem, type InsertOrderItem,
  type Review, type InsertReview, type WishlistItem, type InsertWishlistItem,
  type TravelGoal
} from "@shared/schema";

export interface UpsertTravelGoalInput {
  year: number;
  targetTrips?: number;
  targetProvinces?: number;
  targetTravelDays?: number;
  targetPoints?: number;
  currentTrips?: number;
  currentProvinces?: number;
  currentTravelDays?: number;
  currentPoints?: number;
  notes?: string | null;
  lastActivityAt?: Date | null;
}

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  getUserByFacebookId(facebookId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;
  getTravelGoal(userId: number, year: number): Promise<TravelGoal | undefined>;
  upsertTravelGoal(userId: number, input: UpsertTravelGoalInput): Promise<TravelGoal>;

  // Category methods
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: number): Promise<void>;

  // Product methods
  getProducts(categoryId?: number, limit?: number, offset?: number): Promise<Product[]>;
  getFeaturedProducts(limit?: number): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  searchProducts(query: string, limit?: number): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;

  // Product variant methods
  getProductVariants(productId: number): Promise<ProductVariant[]>;
  getProductVariant(id: number): Promise<ProductVariant | undefined>;
  createProductVariant(variant: InsertProductVariant): Promise<ProductVariant>;
  updateProductVariant(id: number, variant: Partial<InsertProductVariant>): Promise<ProductVariant>;
  deleteProductVariant(id: number): Promise<void>;

  // Cart methods
  getCartItems(userId: number): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem>;
  removeFromCart(id: number): Promise<void>;
  clearCart(userId: number): Promise<void>;

  // Order methods
  getOrders(userId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;

  // Review methods
  getProductReviews(productId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: number, review: Partial<InsertReview>): Promise<Review>;
  deleteReview(id: number): Promise<void>;

  // Wishlist methods
  getWishlistItems(userId: number): Promise<WishlistItem[]>;
  addToWishlist(item: InsertWishlistItem): Promise<WishlistItem>;
  removeFromWishlist(userId: number, productId: number): Promise<void>;
}

// Temporary in-memory storage for testing
class MemoryStorage implements IStorage {
  private users: User[] = [];
  private categories: Category[] = [];
  private products: Product[] = [];
  private productVariants: ProductVariant[] = [];
  private cartItems: CartItem[] = [];
  private orders: Order[] = [];
  private orderItems: OrderItem[] = [];
  private reviews: Review[] = [];
  private wishlistItems: WishlistItem[] = [];
  private travelGoals: TravelGoal[] = [];
  private nextUserId = 1;
  private nextCategoryId = 1;
  private nextProductId = 1;
  private nextProductVariantId = 1;
  private nextCartItemId = 1;
  private nextOrderId = 1;
  private nextOrderItemId = 1;
  private nextReviewId = 1;
  private nextWishlistItemId = 1;
  private nextTravelGoalId = 1;

  constructor() {
    // Create a default admin user for testing
    this.initializeDefaultUsers();
  }

  private async initializeDefaultUsers() {
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.default.hash('admin123', 10);
    
    // Add default admin user
    this.users.push({
      id: this.nextUserId++,
      username: 'admin',
      password: hashedPassword,
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      phone: null,
      address: null,
      city: null,
      postalCode: null,
      country: 'Philippines',
      googleId: null,
      facebookId: null,
      profileImage: null,
      authProvider: 'local',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Add a regular test user
    const regularPassword = await bcrypt.default.hash('user123', 10);
    this.users.push({
      id: this.nextUserId++,
      username: 'testuser',
      password: regularPassword,
      email: 'user@example.com',
      firstName: 'Test',
      lastName: 'User',
      phone: null,
      address: null,
      city: null,
      postalCode: null,
      country: 'Philippines',
      googleId: null,
      facebookId: null,
      profileImage: null,
      authProvider: 'local',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async getUsers(): Promise<User[]> {
    return [...this.users].sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime(),
    );
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(u => u.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.users.find(u => u.email === email);
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    return this.users.find(u => u.googleId === googleId);
  }

  async getUserByFacebookId(facebookId: string): Promise<User | undefined> {
    return this.users.find(u => u.facebookId === facebookId);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.nextUserId++,
      username: insertUser.username!,
      password: insertUser.password || null,
      email: insertUser.email || null,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      phone: insertUser.phone || null,
      address: insertUser.address || null,
      city: insertUser.city || null,
      postalCode: insertUser.postalCode || null,
      country: insertUser.country || 'Philippines',
      googleId: insertUser.googleId || null,
      facebookId: (insertUser as any).facebookId || null,
      profileImage: insertUser.profileImage || null,
      authProvider: insertUser.authProvider || 'local',
      role: insertUser.role || 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.push(user);
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User> {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) throw new Error('User not found');
    
    this.users[userIndex] = { ...this.users[userIndex], ...userData, updatedAt: new Date() };
    return this.users[userIndex];
  }

  async getTravelGoal(userId: number, year: number): Promise<TravelGoal | undefined> {
    return this.travelGoals.find((goal) => goal.userId === userId && goal.year === year);
  }

  async upsertTravelGoal(userId: number, input: UpsertTravelGoalInput): Promise<TravelGoal> {
    const year = input.year;
    const now = new Date();
    const existingIndex = this.travelGoals.findIndex(
      (goal) => goal.userId === userId && goal.year === year,
    );

    if (existingIndex !== -1) {
      const existing = this.travelGoals[existingIndex];
      const updated: TravelGoal = {
        ...existing,
        targetTrips: input.targetTrips ?? existing.targetTrips,
        targetProvinces: input.targetProvinces ?? existing.targetProvinces,
        targetTravelDays: input.targetTravelDays ?? existing.targetTravelDays,
        targetPoints: input.targetPoints ?? existing.targetPoints,
        currentTrips: input.currentTrips ?? existing.currentTrips,
        currentProvinces: input.currentProvinces ?? existing.currentProvinces,
        currentTravelDays: input.currentTravelDays ?? existing.currentTravelDays,
        currentPoints: input.currentPoints ?? existing.currentPoints,
        notes: input.notes === undefined ? existing.notes : input.notes,
        lastActivityAt:
          input.lastActivityAt === undefined ? existing.lastActivityAt : input.lastActivityAt,
        updatedAt: now,
      };
      this.travelGoals[existingIndex] = updated;
      return updated;
    }

    const created: TravelGoal = {
      id: this.nextTravelGoalId++,
      userId,
      year,
      targetTrips: input.targetTrips ?? 6,
      targetProvinces: input.targetProvinces ?? 8,
      targetTravelDays: input.targetTravelDays ?? 20,
      targetPoints: input.targetPoints ?? 1200,
      currentTrips: input.currentTrips ?? 0,
      currentProvinces: input.currentProvinces ?? 0,
      currentTravelDays: input.currentTravelDays ?? 0,
      currentPoints: input.currentPoints ?? 0,
      notes: input.notes ?? null,
      lastActivityAt: input.lastActivityAt ?? null,
      createdAt: now,
      updatedAt: now,
    };

    this.travelGoals.push(created);
    return created;
  }

  // Category methods  
  async getCategories(): Promise<Category[]> {
    return this.categories
      .filter((category) => category.isActive !== false)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async getCategory(id: number): Promise<Category | undefined> { return this.categories.find(c => c.id === id); }
  async getCategoryBySlug(slug: string): Promise<Category | undefined> { return this.categories.find(c => c.slug === slug); }
  async createCategory(insertCategory: InsertCategory): Promise<Category> { 
    const category: Category = {
      id: this.nextCategoryId++,
      name: insertCategory.name,
      slug: insertCategory.slug,
      description: insertCategory.description ?? null,
      image: insertCategory.image ?? null,
      parentId: insertCategory.parentId ?? null,
      isActive: insertCategory.isActive ?? true,
      createdAt: new Date(),
    };
    this.categories.push(category);
    return category;
  }
  async updateCategory(id: number, categoryData: Partial<InsertCategory>): Promise<Category> { 
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    this.categories[index] = { ...this.categories[index], ...categoryData };
    return this.categories[index];
  }
  async deleteCategory(id: number): Promise<void> { 
    const index = this.categories.findIndex(c => c.id === id);
    if (index !== -1) {
      this.categories[index] = { ...this.categories[index], isActive: false };
    }
  }

  // Product methods
  async getProducts(categoryId?: number, limit = 20, offset = 0): Promise<Product[]> {
    let filtered = this.products.filter((product) => product.isActive !== false);

    if (categoryId) {
      filtered = filtered.filter((product) => product.categoryId === categoryId);
    }

    return filtered
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime(),
      )
      .slice(offset, offset + limit);
  }

  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    return this.products
      .filter((product) => product.isActive !== false && product.isFeatured === true)
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime(),
      )
      .slice(0, limit);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.find((product) => product.id === id);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return this.products.find((product) => product.slug === slug && product.isActive !== false);
  }

  async searchProducts(query: string, limit = 20): Promise<Product[]> {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return this.getProducts(undefined, limit, 0);
    }

    return this.products
      .filter((product) => {
        if (product.isActive === false) return false;
        return (
          product.name.toLowerCase().includes(needle) ||
          product.slug.toLowerCase().includes(needle) ||
          (product.description || "").toLowerCase().includes(needle) ||
          (product.brand || "").toLowerCase().includes(needle) ||
          (product.sku || "").toLowerCase().includes(needle)
        );
      })
      .slice(0, limit);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const now = new Date();
    const product: Product = {
      id: this.nextProductId++,
      name: insertProduct.name,
      slug: insertProduct.slug,
      description: insertProduct.description ?? null,
      shortDescription: insertProduct.shortDescription ?? null,
      price: String(insertProduct.price),
      salePrice: insertProduct.salePrice ? String(insertProduct.salePrice) : null,
      sku: insertProduct.sku ?? null,
      stock: insertProduct.stock ?? 0,
      images: insertProduct.images ?? [],
      categoryId: insertProduct.categoryId ?? null,
      brand: insertProduct.brand ?? null,
      weight: insertProduct.weight ? String(insertProduct.weight) : null,
      dimensions: insertProduct.dimensions ?? null,
      colors: insertProduct.colors ?? [],
      sizes: insertProduct.sizes ?? [],
      materials: insertProduct.materials ?? [],
      features: insertProduct.features ?? [],
      isActive: insertProduct.isActive ?? true,
      isFeatured: insertProduct.isFeatured ?? false,
      rating: insertProduct.rating ? String(insertProduct.rating) : "0",
      reviewCount: insertProduct.reviewCount ?? 0,
      createdAt: now,
      updatedAt: now,
    };

    this.products.push(product);
    return product;
  }

  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product> {
    const index = this.products.findIndex((product) => product.id === id);
    if (index === -1) throw new Error("Product not found");

    const existing = this.products[index];
    this.products[index] = {
      ...existing,
      ...productData,
      price: productData.price ? String(productData.price) : existing.price,
      salePrice: productData.salePrice ? String(productData.salePrice) : existing.salePrice,
      weight: productData.weight ? String(productData.weight) : existing.weight,
      rating: productData.rating ? String(productData.rating) : existing.rating,
      updatedAt: new Date(),
    };

    return this.products[index];
  }

  async deleteProduct(id: number): Promise<void> {
    const index = this.products.findIndex((product) => product.id === id);
    if (index !== -1) {
      this.products[index] = {
        ...this.products[index],
        isActive: false,
        updatedAt: new Date(),
      };
    }
  }

  // Product variant methods
  async getProductVariants(productId: number): Promise<ProductVariant[]> {
    return this.productVariants.filter(
      (variant) => variant.productId === productId && variant.isActive !== false,
    );
  }

  async getProductVariant(id: number): Promise<ProductVariant | undefined> {
    return this.productVariants.find((variant) => variant.id === id);
  }

  async createProductVariant(variant: InsertProductVariant): Promise<ProductVariant> {
    const created: ProductVariant = {
      id: this.nextProductVariantId++,
      productId: variant.productId ?? null,
      sku: variant.sku ?? null,
      size: variant.size ?? null,
      color: variant.color ?? null,
      price: variant.price ? String(variant.price) : null,
      stock: variant.stock ?? 0,
      image: variant.image ?? null,
      isActive: variant.isActive ?? true,
    };

    this.productVariants.push(created);
    return created;
  }

  async updateProductVariant(id: number, variantData: Partial<InsertProductVariant>): Promise<ProductVariant> {
    const index = this.productVariants.findIndex((variant) => variant.id === id);
    if (index === -1) throw new Error("Product variant not found");

    this.productVariants[index] = {
      ...this.productVariants[index],
      ...variantData,
      price: variantData.price ? String(variantData.price) : this.productVariants[index].price,
    };

    return this.productVariants[index];
  }

  async deleteProductVariant(id: number): Promise<void> {
    const index = this.productVariants.findIndex((variant) => variant.id === id);
    if (index !== -1) {
      this.productVariants[index] = {
        ...this.productVariants[index],
        isActive: false,
      };
    }
  }

  // Cart methods
  async getCartItems(userId: number): Promise<CartItem[]> {
    return this.cartItems.filter((item) => item.userId === userId);
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    if (!item.userId || !item.productId) {
      throw new Error("userId and productId are required");
    }

    const existingIndex = this.cartItems.findIndex(
      (cartItem) =>
        cartItem.userId === item.userId &&
        cartItem.productId === item.productId &&
        (cartItem.variantId ?? null) === (item.variantId ?? null),
    );

    if (existingIndex !== -1) {
      const existing = this.cartItems[existingIndex];
      this.cartItems[existingIndex] = {
        ...existing,
        quantity: existing.quantity + (item.quantity ?? 1),
        price: String(item.price ?? existing.price),
      };
      return this.cartItems[existingIndex];
    }

    const cartItem: CartItem = {
      id: this.nextCartItemId++,
      userId: item.userId,
      productId: item.productId,
      variantId: item.variantId ?? null,
      quantity: item.quantity ?? 1,
      price: String(item.price),
      createdAt: new Date(),
    };

    this.cartItems.push(cartItem);
    return cartItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem> {
    const index = this.cartItems.findIndex((item) => item.id === id);
    if (index === -1) throw new Error("Cart item not found");

    this.cartItems[index] = {
      ...this.cartItems[index],
      quantity: Math.max(1, quantity),
    };

    return this.cartItems[index];
  }

  async removeFromCart(id: number): Promise<void> {
    this.cartItems = this.cartItems.filter((item) => item.id !== id);
  }

  async clearCart(userId: number): Promise<void> {
    this.cartItems = this.cartItems.filter((item) => item.userId !== userId);
  }

  // Order methods
  async getOrders(userId: number): Promise<Order[]> {
    return this.orders
      .filter((order) => order.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime(),
      );
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.find((order) => order.id === id);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const now = new Date();
    const created: Order = {
      id: this.nextOrderId++,
      userId: order.userId ?? null,
      orderNumber: order.orderNumber,
      status: order.status ?? "pending",
      subtotal: String(order.subtotal),
      shippingFee: order.shippingFee ? String(order.shippingFee) : "0",
      tax: order.tax ? String(order.tax) : "0",
      total: String(order.total),
      currency: order.currency ?? "PHP",
      paymentMethod: order.paymentMethod ?? null,
      paymentStatus: order.paymentStatus ?? "pending",
      paymentId: order.paymentId ?? null,
      shippingAddress: order.shippingAddress ?? null,
      billingAddress: order.billingAddress ?? null,
      notes: order.notes ?? null,
      createdAt: now,
      updatedAt: now,
    };

    this.orders.push(created);
    return created;
  }

  async updateOrder(id: number, orderData: Partial<InsertOrder>): Promise<Order> {
    const index = this.orders.findIndex((order) => order.id === id);
    if (index === -1) throw new Error("Order not found");

    const existing = this.orders[index];
    this.orders[index] = {
      ...existing,
      ...orderData,
      subtotal: orderData.subtotal ? String(orderData.subtotal) : existing.subtotal,
      shippingFee: orderData.shippingFee ? String(orderData.shippingFee) : existing.shippingFee,
      tax: orderData.tax ? String(orderData.tax) : existing.tax,
      total: orderData.total ? String(orderData.total) : existing.total,
      updatedAt: new Date(),
    };

    return this.orders[index];
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return this.orderItems.filter((item) => item.orderId === orderId);
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const created: OrderItem = {
      id: this.nextOrderItemId++,
      orderId: item.orderId ?? null,
      productId: item.productId ?? null,
      variantId: item.variantId ?? null,
      quantity: item.quantity,
      price: String(item.price),
      total: String(item.total),
    };

    this.orderItems.push(created);
    return created;
  }

  // Review methods
  async getProductReviews(productId: number): Promise<Review[]> {
    return this.reviews
      .filter((review) => review.productId === productId)
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime(),
      );
  }

  async createReview(review: InsertReview): Promise<Review> {
    const created: Review = {
      id: this.nextReviewId++,
      productId: review.productId ?? null,
      userId: review.userId ?? null,
      rating: review.rating,
      title: review.title ?? null,
      comment: review.comment ?? null,
      isVerified: review.isVerified ?? false,
      createdAt: new Date(),
    };

    this.reviews.push(created);
    this.syncProductReviewStats(created.productId);
    return created;
  }

  async updateReview(id: number, reviewData: Partial<InsertReview>): Promise<Review> {
    const index = this.reviews.findIndex((review) => review.id === id);
    if (index === -1) throw new Error("Review not found");

    this.reviews[index] = {
      ...this.reviews[index],
      ...reviewData,
    };

    this.syncProductReviewStats(this.reviews[index].productId);
    return this.reviews[index];
  }

  async deleteReview(id: number): Promise<void> {
    const review = this.reviews.find((item) => item.id === id);
    this.reviews = this.reviews.filter((item) => item.id !== id);
    this.syncProductReviewStats(review?.productId ?? null);
  }

  // Wishlist methods
  async getWishlistItems(userId: number): Promise<WishlistItem[]> {
    return this.wishlistItems.filter((item) => item.userId === userId);
  }

  async addToWishlist(item: InsertWishlistItem): Promise<WishlistItem> {
    if (!item.userId || !item.productId) {
      throw new Error("userId and productId are required");
    }

    const existing = this.wishlistItems.find(
      (wishlistItem) =>
        wishlistItem.userId === item.userId &&
        wishlistItem.productId === item.productId,
    );

    if (existing) {
      return existing;
    }

    const created: WishlistItem = {
      id: this.nextWishlistItemId++,
      userId: item.userId,
      productId: item.productId,
      createdAt: new Date(),
    };

    this.wishlistItems.push(created);
    return created;
  }

  async removeFromWishlist(userId: number, productId: number): Promise<void> {
    this.wishlistItems = this.wishlistItems.filter(
      (item) => !(item.userId === userId && item.productId === productId),
    );
  }

  private syncProductReviewStats(productId: number | null) {
    if (!productId) return;

    const productIndex = this.products.findIndex((product) => product.id === productId);
    if (productIndex === -1) return;

    const productReviews = this.reviews.filter((review) => review.productId === productId);
    const reviewCount = productReviews.length;
    const averageRating = reviewCount
      ? productReviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
      : 0;

    this.products[productIndex] = {
      ...this.products[productIndex],
      reviewCount,
      rating: averageRating.toFixed(2),
      updatedAt: new Date(),
    };
  }
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user || undefined;
  }

  async getUserByFacebookId(facebookId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.facebookId, facebookId));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User> {
    const [user] = await db.update(users).set(userData).where(eq(users.id, id)).returning();
    return user;
  }

  async getTravelGoal(userId: number, year: number): Promise<TravelGoal | undefined> {
    const [goal] = await db
      .select()
      .from(travelGoals)
      .where(and(eq(travelGoals.userId, userId), eq(travelGoals.year, year)));
    return goal || undefined;
  }

  async upsertTravelGoal(userId: number, input: UpsertTravelGoalInput): Promise<TravelGoal> {
    const now = new Date();
    const existing = await this.getTravelGoal(userId, input.year);

    if (existing) {
      const [updated] = await db
        .update(travelGoals)
        .set({
          targetTrips: input.targetTrips ?? existing.targetTrips,
          targetProvinces: input.targetProvinces ?? existing.targetProvinces,
          targetTravelDays: input.targetTravelDays ?? existing.targetTravelDays,
          targetPoints: input.targetPoints ?? existing.targetPoints,
          currentTrips: input.currentTrips ?? existing.currentTrips,
          currentProvinces: input.currentProvinces ?? existing.currentProvinces,
          currentTravelDays: input.currentTravelDays ?? existing.currentTravelDays,
          currentPoints: input.currentPoints ?? existing.currentPoints,
          notes: input.notes === undefined ? existing.notes : input.notes,
          lastActivityAt:
            input.lastActivityAt === undefined ? existing.lastActivityAt : input.lastActivityAt,
          updatedAt: now,
        })
        .where(eq(travelGoals.id, existing.id))
        .returning();
      return updated;
    }

    const [created] = await db
      .insert(travelGoals)
      .values({
        userId,
        year: input.year,
        targetTrips: input.targetTrips ?? 6,
        targetProvinces: input.targetProvinces ?? 8,
        targetTravelDays: input.targetTravelDays ?? 20,
        targetPoints: input.targetPoints ?? 1200,
        currentTrips: input.currentTrips ?? 0,
        currentProvinces: input.currentProvinces ?? 0,
        currentTravelDays: input.currentTravelDays ?? 0,
        currentPoints: input.currentPoints ?? 0,
        notes: input.notes ?? null,
        lastActivityAt: input.lastActivityAt ?? null,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return created;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).where(eq(categories.isActive, true)).orderBy(asc(categories.name));
  }

  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category || undefined;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }

  async updateCategory(id: number, categoryData: Partial<InsertCategory>): Promise<Category> {
    const [category] = await db.update(categories).set(categoryData).where(eq(categories.id, id)).returning();
    return category;
  }

  async deleteCategory(id: number): Promise<void> {
    await db.update(categories).set({ isActive: false }).where(eq(categories.id, id));
  }

  // Product methods
  async getProducts(categoryId?: number, limit = 20, offset = 0): Promise<Product[]> {
    let query = db.select().from(products).where(eq(products.isActive, true));
    
    if (categoryId) {
      query = query.where(and(eq(products.isActive, true), eq(products.categoryId, categoryId)));
    }
    
    return await query.orderBy(desc(products.createdAt)).limit(limit).offset(offset);
  }

  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    return await db.select().from(products)
      .where(and(eq(products.isActive, true), eq(products.isFeatured, true)))
      .orderBy(desc(products.createdAt))
      .limit(limit);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.slug, slug));
    return product || undefined;
  }

  async searchProducts(query: string, limit = 20): Promise<Product[]> {
    // Simple text search - in production, you'd use full-text search
    return await db.select().from(products)
      .where(eq(products.isActive, true))
      .limit(limit);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: number, productData: Partial<InsertProduct>): Promise<Product> {
    const [product] = await db.update(products).set(productData).where(eq(products.id, id)).returning();
    return product;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.update(products).set({ isActive: false }).where(eq(products.id, id));
  }

  // Product variant methods
  async getProductVariants(productId: number): Promise<ProductVariant[]> {
    return await db.select().from(productVariants)
      .where(and(eq(productVariants.productId, productId), eq(productVariants.isActive, true)));
  }

  async getProductVariant(id: number): Promise<ProductVariant | undefined> {
    const [variant] = await db.select().from(productVariants).where(eq(productVariants.id, id));
    return variant || undefined;
  }

  async createProductVariant(insertVariant: InsertProductVariant): Promise<ProductVariant> {
    const [variant] = await db.insert(productVariants).values(insertVariant).returning();
    return variant;
  }

  async updateProductVariant(id: number, variantData: Partial<InsertProductVariant>): Promise<ProductVariant> {
    const [variant] = await db.update(productVariants).set(variantData).where(eq(productVariants.id, id)).returning();
    return variant;
  }

  async deleteProductVariant(id: number): Promise<void> {
    await db.update(productVariants).set({ isActive: false }).where(eq(productVariants.id, id));
  }

  // Cart methods
  async getCartItems(userId: number): Promise<CartItem[]> {
    return await db.select().from(cartItems).where(eq(cartItems.userId, userId));
  }

  async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = await db.select().from(cartItems)
      .where(and(
        eq(cartItems.userId, insertCartItem.userId!),
        eq(cartItems.productId, insertCartItem.productId!),
        insertCartItem.variantId ? eq(cartItems.variantId, insertCartItem.variantId) : sql`${cartItems.variantId} IS NULL`
      ));

    if (existingItem.length > 0) {
      // Update quantity
      const [updated] = await db.update(cartItems)
        .set({ quantity: existingItem[0].quantity + (insertCartItem.quantity || 1) })
        .where(eq(cartItems.id, existingItem[0].id))
        .returning();
      return updated;
    } else {
      // Add new item
      const [item] = await db.insert(cartItems).values(insertCartItem).returning();
      return item;
    }
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem> {
    const [item] = await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, id)).returning();
    return item;
  }

  async removeFromCart(id: number): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  }

  async clearCart(userId: number): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }

  // Order methods
  async getOrders(userId: number): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(insertOrder).returning();
    return order;
  }

  async updateOrder(id: number, orderData: Partial<InsertOrder>): Promise<Order> {
    const [order] = await db.update(orders).set(orderData).where(eq(orders.id, id)).returning();
    return order;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const [item] = await db.insert(orderItems).values(insertOrderItem).returning();
    return item;
  }

  // Review methods
  async getProductReviews(productId: number): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.productId, productId)).orderBy(desc(reviews.createdAt));
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(insertReview).returning();
    return review;
  }

  async updateReview(id: number, reviewData: Partial<InsertReview>): Promise<Review> {
    const [review] = await db.update(reviews).set(reviewData).where(eq(reviews.id, id)).returning();
    return review;
  }

  async deleteReview(id: number): Promise<void> {
    await db.delete(reviews).where(eq(reviews.id, id));
  }

  // Wishlist methods
  async getWishlistItems(userId: number): Promise<WishlistItem[]> {
    return await db.select().from(wishlistItems).where(eq(wishlistItems.userId, userId));
  }

  async addToWishlist(insertWishlistItem: InsertWishlistItem): Promise<WishlistItem> {
    const [item] = await db.insert(wishlistItems).values(insertWishlistItem).returning();
    return item;
  }

  async removeFromWishlist(userId: number, productId: number): Promise<void> {
    await db.delete(wishlistItems).where(and(eq(wishlistItems.userId, userId), eq(wishlistItems.productId, productId)));
  }
}

// Use database storage when DATABASE_URL is available, otherwise fallback to memory storage.
export const storage: IStorage = process.env.DATABASE_URL
  ? new DatabaseStorage()
  : new MemoryStorage();
