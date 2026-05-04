require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const { generalLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorMiddleware');
const ApiResponse = require('./utils/apiResponse');
const { StatusCodes } = require('http-status-codes');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const chatRoutes = require('./routes/chatRoutes');
const alertRoutes = require('./routes/alertRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const reportRoutes = require('./routes/reportRoutes');
const paymentRoutes = require('./routes/paymentRoutes'); // ✅ NEW

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

// ─────────────────────────────────────────────────────────────────────────────
// ✅ STRIPE WEBHOOK — must be registered BEFORE express.json() parses the body.
// Stripe signs the raw request body; once JSON-parsed the signature breaks.
// The route itself applies express.raw() internally (see paymentRoutes.js).
// ─────────────────────────────────────────────────────────────────────────────
app.use('/api/v1/payments', paymentRoutes);

// Compression & parsing middleware (after webhook route)
app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
app.use(generalLimiter);

// Health check route
app.get('/api/v1/health', (req, res) => {
  return ApiResponse.success(res, StatusCodes.OK, {
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    version: '1.0.0'
  }, 'API is healthy');
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/alerts', alertRoutes);
app.use('/api/v1/suppliers', supplierRoutes);
app.use('/api/v1/reports', reportRoutes);

// 404 Handler
app.use((req, res) => {
  return ApiResponse.error(
    res,
    StatusCodes.NOT_FOUND,
    `Route ${req.originalUrl} not found`
  );
});

// Global error handler (MUST be last)
app.use(errorHandler);

module.exports = app;