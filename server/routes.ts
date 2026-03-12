import crypto from "crypto";
import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import passport from "passport";
import { setupAuth, requireAuth, requireRole, getCurrentUser } from "./auth";
import adminRoutes from "./routes/admin";
import bcrypt from 'bcryptjs';
import hostRoutes from "./routes/host";
import adminLocalRoutes from "./routes/admin-local";
import hostLocalRoutes from "./routes/host-local";
import chatRoutes from "./routes/chat";
import accommodationRoutes from "./routes/accommodation";
import shopRoutes from "./routes/shop";
import audioRoutes from "./routes/audio";
import { storage } from "./storage";
import { 
  insertCategorySchema, insertProductSchema, insertCartItemSchema, 
  insertOrderSchema, insertReviewSchema, insertWishlistItemSchema,
  type Category, type Product, type CartItem 
} from "@shared/schema";
import { z } from "zod";
import { isSearchable } from "@shared/status-transitions";

// PayMongo API configuration
const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY;
const PAYMONGO_WEBHOOK_SECRET = process.env.PAYMONGO_WEBHOOK_SECRET;
const PAYMONGO_BASE_URL = 'https://api.paymongo.com/v1';

type AuthenticatedRequest = Request & {
  user?: {
    id?: string | number;
    username?: string;
    email?: string;
    role?: "user" | "host" | "admin";
  };
  rawBody?: Buffer;
};

type ReservationRecord = {
  id: string;
  trip_id: string;
  trip_title: string;
  user_id: string;
  user_name: string;
  user_email: string;
  check_in: string;
  check_out: string;
  guests: number;
  amount: number;
  status: string;
  payment_status: string;
  payment_id: string | null;
  created_at: string;
  expires_at: string;
  updated_at: string;
};

const pendingReservations = new Map<string, ReservationRecord>();
const passwordResetTokens = new Map<string, { userId: number; expiresAt: number }>();

const DEFAULT_TRAVEL_GOAL_TARGETS = {
  targetTrips: 6,
  targetProvinces: 8,
  targetTravelDays: 20,
};

const travelGoalUpsertSchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
  // Legacy field names (kept for backward compatibility)
  targetTrips: z.coerce.number().int().min(1).max(120).optional(),
  targetProvinces: z.coerce.number().int().min(1).max(120).optional(),
  targetTravelDays: z.coerce.number().int().min(1).max(365).optional(),
  // Preferred semantic goal names
  targetAdventure: z.coerce.number().int().min(1).max(120).optional(),
  targetWellness: z.coerce.number().int().min(1).max(120).optional(),
  targetExplorationDays: z.coerce.number().int().min(1).max(365).optional(),
  targetPoints: z.coerce.number().int().min(100).max(100000).optional(),
  notes: z.string().max(500).optional().nullable(),
});

const travelGoalProgressSchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
  action: z.enum([
    "trip_completed",
    "province_visited",
    "travel_day",
    "bonus_points",
    "adventure_activity",
    "wellness_activity",
    "exploration_day",
  ]),
  amount: z.coerce.number().int().min(1).max(100).default(1),
});

const getTargetPointsFromGoals = (targetTrips: number, targetProvinces: number, targetTravelDays: number) => {
  return targetTrips * 120 + targetProvinces * 80 + targetTravelDays * 20;
};

const clampPercent = (current: number, target: number) => {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
};

const buildTravelGoalResponse = (goal: any) => {
  const tripsPercent = clampPercent(goal.currentTrips, goal.targetTrips);
  const provincesPercent = clampPercent(goal.currentProvinces, goal.targetProvinces);
  const travelDaysPercent = clampPercent(goal.currentTravelDays, goal.targetTravelDays);
  const pointsPercent = clampPercent(goal.currentPoints, goal.targetPoints);
  const overallCompletion = Math.round(
    (tripsPercent + provincesPercent + travelDaysPercent + pointsPercent) / 4,
  );

  const level = Math.max(1, Math.floor(goal.currentPoints / 300) + 1);
  const nextLevelPoints = level * 300;
  const xpToNextLevel = Math.max(0, nextLevelPoints - goal.currentPoints);

  const badges: string[] = [];
  if (goal.currentTrips >= 1) badges.push("First Adventure");
  if (goal.currentProvinces >= 5) badges.push("Wellness Keeper");
  if (goal.currentTravelDays >= 10) badges.push("Explorer Rhythm");
  if (goal.currentPoints >= 1000) badges.push("Momentum Master");
  if (overallCompletion >= 100) badges.push("Goal Champion");

  return {
    goal: {
      ...goal,
      targetAdventure: goal.targetTrips,
      targetWellness: goal.targetProvinces,
      targetExplorationDays: goal.targetTravelDays,
      currentAdventure: goal.currentTrips,
      currentWellness: goal.currentProvinces,
      currentExplorationDays: goal.currentTravelDays,
    },
    progress: {
      trips: { current: goal.currentTrips, target: goal.targetTrips, percent: tripsPercent },
      provinces: { current: goal.currentProvinces, target: goal.targetProvinces, percent: provincesPercent },
      travelDays: { current: goal.currentTravelDays, target: goal.targetTravelDays, percent: travelDaysPercent },
      points: { current: goal.currentPoints, target: goal.targetPoints, percent: pointsPercent },
      adventure: { current: goal.currentTrips, target: goal.targetTrips, percent: tripsPercent },
      wellness: { current: goal.currentProvinces, target: goal.targetProvinces, percent: provincesPercent },
      explorationDays: { current: goal.currentTravelDays, target: goal.targetTravelDays, percent: travelDaysPercent },
      overallCompletion,
    },
    gamification: {
      level,
      nextLevelPoints,
      xpToNextLevel,
      badges,
      rank: overallCompletion >= 100 ? "Travel Legend" : level >= 5 ? "Trail Mentor" : "Explorer in Progress",
    },
  };
};

const parsePaymongoSignatureHeader = (headerValue: string | undefined): { timestamp: string; signature: string } | null => {
  if (!headerValue) {
    return null;
  }

  const parts = headerValue.split(",").reduce<Record<string, string>>((acc, entry) => {
    const [key, value] = entry.split("=").map((part) => part?.trim());
    if (key && value) {
      acc[key] = value;
    }
    return acc;
  }, {});

  const timestamp = parts.t;
  const signature = parts.li || parts.te || parts.v1;
  if (!timestamp || !signature) {
    return null;
  }

  return { timestamp, signature };
};

const timingSafeHexCompare = (left: string, right: string): boolean => {
  const leftBuffer = Buffer.from(left, "hex");
  const rightBuffer = Buffer.from(right, "hex");

  if (leftBuffer.length === 0 || rightBuffer.length === 0 || leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
};

const verifyPaymongoWebhookSignature = (req: AuthenticatedRequest): boolean => {
  if (!PAYMONGO_WEBHOOK_SECRET) {
    return true;
  }

  const rawBody = req.rawBody;
  if (!rawBody) {
    return false;
  }

  const signatureHeader =
    req.header("paymongo-signature") ||
    req.header("Paymongo-Signature") ||
    req.header("x-paymongo-signature");

  const parsedSignature = parsePaymongoSignatureHeader(signatureHeader);
  if (!parsedSignature) {
    return false;
  }

  const signedPayload = `${parsedSignature.timestamp}.${rawBody.toString("utf8")}`;
  const expectedSignature = crypto
    .createHmac("sha256", PAYMONGO_WEBHOOK_SECRET)
    .update(signedPayload)
    .digest("hex");

  return timingSafeHexCompare(expectedSignature, parsedSignature.signature);
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // ============ AUTHENTICATION ROUTES ============
  
  // Debug endpoint to show OAuth configuration
  app.get('/api/auth/debug', (req, res) => {
    const domain = 'cf95eddf-2870-43aa-8998-a0b407d82da8-00-a53kb0z62kcn.spock.replit.dev';
    const callbackURL = `https://${domain}/api/auth/google/callback`;
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&redirect_uri=${encodeURIComponent(callbackURL)}&scope=profile%20email&client_id=${clientId}`;
    
    res.json({
      domain,
      callbackURL,
      clientId: clientId?.slice(0, 20) + '...', // Hide most of client ID for security
      googleAuthUrl,
      instructions: {
        step1: 'Go to Google Cloud Console',
        step2: 'Navigate to APIs & Services > Credentials',
        step3: `Find your OAuth 2.0 Client ID: ${clientId?.slice(0, 20)}...`,
        step4: 'Add these exact values:',
        authorizedJavaScriptOrigins: [`https://${domain}`],
        authorizedRedirectURIs: [callbackURL]
      }
    });
  });
  
  // Google OAuth routes
  app.get('/api/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  app.get('/api/auth/google/callback',
    passport.authenticate('google', { 
      failureRedirect: '/login?error=auth_failed',
      failureFlash: false 
    }),
    (req, res) => {
      // Successful authentication, redirect to home
      console.log('🎉 Google OAuth SUCCESS for user:', JSON.stringify(req.user, null, 2));
      res.redirect('/?auth=success');
    }
  );

  // Facebook OAuth routes - Only enable if credentials are available
  if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    app.get('/api/auth/facebook',
      passport.authenticate('facebook', { scope: ['email'] })
    );

    app.get('/api/auth/facebook/callback',
      passport.authenticate('facebook', { 
        failureRedirect: '/login?error=auth_failed',
        failureFlash: false 
      }),
      (req, res) => {
        // Successful authentication, redirect to home
        console.log('🎉 Facebook OAuth SUCCESS for user:', JSON.stringify(req.user, null, 2));
        res.redirect('/?auth=success');
      }
    );
  } else {
    // Placeholder routes when Facebook OAuth is not configured
    app.get('/api/auth/facebook', (req, res) => {
      res.status(503).json({ 
        error: 'Facebook authentication not configured',
        message: 'FACEBOOK_APP_ID and FACEBOOK_APP_SECRET are required'
      });
    });

    app.get('/api/auth/facebook/callback', (req, res) => {
      res.redirect('/login?error=facebook_not_configured');
    });
  }

  // Add a test callback endpoint to debug what Google sends back
  app.get('/api/auth/callback-test', (req, res) => {
    console.log('📝 Callback received with params:', req.query);
    res.json({ 
      message: 'Callback test received',
      params: req.query,
      timestamp: new Date().toISOString()
    });
  });

  // Add error handling route
  app.get('/api/auth/error', (req, res) => {
    console.log('OAuth error:', req.query);
    res.redirect('/login?error=oauth_error');
  });

  // Get current user
  app.get('/api/auth/user', (req, res) => {
    const user = getCurrentUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    res.json(user);
  });

  app.post('/api/auth/forgot-password', async (req, res) => {
    try {
      const email = String(req.body?.email || "").trim().toLowerCase();
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const user = await storage.getUserByEmail(email);
      if (user) {
        const token = crypto.randomBytes(24).toString("hex");
        const expiresAt = Date.now() + 60 * 60 * 1000;
        passwordResetTokens.set(token, { userId: user.id, expiresAt });
        console.log(`Password reset token generated for user ${user.id}: ${token}`);
      }

      res.json({
        success: true,
        message: "If the account exists, a reset link has been generated.",
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post('/api/auth/reset-password', async (req, res) => {
    try {
      const token = String(req.body?.token || "");
      const password = String(req.body?.password || "");
      if (!token || !password) {
        return res.status(400).json({ error: "Token and password are required" });
      }

      const tokenRecord = passwordResetTokens.get(token);
      if (!tokenRecord || tokenRecord.expiresAt < Date.now()) {
        passwordResetTokens.delete(token);
        return res.status(400).json({ error: "Invalid or expired reset token" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await storage.updateUser(tokenRecord.userId, { password: hashedPassword });
      passwordResetTokens.delete(token);

      res.json({ success: true });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Logout
  app.post('/api/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: 'Logout failed' });
      }
      res.json({ success: true });
    });
  });

  // Local authentication (username/password)
  app.post('/api/auth/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      
      if (!user) {
        return res.status(401).json({ 
          error: info?.message || 'Invalid credentials' 
        });
      }

      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        
        return res.json({ 
          success: true, 
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            authProvider: user.authProvider
          }
        });
      });
    })(req, res, next);
  });

  // Register new user
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { username, email, password, firstName, lastName } = req.body;
      
      if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ error: 'Username already taken' });
      }

      // Hash password before storing
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new user
      const newUser = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        firstName: firstName || '',
        lastName: lastName || '',
        authProvider: 'local'
      });

      // Log user in automatically
      req.login(newUser, (err) => {
        if (err) {
          return res.status(500).json({ error: 'Registration successful but login failed' });
        }
        res.status(201).json({ success: true, user: newUser });
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // ============ E-COMMERCE API ROUTES ============
  
  // Categories
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  });

  app.get('/api/categories/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getCategory(id);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }
      res.json(category);
    } catch (error) {
      console.error('Error fetching category:', error);
      res.status(500).json({ error: 'Failed to fetch category' });
    }
  });

  app.post('/api/categories', async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      console.error('Error creating category:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid category data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create category' });
    }
  });

  // Products
  app.get('/api/products', async (req, res) => {
    try {
      const { category, featured, limit = 20, offset = 0 } = req.query;
      
      let products;
      if (featured === 'true') {
        products = await storage.getFeaturedProducts(parseInt(limit as string));
      } else {
        const categoryId = category ? parseInt(category as string) : undefined;
        products = await storage.getProducts(categoryId, parseInt(limit as string), parseInt(offset as string));
      }
      
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      // Get product variants and reviews
      const [variants, reviews] = await Promise.all([
        storage.getProductVariants(id),
        storage.getProductReviews(id)
      ]);
      
      res.json({ ...product, variants, reviews });
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  });

  app.get('/api/products/slug/:slug', async (req, res) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      const [variants, reviews] = await Promise.all([
        storage.getProductVariants(product.id),
        storage.getProductReviews(product.id)
      ]);
      
      res.json({ ...product, variants, reviews });
    } catch (error) {
      console.error('Error fetching product by slug:', error);
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  });

  app.post('/api/products', async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      console.error('Error creating product:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid product data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create product' });
    }
  });

  // Shopping Cart
  app.get('/api/cart/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const cartItems = await storage.getCartItems(userId);
      res.json(cartItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
      res.status(500).json({ error: 'Failed to fetch cart' });
    }
  });

  app.post('/api/cart', async (req, res) => {
    try {
      const validatedData = insertCartItemSchema.parse(req.body);
      const cartItem = await storage.addToCart(validatedData);
      res.status(201).json(cartItem);
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid cart item data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to add to cart' });
    }
  });

  app.put('/api/cart/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      const cartItem = await storage.updateCartItem(id, quantity);
      res.json(cartItem);
    } catch (error) {
      console.error('Error updating cart item:', error);
      res.status(500).json({ error: 'Failed to update cart item' });
    }
  });

  app.delete('/api/cart/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.removeFromCart(id);
      res.json({ success: true });
    } catch (error) {
      console.error('Error removing from cart:', error);
      res.status(500).json({ error: 'Failed to remove from cart' });
    }
  });

  app.delete('/api/cart/clear/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      await storage.clearCart(userId);
      res.json({ success: true });
    } catch (error) {
      console.error('Error clearing cart:', error);
      res.status(500).json({ error: 'Failed to clear cart' });
    }
  });


  // Orders
  app.get('/api/orders/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const orders = await storage.getOrders(userId);
      res.json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  app.get('/api/order/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const [order, orderItems] = await Promise.all([
        storage.getOrder(id),
        storage.getOrderItems(id)
      ]);
      
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      res.json({ ...order, items: orderItems });
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({ error: 'Failed to fetch order' });
    }
  });

  app.post('/api/orders', async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      // Generate order number
      validatedData.orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      
      const order = await storage.createOrder(validatedData);
      res.status(201).json(order);
    } catch (error) {
      console.error('Error creating order:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid order data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create order' });
    }
  });

  // Reviews
  app.get('/api/products/:productId/reviews', async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      const reviews = await storage.getProductReviews(productId);
      res.json(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  });

  app.post('/api/reviews', async (req, res) => {
    try {
      const validatedData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(validatedData);
      res.status(201).json(review);
    } catch (error) {
      console.error('Error creating review:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid review data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create review' });
    }
  });

  // Wishlist
  app.get('/api/wishlist/:userId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const wishlistItems = await storage.getWishlistItems(userId);
      res.json(wishlistItems);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
  });

  app.post('/api/wishlist', async (req, res) => {
    try {
      const validatedData = insertWishlistItemSchema.parse(req.body);
      const wishlistItem = await storage.addToWishlist(validatedData);
      res.status(201).json(wishlistItem);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid wishlist item data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to add to wishlist' });
    }
  });

  app.delete('/api/wishlist/:userId/:productId', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const productId = parseInt(req.params.productId);
      await storage.removeFromWishlist(userId, productId);
      res.json({ success: true });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      res.status(500).json({ error: 'Failed to remove from wishlist' });
    }
  });

  // ============ EXISTING TRAVEL BOOKING ROUTES ============
  // PayMongo Payment Routes
  app.post('/api/create-payment', requireAuth, async (req, res) => {
    try {
      const { amount, currency, description, statement_descriptor, metadata } = req.body;
      const safeMetadata =
        metadata && typeof metadata === "object" ? (metadata as Record<string, unknown>) : {};
      const tripId = String(safeMetadata.trip_id || "booking");

      if (!PAYMONGO_SECRET_KEY) {
        return res.status(500).json({ 
          success: false, 
          error: 'PayMongo secret key not configured. Please add PAYMONGO_SECRET_KEY to environment variables.' 
        });
      }

      // Create PayMongo Checkout Session
      const checkoutResponse = await fetch(`${PAYMONGO_BASE_URL}/checkout_sessions`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(PAYMONGO_SECRET_KEY + ':').toString('base64')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            attributes: {
              cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5000'}/trip/${tripId}?payment=cancelled`,
              billing: {
                name: 'Customer',
                email: 'customer@lakbay.com',
                phone: '+639123456789'
              },
              description,
              line_items: [
                {
                  amount,
                  currency,
                  description,
                  name: description,
                  quantity: 1
                }
              ],
              payment_method_types: [
                'card',
                'gcash',
                'paymaya',
                'grab_pay'
              ],
              success_url: `${process.env.FRONTEND_URL || 'http://localhost:5000'}/trip/${tripId}?payment=success`,
              statement_descriptor,
              metadata: safeMetadata
            }
          }
        }),
      });

      const checkoutData = await checkoutResponse.json();

      if (!checkoutResponse.ok) {
        console.error('PayMongo checkout error:', checkoutData);
        return res.status(400).json({ 
          success: false, 
          error: checkoutData.errors?.[0]?.detail || 'Checkout creation failed' 
        });
      }

      const reservationId = safeMetadata.reservation_id as string | undefined;
      if (reservationId && pendingReservations.has(reservationId)) {
        const reservation = pendingReservations.get(reservationId)!;
        reservation.payment_id = checkoutData.data.id;
        reservation.updated_at = new Date().toISOString();
        pendingReservations.set(reservation.id, reservation);
      }

      res.json({
        success: true,
        checkout_url: checkoutData.data.attributes.checkout_url,
        checkout_id: checkoutData.data.id
      });

    } catch (error) {
      console.error('Payment creation error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  });

  // Create Reservation (without payment)
  app.post('/api/create-reservation', requireAuth, async (req, res) => {
    try {
      const requestUser = getCurrentUser(req as AuthenticatedRequest);
      const { trip_id, trip_title, check_in, check_out, guests, status = "pending_payment", amount } = req.body;

      if (!trip_id || !check_in || !check_out) {
        return res.status(400).json({
          success: false,
          error: "trip_id, check_in, and check_out are required",
        });
      }

      const checkInDate = new Date(check_in);
      const checkOutDate = new Date(check_out);
      if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())) {
        return res.status(400).json({ success: false, error: "Invalid date format" });
      }

      if (checkOutDate <= checkInDate) {
        return res.status(400).json({ success: false, error: "check_out must be after check_in" });
      }

      const parsedGuests = Math.max(1, Number.parseInt(String(guests), 10) || 1);
      const parsedAmount = Number.isFinite(Number(amount)) ? Number(amount) / 100 : 0;
      const nowIso = new Date().toISOString();
      const reservationId = `res_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

      const reservation: ReservationRecord = {
        id: reservationId,
        trip_id: String(trip_id),
        trip_title: String(trip_title || `Trip ${trip_id}`),
        user_id: String(requestUser?.id ?? ""),
        user_name: requestUser?.username || "Guest User",
        user_email: requestUser?.email || "unknown@lakbay.local",
        check_in: checkInDate.toISOString(),
        check_out: checkOutDate.toISOString(),
        guests: parsedGuests,
        amount: Number.isNaN(parsedAmount) ? 0 : parsedAmount,
        status: String(status),
        payment_status: "pending",
        payment_id: null,
        created_at: nowIso,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        updated_at: nowIso,
      };

      pendingReservations.set(reservation.id, reservation);

      try {
        const { adminBookings } = await import("@shared/admin-schema");
        const { db } = await import("./db");
        await db.insert(adminBookings).values({
          id: reservation.id,
          tourId: reservation.trip_id,
          userId: reservation.user_id,
          userName: reservation.user_name,
          userEmail: reservation.user_email,
          tourTitle: reservation.trip_title,
          amount: reservation.amount.toFixed(2),
          status: reservation.status,
          participants: reservation.guests,
          bookingDate: new Date(reservation.created_at),
          travelDate: new Date(reservation.check_in),
          notes: `check_out=${reservation.check_out}`,
          paymentStatus: reservation.payment_status,
          paymentId: reservation.payment_id,
          updatedAt: new Date(),
        });
      } catch (dbError) {
        console.warn("Reservation DB persistence unavailable, using in-memory fallback:", dbError);
      }

      res.json({
        success: true,
        reservation
      });

    } catch (error) {
      console.error('Reservation creation error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  });

  // Google Maps API Key endpoint
  app.get('/api/config/google-maps-key', (req, res) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        success: false, 
        error: 'Google Maps API key not configured' 
      });
    }
    res.json({ 
      success: true, 
      apiKey: apiKey 
    });
  });

  // PayMongo Webhook handler
  app.post('/api/paymongo-webhook', async (req, res) => {
    try {
      const typedReq = req as AuthenticatedRequest;
      const signatureValid = verifyPaymongoWebhookSignature(typedReq);
      if (!signatureValid) {
        return res.status(400).json({ error: "Invalid webhook signature" });
      }

      const event = req.body as any;
      const eventType = event?.data?.attributes?.type as string | undefined;
      const eventData = event?.data?.attributes?.data;
      const eventAttributes = eventData?.attributes ?? {};
      const metadata = eventAttributes.metadata ?? {};
      const paymentId = eventData?.id ? String(eventData.id) : null;
      const reservationId = metadata.reservation_id ? String(metadata.reservation_id) : null;
      
      switch (eventType) {
        case 'payment_intent.payment_failed':
          console.log('Payment failed:', paymentId);
          break;
          
        case 'payment_intent.succeeded':
          console.log('Payment succeeded:', paymentId);
          break;
          
        case 'checkout_session.payment_paid':
          console.log('Checkout payment paid:', paymentId);
          if (reservationId && pendingReservations.has(reservationId)) {
            const reservation = pendingReservations.get(reservationId)!;
            reservation.payment_status = "paid";
            reservation.status = "confirmed";
            reservation.payment_id = paymentId;
            reservation.updated_at = new Date().toISOString();
            pendingReservations.set(reservation.id, reservation);

            try {
              const [{ adminBookings }, { eq }, { db }] = await Promise.all([
                import("@shared/admin-schema"),
                import("drizzle-orm"),
                import("./db"),
              ]);
              await db
                .update(adminBookings)
                .set({
                  status: "confirmed",
                  paymentStatus: "paid",
                  paymentId,
                  updatedAt: new Date(),
                })
                .where(eq(adminBookings.id, reservation.id));
            } catch (dbError) {
              console.warn("Failed to update booking status in DB after webhook:", dbError);
            }
          }
          break;
      }

      res.json({ received: true });

    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  });

  // Admin user promotion endpoint
  app.post('/api/auth/promote-user', requireAuth, async (req, res) => {
    try {
      const currentUser = getCurrentUser(req);
      
      // Check if current user is admin
      if (!currentUser || currentUser.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const { userId, role } = req.body;
      
      if (!userId || !role) {
        return res.status(400).json({ error: 'User ID and role are required' });
      }

      if (!['user', 'host', 'admin'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role. Must be user, host, or admin' });
      }

      // Get the user to be updated
      const userToUpdate = await storage.getUser(userId);
      if (!userToUpdate) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Update user role
      const updatedUser = await storage.updateUser(userId, { role });
      
      res.json({ 
        success: true, 
        message: `User ${userToUpdate.username} has been promoted to ${role}`,
        user: {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          role: updatedUser.role
        }
      });

    } catch (error) {
      console.error('User promotion error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get all users (admin only)
  app.get('/api/auth/users', requireAuth, async (req, res) => {
    try {
      const currentUser = getCurrentUser(req);
      
      // Check if current user is admin
      if (!currentUser || currentUser.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }

      const users = await storage.getUsers();

      res.json({ 
        success: true, 
        users: users.map((user) => ({
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          authProvider: user.authProvider,
          createdAt: user.createdAt,
        }))
      });

    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Yearly travel goals with gamified progress
  app.get('/api/travel-goals', requireAuth, async (req, res) => {
    try {
      const parsedYear = Number(req.query.year ?? new Date().getFullYear());
      if (!Number.isInteger(parsedYear) || parsedYear < 2000 || parsedYear > 2100) {
        return res.status(400).json({ error: "Invalid year" });
      }

      const userId = Number((req.user as any)?.id);
      if (!Number.isInteger(userId)) {
        return res.status(401).json({ error: "Authentication required" });
      }

      let goal = await storage.getTravelGoal(userId, parsedYear);
      if (!goal) {
        goal = await storage.upsertTravelGoal(userId, {
          year: parsedYear,
          ...DEFAULT_TRAVEL_GOAL_TARGETS,
          targetPoints: getTargetPointsFromGoals(
            DEFAULT_TRAVEL_GOAL_TARGETS.targetTrips,
            DEFAULT_TRAVEL_GOAL_TARGETS.targetProvinces,
            DEFAULT_TRAVEL_GOAL_TARGETS.targetTravelDays,
          ),
        });
      }

      res.json(buildTravelGoalResponse(goal));
    } catch (error) {
      console.error("Get travel goals error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put('/api/travel-goals', requireAuth, async (req, res) => {
    try {
      const parsed = travelGoalUpsertSchema.parse(req.body || {});
      const userId = Number((req.user as any)?.id);
      if (!Number.isInteger(userId)) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const targetTrips = parsed.targetAdventure ?? parsed.targetTrips;
      const targetProvinces = parsed.targetWellness ?? parsed.targetProvinces;
      const targetTravelDays = parsed.targetExplorationDays ?? parsed.targetTravelDays;
      if (!targetTrips || !targetProvinces || !targetTravelDays) {
        return res.status(400).json({
          error:
            "Provide targetAdventure/targetWellness/targetExplorationDays (or legacy targetTrips/targetProvinces/targetTravelDays).",
        });
      }

      const goal = await storage.upsertTravelGoal(userId, {
        year: parsed.year,
        targetTrips,
        targetProvinces,
        targetTravelDays,
        targetPoints:
          parsed.targetPoints ??
          getTargetPointsFromGoals(targetTrips, targetProvinces, targetTravelDays),
        notes: parsed.notes,
      });

      res.json(buildTravelGoalResponse(goal));
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid goal payload", details: error.errors });
      }
      console.error("Update travel goals error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post('/api/travel-goals/progress', requireAuth, async (req, res) => {
    try {
      const parsed = travelGoalProgressSchema.parse(req.body || {});
      const userId = Number((req.user as any)?.id);
      if (!Number.isInteger(userId)) {
        return res.status(401).json({ error: "Authentication required" });
      }

      let goal = await storage.getTravelGoal(userId, parsed.year);
      if (!goal) {
        goal = await storage.upsertTravelGoal(userId, {
          year: parsed.year,
          ...DEFAULT_TRAVEL_GOAL_TARGETS,
          targetPoints: getTargetPointsFromGoals(
            DEFAULT_TRAVEL_GOAL_TARGETS.targetTrips,
            DEFAULT_TRAVEL_GOAL_TARGETS.targetProvinces,
            DEFAULT_TRAVEL_GOAL_TARGETS.targetTravelDays,
          ),
        });
      }

      let currentTrips = goal.currentTrips;
      let currentProvinces = goal.currentProvinces;
      let currentTravelDays = goal.currentTravelDays;
      let currentPoints = goal.currentPoints;

      switch (parsed.action) {
        case "trip_completed":
        case "adventure_activity":
          currentTrips += parsed.amount;
          currentPoints += parsed.amount * 120;
          break;
        case "province_visited":
        case "wellness_activity":
          currentProvinces += parsed.amount;
          currentPoints += parsed.amount * 80;
          break;
        case "travel_day":
        case "exploration_day":
          currentTravelDays += parsed.amount;
          currentPoints += parsed.amount * 20;
          break;
        case "bonus_points":
          currentPoints += parsed.amount;
          break;
      }

      const updatedGoal = await storage.upsertTravelGoal(userId, {
        year: parsed.year,
        currentTrips,
        currentProvinces,
        currentTravelDays,
        currentPoints,
        lastActivityAt: new Date(),
      });

      res.json(buildTravelGoalResponse(updatedGoal));
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid progress payload", details: error.errors });
      }
      console.error("Update travel goal progress error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const adminRouter = process.env.DATABASE_URL ? adminRoutes : adminLocalRoutes;
  const hostRouter = process.env.DATABASE_URL ? hostRoutes : hostLocalRoutes;

  // Register admin routes
  app.use('/api/admin', requireAuth, requireRole('admin'), adminRouter);
  
  // Register host routes
  app.use('/api/host', requireAuth, requireRole('host', 'admin'), hostRouter);
  
  // Register chat routes
  app.use('/api/chat', requireAuth, chatRoutes);
  
  // Register accommodation routes
  app.use('/api/accommodation', requireAuth, requireRole('host', 'admin'), accommodationRoutes);

  // Register shop routes
  app.use('/api/shop', shopRoutes);

  // Register audio routes
  app.use('/api', audioRoutes);

  // Public trips endpoint with status visibility filtering
  app.get('/api/trips', async (req, res) => {
    try {
      if (!process.env.DATABASE_URL) {
        return res.json([]);
      }

      const { category, search, limit = "20", offset = "0", featured } = req.query;
      
      // Import admin tours schema for public display
      const { adminTours } = await import('@shared/admin-schema');
      const { db } = await import('./db');
      const { eq, desc, and, inArray, sql } = await import('drizzle-orm');
      
      const conditions = [];
      
      // Only show trips with searchable status
      const searchableStatuses = ['active', 'ongoing', 'completed'];
      conditions.push(inArray(adminTours.status, searchableStatuses));
      
      if (category && category !== "all") {
        // Category can be stored as a JSON array string; use text match for compatibility
        conditions.push(sql`${adminTours.category}::text ILIKE ${`%${String(category)}%`}`);
      }
      
      if (featured === 'true') {
        conditions.push(eq(adminTours.featured, true));
      }

      if (search) {
        const term = `%${String(search).trim()}%`;
        conditions.push(
          sql`(
            ${adminTours.title} ILIKE ${term}
            OR ${adminTours.location} ILIKE ${term}
            OR COALESCE(${adminTours.description}, '') ILIKE ${term}
          )`
        );
      }

      let query = db.select().from(adminTours);
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }

      const trips = await query
        .orderBy(desc(adminTours.createdAt))
        .limit(parseInt(limit as string))
        .offset(parseInt(offset as string));

      res.json(trips);
    } catch (error) {
      console.error("Error fetching public trips:", error);
      res.status(500).json({ error: "Failed to fetch trips" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
