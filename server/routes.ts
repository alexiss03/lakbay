import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// PayMongo API configuration
const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY;
const PAYMONGO_BASE_URL = 'https://api.paymongo.com/v1';

export async function registerRoutes(app: Express): Promise<Server> {
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

  const httpServer = createServer(app);
  return httpServer;
}
