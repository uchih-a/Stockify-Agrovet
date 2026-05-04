// userController.js
const { validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const User = require('../models/User');
const cloudinaryService = require('../services/cloudinaryService');

const getAllUsers = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      new ApiResponse(StatusCodes.BAD_REQUEST, null, 'Validation errors', errors.array())
    );
  }

  const { page = 1, limit = 10, role, isActive, search } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter = {};
  if (role) filter.role = role;
  if (typeof isActive === 'string') filter.isActive = isActive === 'true';
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const docs = await User.find(filter)
    .select('-password')
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const totalDocs = await User.countDocuments(filter);

  // ✅ Normalized
  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, {
      docs,
      totalDocs,
      totalPages: Math.ceil(totalDocs / parseInt(limit)),
      page: parseInt(page),
      limit: parseInt(limit)
    }, 'Users retrieved successfully')
  );
});

const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).select('-password');
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json(
      new ApiResponse(StatusCodes.NOT_FOUND, null, 'User not found')
    );
  }

  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, user, 'User retrieved successfully')
  );
});

const createUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      new ApiResponse(StatusCodes.BAD_REQUEST, null, 'Validation errors', errors.array())
    );
  }

  const { name, email, password, phone, location, role } = req.body;

  if (req.user.role === 'staff' && role !== 'farmer') {
    return res.status(StatusCodes.FORBIDDEN).json(
      new ApiResponse(StatusCodes.FORBIDDEN, null, 'Staff can only create farmer accounts')
    );
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(StatusCodes.CONFLICT).json(
      new ApiResponse(StatusCodes.CONFLICT, null, 'Email already registered')
    );
  }

  const newUser = new User({
    name, email, password, phone, location,
    role: role || 'farmer',
    isActive: true
  });

  await newUser.save();

  const userResponse = newUser.toObject();
  delete userResponse.password;

  return res.status(StatusCodes.CREATED).json(
    new ApiResponse(StatusCodes.CREATED, userResponse, 'User created successfully')
  );
});

const updateUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      new ApiResponse(StatusCodes.BAD_REQUEST, null, 'Validation errors', errors.array())
    );
  }

  const { userId } = req.params;
  const { name, phone, location, role, isActive } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json(
      new ApiResponse(StatusCodes.NOT_FOUND, null, 'User not found')
    );
  }

  if (role && req.user.role !== 'admin') {
    return res.status(StatusCodes.FORBIDDEN).json(
      new ApiResponse(StatusCodes.FORBIDDEN, null, 'Only admins can change user role')
    );
  }

  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (location) user.location = location;
  if (role && req.user.role === 'admin') user.role = role;
  if (typeof isActive === 'boolean') user.isActive = isActive;

  await user.save();

  const userResponse = user.toObject();
  delete userResponse.password;

  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, userResponse, 'User updated successfully')
  );
});

const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (userId === req.user._id.toString()) {
    return res.status(StatusCodes.FORBIDDEN).json(
      new ApiResponse(StatusCodes.FORBIDDEN, null, 'Cannot delete your own account')
    );
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json(
      new ApiResponse(StatusCodes.NOT_FOUND, null, 'User not found')
    );
  }

  user.isActive = false;
  await user.save();

  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, null, 'User deleted successfully')
  );
});

const uploadProfilePic = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!req.file) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      new ApiResponse(StatusCodes.BAD_REQUEST, null, 'No file uploaded')
    );
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json(
      new ApiResponse(StatusCodes.NOT_FOUND, null, 'User not found')
    );
  }

  if (user.profilePic && user.profilePic.publicId) {
    try { await cloudinaryService.deleteImage(user.profilePic.publicId); } catch (e) { console.error(e); }
  }

  const uploadResult = await cloudinaryService.uploadImage(req.file.path, {
    folder: 'agrovet/profiles',
    resource_type: 'auto'
  });

  user.profilePic = { url: uploadResult.secure_url, publicId: uploadResult.public_id };
  await user.save();

  const userResponse = user.toObject();
  delete userResponse.password;

  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, userResponse, 'Profile picture uploaded successfully')
  );
});

const getFarmerStats = asyncHandler(async (req, res) => {
  const { farmerId } = req.params;

  const farmer = await User.findById(farmerId);
  if (!farmer || farmer.role !== 'farmer') {
    return res.status(StatusCodes.NOT_FOUND).json(
      new ApiResponse(StatusCodes.NOT_FOUND, null, 'Farmer not found')
    );
  }

  const Transaction = require('../models/Transaction');

  const stats = await Transaction.aggregate([
    { $match: { userId: require('mongoose').Types.ObjectId(farmerId) } },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        totalAmount: { $sum: { $multiply: ['$quantity', '$unitPrice'] } }
      }
    }
  ]);

  const totalTransactions = await Transaction.countDocuments({ userId: farmerId });

  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, {
      farmer: {
        _id: farmer._id, name: farmer.name,
        email: farmer.email, phone: farmer.phone, location: farmer.location
      },
      stats,
      totalTransactions
    }, 'Farmer statistics retrieved successfully')
  );
});

module.exports = {
  getAllUsers, getUserById, createUser, updateUser,
  deleteUser, uploadProfilePic, getFarmerStats
};