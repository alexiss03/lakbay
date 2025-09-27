import { db } from "./db";
import { eq, and, desc, asc, sql } from "drizzle-orm";
import {
  users, categories, products, productVariants, cartItems, orders, orderItems, reviews, wishlistItems,
  type User, type InsertUser, type Category, type InsertCategory, type Product, type InsertProduct,
  type ProductVariant, type InsertProductVariant, type CartItem, type InsertCartItem,
  type Order, type InsertOrder, type OrderItem, type InsertOrderItem,
  type Review, type InsertReview, type WishlistItem, type InsertWishlistItem
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  getUserByFacebookId(facebookId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;

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
  private nextUserId = 1;
  private nextCategoryId = 1;
  private nextProductId = 1;

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

  // Category methods  
  async getCategories(): Promise<Category[]> { return this.categories; }
  async getCategory(id: number): Promise<Category | undefined> { return this.categories.find(c => c.id === id); }
  async getCategoryBySlug(slug: string): Promise<Category | undefined> { return this.categories.find(c => c.slug === slug); }
  async createCategory(insertCategory: InsertCategory): Promise<Category> { 
    const category: Category = { id: this.nextCategoryId++, ...insertCategory } as Category;
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
    if (index !== -1) this.categories.splice(index, 1);
  }

  // Stub implementations for other methods
  async getProducts(): Promise<Product[]> { return this.products; }
  async getFeaturedProducts(): Promise<Product[]> { return this.products.slice(0, 6); }
  async getProduct(id: number): Promise<Product | undefined> { return this.products.find(p => p.id === id); }
  async getProductBySlug(): Promise<Product | undefined> { return undefined; }
  async searchProducts(): Promise<Product[]> { return []; }
  async createProduct(): Promise<Product> { throw new Error('Not implemented'); }
  async updateProduct(): Promise<Product> { throw new Error('Not implemented'); }
  async deleteProduct(): Promise<void> { throw new Error('Not implemented'); }
  async getProductVariants(): Promise<ProductVariant[]> { return []; }
  async getProductVariant(): Promise<ProductVariant | undefined> { return undefined; }
  async createProductVariant(): Promise<ProductVariant> { throw new Error('Not implemented'); }
  async updateProductVariant(): Promise<ProductVariant> { throw new Error('Not implemented'); }
  async deleteProductVariant(): Promise<void> { throw new Error('Not implemented'); }
  async getCartItems(): Promise<CartItem[]> { return []; }
  async addToCart(): Promise<CartItem> { throw new Error('Not implemented'); }
  async updateCartItem(): Promise<CartItem> { throw new Error('Not implemented'); }
  async removeFromCart(): Promise<void> { throw new Error('Not implemented'); }
  async clearCart(): Promise<void> { throw new Error('Not implemented'); }
  async getOrders(): Promise<Order[]> { return []; }
  async getOrder(): Promise<Order | undefined> { return undefined; }
  async createOrder(): Promise<Order> { throw new Error('Not implemented'); }
  async updateOrder(): Promise<Order> { throw new Error('Not implemented'); }
  async getOrderItems(): Promise<OrderItem[]> { return []; }
  async createOrderItem(): Promise<OrderItem> { throw new Error('Not implemented'); }
  async getProductReviews(): Promise<Review[]> { return []; }
  async createReview(): Promise<Review> { throw new Error('Not implemented'); }
  async updateReview(): Promise<Review> { throw new Error('Not implemented'); }
  async deleteReview(): Promise<void> { throw new Error('Not implemented'); }
  async getWishlistItems(): Promise<WishlistItem[]> { return []; }
  async addToWishlist(): Promise<WishlistItem> { throw new Error('Not implemented'); }
  async removeFromWishlist(): Promise<void> { throw new Error('Not implemented'); }
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
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

// Use memory storage temporarily since database is unavailable
export const storage = new MemoryStorage();
