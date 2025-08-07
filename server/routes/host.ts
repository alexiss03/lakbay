import { Router } from "express";
import { db } from "../db";
import { adminTours, adminBookings, adminHosts, adminUsers } from "@shared/admin-schema";
import { eq, desc, count, sum, and, gte, lte, sql } from "drizzle-orm";

const router = Router();

// Host dashboard analytics
router.get("/analytics/:hostId", async (req, res) => {
  try {
    const { hostId } = req.params;

    // Get host's tour stats
    const [tourStats] = await db
      .select({
        totalTrips: count(),
        activeTrips: count(sql`CASE WHEN status = 'active' THEN 1 END`),
        avgRating: sql<number>`AVG(rating)`,
      })
      .from(adminTours)
      .where(eq(adminTours.hostId, hostId));

    // Get host's booking stats
    const [bookingStats] = await db
      .select({
        totalBookings: count(),
        monthlyBookings: count(sql`CASE WHEN created_at >= date_trunc('month', now()) THEN 1 END`),
        totalRevenue: sum(sql`amount * 0.85`), // 15% commission
        monthlyRevenue: sum(sql`CASE WHEN created_at >= date_trunc('month', now()) THEN amount * 0.85 ELSE 0 END`),
      })
      .from(adminBookings)
      .innerJoin(adminTours, eq(adminBookings.tourId, adminTours.id))
      .where(eq(adminTours.hostId, hostId));

    const analytics = {
      totalTrips: tourStats.totalTrips || 0,
      activeTrips: tourStats.activeTrips || 0,
      averageRating: Number(tourStats.avgRating) || 0,
      totalBookings: bookingStats.totalBookings || 0,
      monthlyBookings: bookingStats.monthlyBookings || 0,
      totalRevenue: Number(bookingStats.totalRevenue) || 0,
      monthlyRevenue: Number(bookingStats.monthlyRevenue) || 0,
      pendingPayouts: 0, // Will be calculated from payouts table
    };

    res.json(analytics);
  } catch (error) {
    console.error("Error fetching host analytics:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

// Get host's trips
router.get("/trips/:hostId", async (req, res) => {
  try {
    const { hostId } = req.params;
    const { status, limit = "50", offset = "0" } = req.query;

    const conditions = [eq(adminTours.hostId, hostId)];
    
    if (status && status !== "all") {
      conditions.push(eq(adminTours.status, status as any));
    }

    const trips = await db
      .select()
      .from(adminTours)
      .where(and(...conditions))
      .orderBy(desc(adminTours.createdAt))
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string));

    res.json(trips);
  } catch (error) {
    console.error("Error fetching host trips:", error);
    res.status(500).json({ error: "Failed to fetch trips" });
  }
});

// Get host's bookings
router.get("/bookings/:hostId", async (req, res) => {
  try {
    const { hostId } = req.params;
    const { status, limit = "50", offset = "0" } = req.query;

    let query = db
      .select({
        id: adminBookings.id,
        userName: adminBookings.userName,
        userEmail: adminBookings.userEmail,
        tourTitle: adminBookings.tourTitle,
        amount: adminBookings.amount,
        status: adminBookings.status,
        participants: adminBookings.participants,
        bookingDate: adminBookings.createdAt,
        travelDate: adminBookings.travelDate,
      })
      .from(adminBookings)
      .innerJoin(adminTours, eq(adminBookings.tourId, adminTours.id))
      .where(eq(adminTours.hostId, hostId));

    if (status && status !== "all") {
      query = query.where(and(
        eq(adminTours.hostId, hostId),
        eq(adminBookings.status, status as string)
      ));
    }

    const bookings = await query
      .orderBy(desc(adminBookings.createdAt))
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string));

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching host bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// Update booking status
router.put("/bookings/:bookingId/status", async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const [updatedBooking] = await db
      .update(adminBookings)
      .set({ 
        status,
        updatedAt: new Date()
      })
      .where(eq(adminBookings.id, bookingId))
      .returning();

    if (!updatedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json(updatedBooking);
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ error: "Failed to update booking status" });
  }
});

// Get host profile
router.get("/profile/:hostId", async (req, res) => {
  try {
    const { hostId } = req.params;

    const [host] = await db
      .select()
      .from(adminHosts)
      .where(eq(adminHosts.id, hostId));

    if (!host) {
      return res.status(404).json({ error: "Host not found" });
    }

    res.json(host);
  } catch (error) {
    console.error("Error fetching host profile:", error);
    res.status(500).json({ error: "Failed to fetch host profile" });
  }
});

// Update host profile
router.put("/profile/:hostId", async (req, res) => {
  try {
    const { hostId } = req.params;

    const [updatedHost] = await db
      .update(adminHosts)
      .set({ 
        ...req.body,
        updatedAt: new Date()
      })
      .where(eq(adminHosts.id, hostId))
      .returning();

    if (!updatedHost) {
      return res.status(404).json({ error: "Host not found" });
    }

    res.json(updatedHost);
  } catch (error) {
    console.error("Error updating host profile:", error);
    res.status(500).json({ error: "Failed to update host profile" });
  }
});

// Request payout
router.post("/payouts/request", async (req, res) => {
  try {
    const { hostId, amount, period } = req.body;

    // In a real application, you would:
    // 1. Verify the host's available balance
    // 2. Create a payout request record
    // 3. Integrate with payment processor
    
    // For now, we'll return a success response
    const payoutRequest = {
      id: `payout_${Date.now()}`,
      hostId,
      amount,
      period,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    };

    res.status(201).json(payoutRequest);
  } catch (error) {
    console.error("Error requesting payout:", error);
    res.status(500).json({ error: "Failed to request payout" });
  }
});

export default router;