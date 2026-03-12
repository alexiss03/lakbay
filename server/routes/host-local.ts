import { Router } from "express";
import { localAdminStore } from "./local-admin-store";

const router = Router();

const parseLimit = (value: unknown, fallback = 50): number => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
};

const parseOffset = (value: unknown, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
};

const mapHostTripStatus = (status: string): "active" | "inactive" | "pending" => {
  if (status === "active" || status === "ongoing") return "active";
  if (status === "completed" || status === "declined") return "inactive";
  return "pending";
};

router.get("/analytics/:hostId", async (req, res) => {
  const { hostId } = req.params;
  const hostTours = localAdminStore.tours.filter((tour) => tour.hostId === hostId);
  const hostTourIds = new Set(hostTours.map((tour) => tour.id));
  const hostBookings = localAdminStore.bookings.filter((booking) => hostTourIds.has(booking.tourId));
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const totalTrips = hostTours.length;
  const activeTrips = hostTours.filter((tour) => mapHostTripStatus(tour.status) === "active").length;
  const averageRating =
    hostTours.length > 0
      ? hostTours.reduce((sum, tour) => sum + localAdminStore.toNumber(tour.rating), 0) / hostTours.length
      : 0;
  const totalBookings = hostBookings.length;
  const monthlyBookings = hostBookings.filter((booking) => booking.createdAt >= monthStart);
  const totalRevenue = hostBookings
    .filter((booking) => booking.status === "confirmed" || booking.status === "completed")
    .reduce((sum, booking) => sum + localAdminStore.toNumber(booking.amount) * 0.85, 0);
  const monthlyRevenue = monthlyBookings
    .filter((booking) => booking.status === "confirmed" || booking.status === "completed")
    .reduce((sum, booking) => sum + localAdminStore.toNumber(booking.amount) * 0.85, 0);

  res.json({
    totalTrips,
    activeTrips,
    averageRating: Number(averageRating.toFixed(2)),
    totalBookings,
    monthlyBookings: monthlyBookings.length,
    totalRevenue: Number(totalRevenue.toFixed(2)),
    monthlyRevenue: Number(monthlyRevenue.toFixed(2)),
    pendingPayouts: Number((monthlyRevenue * 0.5).toFixed(2)),
  });
});

router.get("/trips/:hostId", async (req, res) => {
  const { hostId } = req.params;
  const { status = "all", limit = "50", offset = "0" } = req.query;
  const parsedLimit = parseLimit(limit, 50);
  const parsedOffset = parseOffset(offset, 0);

  let trips = localAdminStore.tours.filter((tour) => tour.hostId === hostId);
  if (status !== "all") {
    trips = trips.filter((tour) => mapHostTripStatus(tour.status) === status);
  }

  const shapedTrips = trips
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(parsedOffset, parsedOffset + parsedLimit)
    .map((tour) => ({
      id: tour.id,
      title: tour.title,
      status: mapHostTripStatus(tour.status),
      bookings: tour.bookingsCount,
      revenue: localAdminStore.toNumber(tour.revenue),
      rating: localAdminStore.toNumber(tour.rating),
      nextDeparture: tour.startAt ? tour.startAt.toISOString() : "",
      category: tour.category,
      price: localAdminStore.toNumber(tour.price),
      maxParticipants: tour.maxParticipants ?? 0,
      createdAt: tour.createdAt.toISOString(),
    }));

  res.json(shapedTrips);
});

router.get("/bookings/:hostId", async (req, res) => {
  const { hostId } = req.params;
  const { status = "all", limit = "50", offset = "0" } = req.query;
  const parsedLimit = parseLimit(limit, 50);
  const parsedOffset = parseOffset(offset, 0);

  const hostTourIds = new Set(
    localAdminStore.tours.filter((tour) => tour.hostId === hostId).map((tour) => tour.id),
  );
  let bookings = localAdminStore.bookings.filter((booking) => hostTourIds.has(booking.tourId));
  if (status !== "all") {
    bookings = bookings.filter((booking) => booking.status === status);
  }

  const shapedBookings = bookings
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(parsedOffset, parsedOffset + parsedLimit)
    .map((booking) => ({
      id: booking.id,
      userName: booking.userName,
      userEmail: booking.userEmail,
      tourTitle: booking.tourTitle,
      amount: localAdminStore.toNumber(booking.amount),
      status: booking.status,
      participants: booking.participants,
      bookingDate: booking.bookingDate.toISOString(),
      travelDate: booking.travelDate ? booking.travelDate.toISOString() : "",
    }));

  res.json(shapedBookings);
});

router.put("/bookings/:bookingId/status", async (req, res) => {
  const index = localAdminStore.bookings.findIndex((booking) => booking.id === req.params.bookingId);
  if (index === -1) {
    return res.status(404).json({ error: "Booking not found" });
  }

  const updated = {
    ...localAdminStore.bookings[index],
    status: req.body?.status ? String(req.body.status) : localAdminStore.bookings[index].status,
    updatedAt: new Date(),
  };
  localAdminStore.bookings[index] = updated;
  localAdminStore.recomputeDerivedMetrics();
  res.json(updated);
});

router.get("/profile/:hostId", async (req, res) => {
  const host = localAdminStore.hosts.find((item) => item.id === req.params.hostId);
  if (!host) {
    return res.status(404).json({ error: "Host not found" });
  }
  res.json(host);
});

router.put("/profile/:hostId", async (req, res) => {
  const index = localAdminStore.hosts.findIndex((item) => item.id === req.params.hostId);
  if (index === -1) {
    return res.status(404).json({ error: "Host not found" });
  }
  const updated = {
    ...localAdminStore.hosts[index],
    ...req.body,
    updatedAt: new Date(),
  };
  localAdminStore.hosts[index] = updated;
  res.json(updated);
});

router.post("/payouts/request", async (req, res) => {
  const { hostId, amount, period } = req.body || {};

  const payoutRequest = {
    id: `payout_${Date.now()}`,
    hostId,
    amount,
    period,
    status: "pending",
    requestedAt: new Date().toISOString(),
  };

  res.status(201).json(payoutRequest);
});

export default router;
