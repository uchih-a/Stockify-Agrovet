const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');
const { registerValidator, loginValidator } = require('../utils/validators');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authLimiter, registerValidator, authController.register);
router.post('/login', authLimiter, loginValidator, authController.login);
router.post('/logout', protect, authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authLimiter, authController.forgotPassword);
router.put('/reset-password/:token', authController.resetPassword);
router.get('/me', protect, authController.getMe);

module.exports = router;
