import { Router } from "express";
import { db } from "../db";
import { chatRooms, chatParticipants, chatMessages, chatRoomStats, messageReadReceipts } from "@shared/chat-schema";
import { eq, desc, and, count, sql } from "drizzle-orm";

const router = Router();

// Get user's chat rooms
router.get("/rooms/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const userChatRooms = await db
      .select({
        id: chatRooms.id,
        name: chatRooms.name,
        type: chatRooms.type,
        avatar: chatRooms.avatar,
        tripId: chatRooms.tripId,
        hostId: chatRooms.hostId,
        lastMessageAt: chatRoomStats.lastMessageAt,
        lastMessageContent: chatRoomStats.lastMessageContent,
        lastMessageSender: chatRoomStats.lastMessageSender,
        participantCount: chatRoomStats.participantCount,
        messageCount: chatRoomStats.messageCount,
      })
      .from(chatParticipants)
      .innerJoin(chatRooms, eq(chatParticipants.chatRoomId, chatRooms.id))
      .leftJoin(chatRoomStats, eq(chatRooms.id, chatRoomStats.chatRoomId))
      .where(
        and(
          eq(chatParticipants.userId, userId),
          eq(chatParticipants.isActive, true),
          eq(chatRooms.isActive, true)
        )
      )
      .orderBy(desc(chatRoomStats.lastMessageAt));

    // Calculate unread count for each room (simplified for demo)
    const roomsWithUnreadCount = userChatRooms.map(room => ({
      ...room,
      unreadCount: 0, // Would calculate based on user's last seen vs latest messages
    }));

    res.json(roomsWithUnreadCount);
  } catch (error) {
    console.error("Error fetching user chat rooms:", error);
    res.status(500).json({ error: "Failed to fetch chat rooms" });
  }
});

// Get chat room messages
router.get("/rooms/:roomId/messages", async (req, res) => {
  try {
    const { roomId } = req.params;
    const { limit = "50", offset = "0", userId } = req.query;

    const messages = await db
      .select()
      .from(chatMessages)
      .where(
        and(
          eq(chatMessages.chatRoomId, roomId),
          eq(chatMessages.isDeleted, false)
        )
      )
      .orderBy(desc(chatMessages.createdAt))
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string));

    // Add read receipts and mark own messages (simplified)
    const messagesWithMetadata = messages.map(message => ({
      ...message,
      isOwnMessage: message.senderId === userId,
      readBy: [], // Would fetch from messageReadReceipts table
    }));

    res.json(messagesWithMetadata);
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Send a message
router.post("/rooms/:roomId/messages", async (req, res) => {
  try {
    const { roomId } = req.params;
    const { senderId, senderName, senderAvatar, content, type = "text", attachments } = req.body;

    const [currentStats] = await db
      .select({ messageCount: chatRoomStats.messageCount })
      .from(chatRoomStats)
      .where(eq(chatRoomStats.chatRoomId, roomId))
      .limit(1);
    const nextMessageCount = (Number(currentStats?.messageCount || 0) + 1).toString();

    const [newMessage] = await db
      .insert(chatMessages)
      .values({
        chatRoomId: roomId,
        senderId,
        senderName,
        senderAvatar,
        content,
        type: type as any,
        attachments: attachments ? JSON.stringify(attachments) : null,
      })
      .returning();

    // Update chat room stats
    await db
      .insert(chatRoomStats)
      .values({
        chatRoomId: roomId,
        lastMessageAt: new Date(),
        lastMessageContent: content.substring(0, 100), // Preview
        lastMessageSender: senderName,
        messageCount: nextMessageCount,
      })
      .onConflictDoUpdate({
        target: chatRoomStats.chatRoomId,
        set: {
          lastMessageAt: new Date(),
          lastMessageContent: content.substring(0, 100),
          lastMessageSender: senderName,
          messageCount: nextMessageCount,
          updatedAt: new Date(),
        }
      });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// Create a chat room
router.post("/rooms", async (req, res) => {
  try {
    const { name, type, description, tripId, hostId, createdBy, participants = [] } = req.body;

    // Create the chat room
    const [newRoom] = await db
      .insert(chatRooms)
      .values({
        name,
        type: type as any,
        description,
        tripId,
        hostId,
        createdBy,
      })
      .returning();

    // Add participants
    if (participants.length > 0) {
      const participantRecords = participants.map((userId: string) => ({
        chatRoomId: newRoom.id,
        userId,
        role: userId === hostId ? 'host' : userId === createdBy ? 'admin' : 'member',
      }));

      await db.insert(chatParticipants).values(participantRecords);
    }

    // Initialize stats
    await db.insert(chatRoomStats).values({
      chatRoomId: newRoom.id,
      participantCount: participants.length.toString(),
    });

    res.status(201).json(newRoom);
  } catch (error) {
    console.error("Error creating chat room:", error);
    res.status(500).json({ error: "Failed to create chat room" });
  }
});

// Join a chat room
router.post("/rooms/:roomId/join", async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId } = req.body;

    const [participant] = await db
      .insert(chatParticipants)
      .values({
        chatRoomId: roomId,
        userId,
      })
      .returning();

    // Update participant count
    await db.execute(sql`
      UPDATE ${chatRoomStats}
      SET participant_count = participant_count::int + 1
      WHERE chat_room_id = ${roomId}
    `);

    res.status(201).json(participant);
  } catch (error) {
    console.error("Error joining chat room:", error);
    res.status(500).json({ error: "Failed to join chat room" });
  }
});

// Leave a chat room
router.post("/rooms/:roomId/leave", async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId } = req.body;

    await db
      .update(chatParticipants)
      .set({
        isActive: false,
        leftAt: new Date(),
      })
      .where(
        and(
          eq(chatParticipants.chatRoomId, roomId),
          eq(chatParticipants.userId, userId)
        )
      );

    res.json({ success: true });
  } catch (error) {
    console.error("Error leaving chat room:", error);
    res.status(500).json({ error: "Failed to leave chat room" });
  }
});

// Mark messages as read
router.post("/messages/:messageId/read", async (req, res) => {
  try {
    const { messageId } = req.params;
    const { userId } = req.body;

    await db
      .insert(messageReadReceipts)
      .values({
        messageId,
        userId,
      })
      .onConflictDoNothing();

    res.json({ success: true });
  } catch (error) {
    console.error("Error marking message as read:", error);
    res.status(500).json({ error: "Failed to mark message as read" });
  }
});

export default router;
