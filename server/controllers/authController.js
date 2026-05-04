const { StatusCodes } = require('http-status-codes');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');
const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Register a new user
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const register = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ApiResponse.error(res, StatusCodes.BAD_REQUEST, 'Validation failed', errors.array());
  }

  const { name, email, password, phone, location } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return ApiResponse.error(res, StatusCodes.CONFLICT, 'Email already registered');
    }

    const user = new User({
      name,
      email,
      password,
      phone,
      location,
      role: 'farmer'
    });

    await user.save();

    const accessToken = user.getJwtToken();
    const refreshToken = user.getRefreshToken();
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const userResponse = await User.findById(user._id).select('-password');

    return ApiResponse.success(
      res,
      StatusCodes.CREATED,
      { user: userResponse, accessToken },
      'User registered successfully'
    );
  } catch (error) {
    logger.error('Registration error:', error);
    return ApiResponse.error(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Registration failed');
  }
});

/**
 * Login user
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ApiResponse.error(res, StatusCodes.BAD_REQUEST, 'Validation failed', errors.array());
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return ApiResponse.error(res, StatusCodes.UNAUTHORIZED, 'Invalid credentials');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return ApiResponse.error(res, StatusCodes.UNAUTHORIZED, 'Invalid credentials');
    }

    user.lastLogin = new Date();
    await user.save();

    const accessToken = user.getJwtToken();
    const refreshToken = user.getRefreshToken();
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const userResponse = await User.findById(user._id).select('-password -refreshToken');

    return ApiResponse.success(
      res,
      StatusCodes.OK,
      { user: userResponse, accessToken },
      'Logged in successfully'
    );
  } catch (error) {
    logger.error('Login error:', error);
    return ApiResponse.error(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Login failed');
  }
});

/**
 * Logout user
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const logout = asyncHandler(async (req, res) => {
  try {
    await User.updateOne({ _id: req.user._id }, { refreshToken: null });
    res.clearCookie('refreshToken');
    return ApiResponse.success(res, StatusCodes.OK, null, 'Logged out successfully');
  } catch (error) {
    logger.error('Logout error:', error);
    return ApiResponse.error(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Logout failed');
  }
});

/**
 * Refresh access token
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const refreshToken = asyncHandler(async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return ApiResponse.error(res, StatusCodes.UNAUTHORIZED, 'Refresh token not found');
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || !user.refreshToken) {
      return ApiResponse.error(res, StatusCodes.UNAUTHORIZED, 'Invalid refresh token');
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    if (hashedToken !== user.refreshToken) {
      return ApiResponse.error(res, StatusCodes.UNAUTHORIZED, 'Invalid refresh token');
    }

    const newAccessToken = user.getJwtToken();
    return ApiResponse.success(res, StatusCodes.OK, { accessToken: newAccessToken }, 'Token refreshed');
  } catch (error) {
    logger.error('Token refresh error:', error);
    return ApiResponse.error(res, StatusCodes.UNAUTHORIZED, 'Token refresh failed');
  }
});

/**
 * Send password reset email
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const message = 'If an account exists, a password reset link has been sent to your email';

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return ApiResponse.success(res, StatusCodes.OK, null, message);
    }

    const resetToken = user.getResetPasswordToken();
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await transporter.sendMail({
      to: email,
      from: process.env.EMAIL_FROM,
      subject: 'Password Reset Request',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. Link expires in 10 minutes.</p>`
    });

    return ApiResponse.success(res, StatusCodes.OK, null, message);
  } catch (error) {
    logger.error('Forgot password error:', error);
    return ApiResponse.error(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to send reset email');
  }
});

/**
 * Reset password with token
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() }
    }).select('+resetPasswordToken +resetPasswordExpire');

    if (!user) {
      return ApiResponse.error(res, StatusCodes.BAD_REQUEST, 'Invalid or expired reset token');
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();

    return ApiResponse.success(res, StatusCodes.OK, null, 'Password reset successfully');
  } catch (error) {
    logger.error('Reset password error:', error);
    return ApiResponse.error(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Password reset failed');
  }
});

/**
 * Get current logged-in user
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  return ApiResponse.success(res, StatusCodes.OK, user, 'User fetched successfully');
});

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  getMe
};
