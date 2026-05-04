const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authorise } = require('../middleware/roleMiddleware');
const { generalLimiter } = require('../middleware/rateLimiter');
const upload = require('../middleware/uploadMiddleware');
const { createProductValidator } = require('../utils/validators');
const productController = require('../controllers/productController');

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// Public / any authenticated user
// ─────────────────────────────────────────────────────────────────────────────
router.get('/',          protect, generalLimiter, productController.getAllProducts);
router.get('/low-stock', protect, authorise('admin', 'staff'), productController.getLowStockProducts);
router.get('/expiring',  protect, authorise('admin', 'staff'), productController.getExpiringProducts);
router.get('/:productId',   protect, productController.getProductById);

// ─────────────────────────────────────────────────────────────────────────────
// Admin / staff only
// ─────────────────────────────────────────────────────────────────────────────
router.post('/',    protect, authorise('admin', 'staff'), createProductValidator, productController.createProduct);
router.put('/:productId',  protect, authorise('admin', 'staff'), productController.updateProduct);
router.delete('/:productId', protect, authorise('admin'), productController.deleteProduct);

// ─────────────────────────────────────────────────────────────────────────────
// Image uploads
// ─────────────────────────────────────────────────────────────────────────────
router.post('/:productId/images',          protect, authorise('admin', 'staff'), upload.array('images', 5), productController.uploadProductImages);
router.delete('/:productId/images/:imagePublicId', protect, authorise('admin', 'staff'), productController.deleteProductImage);

module.exports = router;