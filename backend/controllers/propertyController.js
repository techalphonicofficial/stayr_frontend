import Property from '../models/Property.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Create new property
// @route   POST /api/properties
// @access  Private (Host/Admin)
export const createProperty = asyncHandler(async (req, res) => {
  // Add user to req.body
  req.body.host = req.user.id;

  const property = await Property.create(req.body);

  res.status(201).json({
    success: true,
    data: property,
  });
});

// @desc    Get all properties (with filter, search, sort, pagination)
// @route   GET /api/properties
// @access  Public
export const getProperties = asyncHandler(async (req, res) => {
  let query;

  // 1. Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude from direct matching
  const removeFields = ['select', 'sort', 'page', 'limit', 'search', 'minPrice', 'maxPrice'];
  removeFields.forEach((param) => delete reqQuery[param]);

  // 2. Initial query object
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc) - though we're explicitly handling prices below, this is good for other fields
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);
  
  const queryObj = JSON.parse(queryStr);

  // 3. Handle specific filters
  if (req.query.minPrice || req.query.maxPrice) {
    queryObj.pricePerNight = {};
    if (req.query.minPrice) queryObj.pricePerNight.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) queryObj.pricePerNight.$lte = Number(req.query.maxPrice);
  }

  // 4. Searching
  if (req.query.search) {
    queryObj.$text = { $search: req.query.search };
  }

  // Find resource
  query = Property.find(queryObj);

  // 5. Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt'); // default sort
  }

  // 6. Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Property.countDocuments(queryObj);

  query = query.skip(startIndex).limit(limit);

  // Populate host info
  query = query.populate({
    path: 'host',
    select: 'name profileImage',
  });

  // Executing query
  const properties = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: properties.length,
    pagination,
    data: properties,
  });
});

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
export const getProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id).populate({
    path: 'host',
    select: 'name profileImage',
  });

  if (!property) {
    res.status(404);
    throw new Error(`Property not found with id of ${req.params.id}`);
  }

  res.status(200).json({
    success: true,
    data: property,
  });
});

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Host/Admin)
export const updateProperty = asyncHandler(async (req, res) => {
  let property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error(`Property not found with id of ${req.params.id}`);
  }

  // Make sure user is property owner or admin
  if (property.host.toString() !== req.user.id && req.user.role !== 'Admin') {
    res.status(401);
    throw new Error(`User ${req.user.id} is not authorized to update this property`);
  }

  property = await Property.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // If title was updated, save it so the pre-save hook can re-generate the slug
  if (req.body.title) {
    property.title = req.body.title;
    await property.save();
  }

  res.status(200).json({
    success: true,
    data: property,
  });
});

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Host/Admin)
export const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error(`Property not found with id of ${req.params.id}`);
  }

  // Make sure user is property owner or admin
  if (property.host.toString() !== req.user.id && req.user.role !== 'Admin') {
    res.status(401);
    throw new Error(`User ${req.user.id} is not authorized to delete this property`);
  }

  await property.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
    message: 'Property removed successfully'
  });
});
