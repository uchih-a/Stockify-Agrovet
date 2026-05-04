// supplierController.js
const { validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const Supplier = require('../models/Supplier');
const Product = require('../models/Product');

const getAllSuppliers = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      new ApiResponse(StatusCodes.BAD_REQUEST, null, 'Validation errors', errors.array())
    );
  }

  const { page = 1, limit = 10, isActive, search } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter = {};
  if (typeof isActive === 'string') filter.isActive = isActive === 'true';
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const docs = await Supplier.find(filter)
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const totalDocs = await Supplier.countDocuments(filter);

  // ✅ Normalized
  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, {
      docs,
      totalDocs,
      totalPages: Math.ceil(totalDocs / parseInt(limit)),
      page: parseInt(page),
      limit: parseInt(limit)
    }, 'Suppliers retrieved successfully')
  );
});

const getSupplierById = asyncHandler(async (req, res) => {
  const { supplierId } = req.params;

  const supplier = await Supplier.findById(supplierId);
  if (!supplier) {
    return res.status(StatusCodes.NOT_FOUND).json(
      new ApiResponse(StatusCodes.NOT_FOUND, null, 'Supplier not found')
    );
  }

  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, supplier, 'Supplier retrieved successfully')
  );
});

const createSupplier = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      new ApiResponse(StatusCodes.BAD_REQUEST, null, 'Validation errors', errors.array())
    );
  }

  const { name, email, phone, address, city, state, zipCode, contactPerson } = req.body;

  const existingSupplier = await Supplier.findOne({ email });
  if (existingSupplier) {
    return res.status(StatusCodes.CONFLICT).json(
      new ApiResponse(StatusCodes.CONFLICT, null, 'Supplier with this email already exists')
    );
  }

  const newSupplier = new Supplier({
    name, email, phone, address, city, state, zipCode, contactPerson, isActive: true
  });

  await newSupplier.save();

  return res.status(StatusCodes.CREATED).json(
    new ApiResponse(StatusCodes.CREATED, newSupplier, 'Supplier created successfully')
  );
});

const updateSupplier = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json(
      new ApiResponse(StatusCodes.BAD_REQUEST, null, 'Validation errors', errors.array())
    );
  }

  const { supplierId } = req.params;
  const { name, email, phone, address, city, state, zipCode, contactPerson, isActive } = req.body;

  const supplier = await Supplier.findById(supplierId);
  if (!supplier) {
    return res.status(StatusCodes.NOT_FOUND).json(
      new ApiResponse(StatusCodes.NOT_FOUND, null, 'Supplier not found')
    );
  }

  if (email && email !== supplier.email) {
    const existingEmail = await Supplier.findOne({ email });
    if (existingEmail) {
      return res.status(StatusCodes.CONFLICT).json(
        new ApiResponse(StatusCodes.CONFLICT, null, 'Email already in use by another supplier')
      );
    }
  }

  if (name) supplier.name = name;
  if (email) supplier.email = email;
  if (phone) supplier.phone = phone;
  if (address) supplier.address = address;
  if (city) supplier.city = city;
  if (state) supplier.state = state;
  if (zipCode) supplier.zipCode = zipCode;
  if (contactPerson) supplier.contactPerson = contactPerson;
  if (typeof isActive === 'boolean') supplier.isActive = isActive;

  await supplier.save();

  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, supplier, 'Supplier updated successfully')
  );
});

const deleteSupplier = asyncHandler(async (req, res) => {
  const { supplierId } = req.params;

  const supplier = await Supplier.findById(supplierId);
  if (!supplier) {
    return res.status(StatusCodes.NOT_FOUND).json(
      new ApiResponse(StatusCodes.NOT_FOUND, null, 'Supplier not found')
    );
  }

  supplier.isActive = false;
  await supplier.save();

  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, null, 'Supplier deleted successfully')
  );
});

const getSupplierProducts = asyncHandler(async (req, res) => {
  const { supplierId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const supplier = await Supplier.findById(supplierId);
  if (!supplier) {
    return res.status(StatusCodes.NOT_FOUND).json(
      new ApiResponse(StatusCodes.NOT_FOUND, null, 'Supplier not found')
    );
  }

  const docs = await Product.find({ supplierId })
    .skip(skip)
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  const totalDocs = await Product.countDocuments({ supplierId });

  // ✅ Normalized — supplier info kept alongside pagination
  return res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, {
      supplier: { _id: supplier._id, name: supplier.name, email: supplier.email, phone: supplier.phone },
      docs,
      totalDocs,
      totalPages: Math.ceil(totalDocs / parseInt(limit)),
      page: parseInt(page),
      limit: parseInt(limit)
    }, 'Supplier products retrieved successfully')
  );
});

module.exports = {
  getAllSuppliers, getSupplierById, createSupplier,
  updateSupplier, deleteSupplier, getSupplierProducts
};