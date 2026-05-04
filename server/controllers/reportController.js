// reportService.js
const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const User = require('../models/User');
const ChatMessage = require('../models/ChatMessage');
const logger = require('../utils/logger');

/**
 * Helper — build a date range from a period string or explicit dates
 */
const buildDateRange = (startDate, endDate) => {
  if (startDate && endDate) {
    return { $gte: new Date(startDate), $lte: new Date(endDate) };
  }
  // Default: last 30 days
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  return { $gte: start, $lte: end };
};

/**
 * Get sales summary — top-level fields match what AdminDashboardPage reads
 */
const getSalesSummary = async (startDate, endDate) => {
  try {
    const dateRange = buildDateRange(startDate, endDate);

    // Current period metrics
    const salesMetrics = await Transaction.aggregate([
      { $match: { type: 'sale', createdAt: dateRange } },
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

    // Previous period metrics (same duration, shifted back) for revenueGrowth
    const rangeDuration = new Date(dateRange.$lte) - new Date(dateRange.$gte);
    const prevStart = new Date(new Date(dateRange.$gte) - rangeDuration);
    const prevEnd = new Date(dateRange.$gte);

    const prevMetrics = await Transaction.aggregate([
      { $match: { type: 'sale', createdAt: { $gte: prevStart, $lte: prevEnd } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);

    const currentRevenue = salesMetrics[0]?.totalRevenue || 0;
    const previousRevenue = prevMetrics[0]?.totalRevenue || 0;
    const revenueGrowth = previousRevenue === 0
      ? 0
      : ((currentRevenue - previousRevenue) / previousRevenue) * 100;

    // ✅ Daily revenue for RevenueAreaChart
    const dailyRevenue = await Transaction.aggregate([
      { $match: { type: 'sale', createdAt: dateRange } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          transactions: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: '$_id', revenue: 1, transactions: 1 } }
    ]);

    // ✅ Monthly sales for MonthlySalesChart
    const monthlySales = await Transaction.aggregate([
      { $match: { type: 'sale' } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          transactions: { $sum: 1 },
          unitsSold: { $sum: '$quantity' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          revenue: 1,
          transactions: 1,
          unitsSold: 1
        }
      }
    ]);

    // Category breakdown
    const byCategory = await Transaction.aggregate([
      { $match: { type: 'sale', createdAt: dateRange } },
      { $lookup: { from: 'products', localField: 'productId', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          totalRevenue: { $sum: '$totalAmount' },
          totalUnits: { $sum: '$quantity' },
          transactions: { $sum: 1 }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    // Top 10 products
    const topProducts = await Transaction.aggregate([
      { $match: { type: 'sale', createdAt: dateRange } },
      { $lookup: { from: 'products', localField: 'productId', foreignField: '_id', as: 'product' } },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product._id',
          name: { $first: '$product.name' },
          sku: { $first: '$product.sku' },
          totalRevenue: { $sum: '$totalAmount' },
          unitsSold: { $sum: '$quantity' }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 }
    ]);

    // ✅ Flat top-level shape — matches AdminDashboardPage reads exactly
    return {
      period: { startDate: dateRange.$gte, endDate: dateRange.$lte },
      // Flat fields read directly by StatCards
      totalRevenue: currentRevenue,
      totalUnitsSold: salesMetrics[0]?.totalUnitsSold || 0,
      totalTransactions: salesMetrics[0]?.totalTransactions || 0,
      avgTransactionValue: salesMetrics[0]?.avgTransactionValue || 0,
      revenueGrowth: Math.round(revenueGrowth * 10) / 10,
      // Chart data
      dailyRevenue,
      monthlySales,
      byCategory,
      topProducts
    };
  } catch (error) {
    logger.error('Error generating sales summary:', error);
    throw error;
  }
};

/**
 * Get inventory snapshot — top-level fields match what AdminDashboardPage reads
 */
const getInventorySnapshot = async () => {
  try {
    const overallMetrics = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalStockValue: { $sum: { $multiply: ['$quantity', '$price'] } },
          totalQuantity: { $sum: '$quantity' }
        }
      }
    ]);

    const lowStockCount = await Product.countDocuments({
      isActive: true,
      $expr: { $lte: ['$quantity', '$reorderLevel'] }
    });

    const expiredCount = await Product.countDocuments({
      isActive: true,
      expiryDate: { $lt: new Date() }
    });

    const expiryThreshold = new Date();
    expiryThreshold.setDate(expiryThreshold.getDate() + 30);
    const expiringCount = await Product.countDocuments({
      isActive: true,
      expiryDate: { $lte: expiryThreshold, $gt: new Date() }
    });

    // ✅ totalFarmers added here — AdminDashboardPage reads snapshot?.totalFarmers
    const totalFarmers = await User.countDocuments({ role: 'farmer', isActive: true });

    const byCategory = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
          totalValue: { $sum: { $multiply: ['$quantity', '$price'] } }
        }
      },
      { $sort: { totalValue: -1 } }
    ]);

    // ✅ Flat top-level shape — matches AdminDashboardPage reads exactly
    return {
      timestamp: new Date(),
      // Flat fields read directly by StatCards
      totalProducts: overallMetrics[0]?.totalProducts || 0,
      totalStockValue: overallMetrics[0]?.totalStockValue || 0,
      totalQuantity: overallMetrics[0]?.totalQuantity || 0,
      lowStockCount,
      expiredCount,
      expiringCount,
      totalFarmers,
      // Chart data
      byCategory
    };
  } catch (error) {
    logger.error('Error generating inventory snapshot:', error);
    throw error;
  }
};

/**
 * Get farmer activity report
 */
const getFarmerActivityReport = async (startDate, endDate) => {
  try {
    const dateRange = buildDateRange(startDate, endDate);

    const totalFarmers = await User.countDocuments({ role: 'farmer' });

    const activeFarmers = await Transaction.aggregate([
      { $match: { createdAt: dateRange } },
      { $group: { _id: '$userId' } },
      { $count: 'total' }
    ]);

    const topFarmers = await Transaction.aggregate([
      { $match: { type: 'sale', createdAt: dateRange } },
      { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'farmer' } },
      { $unwind: '$farmer' },
      {
        $group: {
          _id: '$farmer._id',
          name: { $first: '$farmer.name' },
          email: { $first: '$farmer.email' },
          totalSpent: { $sum: '$totalAmount' },
          transactions: { $sum: 1 }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 }
    ]);

    const registrationTrend = await User.aggregate([
      { $match: { role: 'farmer', createdAt: dateRange } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    return {
      period: { startDate: dateRange.$gte, endDate: dateRange.$lte },
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
 */
const getChatbotUsageStats = async () => {
  try {
    const overallStats = await ChatMessage.aggregate([
      {
        $group: {
          _id: null,
          totalMessages: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' },
          averageTokensPerMessage: { $avg: '$tokensUsed' }
        }
      },
      { $addFields: { uniqueUsers: { $size: '$uniqueUsers' } } }
    ]);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyUsage = await ChatMessage.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' }
        }
      },
      { $addFields: { uniqueUsers: { $size: '$uniqueUsers' } } },
      { $sort: { _id: 1 } }
    ]);

    return {
      overall: overallStats[0] || { totalMessages: 0, uniqueUsers: 0, averageTokensPerMessage: 0 },
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