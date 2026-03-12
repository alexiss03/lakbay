import type { TripStatus } from "@shared/status-transitions";

export type LocalAdminTour = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  price: string;
  currency: string;
  status: TripStatus;
  hostId: string;
  hostName: string;
  hostAvatar: string | null;
  bookingsCount: number;
  revenue: string;
  rating: string;
  maxParticipants: number | null;
  duration: string | null;
  location: string | null;
  heroImage: string | null;
  featured: boolean;
  startAt: Date | null;
  endAt: Date | null;
  adminNotes: string | null;
  lastStatusChange: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type LocalAdminUser = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: "user" | "host" | "admin";
  status: "active" | "suspended";
  totalBookings: number;
  totalSpent: string;
  lastLoginAt: Date | null;
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type LocalAdminArticle = {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  category: string;
  tags: string | null;
  author: string;
  authorId: string | null;
  status: "published" | "draft" | "review";
  featuredImage: string | null;
  views: number;
  likes: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type LocalAdminBooking = {
  id: string;
  tourId: string;
  userId: string;
  userName: string;
  userEmail: string;
  tourTitle: string;
  amount: string;
  currency: string;
  status: string;
  participants: number;
  bookingDate: Date;
  travelDate: Date | null;
  notes: string | null;
  paymentStatus: string;
  paymentId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type LocalAdminHost = {
  id: string;
  userId: string;
  businessName: string | null;
  description: string | null;
  specialties: string | null;
  experience: string | null;
  location: string | null;
  website: string | null;
  socialMedia: string | null;
  verificationStatus: string;
  documentsSubmitted: boolean;
  rating: string;
  totalTours: number;
  totalRevenue: string;
  commissionRate: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

let sequence = 1;
const makeId = (prefix: string): string => `${prefix}_${Date.now()}_${sequence++}`;

const now = new Date();
const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

const toNumber = (value: string | number | null | undefined): number => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const tours: LocalAdminTour[] = [
  {
    id: "tour_1",
    title: "Palawan Wellness Escape",
    description: "A balanced itinerary of beaches, light hikes, and mindfulness.",
    category: "wellness",
    price: "14900.00",
    currency: "PHP",
    status: "active",
    hostId: "host_1",
    hostName: "Lakbay Adventures",
    hostAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&h=160&fit=crop",
    bookingsCount: 0,
    revenue: "0.00",
    rating: "4.8",
    maxParticipants: 12,
    duration: "4D3N",
    location: "Palawan",
    heroImage: "https://images.unsplash.com/photo-1521334884684-d80222895322?w=1200&h=800&fit=crop",
    featured: true,
    startAt: now,
    endAt: nextMonth,
    adminNotes: null,
    lastStatusChange: now,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "tour_2",
    title: "Siargao Adventure Circuit",
    description: "Surf sessions, island hopping, and guided nature routes.",
    category: "adventure",
    price: "18900.00",
    currency: "PHP",
    status: "pending_approval",
    hostId: "host_1",
    hostName: "Lakbay Adventures",
    hostAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&h=160&fit=crop",
    bookingsCount: 0,
    revenue: "0.00",
    rating: "4.7",
    maxParticipants: 10,
    duration: "5D4N",
    location: "Siargao",
    heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop",
    featured: false,
    startAt: null,
    endAt: null,
    adminNotes: null,
    lastStatusChange: now,
    createdAt: now,
    updatedAt: now,
  },
];

const users: LocalAdminUser[] = [
  {
    id: "admin_1",
    name: "Admin User",
    email: "admin@example.com",
    avatar: null,
    role: "admin",
    status: "active",
    totalBookings: 0,
    totalSpent: "0.00",
    lastLoginAt: now,
    joinedAt: now,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "host_user_1",
    name: "Lakbay Host",
    email: "host@example.com",
    avatar: null,
    role: "host",
    status: "active",
    totalBookings: 0,
    totalSpent: "0.00",
    lastLoginAt: now,
    joinedAt: now,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "traveler_1",
    name: "Juan Dela Cruz",
    email: "juan@example.com",
    avatar: null,
    role: "user",
    status: "active",
    totalBookings: 0,
    totalSpent: "0.00",
    lastLoginAt: now,
    joinedAt: now,
    createdAt: now,
    updatedAt: now,
  },
];

const hosts: LocalAdminHost[] = [
  {
    id: "host_1",
    userId: "host_user_1",
    businessName: "Lakbay Adventures",
    description: "Curated local experiences across Philippine islands.",
    specialties: JSON.stringify(["wellness", "adventure"]),
    experience: "6 years",
    location: "Cebu",
    website: null,
    socialMedia: null,
    verificationStatus: "verified",
    documentsSubmitted: true,
    rating: "4.8",
    totalTours: 0,
    totalRevenue: "0.00",
    commissionRate: "15.00",
    isActive: true,
    createdAt: now,
    updatedAt: now,
  },
];

const articles: LocalAdminArticle[] = [
  {
    id: "article_1",
    title: "7 Wellness Retreat Spots in the Philippines",
    slug: "wellness-retreat-spots-ph",
    content: "Wellness travel guide content",
    excerpt: "Reset your year with these retreat-ready islands and mountains.",
    category: "Wellness",
    tags: JSON.stringify(["wellness", "retreat", "philippines"]),
    author: "Lakbay Team",
    authorId: "admin_1",
    status: "published",
    featuredImage: null,
    views: 2300,
    likes: 210,
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "article_2",
    title: "Adventure Routes for First-Time Explorers",
    slug: "adventure-routes-first-time",
    content: "Adventure travel planning content",
    excerpt: "Beginner-friendly routes for trekking, island hopping, and more.",
    category: "Adventure",
    tags: JSON.stringify(["adventure", "beginners"]),
    author: "Lakbay Team",
    authorId: "admin_1",
    status: "draft",
    featuredImage: null,
    views: 0,
    likes: 0,
    publishedAt: null,
    createdAt: now,
    updatedAt: now,
  },
];

const bookings: LocalAdminBooking[] = [
  {
    id: "booking_1",
    tourId: "tour_1",
    userId: "traveler_1",
    userName: "Juan Dela Cruz",
    userEmail: "juan@example.com",
    tourTitle: "Palawan Wellness Escape",
    amount: "14900.00",
    currency: "PHP",
    status: "confirmed",
    participants: 2,
    bookingDate: now,
    travelDate: nextMonth,
    notes: null,
    paymentStatus: "paid",
    paymentId: "pay_local_1",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "booking_2",
    tourId: "tour_1",
    userId: "traveler_1",
    userName: "Juan Dela Cruz",
    userEmail: "juan@example.com",
    tourTitle: "Palawan Wellness Escape",
    amount: "14900.00",
    currency: "PHP",
    status: "pending",
    participants: 1,
    bookingDate: now,
    travelDate: nextMonth,
    notes: null,
    paymentStatus: "pending",
    paymentId: null,
    createdAt: now,
    updatedAt: now,
  },
];

const recomputeDerivedMetrics = () => {
  for (const tour of tours) {
    const tourBookings = bookings.filter((booking) => booking.tourId === tour.id);
    const paidBookings = tourBookings.filter(
      (booking) => booking.paymentStatus === "paid" || booking.status === "confirmed" || booking.status === "completed",
    );
    const revenue = paidBookings.reduce((sum, booking) => sum + toNumber(booking.amount), 0);
    tour.bookingsCount = tourBookings.length;
    tour.revenue = revenue.toFixed(2);
  }

  for (const host of hosts) {
    const hostTours = tours.filter((tour) => tour.hostId === host.id);
    const hostRevenue = hostTours.reduce((sum, tour) => sum + toNumber(tour.revenue), 0);
    host.totalTours = hostTours.length;
    host.totalRevenue = hostRevenue.toFixed(2);
  }

  for (const user of users) {
    const userBookings = bookings.filter((booking) => booking.userId === user.id);
    const totalSpent = userBookings
      .filter((booking) => booking.paymentStatus === "paid" || booking.status === "confirmed" || booking.status === "completed")
      .reduce((sum, booking) => sum + toNumber(booking.amount), 0);
    user.totalBookings = userBookings.length;
    user.totalSpent = totalSpent.toFixed(2);
  }
};

recomputeDerivedMetrics();

export const localAdminStore = {
  tours,
  users,
  articles,
  hosts,
  bookings,
  makeId,
  toNumber,
  recomputeDerivedMetrics,
};
