const cron = require('node-cron');
const alertService = require('../services/alertService');
const logger = require('../utils/logger');

/**
 * Start the stock and expiry alert cron job
 */
const startStockAlertJob = () => {
  const schedule = process.env.STOCK_ALERT_CRON_SCHEDULE || '0 7 * * *';

  const job = cron.schedule(schedule, async () => {
    try {
      logger.info('Stock alert job started...');

      // Check for low-stock products
      const lowStockCount = await alertService.checkLowStockAlerts();
      logger.info(`Low-stock check completed: ${lowStockCount} new alerts`);

      // Check for expiring/expired products
      const expiryCount = await alertService.checkExpiryAlerts();
      logger.info(`Expiry check completed: ${expiryCount} new alerts`);

      logger.info('Stock alert job completed successfully');
    } catch (error) {
      logger.error('Error in stock alert job:', error);
    }
  });

  // Run job immediately on startup for testing (optional)
  if (process.env.NODE_ENV === 'development') {
    job.start();
  }

  return job;
};

module.exports = { startStockAlertJob };
