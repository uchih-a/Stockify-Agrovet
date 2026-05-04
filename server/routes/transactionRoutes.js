const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authorise } = require('../middleware/roleMiddleware');
const { createTransactionValidator } = require('../utils/validators');

const router = express.Router();

const transactionController = {
  getAllTransactions: (req, res) => res.json({ message: 'Get all transactions' }),
  getTransactionById: (req, res) => res.json({ message: 'Get transaction' }),
  createTransaction: (req, res) => res.json({ message: 'Create transaction' }),
  getMyTransactions: (req, res) => res.json({ message: 'Get my transactions' })
};

router.get('/', protect, authorise('admin', 'staff'), transactionController.getAllTransactions);
router.get('/my', protect, transactionController.getMyTransactions);
router.get('/:id', protect, transactionController.getTransactionById);
router.post('/', protect, authorise('admin', 'staff'), createTransactionValidator, transactionController.createTransaction);

module.exports = router;
