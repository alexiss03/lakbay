import { pgTable, text, serial, integer, boolean, decimal, timestamp, varchar, jsonb, pgEnum, uniqueIndex } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User role enum
export const userRoleEnum = pgEnum('user_role', ['user', 'host', 'admin']);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password"),
  email: text("email"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  postalCode: text("postal_code"),
  country: text("country").default("Philippines"),
  googleId: text("google_id").unique(),
  facebookId: text("facebook_id").unique(),
  profileImage: text("profile_image"),
  authProvider: text("auth_provider").default("local"), // 'local', 'google', 'facebook'
  role: userRoleEnum("role").default("user"), // user, host, admin
  createdAt: timestamp("created_at").defaultNow(),
});

// Product Categories
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
  parentId: integer("parent_id"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Products
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  shortDescription: text("short_description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  salePrice: decimal("sale_price", { precision: 10, scale: 2 }),
  sku: text("sku").unique(),
  stock: integer("stock").default(0),
  images: text("images").array(),
  categoryId: integer("category_id").references(() => categories.id),
  brand: text("brand"),
  weight: decimal("weight", { precision: 8, scale: 2 }),
  dimensions: text("dimensions"),
  colors: text("colors").array(),
  sizes: text("sizes").array(),
  materials: text("materials").array(),
  features: text("features").array(),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Product Variants (for different sizes/colors)
export const productVariants = pgTable("product_variants", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id),
  sku: text("sku").unique(),
  size: text("size"),
  color: text("color"),
  price: decimal("price", { precision: 10, scale: 2 }),
  stock: integer("stock").default(0),
  image: text("image"),
  isActive: boolean("is_active").default(true),
});

// Shopping Cart
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  productId: integer("product_id").references(() => products.id),
  variantId: integer("variant_id").references(() => productVariants.id),
  quantity: integer("quantity").notNull().default(1),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Orders
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  orderNumber: text("order_number").notNull().unique(),
  status: text("status").notNull().default("pending"), // pending, processing, shipped, delivered, cancelled
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingFee: decimal("shipping_fee", { precision: 10, scale: 2 }).default("0"),
  tax: decimal("tax", { precision: 10, scale: 2 }).default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("PHP"),
  paymentMethod: text("payment_method"),
  paymentStatus: text("payment_status").default("pending"),
  paymentId: text("payment_id"),
  shippingAddress: jsonb("shipping_address"),
  billingAddress: jsonb("billing_address"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Order Items
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  productId: integer("product_id").references(() => products.id),
  variantId: integer("variant_id").references(() => productVariants.id),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
});

// Product Reviews
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id),
  userId: integer("user_id").references(() => users.id),
  rating: integer("rating").notNull(),
  title: text("title"),
  comment: text("comment"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Wishlist
export const wishlistItems = pgTable("wishlist_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  productId: integer("product_id").references(() => products.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  cartItems: many(cartItems),
  orders: many(orders),
  reviews: many(reviews),
  wishlistItems: many(wishlistItems),
}));

export const categoriesRelations = relations(categories, ({ many, one }) => ({
  products: many(products),
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
  children: many(categories),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  variants: many(productVariants),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
  reviews: many(reviews),
  wishlistItems: many(wishlistItems),
}));

export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
  cartItems: many(cartItems),
  orderItems: many(orderItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [cartItems.variantId],
    references: [productVariants.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));

export const wishlistItemsRelations = relations(wishlistItems, ({ one }) => ({
  user: one(users, {
    fields: [wishlistItems.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [wishlistItems.productId],
    references: [products.id],
  }),
}));

// Zod Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  address: true,
  city: true,
  postalCode: true,
  country: true,
  googleId: true,
  profileImage: true,
  authProvider: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductVariantSchema = createInsertSchema(productVariants).omit({
  id: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertWishlistItemSchema = createInsertSchema(wishlistItems).omit({
  id: true,
  createdAt: true,
});

// Tours/Lakbay table
export const tours = pgTable("tours", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("PHP"),
  hostName: text("host_name").notNull(),
  hostAvatar: text("host_avatar"),
  hostBio: text("host_bio"),
  maxParticipants: integer("max_participants").default(1),
  duration: text("duration"),
  location: text("location"),
  heroImage: text("hero_image"),
  featured: boolean("featured").default(false),
  status: text("status").default("pending"), // active, inactive, pending
  meetingPlace: text("meeting_place"),
  accommodation: jsonb("accommodation"), // {name, description}
  mapCenter: jsonb("map_center"), // {lat, lng}
  itinerary: jsonb("itinerary"), // array of daily activities
  trail: jsonb("trail"), // trail info for hiking tours
  
  // Tab content fields
  inclusions: text("inclusions").array(), // What's included
  thingsToBring: text("things_to_bring").array(), // Things to bring
  reminders: text("reminders").array(), // Important reminders
  cancellationPolicy: text("cancellation_policy"), // Cancellation terms
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertTourSchema = createInsertSchema(tours).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// User yearly travel goals with gamified progress tracking
export const travelGoals = pgTable(
  "travel_goals",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    year: integer("year").notNull(),
    targetTrips: integer("target_trips").notNull().default(6),
    targetProvinces: integer("target_provinces").notNull().default(8),
    targetTravelDays: integer("target_travel_days").notNull().default(20),
    targetPoints: integer("target_points").notNull().default(1200),
    currentTrips: integer("current_trips").notNull().default(0),
    currentProvinces: integer("current_provinces").notNull().default(0),
    currentTravelDays: integer("current_travel_days").notNull().default(0),
    currentPoints: integer("current_points").notNull().default(0),
    notes: text("notes"),
    lastActivityAt: timestamp("last_activity_at"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    userYearUnique: uniqueIndex("travel_goals_user_year_unique").on(table.userId, table.year),
  }),
);

export const insertTravelGoalSchema = createInsertSchema(travelGoals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProductVariant = z.infer<typeof insertProductVariantSchema>;
export type ProductVariant = typeof productVariants.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertWishlistItem = z.infer<typeof insertWishlistItemSchema>;
export type WishlistItem = typeof wishlistItems.$inferSelect;
export type InsertTour = z.infer<typeof insertTourSchema>;
export type Tour = typeof tours.$inferSelect;
export type InsertTravelGoal = z.infer<typeof insertTravelGoalSchema>;
export type TravelGoal = typeof travelGoals.$inferSelect;

// Tour status enum
export const tourStatusEnum = pgEnum('tour_status', ['active', 'inactive', 'pending']);

// User status enum
export const userStatusEnum = pgEnum('user_status', ['active', 'suspended']);

// Tours table for admin management
export const adminTours = pgTable("admin_tours", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("PHP"),
  status: tourStatusEnum("status").default("pending"),
  hostId: varchar("host_id").notNull(),
  hostName: varchar("host_name").notNull(),
  hostAvatar: varchar("host_avatar"),
  bookingsCount: integer("bookings_count").default(0),
  revenue: decimal("revenue", { precision: 12, scale: 2 }).default("0"),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0"),
  maxParticipants: integer("max_participants"),
  duration: varchar("duration"),
  location: varchar("location"),
  heroImage: varchar("hero_image"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Admin users table
export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  avatar: varchar("avatar"),
  role: userRoleEnum("role").default("user"),
  status: userStatusEnum("status").default("active"),
  totalBookings: integer("total_bookings").default(0),
  totalSpent: decimal("total_spent", { precision: 12, scale: 2 }).default("0"),
  lastLoginAt: timestamp("last_login_at"),
  joinedAt: timestamp("joined_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Admin bookings table for tracking
export const adminBookings = pgTable("admin_bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tourId: varchar("tour_id").notNull(),
  userId: varchar("user_id").notNull(),
  userName: varchar("user_name").notNull(),
  userEmail: varchar("user_email").notNull(),
  tourTitle: varchar("tour_title").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("PHP"),
  status: varchar("status", { length: 50 }).default("pending"),
  participants: integer("participants").default(1),
  bookingDate: timestamp("booking_date").notNull(),
  travelDate: timestamp("travel_date"),
  notes: text("notes"),
  paymentStatus: varchar("payment_status", { length: 50 }).default("pending"),
  paymentId: varchar("payment_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Admin hosts table
export const adminHosts = pgTable("admin_hosts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").unique().notNull(),
  businessName: varchar("business_name"),
  description: text("description"),
  specialties: text("specialties"),
  experience: varchar("experience"),
  location: varchar("location"),
  website: varchar("website"),
  socialMedia: text("social_media"),
  verificationStatus: varchar("verification_status").default("pending"),
  documentsSubmitted: boolean("documents_submitted").default(false),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0"),
  totalTours: integer("total_tours").default(0),
  totalRevenue: decimal("total_revenue", { precision: 12, scale: 2 }).default("0"),
  commissionRate: decimal("commission_rate", { precision: 3, scale: 2 }).default("15.00"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Admin schema types
export type AdminTour = typeof adminTours.$inferSelect;
export type InsertAdminTour = typeof adminTours.$inferInsert;
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = typeof adminUsers.$inferInsert;
export type AdminBooking = typeof adminBookings.$inferSelect;
export type InsertAdminBooking = typeof adminBookings.$inferInsert;
export type AdminHost = typeof adminHosts.$inferSelect;
export type InsertAdminHost = typeof adminHosts.$inferInsert;
