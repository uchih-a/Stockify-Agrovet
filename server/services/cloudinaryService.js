const cloudinary = require('cloudinary').v2;
const logger = require('../utils/logger');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Delete a single image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<Object>} - Deletion result
 */
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    logger.error(`Failed to delete image ${publicId}:`, error);
    throw new Error(`Failed to delete image from storage: ${error.message}`);
  }
};

/**
 * Delete multiple images from Cloudinary
 * @param {Array<string>} publicIds - Array of Cloudinary public IDs
 * @returns {Promise<Array>} - Array of deletion results
 */
const deleteMultipleImages = async (publicIds) => {
  try {
    const results = [];
    for (const publicId of publicIds) {
      const result = await cloudinary.uploader.destroy(publicId);
      results.push(result);
    }
    return results;
  } catch (error) {
    logger.error('Failed to delete multiple images:', error);
    throw new Error(`Failed to delete images from storage: ${error.message}`);
  }
};

/**
 * Get a transformed image URL from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @param {Object} options - Transformation options
 * @returns {Promise<string>} - Transformed image URL
 */
const getImageUrl = async (publicId, options = {}) => {
  try {
    const url = cloudinary.url(publicId, {
      secure: true, // Use HTTPS
      fetch_format: 'auto', // Auto-detect best format
      quality: 'auto', // Auto-optimized quality
      ...options
    });
    return url;
  } catch (error) {
    logger.error(`Failed to generate URL for ${publicId}:`, error);
    throw new Error(`Failed to generate image URL: ${error.message}`);
  }
};

module.exports = {
  deleteImage,
  deleteMultipleImages,
  getImageUrl
};
