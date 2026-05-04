const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const User = require('../models/User');
const ChatMessage = require('../models/ChatMessage');
const logger = require('../utils/logger');

/**
 * Get sales summary with revenue, units, and breakdown by category
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<Object>} - Sales summary report
 */
const getSalesSummary = async (startDate, endDate) => {
  try {
    // Overall sales metrics
    const salesMetrics = await Transaction.aggregate([
      {
        $match: {
          type: 'sale',
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalUnitsSold: { $sum: '$quantity' },
          totalTransactions: { $sum: 1 },
          avgTransactionValue: { $avg: '$totalAmount' }
        }
      }
    ]);

    // Breakdown by product category
    const categoryBreakdown = await Transaction.aggregate([
      {
        $match: {
          type: 'sale',
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: '$product'
      },
      {
        $group: {
          _id: '$product.category',
          totalRevenue: { $sum: '$totalAmount' },
          totalUnits: { $sum: '$quantity' },
          transactions: { $sum: 1 }
        }
      },
      {
        $sort: { totalRevenue: -1 }
      }
    ]);

    // Top 10 selling products
    const topProducts = await Transaction.aggregate([
      {
        $match: {
          type: 'sale',
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: '$product'
      },
      {
        $group: {
          _id: '$product._id',
          name: { $first: '$product.name' },
          sku: { $first: '$product.sku' },
          totalRevenue: { $sum: '$totalAmount' },
          unitsSold: { $sum: '$quantity' }
        }
      },
      {
        $sort: { totalRevenue: -1 }
      },
      {
        $limit: 10
      }
    ]);

    return {
      period: { startDate, endDate },
      summary: salesMetrics[0] || {
        totalRevenue: 0,
        totalUnitsSold: 0,
        totalTransactions: 0,
        avgTransactionValue: 0
      },
      byCategory: categoryBreakdown,
      topProducts
    };
  } catch (error) {
    logger.error('Error generating sales summary:', error);
    throw error;
  }
};

/**
 * Get current inventory snapshot
 * @returns {Promise<Object>} - Inventory snapshot report
 */
const getInventorySnapshot = async () => {
  try {
    // Overall inventory metrics
    const overallMetrics = await Product.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalStockValue: { $sum: { $multiply: ['$quantity', '$price'] } },
          totalQuantity: { $sum: '$quantity' }
        }
      }
    ]);

    // Count low-stock products
    const lowStockCount = await Product.countDocuments({
      isActive: true,
      $expr: { $lte: ['$quantity', '$reorderLevel'] }
    });

    // Count expired products
    const expiredCount = await Product.countDocuments({
      isActive: true,
      expiryDate: { $lt: new Date() }
    });

    // Count expiring soon (within 30 days)
    const expiryThreshold = new Date();
    expiryThreshold.setDate(expiryThreshold.getDate() + 30);
    const expiringCount = await Product.countDocuments({
      isActive: true,
      expiryDate: { $lte: expiryThreshold, $gt: new Date() }
    });

    // Breakdown by category
    const categoryBreakdown = await Product.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
          totalValue: { $sum: { $multiply: ['$quantity', '$price'] } }
        }
      },
      {
        $sort: { totalValue: -1 }
      }
    ]);

    return {
      timestamp: new Date(),
      overall: overallMetrics[0] || {
        totalProducts: 0,
        totalStockValue: 0,
        totalQuantity: 0
      },
      alerts: {
        lowStockCount,
        expiredCount,
        expiringCount
      },
      byCategory: categoryBreakdown
    };
  } catch (error) {
    logger.error('Error generating inventory snapshot:', error);
    throw error;
  }
};

/**
 * Get farmer activity report
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<Object>} - Farmer activity report
 */
const getFarmerActivityReport = async (startDate, endDate) => {
  try {
    // Total registered farmers
    const totalFarmers = await User.countDocuments({ role: 'farmer' });

    // Active farmers (with at least 1 transaction in period)
    const activeFarmers = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $group: {
          _id: '$userId'
        }
      },
      {
        $count: 'total'
      }
    ]);

    // Top 10 farmers by purchase value
    const topFarmers = await Transaction.aggregate([
      {
        $match: {
          type: 'sale',
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'farmer'
        }
      },
      {
        $unwind: '$farmer'
      },
      {
        $group: {
          _id: '$farmer._id',
          name: { $first: '$farmer.name' },
          email: { $first: '$farmer.email' },
          totalSpent: { $sum: '$totalAmount' },
          transactions: { $sum: 1 }
        }
      },
      {
        $sort: { totalSpent: -1 }
      },
      {
        $limit: 10
      }
    ]);

    // Registration trend (by month)
    const registrationTrend = await User.aggregate([
      {
        $match: {
          role: 'farmer',
          createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    return {
      period: { startDate, endDate },
      totalFarmers,
      activeFarmers: activeFarmers[0]?.total || 0,
      topFarmers,
      registrationTrend
    };
  } catch (error) {
    logger.error('Error generating farmer activity report:', error);
    throw error;
  }
};

/**
 * Get chatbot usage statistics
 * @returns {Promise<Object>} - Chatbot usage stats
 */
const getChatbotUsageStats = async () => {
  try {
    // Total messages and unique users
    const overallStats = await ChatMessage.aggregate([
      {
        $group: {
          _id: null,
          totalMessages: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' },
          averageTokensPerMessage: { $avg: '$tokensUsed' }
        }
      },
      {
        $addFields: {
          uniqueUsers: { $size: '$uniqueUsers' }
        }
      }
    ]);

    // Daily usage (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyUsage = await ChatMessage.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' }
        }
      },
      {
        $addFields: {
          uniqueUsers: { $size: '$uniqueUsers' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    return {
      overall: overallStats[0] || {
        totalMessages: 0,
        uniqueUsers: 0,
        averageTokensPerMessage: 0
      },
      dailyUsageLast30Days: dailyUsage
    };
  } catch (error) {
    logger.error('Error generating chatbot usage stats:', error);
    throw error;
  }
};

module.exports = {
  getSalesSummary,
  getInventorySnapshot,
  getFarmerActivityReport,
  getChatbotUsageStats
};
