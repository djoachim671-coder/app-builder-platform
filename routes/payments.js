const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

const PLANS = {
  free: { credits: 5, price: 0 },
  pro: { credits: 50, price: 9.99 },
  business: { credits: 500, price: 29.99 }
};

// Create Stripe Checkout Session
router.post('/checkout', auth, async (req, res) => {
  try {
    const { plan } = req.body;
    
    if (!PLANS[plan]) return res.status(400).json({ message: 'Invalid plan' });
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: `${plan.toUpperCase()} Plan` },
            unit_amount: Math.round(PLANS[plan].price * 100)
          },
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/pricing`
    });
    
    res.json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ message: 'Error creating checkout', error });
  }
});

// USDT Payment (Tether)
router.post('/usdt-payment', auth, async (req, res) => {
  try {
    const { plan, amount } = req.body;
    
    // Integrate USDT payment processing
    // This would connect to a blockchain service like Web3.js
    // For now, we'll simulate the payment
    
    const user = await User.findById(req.userId);
    user.plan = plan;
    user.credits = PLANS[plan].credits;
    user.subscription.status = 'active';
    await user.save();
    
    res.json({ message: 'Payment successful', plan, credits: user.credits });
  } catch (error) {
    res.status(500).json({ message: 'Error processing USDT payment', error });
  }
});

// PayPal Payment Integration
router.post('/paypal-payment', auth, async (req, res) => {
  try {
    const { plan } = req.body;
    
    // Integrate PayPal API
    res.json({ message: 'PayPal integration initiated', plan });
  } catch (error) {
    res.status(500).json({ message: 'Error with PayPal payment', error });
  }
});

// Get User Credits
router.get('/credits', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({ credits: user.credits, plan: user.plan });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching credits', error });
  }
});

// Reset Credits (24-hour cycle)
router.post('/reset-credits', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const now = new Date();
    
    if (now > user.creditsResetDate) {
      user.credits = PLANS[user.plan].credits;
      user.creditsResetDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      await user.save();
      res.json({ message: 'Credits reset', credits: user.credits });
    } else {
      res.json({ message: 'Credits will reset at', resetTime: user.creditsResetDate });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error resetting credits', error });
  }
});

module.exports = router;