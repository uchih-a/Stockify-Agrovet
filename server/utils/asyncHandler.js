/**
 * Wrapper for async Express route handlers
 * Automatically catches errors and passes them to error middleware
 * @param {Function} fn - The async route handler
 * @returns {Function} - Express middleware
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = asyncHandler;
