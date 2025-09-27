import { sql } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  text,
  timestamp,
  integer,
  decimal,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Tour status enum
export const tourStatusEnum = pgEnum('tour_status', ['active', 'inactive', 'pending']);

// User role enum  
export const userRoleEnum = pgEnum('user_role', ['user', 'host', 'admin']);

// User status enum
export const userStatusEnum = pgEnum('user_status', ['active', 'suspended']);

// Article status enum
export const articleStatusEnum = pgEnum('article_status', ['published', 'draft', 'review']);

// Tours table for admin management
export const adminTours = pgTable("admin_tours", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: text("category").notNull(), // JSON array as text
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

// Admin articles table
export const adminArticles = pgTable("admin_articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  content: text("content"),
  excerpt: text("excerpt"),
  category: varchar("category", { length: 100 }).notNull(),
  tags: text("tags"), // JSON array as text
  author: varchar("author", { length: 255 }).notNull(),
  authorId: varchar("author_id"),
  status: articleStatusEnum("status").default("draft"),
  featuredImage: varchar("featured_image"),
  views: integer("views").default(0),
  likes: integer("likes").default(0),
  publishedAt: timestamp("published_at"),
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
  status: varchar("status", { length: 50 }).default("pending"), // pending, confirmed, cancelled, completed
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
  specialties: text("specialties"), // JSON array as text
  experience: varchar("experience"),
  location: varchar("location"),
  website: varchar("website"),
  socialMedia: text("social_media"), // JSON object as text
  verificationStatus: varchar("verification_status").default("pending"), // pending, verified, rejected
  documentsSubmitted: boolean("documents_submitted").default(false),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0"),
  totalTours: integer("total_tours").default(0),
  totalRevenue: decimal("total_revenue", { precision: 12, scale: 2 }).default("0"),
  commissionRate: decimal("commission_rate", { precision: 3, scale: 2 }).default("15.00"), // 15%
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Platform settings table
export const adminSettings = pgTable("admin_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: varchar("key", { length: 255 }).unique().notNull(),
  value: text("value"),
  category: varchar("category", { length: 100 }).default("general"),
  description: text("description"),
  dataType: varchar("data_type", { length: 50 }).default("string"), // string, number, boolean, json
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Type exports
export type AdminTour = typeof adminTours.$inferSelect;
export type InsertAdminTour = typeof adminTours.$inferInsert;
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = typeof adminUsers.$inferInsert;
export type AdminArticle = typeof adminArticles.$inferSelect;
export type InsertAdminArticle = typeof adminArticles.$inferInsert;
export type AdminBooking = typeof adminBookings.$inferSelect;
export type InsertAdminBooking = typeof adminBookings.$inferInsert;
export type AdminHost = typeof adminHosts.$inferSelect;
export type InsertAdminHost = typeof adminHosts.$inferInsert;
export type AdminSetting = typeof adminSettings.$inferSelect;
export type InsertAdminSetting = typeof adminSettings.$inferInsert;

// Zod schemas
export const insertAdminTourSchema = createInsertSchema(adminTours);
export const selectAdminTourSchema = createSelectSchema(adminTours);

export const insertAdminUserSchema = createInsertSchema(adminUsers);
export const selectAdminUserSchema = createSelectSchema(adminUsers);

export const insertAdminArticleSchema = createInsertSchema(adminArticles);
export const selectAdminArticleSchema = createSelectSchema(adminArticles);

export const insertAdminBookingSchema = createInsertSchema(adminBookings);
export const selectAdminBookingSchema = createSelectSchema(adminBookings);

export const insertAdminHostSchema = createInsertSchema(adminHosts);
export const selectAdminHostSchema = createSelectSchema(adminHosts);

export const insertAdminSettingSchema = createInsertSchema(adminSettings);
export const selectAdminSettingSchema = createSelectSchema(adminSettings);

// Analytics types
export interface AdminAnalytics {
  totalTours: number;
  activeTours: number;
  totalUsers: number;
  activeUsers: number;
  totalHosts: number;
  verifiedHosts: number;
  totalBookings: number;
  monthlyRevenue: number;
  monthlyBookings: number;
  topCategories: Array<{category: string; count: number}>;
  recentActivity: Array<{
    type: 'tour' | 'user' | 'booking' | 'host';
    action: string;
    timestamp: string;
    details: string;
  }>;
}

// Tour management filters
export interface TourFilters {
  status?: 'active' | 'inactive' | 'pending' | 'all';
  category?: string;
  hostId?: string;
  featured?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}

// User management filters  
export interface UserFilters {
  role?: 'user' | 'host' | 'admin' | 'all';
  status?: 'active' | 'suspended' | 'all';
  joinedAfter?: string;
  totalSpentMin?: number;
  totalBookingsMin?: number;
}

// Article management filters
export interface ArticleFilters {
  status?: 'published' | 'draft' | 'review' | 'all';
  category?: string;
  author?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}