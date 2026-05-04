const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authorise } = require('../middleware/roleMiddleware');

const router = express.Router();

const reportController = {
  getSalesSummary: (req, res) => res.json({ message: 'Sales summary' }),
  getInventorySnapshot: (req, res) => res.json({ message: 'Inventory snapshot' }),
  getFarmerActivityReport: (req, res) => res.json({ message: 'Farmer activity' }),
  getChatbotStats: (req, res) => res.json({ message: 'Chatbot stats' }),
  getGeminiInsights: (req, res) => res.json({ message: 'Gemini insights' })
};

router.get('/sales', protect, authorise('admin', 'staff'), reportController.getSalesSummary);
router.get('/inventory', protect, authorise('admin', 'staff'), reportController.getInventorySnapshot);
router.get('/farmers', protect, authorise('admin', 'staff'), reportController.getFarmerActivityReport);
router.get('/chatbot', protect, authorise('admin', 'staff'), reportController.getChatbotStats);
router.get('/insights', protect, authorise('admin'), reportController.getGeminiInsights);

module.exports = router;
