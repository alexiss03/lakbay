import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';
import { storage } from './storage';
import type { Express } from 'express';

export function setupAuth(app: Express) {
  // Session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Google OAuth Strategy - Use full URL with proper domain
  const getCallbackURL = () => {
    // Use hardcoded Replit domain since REPLIT_DOMAIN env var is not available
    const domain = 'cf95eddf-2870-43aa-8998-a0b407d82da8-00-a53kb0z62kcn.spock.replit.dev';
    return `https://${domain}/api/auth/google/callback`;
  };

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: getCallbackURL()
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await storage.getUserByGoogleId(profile.id);
      
      if (user) {
        return done(null, user);
      }

      // Create new user
      const newUser = await storage.createUser({
        googleId: profile.id,
        email: profile.emails?.[0]?.value || '',
        username: profile.displayName || profile.emails?.[0]?.value?.split('@')[0] || 'user',
        firstName: profile.name?.givenName || '',
        lastName: profile.name?.familyName || '',
        profileImage: profile.photos?.[0]?.value || '',
        authProvider: 'google'
      });

      return done(null, newUser);
    } catch (error) {
      return done(error as Error, undefined);
    }
  }));

  // Serialize/deserialize user for session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
}

// Middleware to check if user is authenticated
export function requireAuth(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required' });
}

// Get current user data
export function getCurrentUser(req: any) {
  return req.user;
}