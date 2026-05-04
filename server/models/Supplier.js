const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const supplierSchema = new mongoose.Schema(
  {
    // Supplier basic information
    name: {
      type: String,
      required: [true, 'Please provide supplier name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [200, 'Name cannot exceed 200 characters']
    },

    contactPerson: {
      type: String,
      trim: true,
      maxlength: [100, 'Contact person name cannot exceed 100 characters']
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },

    phone: {
      type: String,
      trim: true
    },

    address: {
      type: String,
      trim: true,
      maxlength: [500, 'Address cannot exceed 500 characters']
    },

    county: {
      type: String,
      trim: true // Kenyan county
    },

    // Products supplied by this supplier
    productsSupplied: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ],

    // Status
    isActive: {
      type: Boolean,
      default: true
    },

    // Additional notes about the supplier
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters']
    },

    // Last delivery date reference
    lastDeliveryDate: Date
  },
  { timestamps: true }
);

// Add pagination plugin
supplierSchema.plugin(mongoosePaginate);

// Indexes for performance
supplierSchema.index({ name: 1 });
supplierSchema.index({ isActive: 1 });

module.exports = mongoose.model('Supplier', supplierSchema);
