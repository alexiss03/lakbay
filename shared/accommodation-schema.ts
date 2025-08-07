import { sql } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  text,
  timestamp,
  boolean,
  pgEnum,
  jsonb,
  decimal,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Accommodation types
export const accommodationTypeEnum = pgEnum('accommodation_type', ['hotel', 'resort', 'hostel', 'lodge', 'guesthouse', 'villa', 'apartment', 'boutique']);
export const roomTypeEnum = pgEnum('room_type', ['single', 'double', 'twin', 'triple', 'quad', 'suite', 'deluxe', 'family', 'dormitory']);
export const accommodationStatusEnum = pgEnum('accommodation_status', ['active', 'inactive', 'maintenance', 'pending']);
export const bookingStatusEnum = pgEnum('booking_status', ['pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show']);

// Accommodations (Properties)
export const accommodations = pgTable("accommodations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  type: accommodationTypeEnum("type").notNull(),
  description: text("description"),
  
  // Location details
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  province: varchar("province", { length: 100 }),
  country: varchar("country", { length: 100 }).default("Philippines"),
  zipCode: varchar("zip_code", { length: 20 }),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  
  // Contact information
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  website: varchar("website", { length: 255 }),
  
  // Property details
  starRating: integer("star_rating"), // 1-5 stars
  totalRooms: integer("total_rooms").default(0),
  totalBeds: integer("total_beds").default(0),
  checkinTime: varchar("checkin_time").default("14:00"),
  checkoutTime: varchar("checkout_time").default("11:00"),
  
  // Media
  heroImage: varchar("hero_image"),
  gallery: jsonb("gallery"), // Array of image URLs
  
  // Amenities and features
  amenities: jsonb("amenities"), // Array of amenity objects
  policies: jsonb("policies"), // Hotel policies as JSON
  features: jsonb("features"), // Special features
  
  // Business information
  hostId: varchar("host_id").notNull(), // Owner/manager ID
  licenseNumber: varchar("license_number"),
  taxId: varchar("tax_id"),
  
  // Status and settings
  status: accommodationStatusEnum("status").default("pending"),
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  
  // Financial
  commissionRate: decimal("commission_rate", { precision: 5, scale: 2 }).default("15.00"), // Platform commission
  
  // Ratings and reviews
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default("0.00"),
  totalReviews: integer("total_reviews").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Room Types/Categories
export const roomTypes = pgTable("room_types", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  accommodationId: varchar("accommodation_id").notNull(),
  
  name: varchar("name", { length: 100 }).notNull(), // e.g., "Deluxe Ocean View"
  type: roomTypeEnum("type").notNull(),
  description: text("description"),
  
  // Room specifications
  maxOccupancy: integer("max_occupancy").notNull(),
  bedConfiguration: varchar("bed_configuration"), // e.g., "1 King Bed", "2 Single Beds"
  roomSize: varchar("room_size"), // e.g., "25 sqm"
  
  // Pricing
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("PHP"),
  
  // Images and amenities
  images: jsonb("images"), // Array of room images
  amenities: jsonb("amenities"), // Room-specific amenities
  
  // Availability
  totalRooms: integer("total_rooms").notNull(), // Number of rooms of this type
  isActive: boolean("is_active").default(true),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Individual room inventory
export const rooms = pgTable("rooms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  accommodationId: varchar("accommodation_id").notNull(),
  roomTypeId: varchar("room_type_id").notNull(),
  
  roomNumber: varchar("room_number", { length: 20 }).notNull(),
  floor: integer("floor"),
  
  // Status
  status: varchar("status", { length: 20 }).default("available"), // available, occupied, maintenance, out_of_order
  lastCleaned: timestamp("last_cleaned"),
  maintenanceNotes: text("maintenance_notes"),
  
  // Features specific to this room
  hasBalcony: boolean("has_balcony").default(false),
  hasOceanView: boolean("has_ocean_view").default(false),
  isAccessible: boolean("is_accessible").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Accommodation bookings
export const accommodationBookings = pgTable("accommodation_bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  accommodationId: varchar("accommodation_id").notNull(),
  roomTypeId: varchar("room_type_id").notNull(),
  roomId: varchar("room_id"), // Assigned room (may be null until check-in)
  
  // Guest information
  guestName: varchar("guest_name", { length: 255 }).notNull(),
  guestEmail: varchar("guest_email", { length: 255 }).notNull(),
  guestPhone: varchar("guest_phone", { length: 50 }),
  guestCount: integer("guest_count").notNull(),
  
  // Booking details
  checkinDate: timestamp("checkin_date").notNull(),
  checkoutDate: timestamp("checkout_date").notNull(),
  nights: integer("nights").notNull(),
  
  // Pricing
  roomPrice: decimal("room_price", { precision: 10, scale: 2 }).notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("PHP"),
  
  // Status and tracking
  status: bookingStatusEnum("status").default("pending"),
  paymentStatus: varchar("payment_status", { length: 20 }).default("pending"),
  paymentIntentId: varchar("payment_intent_id"), // For payment processing
  
  // Special requests and notes
  specialRequests: text("special_requests"),
  internalNotes: text("internal_notes"),
  
  // Confirmation details
  confirmationCode: varchar("confirmation_code", { length: 20 }),
  
  // Check-in/out tracking
  checkedInAt: timestamp("checked_in_at"),
  checkedOutAt: timestamp("checked_out_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Accommodation reviews
export const accommodationReviews = pgTable("accommodation_reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  accommodationId: varchar("accommodation_id").notNull(),
  bookingId: varchar("booking_id").notNull(),
  
  // Reviewer information
  guestName: varchar("guest_name", { length: 255 }).notNull(),
  guestEmail: varchar("guest_email", { length: 255 }),
  
  // Review content
  rating: integer("rating").notNull(), // 1-5 stars
  title: varchar("title", { length: 255 }),
  content: text("content"),
  
  // Detailed ratings
  cleanlinessRating: integer("cleanliness_rating"),
  serviceRating: integer("service_rating"),
  locationRating: integer("location_rating"),
  valueRating: integer("value_rating"),
  
  // Status
  isApproved: boolean("is_approved").default(false),
  isVisible: boolean("is_visible").default(true),
  
  // Response from accommodation
  response: text("response"),
  responseDate: timestamp("response_date"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Seasonal pricing and availability
export const seasonalPricing = pgTable("seasonal_pricing", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  accommodationId: varchar("accommodation_id").notNull(),
  roomTypeId: varchar("room_type_id").notNull(),
  
  name: varchar("name", { length: 100 }).notNull(), // e.g., "Summer Season", "Christmas Holiday"
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  
  // Pricing adjustments
  priceModifier: decimal("price_modifier", { precision: 5, scale: 2 }).notNull(), // Multiplier (1.0 = no change, 1.5 = 50% increase)
  minimumStay: integer("minimum_stay").default(1),
  
  isActive: boolean("is_active").default(true),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Type exports
export type Accommodation = typeof accommodations.$inferSelect;
export type InsertAccommodation = typeof accommodations.$inferInsert;
export type RoomType = typeof roomTypes.$inferSelect;
export type InsertRoomType = typeof roomTypes.$inferInsert;
export type Room = typeof rooms.$inferSelect;
export type InsertRoom = typeof rooms.$inferInsert;
export type AccommodationBooking = typeof accommodationBookings.$inferSelect;
export type InsertAccommodationBooking = typeof accommodationBookings.$inferInsert;
export type AccommodationReview = typeof accommodationReviews.$inferSelect;
export type InsertAccommodationReview = typeof accommodationReviews.$inferInsert;
export type SeasonalPricing = typeof seasonalPricing.$inferSelect;
export type InsertSeasonalPricing = typeof seasonalPricing.$inferInsert;

// Zod schemas
export const insertAccommodationSchema = createInsertSchema(accommodations);
export const selectAccommodationSchema = createSelectSchema(accommodations);

export const insertRoomTypeSchema = createInsertSchema(roomTypes);
export const selectRoomTypeSchema = createSelectSchema(roomTypes);

export const insertAccommodationBookingSchema = createInsertSchema(accommodationBookings);
export const selectAccommodationBookingSchema = createSelectSchema(accommodationBookings);

// Extended types for API responses
export interface AccommodationWithStats extends Accommodation {
  occupancyRate: number;
  revenueThisMonth: number;
  upcomingBookings: number;
  roomTypesCount: number;
  availableRooms: number;
}

export interface RoomTypeWithAvailability extends RoomType {
  availableRooms: number;
  occupiedRooms: number;
  maintenanceRooms: number;
  currentPrice: number; // Price including seasonal adjustments
}

export interface BookingWithDetails extends AccommodationBooking {
  accommodation: {
    name: string;
    type: string;
    address: string;
  };
  roomType: {
    name: string;
    type: string;
  };
  room?: {
    roomNumber: string;
    floor: number;
  };
}