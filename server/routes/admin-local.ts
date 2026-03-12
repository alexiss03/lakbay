import { Router } from "express";
import type { TripStatus } from "@shared/status-transitions";
import {
  checkAutomaticTransition,
  validateStatusTransition,
} from "@shared/status-transitions";
import {
  localAdminStore,
  type LocalAdminArticle,
  type LocalAdminBooking,
  type LocalAdminHost,
  type LocalAdminTour,
  type LocalAdminUser,
} from "./local-admin-store";

const router = Router();

const parseLimit = (value: unknown, fallback = 50): number => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
};

const parseOffset = (value: unknown, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
};

const parseDate = (value: unknown): Date | null => {
  if (!value) return null;
  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const sortByCreatedDesc = <T extends { createdAt: Date }>(items: T[]): T[] => {
  return [...items].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

const paginate = <T>(items: T[], limit: number, offset: number): T[] => {
  return items.slice(offset, offset + limit);
};

// Analytics endpoint
router.get("/analytics", async (_req, res) => {
  const { tours, users, hosts, bookings } = localAdminStore;
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const activeTours = tours.filter((tour) => tour.status === "active").length;
  const activeUsers = users.filter((user) => user.status === "active").length;
  const verifiedHosts = hosts.filter((host) => host.verificationStatus === "verified").length;
  const monthlyBookings = bookings.filter((booking) => booking.createdAt >= monthStart);
  const monthlyRevenue = monthlyBookings.reduce(
    (sum, booking) => sum + localAdminStore.toNumber(booking.amount),
    0,
  );

  const categoryCounts = new Map<string, number>();
  tours
    .filter((tour) => tour.status === "active")
    .forEach((tour) => categoryCounts.set(tour.category, (categoryCounts.get(tour.category) ?? 0) + 1));

  const topCategories = Array.from(categoryCounts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const recentActivity = [
    ...sortByCreatedDesc(tours).slice(0, 2).map((tour) => ({
      type: "tour" as const,
      action: "Tour saved",
      timestamp: tour.updatedAt.toISOString(),
      details: tour.title,
    })),
    ...sortByCreatedDesc(users).slice(0, 2).map((user) => ({
      type: "user" as const,
      action: "User record updated",
      timestamp: user.updatedAt.toISOString(),
      details: user.email,
    })),
    ...sortByCreatedDesc(bookings).slice(0, 2).map((booking) => ({
      type: "booking" as const,
      action: "Booking updated",
      timestamp: booking.updatedAt.toISOString(),
      details: `${booking.tourTitle} - ${booking.userName}`,
    })),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 6);

  res.json({
    totalTours: tours.length,
    activeTours,
    totalUsers: users.length,
    activeUsers,
    totalHosts: hosts.length,
    verifiedHosts,
    totalBookings: bookings.length,
    monthlyRevenue,
    monthlyBookings: monthlyBookings.length,
    topCategories,
    recentActivity,
  });
});

// Tours CRUD
router.get("/tours", async (req, res) => {
  const { status, category, limit = "50", offset = "0" } = req.query;
  const parsedLimit = parseLimit(limit, 50);
  const parsedOffset = parseOffset(offset, 0);

  let filtered = sortByCreatedDesc(localAdminStore.tours);

  if (status && status !== "all") {
    filtered = filtered.filter((tour) => tour.status === status);
  }
  if (category && category !== "all") {
    filtered = filtered.filter((tour) => tour.category === category);
  }

  res.json(paginate(filtered, parsedLimit, parsedOffset));
});

router.get("/tours/:id", async (req, res) => {
  const tour = localAdminStore.tours.find((item) => item.id === req.params.id);
  if (!tour) {
    return res.status(404).json({ error: "Tour not found" });
  }
  res.json(tour);
});

router.post("/tours", async (req, res) => {
  const payload = req.body as Partial<LocalAdminTour>;
  if (!payload.title || !payload.price || !payload.hostName || !payload.category) {
    return res.status(400).json({ error: "title, price, hostName, and category are required" });
  }

  const now = new Date();
  const created: LocalAdminTour = {
    id: localAdminStore.makeId("tour"),
    title: String(payload.title),
    description: payload.description ? String(payload.description) : null,
    category: Array.isArray(payload.category)
      ? JSON.stringify(payload.category)
      : String(payload.category),
    price: Number(payload.price).toFixed(2),
    currency: payload.currency ? String(payload.currency) : "PHP",
    status: (payload.status as TripStatus) || "pending_approval",
    hostId: payload.hostId ? String(payload.hostId) : "host_1",
    hostName: String(payload.hostName),
    hostAvatar: payload.hostAvatar ? String(payload.hostAvatar) : null,
    bookingsCount: 0,
    revenue: "0.00",
    rating: payload.rating ? String(payload.rating) : "0",
    maxParticipants: payload.maxParticipants ? Number(payload.maxParticipants) : null,
    duration: payload.duration ? String(payload.duration) : null,
    location: payload.location ? String(payload.location) : null,
    heroImage: payload.heroImage ? String(payload.heroImage) : null,
    featured: Boolean(payload.featured),
    startAt: parseDate(payload.startAt),
    endAt: parseDate(payload.endAt),
    adminNotes: payload.adminNotes ? String(payload.adminNotes) : null,
    lastStatusChange: now,
    createdAt: now,
    updatedAt: now,
  };

  localAdminStore.tours.push(created);
  localAdminStore.recomputeDerivedMetrics();
  res.status(201).json(created);
});

router.put("/tours/:id", async (req, res) => {
  const index = localAdminStore.tours.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Tour not found" });
  }

  const payload = req.body as Partial<LocalAdminTour>;
  const current = localAdminStore.tours[index];
  const updated: LocalAdminTour = {
    ...current,
    ...payload,
    price:
      payload.price === undefined ? current.price : Number(payload.price || current.price).toFixed(2),
    category:
      payload.category === undefined
        ? current.category
        : Array.isArray(payload.category)
          ? JSON.stringify(payload.category)
          : String(payload.category),
    startAt: payload.startAt === undefined ? current.startAt : parseDate(payload.startAt),
    endAt: payload.endAt === undefined ? current.endAt : parseDate(payload.endAt),
    updatedAt: new Date(),
  };

  localAdminStore.tours[index] = updated;
  localAdminStore.recomputeDerivedMetrics();
  res.json(updated);
});

router.patch("/tours/:id/status", async (req, res) => {
  const index = localAdminStore.tours.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Tour not found" });
  }

  const current = localAdminStore.tours[index];
  const nextStatus = req.body?.status as TripStatus | undefined;
  const adminNotes = req.body?.adminNotes as string | undefined;

  if (!nextStatus) {
    return res.status(400).json({ error: "status is required" });
  }

  const validation = validateStatusTransition(current.status, nextStatus, "admin", adminNotes);
  if (!validation.isValid) {
    return res.status(400).json({ error: validation.error });
  }

  const automaticStatus = checkAutomaticTransition(
    nextStatus,
    current.startAt,
    current.endAt,
  );

  const finalStatus = automaticStatus || nextStatus;
  const updated: LocalAdminTour = {
    ...current,
    status: finalStatus,
    adminNotes: adminNotes || current.adminNotes,
    lastStatusChange: new Date(),
    updatedAt: new Date(),
  };

  localAdminStore.tours[index] = updated;
  res.json({
    success: true,
    tour: updated,
    automaticTransition: automaticStatus !== null,
  });
});

router.delete("/tours/:id", async (req, res) => {
  const index = localAdminStore.tours.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Tour not found" });
  }
  localAdminStore.tours.splice(index, 1);
  localAdminStore.recomputeDerivedMetrics();
  res.json({ message: "Tour deleted successfully" });
});

// Users CRUD
router.get("/users", async (req, res) => {
  const { role, status, limit = "50", offset = "0" } = req.query;
  const parsedLimit = parseLimit(limit, 50);
  const parsedOffset = parseOffset(offset, 0);

  let filtered = sortByCreatedDesc(localAdminStore.users);
  if (role && role !== "all") {
    filtered = filtered.filter((user) => user.role === role);
  }
  if (status && status !== "all") {
    filtered = filtered.filter((user) => user.status === status);
  }

  res.json(paginate(filtered, parsedLimit, parsedOffset));
});

router.get("/users/:id", async (req, res) => {
  const user = localAdminStore.users.find((item) => item.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

router.post("/users", async (req, res) => {
  const { name, email, role = "user", status = "active", avatar } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ error: "name and email are required" });
  }

  const now = new Date();
  const created: LocalAdminUser = {
    id: localAdminStore.makeId("user"),
    name: String(name),
    email: String(email),
    avatar: avatar ? String(avatar) : null,
    role: role === "admin" || role === "host" ? role : "user",
    status: status === "suspended" ? "suspended" : "active",
    totalBookings: 0,
    totalSpent: "0.00",
    lastLoginAt: null,
    joinedAt: now,
    createdAt: now,
    updatedAt: now,
  };

  localAdminStore.users.push(created);
  res.status(201).json(created);
});

router.put("/users/:id", async (req, res) => {
  const index = localAdminStore.users.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  const current = localAdminStore.users[index];
  const payload = req.body || {};
  const updated: LocalAdminUser = {
    ...current,
    ...payload,
    updatedAt: new Date(),
  };

  localAdminStore.users[index] = updated;
  res.json(updated);
});

router.delete("/users/:id", async (req, res) => {
  const index = localAdminStore.users.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "User not found" });
  }
  localAdminStore.users.splice(index, 1);
  res.json({ message: "User deleted successfully" });
});

// Articles CRUD
router.get("/articles", async (req, res) => {
  const { status, category, author, limit = "50", offset = "0" } = req.query;
  const parsedLimit = parseLimit(limit, 50);
  const parsedOffset = parseOffset(offset, 0);

  let filtered = sortByCreatedDesc(localAdminStore.articles);
  if (status && status !== "all") {
    filtered = filtered.filter((article) => article.status === status);
  }
  if (category && category !== "all") {
    filtered = filtered.filter((article) => article.category === category);
  }
  if (author) {
    const needle = String(author).toLowerCase();
    filtered = filtered.filter((article) => article.author.toLowerCase().includes(needle));
  }

  res.json(paginate(filtered, parsedLimit, parsedOffset));
});

router.get("/articles/:id", async (req, res) => {
  const article = localAdminStore.articles.find((item) => item.id === req.params.id);
  if (!article) {
    return res.status(404).json({ error: "Article not found" });
  }
  res.json(article);
});

router.post("/articles", async (req, res) => {
  const payload = req.body as Partial<LocalAdminArticle>;
  if (!payload.title || !payload.slug || !payload.category || !payload.author) {
    return res.status(400).json({ error: "title, slug, category, and author are required" });
  }

  const now = new Date();
  const created: LocalAdminArticle = {
    id: localAdminStore.makeId("article"),
    title: String(payload.title),
    slug: String(payload.slug),
    content: payload.content ? String(payload.content) : null,
    excerpt: payload.excerpt ? String(payload.excerpt) : null,
    category: String(payload.category),
    tags: payload.tags ? String(payload.tags) : null,
    author: String(payload.author),
    authorId: payload.authorId ? String(payload.authorId) : null,
    status:
      payload.status === "published" || payload.status === "review" ? payload.status : "draft",
    featuredImage: payload.featuredImage ? String(payload.featuredImage) : null,
    views: payload.views ? Number(payload.views) : 0,
    likes: payload.likes ? Number(payload.likes) : 0,
    publishedAt: parseDate(payload.publishedAt),
    createdAt: now,
    updatedAt: now,
  };

  localAdminStore.articles.push(created);
  res.status(201).json(created);
});

router.put("/articles/:id", async (req, res) => {
  const index = localAdminStore.articles.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Article not found" });
  }

  const current = localAdminStore.articles[index];
  const payload = req.body as Partial<LocalAdminArticle>;
  const updated: LocalAdminArticle = {
    ...current,
    ...payload,
    publishedAt: payload.publishedAt === undefined ? current.publishedAt : parseDate(payload.publishedAt),
    updatedAt: new Date(),
  };

  localAdminStore.articles[index] = updated;
  res.json(updated);
});

router.delete("/articles/:id", async (req, res) => {
  const index = localAdminStore.articles.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Article not found" });
  }
  localAdminStore.articles.splice(index, 1);
  res.json({ message: "Article deleted successfully" });
});

// Hosts CRUD
router.get("/hosts", async (req, res) => {
  const { status, verified, limit = "50", offset = "0" } = req.query;
  const parsedLimit = parseLimit(limit, 50);
  const parsedOffset = parseOffset(offset, 0);

  let filtered = sortByCreatedDesc(localAdminStore.hosts);

  if (status && status !== "all") {
    const shouldBeActive = status === "active";
    filtered = filtered.filter((host) => host.isActive === shouldBeActive);
  }
  if (verified && verified !== "all") {
    filtered = filtered.filter((host) => host.verificationStatus === verified);
  }

  res.json(paginate(filtered, parsedLimit, parsedOffset));
});

router.get("/hosts/:id", async (req, res) => {
  const host = localAdminStore.hosts.find((item) => item.id === req.params.id);
  if (!host) {
    return res.status(404).json({ error: "Host not found" });
  }
  res.json(host);
});

router.post("/hosts", async (req, res) => {
  const { userId, businessName, location, verificationStatus = "pending", isActive = true } = req.body || {};
  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  const now = new Date();
  const created: LocalAdminHost = {
    id: localAdminStore.makeId("host"),
    userId: String(userId),
    businessName: businessName ? String(businessName) : null,
    description: null,
    specialties: null,
    experience: null,
    location: location ? String(location) : null,
    website: null,
    socialMedia: null,
    verificationStatus: String(verificationStatus),
    documentsSubmitted: false,
    rating: "0",
    totalTours: 0,
    totalRevenue: "0.00",
    commissionRate: "15.00",
    isActive: Boolean(isActive),
    createdAt: now,
    updatedAt: now,
  };

  localAdminStore.hosts.push(created);
  res.status(201).json(created);
});

router.put("/hosts/:id", async (req, res) => {
  const index = localAdminStore.hosts.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Host not found" });
  }
  const current = localAdminStore.hosts[index];
  const updated: LocalAdminHost = {
    ...current,
    ...req.body,
    updatedAt: new Date(),
  };
  localAdminStore.hosts[index] = updated;
  res.json(updated);
});

router.delete("/hosts/:id", async (req, res) => {
  const index = localAdminStore.hosts.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Host not found" });
  }
  localAdminStore.hosts.splice(index, 1);
  res.json({ message: "Host deleted successfully" });
});

router.put("/hosts/:id/verify", async (req, res) => {
  const index = localAdminStore.hosts.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Host not found" });
  }
  const status = req.body?.status;
  const updated: LocalAdminHost = {
    ...localAdminStore.hosts[index],
    verificationStatus: status ? String(status) : localAdminStore.hosts[index].verificationStatus,
    updatedAt: new Date(),
  };
  localAdminStore.hosts[index] = updated;
  res.json(updated);
});

// Bookings CRUD
router.get("/bookings", async (req, res) => {
  const { status, dateFrom, dateTo, limit = "50", offset = "0" } = req.query;
  const parsedLimit = parseLimit(limit, 50);
  const parsedOffset = parseOffset(offset, 0);
  const fromDate = parseDate(dateFrom);
  const toDate = parseDate(dateTo);

  let filtered = sortByCreatedDesc(localAdminStore.bookings);
  if (status && status !== "all") {
    filtered = filtered.filter((booking) => booking.status === status);
  }
  if (fromDate) {
    filtered = filtered.filter((booking) => booking.createdAt >= fromDate);
  }
  if (toDate) {
    filtered = filtered.filter((booking) => booking.createdAt <= toDate);
  }

  res.json(paginate(filtered, parsedLimit, parsedOffset));
});

router.get("/bookings/:id", async (req, res) => {
  const booking = localAdminStore.bookings.find((item) => item.id === req.params.id);
  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }
  res.json(booking);
});

router.post("/bookings", async (req, res) => {
  const {
    tourId,
    userId,
    userName,
    userEmail,
    tourTitle,
    amount,
    participants = 1,
    status = "pending",
    paymentStatus = "pending",
    bookingDate,
    travelDate,
    notes,
  } = req.body || {};

  if (!tourId || !userId || !userName || !userEmail || !tourTitle || amount == null) {
    return res.status(400).json({
      error: "tourId, userId, userName, userEmail, tourTitle, and amount are required",
    });
  }

  const now = new Date();
  const created: LocalAdminBooking = {
    id: localAdminStore.makeId("booking"),
    tourId: String(tourId),
    userId: String(userId),
    userName: String(userName),
    userEmail: String(userEmail),
    tourTitle: String(tourTitle),
    amount: Number(amount).toFixed(2),
    currency: "PHP",
    status: String(status),
    participants: Number(participants) || 1,
    bookingDate: parseDate(bookingDate) || now,
    travelDate: parseDate(travelDate),
    notes: notes ? String(notes) : null,
    paymentStatus: String(paymentStatus),
    paymentId: null,
    createdAt: now,
    updatedAt: now,
  };

  localAdminStore.bookings.push(created);
  localAdminStore.recomputeDerivedMetrics();
  res.status(201).json(created);
});

router.put("/bookings/:id", async (req, res) => {
  const index = localAdminStore.bookings.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Booking not found" });
  }

  const current = localAdminStore.bookings[index];
  const payload = req.body as Partial<LocalAdminBooking>;
  const updated: LocalAdminBooking = {
    ...current,
    ...payload,
    amount: payload.amount === undefined ? current.amount : Number(payload.amount).toFixed(2),
    bookingDate: payload.bookingDate === undefined ? current.bookingDate : parseDate(payload.bookingDate) || current.bookingDate,
    travelDate: payload.travelDate === undefined ? current.travelDate : parseDate(payload.travelDate),
    updatedAt: new Date(),
  };

  localAdminStore.bookings[index] = updated;
  localAdminStore.recomputeDerivedMetrics();
  res.json(updated);
});

router.delete("/bookings/:id", async (req, res) => {
  const index = localAdminStore.bookings.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Booking not found" });
  }
  localAdminStore.bookings.splice(index, 1);
  localAdminStore.recomputeDerivedMetrics();
  res.json({ message: "Booking deleted successfully" });
});

export default router;
