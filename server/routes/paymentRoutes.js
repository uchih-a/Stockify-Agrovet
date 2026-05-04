const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  createCheckoutSession,
  stripeWebhook,
  getPaymentStatus,
} = require('../controllers/paymentController');

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// WEBHOOK — must use express.raw() to receive the raw body.
// Stripe signs the raw request body; once JSON-parsed the signature breaks.
// This route is registered in app.js BEFORE express.json() for this reason.
// ─────────────────────────────────────────────────────────────────────────────
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhook
);

// ─────────────────────────────────────────────────────────────────────────────
// All other payment routes need their own express.json() middleware because
// app.js registers /api/v1/payments BEFORE the global express.json() parser.
// Without this, req.body is undefined on these routes.
// ─────────────────────────────────────────────────────────────────────────────
router.post(
  '/create-checkout-session',
  express.json({ limit: '10kb' }),
  protect,
  createCheckoutSession
);

router.get('/status/:sessionId', protect, getPaymentStatus);

module.exports = router;