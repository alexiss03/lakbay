import { Router } from "express";
import { db } from "../db";
import { accommodations, roomTypes, rooms, accommodationBookings, accommodationReviews, seasonalPricing } from "@shared/accommodation-schema";
import { eq, desc, count, sum, and, gte, lte, sql } from "drizzle-orm";

const router = Router();

// Get accommodation dashboard analytics
router.get("/analytics/:hostId", async (req, res) => {
  try {
    const { hostId } = req.params;

    // For demo purposes, return mock data since we don't have real data yet
    const analytics = {
      totalProperties: 3,
      activeProperties: 3,
      totalRooms: 125,
      averageRating: 4.6,
      totalBookings: 89,
      monthlyBookings: 32,
      totalRevenue: 2450000,
      monthlyRevenue: 485000,
      occupancyRate: 78,
      upcomingCheckins: 12,
      maintenanceRooms: 3,
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

    // For demo purposes, return mock data
    const properties = [
      {
        id: '1',
        name: 'Paradise Beach Resort',
        type: 'resort',
        address: 'El Nido, Palawan',
        city: 'El Nido',
        province: 'Palawan',
        country: 'Philippines',
        totalRooms: 45,
        occupancyRate: 85,
        averageRating: 4.8,
        monthlyRevenue: 580000,
        status: 'active',
        heroImage: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=200&fit=crop',
        email: 'reservations@paradisebeach.com',
        phone: '+63 917 123 4567',
        hostId: hostId,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Manila Bay Hotel',
        type: 'hotel',
        address: 'Roxas Boulevard, Manila',
        city: 'Manila',
        province: 'Metro Manila',
        country: 'Philippines',
        totalRooms: 68,
        occupancyRate: 72,
        averageRating: 4.5,
        monthlyRevenue: 480000,
        status: 'active',
        heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=200&fit=crop',
        email: 'info@manilabayhotel.com',
        phone: '+63 2 8123 4567',
        hostId: hostId,
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date()
      },
      {
        id: '3',
        name: 'Mountain View Lodge',
        type: 'lodge',
        address: 'Baguio City, Benguet',
        city: 'Baguio',
        province: 'Benguet',
        country: 'Philippines',
        totalRooms: 15,
        occupancyRate: 68,
        averageRating: 4.4,
        monthlyRevenue: 190000,
        status: 'active',
        heroImage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=200&fit=crop',
        email: 'stay@mountainviewlodge.com',
        phone: '+63 74 123 4567',
        hostId: hostId,
        createdAt: new Date('2024-03-05'),
        updatedAt: new Date()
      }
    ];

    // Filter by type if specified
    let filteredProperties = properties;
    if (type && type !== "all") {
      filteredProperties = properties.filter(p => p.type === type);
    }
    
    if (status && status !== "all") {
      filteredProperties = filteredProperties.filter(p => p.status === status);
    }

    res.json(filteredProperties);
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

    // Mock room types data
    const roomTypesData: Record<string, any[]> = {
      '1': [ // Paradise Beach Resort
        {
          id: 'rt1',
          name: 'Ocean View Suite',
          type: 'suite',
          description: 'Luxurious suite with stunning ocean views',
          maxOccupancy: 4,
          basePrice: 8500,
          totalRooms: 12,
          availableRooms: 3,
          occupiedRooms: 9,
          bedConfiguration: '1 King Bed + 1 Sofa Bed',
          roomSize: '65 sqm',
          accommodationId: accommodationId
        },
        {
          id: 'rt2',
          name: 'Deluxe Beachfront',
          type: 'deluxe',
          description: 'Premium room with direct beach access',
          maxOccupancy: 2,
          basePrice: 6500,
          totalRooms: 18,
          availableRooms: 7,
          occupiedRooms: 11,
          bedConfiguration: '1 King Bed',
          roomSize: '45 sqm',
          accommodationId: accommodationId
        }
      ],
      '2': [ // Manila Bay Hotel
        {
          id: 'rt3',
          name: 'Executive King Room',
          type: 'deluxe',
          description: 'Executive room with city skyline view',
          maxOccupancy: 2,
          basePrice: 5500,
          totalRooms: 25,
          availableRooms: 8,
          occupiedRooms: 17,
          bedConfiguration: '1 King Bed',
          roomSize: '40 sqm',
          accommodationId: accommodationId
        },
        {
          id: 'rt4',
          name: 'Standard Twin',
          type: 'twin',
          description: 'Comfortable twin room for business travelers',
          maxOccupancy: 2,
          basePrice: 3500,
          totalRooms: 28,
          availableRooms: 12,
          occupiedRooms: 16,
          bedConfiguration: '2 Single Beds',
          roomSize: '32 sqm',
          accommodationId: accommodationId
        }
      ],
      '3': [ // Mountain View Lodge
        {
          id: 'rt5',
          name: 'Mountain Suite',
          type: 'suite',
          description: 'Cozy suite with mountain views and fireplace',
          maxOccupancy: 4,
          basePrice: 4500,
          totalRooms: 6,
          availableRooms: 2,
          occupiedRooms: 4,
          bedConfiguration: '1 Queen Bed + 1 Day Bed',
          roomSize: '50 sqm',
          accommodationId: accommodationId
        },
        {
          id: 'rt6',
          name: 'Standard Room',
          type: 'double',
          description: 'Comfortable room with mountain view',
          maxOccupancy: 2,
          basePrice: 2800,
          totalRooms: 9,
          availableRooms: 4,
          occupiedRooms: 5,
          bedConfiguration: '1 Double Bed',
          roomSize: '28 sqm',
          accommodationId: accommodationId
        }
      ]
    };

    const roomTypes = roomTypesData[accommodationId] || [];
    res.json(roomTypes);
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

    // Mock bookings data
    const allBookings = [
      {
        id: 'b1',
        guestName: 'Juan Dela Cruz',
        guestEmail: 'juan@email.com',
        guestPhone: '+63 917 123 4567',
        accommodationId: '1',
        accommodationName: 'Paradise Beach Resort',
        roomTypeName: 'Ocean View Suite',
        roomTypeType: 'suite',
        checkinDate: '2024-08-15',
        checkoutDate: '2024-08-18',
        nights: 3,
        guestCount: 2,
        totalAmount: 25500,
        status: 'confirmed',
        paymentStatus: 'paid',
        confirmationCode: 'PBR001',
        createdAt: new Date('2024-08-01')
      },
      {
        id: 'b2',
        guestName: 'Maria Santos',
        guestEmail: 'maria@email.com',
        guestPhone: '+63 917 987 6543',
        accommodationId: '2',
        accommodationName: 'Manila Bay Hotel',
        roomTypeName: 'Executive King Room',
        roomTypeType: 'deluxe',
        checkinDate: '2024-08-20',
        checkoutDate: '2024-08-22',
        nights: 2,
        guestCount: 1,
        totalAmount: 11000,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date('2024-08-02')
      },
      {
        id: 'b3',
        guestName: 'Robert Johnson',
        guestEmail: 'robert@email.com',
        accommodationId: '1',
        accommodationName: 'Paradise Beach Resort',
        roomTypeName: 'Deluxe Beachfront',
        roomTypeType: 'deluxe',
        checkinDate: '2024-08-25',
        checkoutDate: '2024-08-28',
        nights: 3,
        guestCount: 2,
        totalAmount: 19500,
        status: 'confirmed',
        paymentStatus: 'paid',
        confirmationCode: 'PBR002',
        createdAt: new Date('2024-08-05')
      },
      {
        id: 'b4',
        guestName: 'Ana Garcia',
        guestEmail: 'ana@email.com',
        accommodationId: '3',
        accommodationName: 'Mountain View Lodge',
        roomTypeName: 'Mountain Suite',
        roomTypeType: 'suite',
        checkinDate: '2024-08-30',
        checkoutDate: '2024-09-02',
        nights: 3,
        guestCount: 3,
        totalAmount: 13500,
        status: 'checked_in',
        paymentStatus: 'paid',
        confirmationCode: 'MVL001',
        createdAt: new Date('2024-08-10')
      }
    ];

    // Filter bookings by accommodation
    let filteredBookings = allBookings.filter(b => b.accommodationId === accommodationId);
    
    // Filter by status if specified
    if (status && status !== "all") {
      filteredBookings = filteredBookings.filter(b => b.status === status);
    }

    res.json(filteredBookings);
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