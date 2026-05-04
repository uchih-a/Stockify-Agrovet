const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const alertSchema = new mongoose.Schema(
  {
    // Type of alert
    type: {
      type: String,
      required: [true, 'Please provide alert type'],
      enum: ['low_stock', 'expiry_warning', 'expired', 'system', 'restock_complete']
    },

    // Product that triggered the alert (optional for system alerts)
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },

    // Alert message
    message: {
      type: String,
      required: [true, 'Please provide alert message'],
      maxlength: [500, 'Message cannot exceed 500 characters']
    },

    // Severity level
    severity: {
      type: String,
      required: [true, 'Please provide severity'],
      enum: ['info', 'warning', 'critical'],
      default: 'warning'
    },

    // Whether the alert has been read by admin/staff
    isRead: {
      type: Boolean,
      default: false
    },

    // Whether the alert has been resolved
    isResolved: {
      type: Boolean,
      default: false
    },

    // Staff/admin who resolved the alert
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    // When the alert was resolved
    resolvedAt: Date
  },
  { timestamps: true }
);

// Add pagination plugin
alertSchema.plugin(mongoosePaginate);

// Indexes for performance
alertSchema.index({ isRead: 1 });
alertSchema.index({ isResolved: 1 });
alertSchema.index({ type: 1 });
alertSchema.index({ productId: 1 });
alertSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Alert', alertSchema);
