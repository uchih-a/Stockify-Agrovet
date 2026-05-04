const { StatusCodes } = require('http-status-codes');

/**
 * Standardized API response helper
 */
class ApiResponse {
  /**
   * Send a successful response
   * @param {Object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {*} data - Response data
   * @param {string} message - Response message
   * @param {Object} meta - Additional metadata
   */
  static success(res, statusCode = StatusCodes.OK, data = null, message = 'Success', meta = null) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      errors: null,
      meta
    });
  }

  /**
   * Send an error response
   * @param {Object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {Array|Object} errors - Detailed error information
   */
  static error(res, statusCode = StatusCodes.INTERNAL_SERVER_ERROR, message = 'Error', errors = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      data: null,
      errors
    });
  }

  /**
   * Send a paginated response
   * @param {Object} res - Express response object
   * @param {Array} data - Paginated data array
   * @param {Object} pagination - Pagination metadata
   * @param {string} message - Response message
   */
  static paginated(res, data = [], pagination = {}, message = 'Retrieved successfully') {
    return res.status(StatusCodes.OK).json({
      success: true,
      message,
      data,
      errors: null,
      meta: {
        pagination: {
          page: pagination.page || 1,
          limit: pagination.limit || 10,
          total: pagination.total || 0,
          pages: pagination.pages || 0,
          hasNextPage: pagination.hasNextPage || false,
          hasPrevPage: pagination.hasPrevPage || false
        }
      }
    });
  }
}

module.exports = ApiResponse;
