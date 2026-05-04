const rateLimit = require('express-rate-limit');

const isDev = process.env.NODE_ENV === 'development';

/**
 * General rate limiter for all routes
 * Very generous in development to avoid blocking React Query polling
 */
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || 900000), // 15 minutes
  max: isDev ? 2000 : parseInt(process.env.RATE_LIMIT_MAX || 100),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    data: null,
    errors: null
  }
});

/**
 * Strict rate limiter for authentication endpoints
 * 10 requests per 15 minutes in production, relaxed in development
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDev ? 200 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login or register attempts, please try again later.',
    data: null,
    errors: null
  }
});

/**
 * Chat rate limiter — per user, not per IP
 * Role-based daily quota is enforced inside the controller instead
 * express-rate-limit does NOT support async max functions
 */
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute sliding window
  max: isDev ? 100 : 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Rate limit per user ID instead of IP address
    // This prevents VPN/proxy bypass and is fairer for shared networks
    return req.user ? req.user._id.toString() : req.ip;
  },
  skip: (req) => {
    // Admins and super admins bypass chat rate limiting entirely
    return (
      req.user &&
      (req.user.role === 'admin' ||
        req.user.role === 'super_admin' ||
        req.user.role === 'manager')
    );
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: isDev
        ? 'Chat rate limit exceeded (dev: 100/min).'
        : 'Daily chat message limit exceeded. Please wait before sending another message.',
      data: null,
      errors: null
    });
  }
});

/**
 * Strict limiter for password reset and sensitive operations
 * 5 requests per hour
 */
const sensitiveOpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isDev ? 100 : 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many attempts for this operation, please try again in an hour.',
    data: null,
    errors: null
  }
});

module.exports = {
  generalLimiter,
  authLimiter,
  chatLimiter,
  sensitiveOpLimiter
};