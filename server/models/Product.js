// models/Product.js
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
      minlength: [2, 'Product name must be at least 2 characters'],
      maxlength: [200, 'Product name cannot exceed 200 characters']
    },

    sku: {
      type: String,
      required: [true, 'Please provide a SKU'],
      unique: true,
      uppercase: true,
      trim: true
    },

    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: [
        'seeds',
        'fertiliser',
        'pesticide',
        'animal_feed',
        'veterinary_medicine',
        'equipment',
        'other'
      ]
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },

    // Product images stored as Base64 data URLs directly in MongoDB.
    // `url`      — the full data:image/...;base64,... string (used as <img src>)
    // `publicId` — a generated ID used to identify which image to delete
    images: [
      {
        url: String,
        publicId: String
      }
    ],

    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [0, 'Price cannot be negative']
    },

    unit: {
      type: String,
      required: [true, 'Please provide a unit'],
      enum: ['kg', 'g', 'litre', 'ml', 'piece', 'pack', 'bag', 'bottle', 'vial']
    },

    quantity: {
      type: Number,
      required: [true, 'Please provide quantity'],
      min: [0, 'Quantity cannot be negative'],
      default: 0
    },

    reorderLevel: {
      type: Number,
      required: [true, 'Please provide reorder level'],
      min: [0, 'Reorder level cannot be negative'],
      default: 10
    },

    expiryDate: Date,

    batchNumber: {
      type: String,
      trim: true
    },

    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier'
    },

    isActive: {
      type: Boolean,
      default: true
    },

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

productSchema.plugin(mongoosePaginate);

productSchema.index({ sku: 1 });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ quantity: 1 });
productSchema.index({ expiryDate: 1 });
productSchema.index({ name: 'text', description: 'text' });

productSchema.virtual('isLowStock').get(function () {
  return this.quantity <= this.reorderLevel;
});

productSchema.virtual('isExpired').get(function () {
  if (!this.expiryDate) return false;
  return this.expiryDate < new Date();
});

productSchema.virtual('isExpiringSoon').get(function () {
  if (!this.expiryDate) return false;
  const daysBeforeExpiry = parseInt(process.env.EXPIRY_ALERT_DAYS_BEFORE || 30);
  const expiryThreshold = new Date();
  expiryThreshold.setDate(expiryThreshold.getDate() + daysBeforeExpiry);
  return this.expiryDate <= expiryThreshold && this.expiryDate > new Date();
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);