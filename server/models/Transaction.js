const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const transactionSchema = new mongoose.Schema(
  {
    // Transaction type
    type: {
      type: String,
      required: [true, 'Please provide transaction type'],
      enum: ['sale', 'restock', 'adjustment', 'return', 'write_off']
    },

    // Product being transacted
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },

    // User who bought/received the product
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // Staff/admin who recorded the transaction
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // Quantity involved in transaction
    quantity: {
      type: Number,
      required: [true, 'Please provide quantity'],
      min: [1, 'Quantity must be at least 1']
    },

    // Unit price at time of transaction
    unitPrice: {
      type: Number,
      required: [true, 'Please provide unit price'],
      min: [0, 'Unit price cannot be negative']
    },

    // Auto-calculated total amount
    totalAmount: {
      type: Number,
      min: [0, 'Total amount cannot be negative']
    },

    // Stock snapshots before and after
    previousStock: {
      type: Number,
      required: true
    },

    newStock: {
      type: Number,
      required: true
    },

    // Additional details
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Notes cannot exceed 500 characters']
    },

    // Reference number (invoice, receipt, etc.)
    reference: {
      type: String,
      trim: true
    },

    // ✅ NEW: Payment method — how the farmer paid
    paymentMethod: {
      type: String,
      enum: ['cash', 'mpesa', 'stripe', 'bank_transfer', 'credit'],
      default: 'cash'
    },

    // ✅ NEW: Stripe Checkout Session ID — set when paid via Stripe
    stripeSessionId: {
      type: String,
      default: null,
      index: true   // indexed so admin can look up by session ID quickly
    }
  },
  { timestamps: true }
);

// Add pagination plugin
transactionSchema.plugin(mongoosePaginate);

// Indexes for performance
transactionSchema.index({ productId: 1, createdAt: -1 });
transactionSchema.index({ userId: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ createdAt: -1 });

// Pre-save hook to auto-calculate totalAmount
transactionSchema.pre('save', function (next) {
  this.totalAmount = this.quantity * this.unitPrice;
  next();
});

module.exports = mongoose.model('Transaction', transactionSchema);