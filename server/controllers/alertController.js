// alertController.js
const { validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const Alert = require('../models/Alert');
const alertService = require('../services/alertService');

const getAllAlerts = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      new ApiResponse(StatusCodes.BAD_REQUEST, null, 'Validation errors', errors.array())
    );
  }

  const { page = 1, limit = 10, type, isRead, isResolved, severity } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter = {};
  if (type) filter.type = type;
  if (typeof isRead === 'string') filter.isRead = isRead === 'true';
  if (typeof isResolved === 'string') filter.isResolved = isResolved === 'true';
  if (severity) filter.severity = severity;

  const docs = await Alert.find(filter)
    .populate('productId', 'name sku category')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const totalDocs = await Alert.countDocuments(filter);

  // ✅ Normalized
  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, {
      docs,
      totalDocs,
      totalPages: Math.ceil(totalDocs / parseInt(limit)),
      page: parseInt(page),
      limit: parseInt(limit)
    }, 'Alerts retrieved successfully')
  );
});

const getAlertById = asyncHandler(async (req, res) => {
  const { alertId } = req.params;

  const alert = await Alert.findById(alertId).populate('productId', 'name sku category');
  if (!alert) {
    return res.status(StatusCodes.NOT_FOUND).json(
      new ApiResponse(StatusCodes.NOT_FOUND, null, 'Alert not found')
    );
  }

  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, alert, 'Alert retrieved successfully')
  );
});

const markAsRead = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      new ApiResponse(StatusCodes.BAD_REQUEST, null, 'Validation errors', errors.array())
    );
  }

  const { alertIds } = req.body;

  if (!alertIds || !Array.isArray(alertIds) || alertIds.length === 0) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      new ApiResponse(StatusCodes.BAD_REQUEST, null, 'alertIds must be a non-empty array')
    );
  }

  const result = await Alert.updateMany({ _id: { $in: alertIds } }, { isRead: true });

  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, { modifiedCount: result.modifiedCount }, 'Alerts marked as read')
  );
});

const resolveAlert = asyncHandler(async (req, res) => {
  const { alertId } = req.params;
  const { resolvedByUserId } = req.body;

  if (!resolvedByUserId) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      new ApiResponse(StatusCodes.BAD_REQUEST, null, 'resolvedByUserId is required')
    );
  }

  const alert = await Alert.findById(alertId);
  if (!alert) {
    return res.status(StatusCodes.NOT_FOUND).json(
      new ApiResponse(StatusCodes.NOT_FOUND, null, 'Alert not found')
    );
  }

  try {
    const resolvedAlert = await alertService.resolveAlert(alertId, resolvedByUserId);
    return res.status(StatusCodes.OK).json(
      new ApiResponse(StatusCodes.OK, resolvedAlert, 'Alert resolved successfully')
    );
  } catch (error) {
    console.error('Error resolving alert:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      new ApiResponse(StatusCodes.INTERNAL_SERVER_ERROR, null, 'Error resolving alert')
    );
  }
});

const deleteAlert = asyncHandler(async (req, res) => {
  const { alertId } = req.params;

  const alert = await Alert.findByIdAndDelete(alertId);
  if (!alert) {
    return res.status(StatusCodes.NOT_FOUND).json(
      new ApiResponse(StatusCodes.NOT_FOUND, null, 'Alert not found')
    );
  }

  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, null, 'Alert deleted successfully')
  );
});

const getUnreadCount = asyncHandler(async (req, res) => {
  const unreadCount = await Alert.countDocuments({ isRead: false });

  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, { unreadCount }, 'Unread count retrieved successfully')
  );
});

module.exports = {
  getAllAlerts, getAlertById, markAsRead,
  resolveAlert, deleteAlert, getUnreadCount
};