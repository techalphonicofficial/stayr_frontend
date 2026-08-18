import prisma from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import slugify from 'slugify';
import { triggerPropertyCreated } from '../utils/notificationHelper.js';

// Helper to generate slug
const generateSlug = (title) => {
  const baseSlug = slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });
  return `${baseSlug}-${Date.now().toString(36)}`;
};

// @desc    Create new property
// @route   POST /api/properties
// @access  Private (Host/Admin)
export const createProperty = asyncHandler(async (req, res) => {
  req.body.hostId = req.user.id;

  // Extract amenities if present
  let amenitiesData = [];
  if (req.body.amenities && Array.isArray(req.body.amenities)) {
    amenitiesData = req.body.amenities.map(item => {
      if (typeof item === 'string') return { name: item, icon: 'check', available: true };
      return { name: item.name, icon: item.icon || 'check', available: item.available !== false };
    });
  }
  delete req.body.amenities;

  // Extract images if present
  let imagesData = [];
  if (req.body.images && Array.isArray(req.body.images)) {
    imagesData = req.body.images.map(img => ({ url: img.url, publicId: img.publicId }));
  }
  delete req.body.images;

  // Clean up host property added by mongoose compat
  if (req.body.host) {
    delete req.body.host;
  }

  const property = await prisma.property.create({
    data: {
      ...req.body,
      slug: generateSlug(req.body.title),
      amenities: {
        create: amenitiesData,
      },
      images: {
        create: imagesData,
      },
    },
    include: {
      amenities: true,
      images: true,
      host: {
        select: { id: true, name: true, profileImage: true }
      }
    }
  });

  const formattedProperty = {
    ...property,
    _id: property.id,
    amenities: property.amenities,
    images: property.images
  };

  // Trigger Notification Fire & Forget
  triggerPropertyCreated(property, req.user);

  res.status(201).json({
    success: true,
    data: formattedProperty,
  });
});

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
export const getProperties = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  let where = {
    isApproved: true
  };

  // Filtering
  if (req.query.minPrice || req.query.maxPrice) {
    where.pricePerNight = {};
    if (req.query.minPrice) where.pricePerNight.gte = Number(req.query.minPrice);
    if (req.query.maxPrice) where.pricePerNight.lte = Number(req.query.maxPrice);
  }

  // Searching
  if (req.query.search) {
    where.OR = [
      { title: { contains: req.query.search } },
      { description: { contains: req.query.search } },
      { city: { contains: req.query.search } },
      { country: { contains: req.query.search } },
    ];
  }

  // Other exact matches
  const exactFields = ['category', 'city', 'country', 'status'];
  exactFields.forEach(field => {
    if (req.query[field]) {
      where[field] = req.query[field];
    }
  });

  // Sorting
  let orderBy = { createdAt: 'desc' };
  if (req.query.sort) {
    const sortParams = req.query.sort.split(',');
    // Simplify for Prisma: only take first sort param
    const field = sortParams[0].replace('-', '');
    const direction = sortParams[0].startsWith('-') ? 'desc' : 'asc';
    orderBy = { [field]: direction };
  }

  const [total, properties] = await Promise.all([
    prisma.property.count({ where }),
    prisma.property.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        host: {
          select: { id: true, name: true, profileImage: true }
        },
        amenities: true,
        images: true
      }
    })
  ]);

  const formattedProperties = properties.map(p => ({
    ...p,
    _id: p.id,
    amenities: p.amenities
  }));

  const pagination = {};
  if (skip + limit < total) {
    pagination.next = { page: page + 1, limit };
  }
  if (skip > 0) {
    pagination.prev = { page: page - 1, limit };
  }

  res.status(200).json({
    success: true,
    count: properties.length,
    pagination,
    data: formattedProperties,
  });
});

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
export const getProperty = asyncHandler(async (req, res) => {
  const property = await prisma.property.findFirst({
    where: { 
      id: req.params.id,
      isApproved: true 
    },
    include: {
      host: { select: { id: true, name: true, profileImage: true } },
      amenities: true,
      images: true,
    }
  });

  if (!property) {
    res.status(404);
    throw new Error(`Property not found with id of ${req.params.id}`);
  }

  res.status(200).json({
    success: true,
    data: {
      ...property,
      _id: property.id,
      amenities: property.amenities
    },
  });
});

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Host/Admin)
export const updateProperty = asyncHandler(async (req, res) => {
  let property = await prisma.property.findUnique({
    where: { id: req.params.id }
  });

  if (!property) {
    res.status(404);
    throw new Error(`Property not found with id of ${req.params.id}`);
  }

  if (property.hostId !== req.user.id && req.user.role !== 'Admin') {
    res.status(401);
    throw new Error(`User ${req.user.id} is not authorized to update this property`);
  }

  const updateData = { ...req.body };
  if (updateData.title && updateData.title !== property.title) {
    updateData.slug = generateSlug(updateData.title);
  }

  // Handle amenities array update
  if (updateData.amenities) {
    // Delete existing
    await prisma.amenity.deleteMany({ where: { propertyId: req.params.id } });
    const newAmenities = updateData.amenities.map(item => {
      if (typeof item === 'string') return { name: item, icon: 'check', available: true };
      return { name: item.name, icon: item.icon || 'check', available: item.available !== false };
    });
    updateData.amenities = { create: newAmenities };
  }

  // Prevent modifying read-only or relational fields through standard update
  const fieldsToRemove = ['id', '_id', 'hostId', 'createdAt', 'updatedAt', 'host', '_count', 'reviews', 'bookings', 'images'];
  fieldsToRemove.forEach(field => {
    if (updateData[field] !== undefined) {
      delete updateData[field];
    }
  });

  property = await prisma.property.update({
    where: { id: req.params.id },
    data: updateData,
    include: {
      amenities: true,
      images: true,
      host: { select: { id: true, name: true, profileImage: true } }
    }
  });

  res.status(200).json({
    success: true,
    data: {
      ...property,
      _id: property.id,
      amenities: property.amenities
    },
  });
});

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Host/Admin)
export const deleteProperty = asyncHandler(async (req, res) => {
  const property = await prisma.property.findUnique({
    where: { id: req.params.id }
  });

  if (!property) {
    res.status(404);
    throw new Error(`Property not found with id of ${req.params.id}`);
  }

  if (property.hostId !== req.user.id && req.user.role !== 'Admin') {
    res.status(401);
    throw new Error(`User ${req.user.id} is not authorized to delete this property`);
  }

  const activeBookings = await prisma.booking.count({
    where: {
      propertyId: req.params.id,
      status: { in: ['Pending', 'Confirmed'] }
    }
  });

  if (activeBookings > 0) {
    res.status(400);
    throw new Error('Cannot delete a property that has active bookings');
  }

  await prisma.property.delete({
    where: { id: req.params.id }
  });

  res.status(200).json({
    success: true,
    data: {},
    message: 'Property removed successfully'
  });
});

// @desc    Check property availability
// @route   GET /api/properties/:id/availability
// @access  Public
export const checkAvailability = asyncHandler(async (req, res) => {
  const { checkIn, checkOut } = req.query;

  if (!checkIn || !checkOut) {
    res.status(400);
    throw new Error('Please provide checkIn and checkOut dates');
  }

  const property = await prisma.property.findUnique({
    where: { id: req.params.id }
  });

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  const overlappingBookings = await prisma.booking.findMany({
    where: {
      propertyId: req.params.id,
      status: { in: ['Pending', 'Confirmed'] },
      OR: [
        {
          checkIn: { lt: new Date(checkOut) },
          checkOut: { gt: new Date(checkIn) }
        }
      ]
    },
    select: {
      checkIn: true,
      checkOut: true,
      status: true
    }
  });

  res.status(200).json({
    success: true,
    available: overlappingBookings.length === 0,
    conflictingBookings: overlappingBookings,
  });
});
