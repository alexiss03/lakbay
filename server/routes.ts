import type { Express } from "express";
import { createServer, type Server } from "http";
import passport from "passport";
import { setupAuth, requireAuth, getCurrentUser } from "./auth";
import adminRoutes from "./routes/admin";
import hostRoutes from "./routes/host";
import chatRoutes from "./routes/chat";
import accommodationRoutes from "./routes/accommodation";
import shopRoutes from "./routes/shop";
import audioRoutes from "./routes/audio";
import { storage } from "./storage";
import Stripe from "stripe";
import { 
  insertCategorySchema, insertProductSchema, insertCartItemSchema, 
  insertOrderSchema, insertReviewSchema, insertWishlistItemSchema,
  type Category, type Product, type CartItem 
} from "@shared/schema";
import { z } from "zod";

// PayMongo API configuration
const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY;
const PAYMONGO_BASE_URL = 'https://api.paymongo.com/v1';

// Stripe configuration
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
});

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
      console.log('Google OAuth success for user:', req.user);
      res.redirect('/?auth=success');
    }
  );

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

  // Logout
  app.post('/api/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: 'Logout failed' });
      }
      res.json({ success: true });
    });
  });

  // Local authentication (email/password)
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // For demo purposes, this is a simple check
      // In production, you'd hash and compare passwords
      const user = await storage.getUserByEmail(email);
      
      if (!user || (user.password && user.password !== password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Set user in session
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ error: 'Login failed' });
        }
        res.json({ success: true, user });
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
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

      // Create new user
      const newUser = await storage.createUser({
        username,
        email,
        password, // In production, hash this password
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

  // Stripe Payment Intent
  app.post('/api/create-payment-intent', async (req, res) => {
    try {
      const { amount, currency = 'php', metadata = {} } = req.body;
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to centavos/cents
        currency: currency.toLowerCase(),
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({ error: 'Failed to create payment intent' });
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
  app.post('/api/create-payment', async (req, res) => {
    try {
      const { amount, currency, description, statement_descriptor, metadata } = req.body;

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
              cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5000'}/trip/${metadata.trip_id}?payment=cancelled`,
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
              success_url: `${process.env.FRONTEND_URL || 'http://localhost:5000'}/trip/${metadata.trip_id}?payment=success`,
              statement_descriptor,
              metadata
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
  app.post('/api/create-reservation', async (req, res) => {
    try {
      const { trip_id, check_in, check_out, guests, status } = req.body;

      // Create reservation object
      const reservation = {
        id: `res_${Date.now()}`,
        trip_id,
        check_in,
        check_out,
        guests,
        status,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      };

      // In production, save to database
      console.log('Created reservation:', reservation);

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
      const event = req.body;
      
      switch (event.data.attributes.type) {
        case 'payment_intent.payment_failed':
          console.log('Payment failed:', event.data.attributes.data.id);
          break;
          
        case 'payment_intent.succeeded':
          console.log('Payment succeeded:', event.data.attributes.data.id);
          break;
          
        case 'checkout_session.payment_paid':
          console.log('Checkout payment paid:', event.data.attributes.data.id);
          break;
      }

      res.json({ received: true });

    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  });

  // Register admin routes
  app.use('/api/admin', adminRoutes);
  
  // Register host routes
  app.use('/api/host', hostRoutes);
  
  // Register chat routes
  app.use('/api/chat', chatRoutes);
  
  // Register accommodation routes
  app.use('/api/accommodation', accommodationRoutes);

  // Register shop routes
  app.use('/api/shop', shopRoutes);

  // Register audio routes
  app.use('/api', audioRoutes);

  const httpServer = createServer(app);
  return httpServer;
}
