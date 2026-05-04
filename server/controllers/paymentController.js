const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const { StatusCodes } = require('http-status-codes');

/**
 * POST /api/v1/payments/create-checkout-session
 * Body: { items: [{ productId, quantity }] }
 * Creates a Stripe Checkout Session and returns the hosted payment URL.
 */
const createCheckoutSession = asyncHandler(async (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return ApiResponse.error(res, StatusCodes.BAD_REQUEST, 'Cart items are required');
  }
   console.log('🔍 items received:', JSON.stringify(items));
  console.log('🔍 productIds extracted:', items?.map((i) => i.productId));

  // Fetch all products in one query
  const productIds = items.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: productIds } });

  if (products.length !== items.length) {
    return ApiResponse.error(res, StatusCodes.BAD_REQUEST, 'One or more products were not found');
  }

  // 👇 ADD THIS
  console.log('🔍 products found in DB:', products.length, 'of', items.length)

  // Validate stock and build Stripe line_items
  const lineItems = [];
  for (const cartItem of items) {
    const product = products.find((p) => p._id.toString() === cartItem.productId);

    if (product.quantity < cartItem.quantity) {
      return ApiResponse.error(
        res,
        StatusCodes.BAD_REQUEST,
        `Insufficient stock for "${product.name}". Available: ${product.quantity} ${product.unit}`
      );
    }

    lineItems.push({
      price_data: {
        currency: 'kes',
        product_data: {
          name: product.name,
          description: `${product.category} · ${product.unit}`,
          // FIX: Stripe requires public HTTPS URLs (max 2048 chars) — Base64 data URLs are
          // too large and not publicly accessible. Images omitted (cosmetic only).
          metadata: { productId: product._id.toString() },
        },
        // Stripe expects amounts in the smallest currency unit.
        // KES is a zero-decimal currency but Stripe still needs integer cents.
        unit_amount: Math.round(product.price * 100),
      },
      quantity: cartItem.quantity,
    });
  }

  // Store the cart in session metadata so the webhook can create Transactions
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL}/farmer/orders?payment=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/farmer/shop?payment=cancelled`,
    customer_email: req.user.email,
    metadata: {
      userId: req.user._id.toString(),
      // Stringify the cart so the webhook can reconstruct Transactions
      items: JSON.stringify(items),
    },
  });

  return ApiResponse.success(
    res,
    StatusCodes.OK,
    { url: session.url, sessionId: session.id },
    'Checkout session created successfully'
  );
});

/**
 * POST /api/v1/payments/webhook
 * Called by Stripe after a successful payment.
 * IMPORTANT: Must receive the raw body (before express.json() parses it).
 * Automatically creates Transaction records and deducts stock.
 */
const stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];

  // ── Guard: webhook secret not configured ──────────────────────────────────
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.warn('⚠️  STRIPE_WEBHOOK_SECRET is not set — skipping signature verification.');
    return res.json({ received: true });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,                            // raw Buffer — not parsed JSON
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Stripe webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Only handle completed checkouts
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Only process paid sessions
    if (session.payment_status !== 'paid') return res.json({ received: true });

    const { userId, items: itemsJson } = session.metadata;
    const cartItems = JSON.parse(itemsJson);

    for (const cartItem of cartItems) {
      try {
        const product = await Product.findById(cartItem.productId);
        if (!product) continue;

        const previousStock = product.quantity;
        const newStock = Math.max(0, previousStock - cartItem.quantity);
        product.quantity = newStock;
        await product.save();

        await Transaction.create({
          type: 'sale',
          productId: product._id,
          userId,
          performedBy: userId,
          quantity: cartItem.quantity,
          unitPrice: product.price,
          totalAmount: product.price * cartItem.quantity,
          previousStock,
          newStock,
          paymentMethod: 'stripe',
          stripeSessionId: session.id,
          reference: `STRIPE-${session.id.slice(-8).toUpperCase()}`,
          notes: `Online payment via Stripe. Session ID: ${session.id}`,
        });
      } catch (err) {
        console.error(`Error processing item ${cartItem.productId}:`, err);
      }
    }
  }

  return res.json({ received: true });
});

/**
 * GET /api/v1/payments/status/:sessionId
 * Check if a Stripe session was paid — useful for the success page.
 */
const getPaymentStatus = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  return ApiResponse.success(
    res,
    StatusCodes.OK,
    {
      status: session.payment_status,      // 'paid' | 'unpaid' | 'no_payment_required'
      amountTotal: session.amount_total,
      currency: session.currency,
      customerEmail: session.customer_email,
    },
    'Payment status retrieved'
  );
});

module.exports = { createCheckoutSession, stripeWebhook, getPaymentStatus };