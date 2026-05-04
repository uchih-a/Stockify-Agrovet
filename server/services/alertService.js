const Product = require('../models/Product');
const Alert = require('../models/Alert');
const logger = require('../utils/logger');

/**
 * Check for low-stock products and create alerts
 * @returns {Promise<number>} - Count of new alerts created
 */
const checkLowStockAlerts = async () => {
  try {
    let alertCount = 0;

    // Find all active products with quantity <= reorderLevel
    const lowStockProducts = await Product.find({
      isActive: true,
      $expr: { $lte: ['$quantity', '$reorderLevel'] }
    });

    for (const product of lowStockProducts) {
      // Check if unresolved low_stock alert already exists
      const existingAlert = await Alert.findOne({
        productId: product._id,
        type: 'low_stock',
        isResolved: false
      });

      // Create new alert if none exists
      if (!existingAlert) {
        await Alert.create({
          type: 'low_stock',
          productId: product._id,
          message: `${product.name} (SKU: ${product.sku}) is running low. Current stock: ${product.quantity} ${product.unit}, Reorder level: ${product.reorderLevel} ${product.unit}`,
          severity: 'warning'
        });
        alertCount++;
      }
    }

    logger.info(`Low-stock alerts check completed. ${alertCount} new alerts created.`);
    return alertCount;
  } catch (error) {
    logger.error('Error checking low-stock alerts:', error);
    throw error;
  }
};

/**
 * Check for expiring/expired products and create alerts
 * @returns {Promise<number>} - Count of new alerts created
 */
const checkExpiryAlerts = async () => {
  try {
    let alertCount = 0;
    const daysBeforeExpiry = parseInt(
      process.env.EXPIRY_ALERT_DAYS_BEFORE || 30
    );
    const today = new Date();
    const expiryThreshold = new Date();
    expiryThreshold.setDate(expiryThreshold.getDate() + daysBeforeExpiry);

    // Find products expiring within the threshold
    const expiringProducts = await Product.find({
      isActive: true,
      expiryDate: {
        $lte: expiryThreshold,
        $gt: today
      }
    });

    for (const product of expiringProducts) {
      // Check if unresolved expiry_warning already exists
      const existingAlert = await Alert.findOne({
        productId: product._id,
        type: 'expiry_warning',
        isResolved: false
      });

      // Create new alert if none exists
      if (!existingAlert) {
        const daysLeft = Math.ceil((product.expiryDate - today) / (1000 * 60 * 60 * 24));
        await Alert.create({
          type: 'expiry_warning',
          productId: product._id,
          message: `${product.name} (SKU: ${product.sku}) will expire in ${daysLeft} day(s). Expiry date: ${product.expiryDate.toDateString()}`,
          severity: 'warning'
        });
        alertCount++;
      }
    }

    // Find already expired products
    const expiredProducts = await Product.find({
      isActive: true,
      expiryDate: { $lt: today }
    });

    for (const product of expiredProducts) {
      // Check if unresolved expired alert already exists
      const existingAlert = await Alert.findOne({
        productId: product._id,
        type: 'expired',
        isResolved: false
      });

      // Create new alert if none exists
      if (!existingAlert) {
        await Alert.create({
          type: 'expired',
          productId: product._id,
          message: `${product.name} (SKU: ${product.sku}) has EXPIRED. Expiry date was: ${product.expiryDate.toDateString()}. Please remove from inventory and write off.`,
          severity: 'critical'
        });
        alertCount++;
      }
    }

    logger.info(`Expiry alerts check completed. ${alertCount} new alerts created.`);
    return alertCount;
  } catch (error) {
    logger.error('Error checking expiry alerts:', error);
    throw error;
  }
};

/**
 * Mark an alert as resolved
 * @param {string} alertId - Alert document ID
 * @param {string} resolvedByUserId - User ID who resolved it
 * @returns {Promise<Object>} - Updated alert document
 */
const resolveAlert = async (alertId, resolvedByUserId) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      alertId,
      {
        isResolved: true,
        resolvedBy: resolvedByUserId,
        resolvedAt: new Date()
      },
      { new: true }
    );

    if (!alert) {
      throw new Error('Alert not found');
    }

    logger.info(`Alert ${alertId} resolved by user ${resolvedByUserId}`);
    return alert;
  } catch (error) {
    logger.error('Error resolving alert:', error);
    throw error;
  }
};

module.exports = {
  checkLowStockAlerts,
  checkExpiryAlerts,
  resolveAlert
};
