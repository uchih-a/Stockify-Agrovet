const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');

/**
 * Middleware to verify JWT and protect routes
 * Extracts user from token and attaches to req.user
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Extract token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return ApiResponse.error(
        res,
        StatusCodes.UNAUTHORIZED,
        'Please log in to access this resource'
      );
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from database (exclude password)
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return ApiResponse.error(
          res,
          StatusCodes.UNAUTHORIZED,
          'User not found'
        );
      }

      // Check if account is active
      if (!user.isActive) {
        return ApiResponse.error(
          res,
          StatusCodes.FORBIDDEN,
          'Your account has been suspended'
        );
      }

      // Attach user to request
      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return ApiResponse.error(
          res,
          StatusCodes.UNAUTHORIZED,
          'Token has expired. Please refresh or log in again'
        );
      }
      if (error.name === 'JsonWebTokenError') {
        return ApiResponse.error(
          res,
          StatusCodes.UNAUTHORIZED,
          'Invalid token. Please log in again'
        );
      }
      throw error;
    }
  } catch (error) {
    return ApiResponse.error(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Authentication failed'
    );
  }
};

module.exports = { protect };
