const { body, param, query, validationResult } = require('express-validator');

// User registration validation
const registerValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*]/)
    .withMessage('Password must contain at least one special character (!@#$%^&*)'),
  body('phone')
    .optional()
    .matches(/^(\+254|0)(7|1)\d{8}$/)
    .withMessage('Valid Kenyan phone number required'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location cannot exceed 200 characters')
];

// User login validation
const loginValidator = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Create product validation
const createProductValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Name must be between 2 and 200 characters'),
  body('sku')
    .trim()
    .notEmpty()
    .withMessage('SKU is required')
    .toUpperCase(),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['seeds', 'fertiliser', 'pesticide', 'animal_feed', 'veterinary_medicine', 'equipment', 'other'])
    .withMessage('Invalid category'),

  // FIX: replaced .notEmpty() with .exists() for all numeric fields.
  //
  // The bug: express-validator's notEmpty() treats the number 0 as an empty
  // value (falsy check), so submitting quantity=0 or reorderLevel=0 always
  // returned a 400 "Quantity is required" even though 0 is a perfectly valid
  // stock figure. exists() only rejects undefined/null, so 0 now passes.
  body('price')
    .exists({ checkNull: true })
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('unit')
    .notEmpty()
    .withMessage('Unit is required')
    .isIn(['kg', 'g', 'litre', 'ml', 'piece', 'pack', 'bag', 'bottle', 'vial'])
    .withMessage('Invalid unit'),
  body('quantity')
    .exists({ checkNull: true })
    .withMessage('Quantity is required')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  body('reorderLevel')
    .exists({ checkNull: true })
    .withMessage('Reorder level is required')
    .isInt({ min: 0 })
    .withMessage('Reorder level must be a non-negative integer'),
  // FIX: use optional({ values: 'falsy' }) instead of plain optional().
  // The form submits expiryDate: '' when the field is left blank.
  // plain .optional() only skips undefined/absent values, NOT empty strings.
  // values:'falsy' also skips '', null, and 0, preventing the false 400 error.
  body('expiryDate')
    .optional({ values: 'falsy' })
    .isISO8601()
    .withMessage('Valid date required'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters')
];

// Create transaction validation
const createTransactionValidator = [
  body('type')
    .notEmpty()
    .withMessage('Transaction type is required')
    .isIn(['sale', 'restock', 'adjustment', 'return', 'write_off'])
    .withMessage('Invalid transaction type'),
  body('productId')
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid product ID'),
  // FIX: same notEmpty() → exists() fix for numeric transaction fields
  body('quantity')
    .exists({ checkNull: true })
    .withMessage('Quantity is required')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('unitPrice')
    .exists({ checkNull: true })
    .withMessage('Unit price is required')
    .isFloat({ min: 0 })
    .withMessage('Unit price must be a positive number'),
  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('Invalid user ID'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
];

module.exports = {
  registerValidator,
  loginValidator,
  createProductValidator,
  createTransactionValidator
};