import { sql } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  text,
  timestamp,
  boolean,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Chat types
export const chatTypeEnum = pgEnum('chat_type', ['direct', 'group', 'trip', 'host_community']);
export const messageTypeEnum = pgEnum('message_type', ['text', 'image', 'file', 'system']);

// Chat rooms/groups
export const chatRooms = pgTable("chat_rooms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  type: chatTypeEnum("type").notNull(),
  description: text("description"),
  avatar: varchar("avatar"),
  
  // Trip-specific fields
  tripId: varchar("trip_id"), // Reference to tour/trip
  hostId: varchar("host_id"), // Host who created/manages the chat
  
  // Settings
  isActive: boolean("is_active").default(true),
  maxParticipants: varchar("max_participants"), // JSON string for flexibility
  settings: jsonb("settings"), // Chat settings as JSON
  
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Chat participants/members
export const chatParticipants = pgTable("chat_participants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  chatRoomId: varchar("chat_room_id").notNull(),
  userId: varchar("user_id").notNull(),
  
  // Participant role and status
  role: varchar("role", { length: 50 }).default("member"), // member, admin, host
  isActive: boolean("is_active").default(true),
  isMuted: boolean("is_muted").default(false),
  
  // Tracking
  joinedAt: timestamp("joined_at").defaultNow(),
  lastSeenAt: timestamp("last_seen_at"),
  leftAt: timestamp("left_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Chat messages
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  chatRoomId: varchar("chat_room_id").notNull(),
  senderId: varchar("sender_id").notNull(),
  senderName: varchar("sender_name").notNull(), // Cached for performance
  senderAvatar: varchar("sender_avatar"), // Cached for performance
  
  // Message content
  type: messageTypeEnum("type").default("text"),
  content: text("content").notNull(),
  attachments: jsonb("attachments"), // File attachments as JSON array
  metadata: jsonb("metadata"), // Additional data (reply info, etc.)
  
  // Message status
  isEdited: boolean("is_edited").default(false),
  isDeleted: boolean("is_deleted").default(false),
  editedAt: timestamp("edited_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Message read receipts
export const messageReadReceipts = pgTable("message_read_receipts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  messageId: varchar("message_id").notNull(),
  userId: varchar("user_id").notNull(),
  readAt: timestamp("read_at").defaultNow(),
});

// Chat room stats (for performance)
export const chatRoomStats = pgTable("chat_room_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  chatRoomId: varchar("chat_room_id").unique().notNull(),
  
  participantCount: varchar("participant_count").default("0"),
  messageCount: varchar("message_count").default("0"),
  lastMessageAt: timestamp("last_message_at"),
  lastMessageContent: text("last_message_content"), // Preview
  lastMessageSender: varchar("last_message_sender"),
  
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Type exports
export type ChatRoom = typeof chatRooms.$inferSelect;
export type InsertChatRoom = typeof chatRooms.$inferInsert;
export type ChatParticipant = typeof chatParticipants.$inferSelect;
export type InsertChatParticipant = typeof chatParticipants.$inferInsert;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;
export type MessageReadReceipt = typeof messageReadReceipts.$inferSelect;
export type InsertMessageReadReceipt = typeof messageReadReceipts.$inferInsert;
export type ChatRoomStats = typeof chatRoomStats.$inferSelect;
export type InsertChatRoomStats = typeof chatRoomStats.$inferInsert;

// Zod schemas
export const insertChatRoomSchema = createInsertSchema(chatRooms);
export const selectChatRoomSchema = createSelectSchema(chatRooms);

export const insertChatParticipantSchema = createInsertSchema(chatParticipants);
export const selectChatParticipantSchema = createSelectSchema(chatParticipants);

export const insertChatMessageSchema = createInsertSchema(chatMessages);
export const selectChatMessageSchema = createSelectSchema(chatMessages);

// Extended types for API responses
export interface ChatRoomWithStats extends ChatRoom {
  stats: ChatRoomStats;
  participantCount: number;
  unreadCount: number;
  lastMessage?: {
    content: string;
    sender: string;
    timestamp: string;
  };
}

export interface ChatMessageWithSender extends ChatMessage {
  isOwnMessage: boolean;
  readBy?: string[]; // List of users who read the message
}

export interface ChatParticipantWithUser extends ChatParticipant {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}

// Chat events for real-time functionality
export interface ChatEvent {
  type: 'message' | 'user_joined' | 'user_left' | 'typing' | 'read_receipt';
  chatRoomId: string;
  userId?: string;
  data: any;
  timestamp: string;
}