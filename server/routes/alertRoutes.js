const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authorise } = require('../middleware/roleMiddleware');

const router = express.Router();

const alertController = {
  getAllAlerts: (req, res) => res.json({ message: 'Get all alerts' }),
  getAlertById: (req, res) => res.json({ message: 'Get alert' }),
  markAsRead: (req, res) => res.json({ message: 'Mark read' }),
  resolveAlert: (req, res) => res.json({ message: 'Resolve alert' }),
  deleteAlert: (req, res) => res.json({ message: 'Delete alert' }),
  getUnreadCount: (req, res) => res.json({ message: 'Get unread count' })
};

router.get('/', protect, authorise('admin', 'staff'), alertController.getAllAlerts);
router.get('/unread-count', protect, authorise('admin', 'staff'), alertController.getUnreadCount);
router.get('/:id', protect, authorise('admin', 'staff'), alertController.getAlertById);
router.put('/mark-read', protect, authorise('admin', 'staff'), alertController.markAsRead);
router.put('/:id/resolve', protect, authorise('admin', 'staff'), alertController.resolveAlert);
router.delete('/:id', protect, authorise('admin'), alertController.deleteAlert);

module.exports = router;
