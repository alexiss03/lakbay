import { sql } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  text,
  integer,
  decimal,
  timestamp,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Products table
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  category: varchar("category").notNull(), // electronics, clothing, home, books, etc.
  brand: varchar("brand"),
  sku: varchar("sku").unique().notNull(), // stock keeping unit
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  costPrice: decimal("cost_price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").default(0),
  lowStockThreshold: integer("low_stock_threshold").default(5),
  images: jsonb("images").$type<string[]>().default([]),
  weight: decimal("weight", { precision: 8, scale: 2 }), // in kg
  dimensions: jsonb("dimensions").$type<{ length: number; width: number; height: number }>(),
  status: varchar("status").notNull().default("active"), // active, inactive, discontinued
  tags: jsonb("tags").$type<string[]>().default([]),
  shopId: varchar("shop_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Stock movements table
export const stockMovements = pgTable("stock_movements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull(),
  type: varchar("type").notNull(), // in, out, adjustment
  quantity: integer("quantity").notNull(),
  reason: varchar("reason").notNull(), // purchase, sale, return, damaged, adjustment
  referenceId: varchar("reference_id"), // order ID, purchase ID, etc.
  notes: text("notes"),
  performedBy: varchar("performed_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Orders table
export const shopOrders = pgTable("shop_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderNumber: varchar("order_number").unique().notNull(),
  customerId: varchar("customer_id"),
  customerName: varchar("customer_name").notNull(),
  customerEmail: varchar("customer_email").notNull(),
  customerPhone: varchar("customer_phone"),
  shippingAddress: jsonb("shipping_address").$type<{
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  }>().notNull(),
  billingAddress: jsonb("billing_address").$type<{
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  }>(),
  items: jsonb("items").$type<{
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[]>().notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingFee: decimal("shipping_fee", { precision: 10, scale: 2 }).default("0"),
  tax: decimal("tax", { precision: 10, scale: 2 }).default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: varchar("payment_status").notNull().default("pending"), // pending, paid, failed, refunded
  paymentMethod: varchar("payment_method"), // credit_card, paypal, bank_transfer, cod
  paymentId: varchar("payment_id"),
  orderStatus: varchar("order_status").notNull().default("pending"), // pending, confirmed, processing, shipped, delivered, cancelled
  shippingStatus: varchar("shipping_status").default("not_shipped"), // not_shipped, preparing, shipped, delivered
  trackingNumber: varchar("tracking_number"),
  shippingProvider: varchar("shipping_provider"), // fedex, ups, dhl, lbc, etc.
  notes: text("notes"),
  shopId: varchar("shop_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Shop analytics/stats table
export const shopStats = pgTable("shop_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  shopId: varchar("shop_id").notNull().unique(),
  totalProducts: integer("total_products").default(0),
  totalOrders: integer("total_orders").default(0),
  totalRevenue: decimal("total_revenue", { precision: 15, scale: 2 }).default("0"),
  monthlyRevenue: decimal("monthly_revenue", { precision: 12, scale: 2 }).default("0"),
  totalCustomers: integer("total_customers").default(0),
  averageOrderValue: decimal("average_order_value", { precision: 10, scale: 2 }).default("0"),
  totalSales: integer("total_sales").default(0),
  monthlySales: integer("monthly_sales").default(0),
  lowStockProducts: integer("low_stock_products").default(0),
  outOfStockProducts: integer("out_of_stock_products").default(0),
  pendingOrders: integer("pending_orders").default(0),
  shippingOrders: integer("shipping_orders").default(0),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Type definitions
export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
export type StockMovement = typeof stockMovements.$inferSelect;
export type InsertStockMovement = typeof stockMovements.$inferInsert;
export type ShopOrder = typeof shopOrders.$inferSelect;
export type InsertShopOrder = typeof shopOrders.$inferInsert;
export type ShopStats = typeof shopStats.$inferSelect;

// Zod schemas for validation
export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStockMovementSchema = createInsertSchema(stockMovements).omit({
  id: true,
  createdAt: true,
});

export const insertShopOrderSchema = createInsertSchema(shopOrders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProductData = z.infer<typeof insertProductSchema>;
export type InsertStockMovementData = z.infer<typeof insertStockMovementSchema>;
export type InsertShopOrderData = z.infer<typeof insertShopOrderSchema>;