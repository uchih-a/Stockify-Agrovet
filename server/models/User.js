const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mongoosePaginate = require('mongoose-paginate-v2');

const userSchema = new mongoose.Schema(
  {
    // Basic user information
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      minlength: [4, 'Name must be at least 4 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },

    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },

    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false // Exclude from queries by default
    },

    // User role for authorization
    role: {
      type: String,
      enum: ['admin', 'staff', 'farmer'],
      default: 'farmer'
    },

    // Contact information
    phone: {
      type: String,
      trim: true,
      match: [
        /^(\+254|0)(7|1)\d{8}$/,
        'Please provide a valid Kenyan phone number (+254 or 07xx format)'
      ]
    },

    location: {
      type: String,
      trim: true,
      maxlength: [200, 'Location cannot exceed 200 characters']
    },

    // Profile picture URL from Cloudinary
    profilePic: {
      type: String,
      default: ''
    },

    // Account status flags
    isActive: {
      type: Boolean,
      default: true
    },

    isVerified: {
      type: Boolean,
      default: false
    },

    // Authentication tracking
    lastLogin: Date,

    refreshToken: {
      type: String,
      select: false // Exclude from queries
    },

    // Password reset fields
    resetPasswordToken: {
      type: String,
      select: false
    },

    resetPasswordExpire: {
      type: Date,
      select: false
    },

    // Chat usage tracking
    chatUsageToday: {
      type: Number,
      default: 0
    },

    chatUsageResetDate: Date
  },
  { timestamps: true }
);

// Add pagination plugin
userSchema.plugin(mongoosePaginate);

// Indexes for performance
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// Pre-save hook to hash password
userSchema.pre('save', async function (next) {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Compare entered password with hashed password
 * @param {string} enteredPassword - Plain text password to compare
 * @returns {Promise<boolean>} - True if password matches
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Generate JWT access token
 * @returns {string} - Signed JWT token
 */
userSchema.methods.getJwtToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

/**
 * Generate JWT refresh token (long-lived)
 * @returns {string} - Signed refresh token (before hashing)
 */
userSchema.methods.getRefreshToken = function () {
  const refreshToken = jwt.sign(
    { id: this._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );

  // Hash and store the refresh token
  this.refreshToken = crypto
    .createHash('sha256')
    .update(refreshToken)
    .digest('hex');

  return refreshToken;
};

/**
 * Generate password reset token (10 minute expiry)
 * @returns {string} - Plain text reset token (before hashing)
 */
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set expiry (10 minutes)
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
