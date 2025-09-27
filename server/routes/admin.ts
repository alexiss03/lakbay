import { Router } from "express";
import { db } from "../db";
import { adminTours, adminUsers, adminArticles, adminBookings, adminHosts, AdminAnalytics } from "@shared/admin-schema";
import { eq, desc, count, sum, and, gte, lte, like, sql } from "drizzle-orm";
import { validateStatusTransition, checkAutomaticTransition, type TripStatus, type UserRole } from "@shared/status-transitions";

const router = Router();

// Analytics endpoint
router.get("/analytics", async (req, res) => {
  try {
    // Get total counts
    const [tourStats] = await db
      .select({
        totalTours: count(),
        activeTours: count(sql`CASE WHEN status = 'active' THEN 1 END`),
      })
      .from(adminTours);

    const [userStats] = await db
      .select({
        totalUsers: count(),
        activeUsers: count(sql`CASE WHEN status = 'active' THEN 1 END`),
      })
      .from(adminUsers);

    const [hostStats] = await db
      .select({
        totalHosts: count(),
        verifiedHosts: count(sql`CASE WHEN verification_status = 'verified' THEN 1 END`),
      })
      .from(adminHosts);

    const [bookingStats] = await db
      .select({
        totalBookings: count(),
        monthlyBookings: count(sql`CASE WHEN created_at >= date_trunc('month', now()) THEN 1 END`),
        monthlyRevenue: sum(sql`CASE WHEN created_at >= date_trunc('month', now()) THEN amount ELSE 0 END`),
      })
      .from(adminBookings);

    // Get top categories
    const topCategories = await db
      .select({
        category: adminTours.category,
        count: count(),
      })
      .from(adminTours)
      .where(eq(adminTours.status, "active"))
      .groupBy(adminTours.category)
      .orderBy(desc(count()))
      .limit(5);

    // Mock recent activity for now
    const recentActivity = [
      {
        type: "tour" as const,
        action: "New tour created",
        timestamp: new Date().toISOString(),
        details: "Palawan Adventure Tour by Sarah Chen"
      },
      {
        type: "user" as const,
        action: "New user registered",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        details: "Juan Dela Cruz joined the platform"
      },
      {
        type: "booking" as const,
        action: "Booking confirmed",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        details: "₱15,000 booking for Palawan Tour"
      }
    ];

    const analytics: AdminAnalytics = {
      totalTours: tourStats.totalTours || 0,
      activeTours: tourStats.activeTours || 0,
      totalUsers: userStats.totalUsers || 0,
      activeUsers: userStats.activeUsers || 0,
      totalHosts: hostStats.totalHosts || 0,
      verifiedHosts: hostStats.verifiedHosts || 0,
      totalBookings: bookingStats.totalBookings || 0,
      monthlyRevenue: Number(bookingStats.monthlyRevenue) || 0,
      monthlyBookings: bookingStats.monthlyBookings || 0,
      topCategories,
      recentActivity,
    };

    res.json(analytics);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

// Tours CRUD
router.get("/tours", async (req, res) => {
  try {
    const { status, category, limit = "50", offset = "0" } = req.query;
    
    const conditions = [];
    
    if (status && status !== "all") {
      conditions.push(eq(adminTours.status, status as any));
    }
    
    if (category && category !== "all") {
      conditions.push(eq(adminTours.category, category as string));
    }

    let query = db.select().from(adminTours);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const tours = await query
      .orderBy(desc(adminTours.createdAt))
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string));

    res.json(tours);
  } catch (error) {
    console.error("Error fetching tours:", error);
    res.status(500).json({ error: "Failed to fetch tours" });
  }
});

router.get("/tours/:id", async (req, res) => {
  try {
    const [tour] = await db
      .select()
      .from(adminTours)
      .where(eq(adminTours.id, req.params.id));

    if (!tour) {
      return res.status(404).json({ error: "Tour not found" });
    }

    res.json(tour);
  } catch (error) {
    console.error("Error fetching tour:", error);
    res.status(500).json({ error: "Failed to fetch tour" });
  }
});

router.post("/tours", async (req, res) => {
  try {
    const [tour] = await db
      .insert(adminTours)
      .values(req.body)
      .returning();

    res.status(201).json(tour);
  } catch (error) {
    console.error("Error creating tour:", error);
    res.status(500).json({ error: "Failed to create tour" });
  }
});

router.put("/tours/:id", async (req, res) => {
  try {
    const [updatedTour] = await db
      .update(adminTours)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(adminTours.id, req.params.id))
      .returning();

    if (!updatedTour) {
      return res.status(404).json({ error: "Tour not found" });
    }

    res.json(updatedTour);
  } catch (error) {
    console.error("Error updating tour:", error);
    res.status(500).json({ error: "Failed to update tour" });
  }
});

// Change tour status with validation
router.patch("/tours/:id/status", async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    
    // Get current tour
    const [currentTour] = await db
      .select()
      .from(adminTours)
      .where(eq(adminTours.id, req.params.id))
      .limit(1);

    if (!currentTour) {
      return res.status(404).json({ error: "Tour not found" });
    }

    // Validate status transition (assuming admin role for now)
    const validation = validateStatusTransition(
      currentTour.status as TripStatus,
      status as TripStatus,
      'admin' as UserRole,
      adminNotes
    );

    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }

    // Check for automatic transitions based on dates
    const automaticStatus = checkAutomaticTransition(
      status as TripStatus,
      currentTour.startAt,
      currentTour.endAt
    );

    // Use automatic status if applicable, otherwise use requested status
    const finalStatus = automaticStatus || status;

    // Update tour with new status
    const [updatedTour] = await db
      .update(adminTours)
      .set({
        status: finalStatus,
        adminNotes: adminNotes || currentTour.adminNotes,
        lastStatusChange: new Date(),
        updatedAt: new Date()
      })
      .where(eq(adminTours.id, req.params.id))
      .returning();

    res.json({
      success: true,
      tour: updatedTour,
      automaticTransition: automaticStatus !== null
    });
  } catch (error) {
    console.error("Error changing tour status:", error);
    res.status(500).json({ error: "Failed to change tour status" });
  }
});

router.delete("/tours/:id", async (req, res) => {
  try {
    const [deletedTour] = await db
      .delete(adminTours)
      .where(eq(adminTours.id, req.params.id))
      .returning();

    if (!deletedTour) {
      return res.status(404).json({ error: "Tour not found" });
    }

    res.json({ message: "Tour deleted successfully" });
  } catch (error) {
    console.error("Error deleting tour:", error);
    res.status(500).json({ error: "Failed to delete tour" });
  }
});

// Users CRUD
router.get("/users", async (req, res) => {
  try {
    const { role, status, limit = "50", offset = "0" } = req.query;
    
    const conditions = [];
    
    if (role && role !== "all") {
      conditions.push(eq(adminUsers.role, role as any));
    }
    
    if (status && status !== "all") {
      conditions.push(eq(adminUsers.status, status as any));
    }

    let query = db.select().from(adminUsers);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const users = await query
      .orderBy(desc(adminUsers.createdAt))
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string));

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const [updatedUser] = await db
      .update(adminUsers)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(adminUsers.id, req.params.id))
      .returning();

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Articles CRUD
router.get("/articles", async (req, res) => {
  try {
    const { status, category, author, limit = "50", offset = "0" } = req.query;
    
    const conditions = [];
    
    if (status && status !== "all") {
      conditions.push(eq(adminArticles.status, status as any));
    }
    
    if (category && category !== "all") {
      conditions.push(eq(adminArticles.category, category as string));
    }

    if (author) {
      conditions.push(like(adminArticles.author, `%${author}%`));
    }

    let query = db.select().from(adminArticles);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const articles = await query
      .orderBy(desc(adminArticles.createdAt))
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string));

    res.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

router.post("/articles", async (req, res) => {
  try {
    const [article] = await db
      .insert(adminArticles)
      .values(req.body)
      .returning();

    res.status(201).json(article);
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ error: "Failed to create article" });
  }
});

router.put("/articles/:id", async (req, res) => {
  try {
    const [updatedArticle] = await db
      .update(adminArticles)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(adminArticles.id, req.params.id))
      .returning();

    if (!updatedArticle) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.json(updatedArticle);
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ error: "Failed to update article" });
  }
});

router.delete("/articles/:id", async (req, res) => {
  try {
    const [deletedArticle] = await db
      .delete(adminArticles)
      .where(eq(adminArticles.id, req.params.id))
      .returning();

    if (!deletedArticle) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ error: "Failed to delete article" });
  }
});

// Hosts CRUD
router.get("/hosts", async (req, res) => {
  try {
    const { status, verified, limit = "50", offset = "0" } = req.query;
    
    const conditions = [];
    
    if (status && status !== "all") {
      conditions.push(eq(adminHosts.isActive, status === "active"));
    }
    
    if (verified && verified !== "all") {
      conditions.push(eq(adminHosts.verificationStatus, verified as string));
    }

    let query = db.select().from(adminHosts);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const hosts = await query
      .orderBy(desc(adminHosts.createdAt))
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string));

    res.json(hosts);
  } catch (error) {
    console.error("Error fetching hosts:", error);
    res.status(500).json({ error: "Failed to fetch hosts" });
  }
});

router.put("/hosts/:id/verify", async (req, res) => {
  try {
    const { status } = req.body; // 'verified', 'rejected', 'pending'
    
    const [updatedHost] = await db
      .update(adminHosts)
      .set({ 
        verificationStatus: status,
        updatedAt: new Date()
      })
      .where(eq(adminHosts.id, req.params.id))
      .returning();

    if (!updatedHost) {
      return res.status(404).json({ error: "Host not found" });
    }

    res.json(updatedHost);
  } catch (error) {
    console.error("Error verifying host:", error);
    res.status(500).json({ error: "Failed to verify host" });
  }
});

// Bookings
router.get("/bookings", async (req, res) => {
  try {
    const { status, dateFrom, dateTo, limit = "50", offset = "0" } = req.query;
    
    const conditions = [];
    
    if (status && status !== "all") {
      conditions.push(eq(adminBookings.status, status as string));
    }
    
    if (dateFrom) {
      conditions.push(gte(adminBookings.createdAt, new Date(dateFrom as string)));
    }
    
    if (dateTo) {
      conditions.push(lte(adminBookings.createdAt, new Date(dateTo as string)));
    }

    let query = db.select().from(adminBookings);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const bookings = await query
      .orderBy(desc(adminBookings.createdAt))
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string));

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

export default router;