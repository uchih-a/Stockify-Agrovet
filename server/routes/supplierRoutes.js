const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authorise } = require('../middleware/roleMiddleware');

const router = express.Router();

const supplierController = {
  getAllSuppliers: (req, res) => res.json({ message: 'Get all suppliers' }),
  getSupplierById: (req, res) => res.json({ message: 'Get supplier' }),
  createSupplier: (req, res) => res.json({ message: 'Create supplier' }),
  updateSupplier: (req, res) => res.json({ message: 'Update supplier' }),
  deleteSupplier: (req, res) => res.json({ message: 'Delete supplier' }),
  getSupplierProducts: (req, res) => res.json({ message: 'Get supplier products' })
};

router.get('/', protect, authorise('admin', 'staff'), supplierController.getAllSuppliers);
router.get('/:id', protect, authorise('admin', 'staff'), supplierController.getSupplierById);
router.get('/:id/products', protect, authorise('admin', 'staff'), supplierController.getSupplierProducts);
router.post('/', protect, authorise('admin', 'staff'), supplierController.createSupplier);
router.put('/:id', protect, authorise('admin', 'staff'), supplierController.updateSupplier);
router.delete('/:id', protect, authorise('admin'), supplierController.deleteSupplier);

module.exports = router;
