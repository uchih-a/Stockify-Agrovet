const { StatusCodes } = require('http-status-codes');
const ApiResponse = require('../utils/apiResponse');

/**
 * Factory function to create role-based authorization middleware
 * @param {...string} allowedRoles - Roles allowed to access the route
 * @returns {Function} - Middleware function
 */
const authorise = (...allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated (should be called after protect middleware)
    if (!req.user) {
      return ApiResponse.error(
        res,
        StatusCodes.UNAUTHORIZED,
        'Authentication required'
      );
    }

    // Check if user's role is in allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return ApiResponse.error(
        res,
        StatusCodes.FORBIDDEN,
        `This resource requires one of the following roles: ${allowedRoles.join(', ')}`
      );
    }

    next();
  };
};

module.exports = { authorise };
