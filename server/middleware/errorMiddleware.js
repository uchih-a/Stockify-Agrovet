const { StatusCodes } = require('http-status-codes');
const ApiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');

/**
 * Global error handler middleware
 * Must be registered as the LAST middleware in the Express app
 * @param {Error} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to database with Winston
  if (err.status >= 500) {
    logger.error({
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip
    });
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error.statusCode = StatusCodes.BAD_REQUEST;
    error.message = message;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    error.statusCode = StatusCodes.CONFLICT;
    error.message = message;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    error.statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
    error.message = message;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error.statusCode = StatusCodes.UNAUTHORIZED;
    error.message = message;
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error.statusCode = StatusCodes.UNAUTHORIZED;
    error.message = message;
  }

  // Multer errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      error.statusCode = StatusCodes.BAD_REQUEST;
      error.message = 'File size exceeds maximum limit of 5MB';
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      error.statusCode = StatusCodes.BAD_REQUEST;
      error.message = 'Max 5 files allowed per upload';
    } else {
      error.statusCode = StatusCodes.BAD_REQUEST;
      error.message = err.message;
    }
  }

  // Default settings
  const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = error.message || 'Internal Server Error';

  const response = {
    success: false,
    message,
    data: null,
    errors: null
  };

  // Include stack trace only in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
};

module.exports = errorHandler;
