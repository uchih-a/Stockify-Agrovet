// productController.js
const { validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const Product = require('../models/Product');
// FIX: Supplier schema must be registered with Mongoose before any .populate('supplierId')
// call runs. Without this require, Mongoose throws MissingSchemaError → 500 on every
// product query. Importing the model here guarantees the schema is always registered.
require('../models/Supplier');
const { EXPIRY_ALERT_DAYS_BEFORE } = require('../utils/constants');

const getAllProducts = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ApiResponse.error(res, StatusCodes.BAD_REQUEST, 'Validation errors', errors.array());
  }

  const {
    page = 1,
    limit = 10,
    category,
    isActive,
    lowStock,
    search,
    sort = '-createdAt',
    status,
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter = {};

  if (category && category !== 'all') filter.category = category;

  if (typeof isActive === 'string') filter.isActive = isActive === 'true';

  if (lowStock === 'true') {
    filter.$expr = { $lte: ['$quantity', '$reorderLevel'] };
  }

  if (status && status !== 'all') {
    const now = new Date();
    switch (status) {
      case 'healthy':
        filter.$expr = { $gt: ['$quantity', '$reorderLevel'] };
        filter.isActive = true;
        break;
      case 'low_stock':
        filter.$expr = { $lte: ['$quantity', '$reorderLevel'] };
        filter.quantity = { $gt: 0 };
        filter.isActive = true;
        break;
      case 'critical':
        filter.quantity = 0;
        filter.isActive = true;
        break;
      case 'expiring': {
        const threshold = new Date();
        threshold.setDate(threshold.getDate() + EXPIRY_ALERT_DAYS_BEFORE);
        filter.expiryDate = { $lte: threshold, $gte: now };
        filter.isActive = true;
        break;
      }
      case 'expired':
        filter.expiryDate = { $lt: now };
        filter.isActive = true;
        break;
      default:
        break;
    }
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } }
    ];
  }

  const docs = await Product.find(filter)
    .populate('supplierId', 'name email phone')
    .skip(skip)
    .limit(parseInt(limit))
    .sort(sort);

  const totalDocs = await Product.countDocuments(filter);

  return ApiResponse.success(res, StatusCodes.OK, {
    docs,
    totalDocs,
    totalPages: Math.ceil(totalDocs / parseInt(limit)),
    page: parseInt(page),
    limit: parseInt(limit)
  }, 'Products retrieved successfully');
});

const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId).populate('supplierId', 'name email phone address');
  if (!product) {
    return ApiResponse.error(res, StatusCodes.NOT_FOUND, 'Product not found');
  }

  return ApiResponse.success(res, StatusCodes.OK, product, 'Product retrieved successfully');
});

const createProduct = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ApiResponse.error(res, StatusCodes.BAD_REQUEST, 'Validation errors', errors.array());
  }

  const { name, sku, category, description, quantity, price, reorderLevel, supplierId, expiryDate, unit } = req.body;

  const existingSku = await Product.findOne({ sku });
  if (existingSku) {
    return ApiResponse.error(res, StatusCodes.CONFLICT, 'SKU already exists');
  }

  const newProduct = new Product({
    name,
    sku,
    category,
    description,
    quantity,
    price,
    reorderLevel,
    supplierId,
    expiryDate,
    unit,
    addedBy: req.user._id,
    isActive: true
  });

  await newProduct.save();
  await newProduct.populate('supplierId', 'name email phone');

  return ApiResponse.success(res, StatusCodes.CREATED, newProduct, 'Product created successfully');
});

const updateProduct = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ApiResponse.error(res, StatusCodes.BAD_REQUEST, 'Validation errors', errors.array());
  }

  const { productId } = req.params;
  const { name, category, description, quantity, price, reorderLevel, supplierId, expiryDate, isActive, unit } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return ApiResponse.error(res, StatusCodes.NOT_FOUND, 'Product not found');
  }

  if (req.body.sku && req.body.sku !== product.sku) {
    return ApiResponse.error(res, StatusCodes.FORBIDDEN, 'Cannot change SKU after product creation');
  }

  if (name) product.name = name;
  if (category) product.category = category;
  if (description) product.description = description;
  if (quantity !== undefined) product.quantity = quantity;
  if (price !== undefined) product.price = price;
  if (reorderLevel !== undefined) product.reorderLevel = reorderLevel;
  if (supplierId) product.supplierId = supplierId;
  if (expiryDate) product.expiryDate = expiryDate;
  if (unit) product.unit = unit;
  if (typeof isActive === 'boolean') product.isActive = isActive;

  await product.save();
  await product.populate('supplierId', 'name email phone');

  return ApiResponse.success(res, StatusCodes.OK, product, 'Product updated successfully');
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    return ApiResponse.error(res, StatusCodes.NOT_FOUND, 'Product not found');
  }

  const Transaction = require('../models/Transaction');
  const pendingTransactions = await Transaction.countDocuments({ productId, status: 'pending' });
  if (pendingTransactions > 0) {
    return ApiResponse.error(res, StatusCodes.FORBIDDEN, 'Cannot delete product with pending transactions');
  }

  product.isActive = false;
  await product.save();

  return ApiResponse.success(res, StatusCodes.OK, null, 'Product deleted successfully');
});

const uploadProductImages = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!req.files || req.files.length === 0) {
    return ApiResponse.error(res, StatusCodes.BAD_REQUEST, 'No files uploaded');
  }

  if (req.files.length > 5) {
    return ApiResponse.error(res, StatusCodes.BAD_REQUEST, 'Maximum 5 images allowed per upload');
  }

  const product = await Product.findById(productId);
  if (!product) {
    return ApiResponse.error(res, StatusCodes.NOT_FOUND, 'Product not found');
  }

  // Convert each uploaded file buffer to a Base64 data URL and store directly in MongoDB
  const uploadedImages = req.files.map((file) => {
    const base64 = file.buffer.toString('base64');
    const dataUrl = `data:${file.mimetype};base64,${base64}`;
    // Use a simple unique ID so the delete endpoint can still identify individual images
    const publicId = `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    return { url: dataUrl, publicId };
  });

  if (!product.images) product.images = [];
  product.images.push(...uploadedImages);
  await product.save();
  await product.populate('supplierId', 'name email phone');

  return ApiResponse.success(res, StatusCodes.OK, product, 'Images uploaded successfully');
});

const deleteProductImage = asyncHandler(async (req, res) => {
  const { productId, imagePublicId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    return ApiResponse.error(res, StatusCodes.NOT_FOUND, 'Product not found');
  }

  const imageIndex = product.images.findIndex(img => img.publicId === imagePublicId);
  if (imageIndex === -1) {
    return ApiResponse.error(res, StatusCodes.NOT_FOUND, 'Image not found');
  }

  // No external service to call — just remove the entry from the array
  product.images.splice(imageIndex, 1);
  await product.save();
  await product.populate('supplierId', 'name email phone');

  return ApiResponse.success(res, StatusCodes.OK, product, 'Image deleted successfully');
});

const getLowStockProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter = { $expr: { $lte: ['$quantity', '$reorderLevel'] }, isActive: true };

  const docs = await Product.find(filter)
    .populate('supplierId', 'name email phone')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ quantity: 1 });

  const totalDocs = await Product.countDocuments(filter);

  return ApiResponse.success(res, StatusCodes.OK, {
    docs,
    totalDocs,
    totalPages: Math.ceil(totalDocs / parseInt(limit)),
    page: parseInt(page),
    limit: parseInt(limit)
  }, 'Low stock products retrieved successfully');
});

const getExpiringProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const expiryThreshold = new Date();
  expiryThreshold.setDate(expiryThreshold.getDate() + EXPIRY_ALERT_DAYS_BEFORE);

  const filter = {
    expiryDate: { $lte: expiryThreshold, $gte: new Date() },
    isActive: true
  };

  const docs = await Product.find(filter)
    .populate('supplierId', 'name email phone')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ expiryDate: 1 });

  const totalDocs = await Product.countDocuments(filter);

  return ApiResponse.success(res, StatusCodes.OK, {
    docs,
    totalDocs,
    totalPages: Math.ceil(totalDocs / parseInt(limit)),
    page: parseInt(page),
    limit: parseInt(limit)
  }, 'Expiring products retrieved successfully');
});

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  deleteProductImage,
  getLowStockProducts,
  getExpiringProducts
};