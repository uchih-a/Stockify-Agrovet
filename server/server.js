// ✅ Register safety net FIRST — before ANY require()
process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION (during load):', err.message);
  console.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('💥 UNHANDLED REJECTION:', reason);
  process.exit(1);
});

// Now safe to require — any crash above will be caught
require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');
const { startStockAlertJob } = require('./jobs/stockAlertJob');

let logger;
try {
  logger = require('./utils/logger');
} catch (e) {
  // Fallback if winston/logger fails to load
  logger = { info: console.log, error: console.error };
}

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    logger.info('✅ MongoDB connected successfully');

    const server = app.listen(PORT, () => {
      logger.info(`✅ Server running on http://localhost:${PORT} in ${process.env.NODE_ENV} mode`);
    });

    startStockAlertJob();
    logger.info(`✅ Stock alert job scheduled: ${process.env.STOCK_ALERT_CRON_SCHEDULE}`);

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, shutting down gracefully');
      server.close(() => process.exit(0));
    });

  } catch (error) {
    // logger is guaranteed to exist here
    logger.error('❌ Failed to start server:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
};

startServer();