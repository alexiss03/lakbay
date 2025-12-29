import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as LocalStrategy } from 'passport-local';
import session from 'express-session';
import { storage } from './storage';
import type { Express } from 'express';
import bcrypt from 'bcryptjs';

export function setupAuth(app: Express) {
  // Session middleware - Fixed for Replit environment
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true, // Changed to true for OAuth
    cookie: {
      secure: false, // Disabled for Replit development environment
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax' // Added for OAuth compatibility
    }
  }));

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Google OAuth Strategy - Only initialize if credentials are available
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    const getCallbackURL = () => {
      // Use hardcoded Replit domain since REPLIT_DOMAIN env var is not available
      const domain = 'cf95eddf-2870-43aa-8998-a0b407d82da8-00-a53kb0z62kcn.spock.replit.dev';
      return `https://${domain}/api/auth/google/callback`;
    };

    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
  } else {
    console.log('⚠️  Google OAuth disabled - GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET not provided');
  }

  // Facebook OAuth Strategy - Only initialize if credentials are available
  if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    const getFacebookCallbackURL = () => {
      const domain = 'cf95eddf-2870-43aa-8998-a0b407d82da8-00-a53kb0z62kcn.spock.replit.dev';
      return `https://${domain}/api/auth/facebook/callback`;
    };

    passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: getFacebookCallbackURL(),
      profileFields: ['id', 'displayName', 'photos', 'email', 'first_name', 'last_name']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await storage.getUserByFacebookId(profile.id);
        
        if (user) {
          return done(null, user);
        }

        // Create new user
        const newUser = await storage.createUser({
          facebookId: profile.id,
          email: profile.emails?.[0]?.value || '',
          username: profile.displayName || `facebook_user_${profile.id}`,
          firstName: profile.name?.givenName || '',
          lastName: profile.name?.familyName || '',
          profileImage: profile.photos?.[0]?.value || '',
          authProvider: 'facebook'
        } as any);

        return done(null, newUser);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }));
  } else {
    console.log('⚠️  Facebook OAuth disabled - FACEBOOK_APP_ID and FACEBOOK_APP_SECRET not provided');
  }

  // Local Strategy for username/password authentication
  passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  async (username, password, done) => {
    try {
      // Check if user exists
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return done(null, false, { message: 'Invalid username or password' });
      }

      // Check if user has a password (might be OAuth-only user)
      if (!user.password) {
        return done(null, false, { message: 'Please sign in with your social account' });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return done(null, false, { message: 'Invalid username or password' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
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