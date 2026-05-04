// transactionController.js
const { validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const User = require('../models/User');
const alertService = require('../services/alertService');

const getAllTransactions = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      new ApiResponse(StatusCodes.BAD_REQUEST, null, 'Validation errors', errors.array())
    );
  }

  const { page = 1, limit = 10, type, productId, userId, startDate, endDate } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter = {};
  if (type) filter.type = type;
  if (productId) filter.productId = productId;
  if (userId) filter.userId = userId;
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = end;
    }
  }

  const docs = await Transaction.find(filter)
    .populate('productId', 'name sku category')
    .populate('userId', 'name email phone')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const totalDocs = await Transaction.countDocuments(filter);

  // ✅ Normalized
  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, {
      docs,
      totalDocs,
      totalPages: Math.ceil(totalDocs / parseInt(limit)),
      page: parseInt(page),
      limit: parseInt(limit)
    }, 'Transactions retrieved successfully')
  );
});

const getTransactionById = asyncHandler(async (req, res) => {
  const { transactionId } = req.params;

  const transaction = await Transaction.findById(transactionId)
    .populate('productId', 'name sku category quantity')
    .populate('userId', 'name email phone');

  if (!transaction) {
    return res.status(StatusCodes.NOT_FOUND).json(
      new ApiResponse(StatusCodes.NOT_FOUND, null, 'Transaction not found')
    );
  }

  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, transaction, 'Transaction retrieved successfully')
  );
});

const createTransaction = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      new ApiResponse(StatusCodes.BAD_REQUEST, null, 'Validation errors', errors.array())
    );
  }

  const { type, productId, userId, quantity, unitPrice, notes } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(StatusCodes.NOT_FOUND).json(
      new ApiResponse(StatusCodes.NOT_FOUND, null, 'Product not found')
    );
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json(
      new ApiResponse(StatusCodes.NOT_FOUND, null, 'User not found')
    );
  }

  const previousStock = product.quantity;
  let newStock = previousStock;

  if (type === 'sale') {
    if (previousStock < quantity) {
      return res.status(StatusCodes.BAD_REQUEST).json(
        new ApiResponse(StatusCodes.BAD_REQUEST, null, `Insufficient stock. Available: ${previousStock}`)
      );
    }
    newStock = previousStock - quantity;
  } else if (type === 'restock') {
    newStock = previousStock + quantity;
  } else if (type === 'adjustment' || type === 'return' || type === 'write_off') {
    const delta = type === 'return' ? quantity : (type === 'write_off' ? -quantity : quantity);
    newStock = previousStock + delta;
    if (newStock < 0) {
      return res.status(StatusCodes.BAD_REQUEST).json(
        new ApiResponse(StatusCodes.BAD_REQUEST, null, 'Adjustment would result in negative stock')
      );
    }
  }

  const newTransaction = new Transaction({
    type, productId, userId, quantity, unitPrice,
    previousStock, newStock, notes,
    recordedBy: req.user._id
  });

  await newTransaction.save();

  product.quantity = newStock;
  await product.save();

  if (newStock <= product.reorderLevel && previousStock > product.reorderLevel) {
    try {
      await alertService.createLowStockAlert(productId, newStock, product.reorderLevel);
    } catch (error) {
      console.error('Error creating low stock alert:', error);
    }
  }

  await newTransaction.populate('productId', 'name sku category');
  await newTransaction.populate('userId', 'name email phone');

  return res.status(StatusCodes.CREATED).json(
    new ApiResponse(StatusCodes.CREATED, newTransaction, 'Transaction created successfully')
  );
});

const getMyTransactions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, type } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter = { userId: req.user._id };
  if (type) filter.type = type;

  const docs = await Transaction.find(filter)
    .populate('productId', 'name sku category images')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const totalDocs = await Transaction.countDocuments(filter);

  // ✅ Normalized
  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, {
      docs,
      totalDocs,
      totalPages: Math.ceil(totalDocs / parseInt(limit)),
      page: parseInt(page),
      limit: parseInt(limit)
    }, 'Your transactions retrieved successfully')
  );
});

module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  getMyTransactions
};