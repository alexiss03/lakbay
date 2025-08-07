import { Router } from "express";
import { db } from "../db";
import { accommodations, roomTypes, rooms, accommodationBookings, accommodationReviews, seasonalPricing } from "@shared/accommodation-schema";
import { eq, desc, count, sum, and, gte, lte, sql } from "drizzle-orm";

const router = Router();

// Get accommodation dashboard analytics
router.get("/analytics/:hostId", async (req, res) => {
  try {
    const { hostId } = req.params;

    // Get accommodation stats
    const [accommodationStats] = await db
      .select({
        totalProperties: count(),
        activeProperties: count(sql`CASE WHEN status = 'active' THEN 1 END`),
        totalRooms: sum(accommodations.totalRooms),
        avgRating: sql<number>`AVG(average_rating)`,
      })
      .from(accommodations)
      .where(eq(accommodations.hostId, hostId));

    // Get booking stats
    const [bookingStats] = await db
      .select({
        totalBookings: count(),
        monthlyBookings: count(sql`CASE WHEN created_at >= date_trunc('month', now()) THEN 1 END`),
        totalRevenue: sum(sql`total_amount * 0.85`), // 15% commission
        monthlyRevenue: sum(sql`CASE WHEN created_at >= date_trunc('month', now()) THEN total_amount * 0.85 ELSE 0 END`),
        occupancyRate: sql<number>`
          CASE WHEN ${accommodationStats.totalRooms} > 0 
          THEN (COUNT(CASE WHEN status IN ('confirmed', 'checked_in') THEN 1 END) * 100.0 / ${accommodationStats.totalRooms})
          ELSE 0 END
        `,
      })
      .from(accommodationBookings)
      .innerJoin(accommodations, eq(accommodationBookings.accommodationId, accommodations.id))
      .where(eq(accommodations.hostId, hostId));

    const analytics = {
      totalProperties: accommodationStats.totalProperties || 0,
      activeProperties: accommodationStats.activeProperties || 0,
      totalRooms: Number(accommodationStats.totalRooms) || 0,
      averageRating: Number(accommodationStats.avgRating) || 0,
      totalBookings: bookingStats.totalBookings || 0,
      monthlyBookings: bookingStats.monthlyBookings || 0,
      totalRevenue: Number(bookingStats.totalRevenue) || 0,
      monthlyRevenue: Number(bookingStats.monthlyRevenue) || 0,
      occupancyRate: Number(bookingStats.occupancyRate) || 0,
      upcomingCheckins: 0, // Calculate based on today's bookings
      maintenanceRooms: 0, // Calculate from room status
    };

    res.json(analytics);
  } catch (error) {
    console.error("Error fetching accommodation analytics:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

// Get host's accommodations
router.get("/properties/:hostId", async (req, res) => {
  try {
    const { hostId } = req.params;
    const { type, status, limit = "50", offset = "0" } = req.query;

    const conditions = [eq(accommodations.hostId, hostId)];
    
    if (type && type !== "all") {
      conditions.push(eq(accommodations.type, type as any));
    }
    
    if (status && status !== "all") {
      conditions.push(eq(accommodations.status, status as any));
    }

    const properties = await db
      .select()
      .from(accommodations)
      .where(and(...conditions))
      .orderBy(desc(accommodations.createdAt))
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string));

    res.json(properties);
  } catch (error) {
    console.error("Error fetching accommodations:", error);
    res.status(500).json({ error: "Failed to fetch accommodations" });
  }
});

// Create new accommodation
router.post("/properties", async (req, res) => {
  try {
    const [newAccommodation] = await db
      .insert(accommodations)
      .values(req.body)
      .returning();

    res.status(201).json(newAccommodation);
  } catch (error) {
    console.error("Error creating accommodation:", error);
    res.status(500).json({ error: "Failed to create accommodation" });
  }
});

// Update accommodation
router.put("/properties/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [updatedAccommodation] = await db
      .update(accommodations)
      .set({ 
        ...req.body,
        updatedAt: new Date()
      })
      .where(eq(accommodations.id, id))
      .returning();

    if (!updatedAccommodation) {
      return res.status(404).json({ error: "Accommodation not found" });
    }

    res.json(updatedAccommodation);
  } catch (error) {
    console.error("Error updating accommodation:", error);
    res.status(500).json({ error: "Failed to update accommodation" });
  }
});

// Get room types for an accommodation
router.get("/properties/:accommodationId/room-types", async (req, res) => {
  try {
    const { accommodationId } = req.params;

    const roomTypesWithAvailability = await db
      .select({
        id: roomTypes.id,
        name: roomTypes.name,
        type: roomTypes.type,
        description: roomTypes.description,
        maxOccupancy: roomTypes.maxOccupancy,
        bedConfiguration: roomTypes.bedConfiguration,
        roomSize: roomTypes.roomSize,
        basePrice: roomTypes.basePrice,
        currency: roomTypes.currency,
        images: roomTypes.images,
        amenities: roomTypes.amenities,
        totalRooms: roomTypes.totalRooms,
        isActive: roomTypes.isActive,
        createdAt: roomTypes.createdAt,
        updatedAt: roomTypes.updatedAt,
        availableRooms: sql<number>`
          ${roomTypes.totalRooms} - COALESCE((
            SELECT COUNT(*) FROM ${rooms} 
            WHERE ${rooms.roomTypeId} = ${roomTypes.id} 
            AND ${rooms.status} IN ('occupied', 'maintenance')
          ), 0)
        `,
        occupiedRooms: sql<number>`
          COALESCE((
            SELECT COUNT(*) FROM ${rooms} 
            WHERE ${rooms.roomTypeId} = ${roomTypes.id} 
            AND ${rooms.status} = 'occupied'
          ), 0)
        `,
      })
      .from(roomTypes)
      .where(eq(roomTypes.accommodationId, accommodationId))
      .orderBy(desc(roomTypes.createdAt));

    res.json(roomTypesWithAvailability);
  } catch (error) {
    console.error("Error fetching room types:", error);
    res.status(500).json({ error: "Failed to fetch room types" });
  }
});

// Create room type
router.post("/properties/:accommodationId/room-types", async (req, res) => {
  try {
    const { accommodationId } = req.params;

    const [newRoomType] = await db
      .insert(roomTypes)
      .values({
        ...req.body,
        accommodationId
      })
      .returning();

    res.status(201).json(newRoomType);
  } catch (error) {
    console.error("Error creating room type:", error);
    res.status(500).json({ error: "Failed to create room type" });
  }
});

// Get accommodation bookings
router.get("/bookings/:accommodationId", async (req, res) => {
  try {
    const { accommodationId } = req.params;
    const { status, dateFrom, dateTo, limit = "50", offset = "0" } = req.query;

    const conditions = [eq(accommodationBookings.accommodationId, accommodationId)];
    
    if (status && status !== "all") {
      conditions.push(eq(accommodationBookings.status, status as any));
    }
    
    if (dateFrom) {
      conditions.push(gte(accommodationBookings.checkinDate, new Date(dateFrom as string)));
    }
    
    if (dateTo) {
      conditions.push(lte(accommodationBookings.checkoutDate, new Date(dateTo as string)));
    }

    const bookings = await db
      .select({
        id: accommodationBookings.id,
        guestName: accommodationBookings.guestName,
        guestEmail: accommodationBookings.guestEmail,
        guestPhone: accommodationBookings.guestPhone,
        guestCount: accommodationBookings.guestCount,
        checkinDate: accommodationBookings.checkinDate,
        checkoutDate: accommodationBookings.checkoutDate,
        nights: accommodationBookings.nights,
        roomPrice: accommodationBookings.roomPrice,
        totalAmount: accommodationBookings.totalAmount,
        currency: accommodationBookings.currency,
        status: accommodationBookings.status,
        paymentStatus: accommodationBookings.paymentStatus,
        confirmationCode: accommodationBookings.confirmationCode,
        specialRequests: accommodationBookings.specialRequests,
        createdAt: accommodationBookings.createdAt,
        roomTypeName: roomTypes.name,
        roomTypeType: roomTypes.type,
        accommodationName: accommodations.name,
      })
      .from(accommodationBookings)
      .innerJoin(roomTypes, eq(accommodationBookings.roomTypeId, roomTypes.id))
      .innerJoin(accommodations, eq(accommodationBookings.accommodationId, accommodations.id))
      .where(and(...conditions))
      .orderBy(desc(accommodationBookings.createdAt))
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string));

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching accommodation bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// Update booking status
router.put("/bookings/:bookingId/status", async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, paymentStatus, internalNotes } = req.body;

    const updateData: any = { updatedAt: new Date() };
    
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (internalNotes) updateData.internalNotes = internalNotes;

    // Set check-in/out timestamps based on status
    if (status === 'checked_in') {
      updateData.checkedInAt = new Date();
    } else if (status === 'checked_out') {
      updateData.checkedOutAt = new Date();
    }

    const [updatedBooking] = await db
      .update(accommodationBookings)
      .set(updateData)
      .where(eq(accommodationBookings.id, bookingId))
      .returning();

    if (!updatedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ error: "Failed to update booking" });
  }
});

// Get accommodation reviews
router.get("/reviews/:accommodationId", async (req, res) => {
  try {
    const { accommodationId } = req.params;
    const { limit = "20", offset = "0" } = req.query;

    const reviews = await db
      .select()
      .from(accommodationReviews)
      .where(eq(accommodationReviews.accommodationId, accommodationId))
      .orderBy(desc(accommodationReviews.createdAt))
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string));

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// Respond to review
router.put("/reviews/:reviewId/respond", async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { response } = req.body;

    const [updatedReview] = await db
      .update(accommodationReviews)
      .set({ 
        response,
        responseDate: new Date(),
        updatedAt: new Date()
      })
      .where(eq(accommodationReviews.id, reviewId))
      .returning();

    if (!updatedReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json(updatedReview);
  } catch (error) {
    console.error("Error responding to review:", error);
    res.status(500).json({ error: "Failed to respond to review" });
  }
});

// Get seasonal pricing
router.get("/properties/:accommodationId/pricing", async (req, res) => {
  try {
    const { accommodationId } = req.params;

    const pricing = await db
      .select()
      .from(seasonalPricing)
      .where(eq(seasonalPricing.accommodationId, accommodationId))
      .orderBy(seasonalPricing.startDate);

    res.json(pricing);
  } catch (error) {
    console.error("Error fetching pricing:", error);
    res.status(500).json({ error: "Failed to fetch pricing" });
  }
});

// Create seasonal pricing
router.post("/properties/:accommodationId/pricing", async (req, res) => {
  try {
    const { accommodationId } = req.params;

    const [newPricing] = await db
      .insert(seasonalPricing)
      .values({
        ...req.body,
        accommodationId
      })
      .returning();

    res.status(201).json(newPricing);
  } catch (error) {
    console.error("Error creating pricing:", error);
    res.status(500).json({ error: "Failed to create pricing" });
  }
});

export default router;