const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authorise } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

const userController = {
  getAllUsers: (req, res) => res.json({ message: 'Get all users' }),
  getUserById: (req, res) => res.json({ message: 'Get user' }),
  createUser: (req, res) => res.json({ message: 'Create user' }),
  updateUser: (req, res) => res.json({ message: 'Update user' }),
  deleteUser: (req, res) => res.json({ message: 'Delete user' }),
  uploadProfilePic: (req, res) => res.json({ message: 'Upload profile pic' }),
  getFarmerStats: (req, res) => res.json({ message: 'Get farmer stats' })
};

router.get('/', protect, authorise('admin', 'staff'), userController.getAllUsers);
router.get('/:id', protect, authorise('admin', 'staff'), userController.getUserById);
router.post('/', protect, authorise('admin', 'staff'), userController.createUser);
router.put('/:id', protect, authorise('admin', 'staff'), userController.updateUser);
router.delete('/:id', protect, authorise('admin'), userController.deleteUser);
router.post('/:id/profile-pic', protect, upload.single('profilePic'), userController.uploadProfilePic);
router.get('/:id/stats', protect, authorise('admin', 'staff'), userController.getFarmerStats);

module.exports = router;
