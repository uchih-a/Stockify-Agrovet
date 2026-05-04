const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { chatLimiter } = require('../middleware/rateLimiter');

const {
  sendMessage,
  getChatHistory,
  getChatSession,
  rateMessage,
  bookmarkMessage,
  deleteChatSession
} = require('../controllers/chatController');

const router = express.Router();

router.post('/',                     protect, chatLimiter, sendMessage);
router.get('/history',               protect, getChatHistory);
router.get('/session/:sessionId',    protect, getChatSession);
router.post('/rate/:messageId',      protect, rateMessage);
router.post('/bookmark/:messageId',  protect, bookmarkMessage);
router.delete('/session/:sessionId', protect, deleteChatSession);

module.exports = router;
