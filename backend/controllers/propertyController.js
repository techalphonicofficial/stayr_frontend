import prisma from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import slugify from 'slugify';
import { triggerPropertyCreated } from '../utils/notificationHelper.js';
import { vectorSearchService } from '../services/vectorSearchService.js';

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

// @desc    Vector semantic search for properties
// @route   GET /api/properties/search/vector
// @access  Public
export const vectorSearchProperties = asyncHandler(async (req, res) => {
  const query = req.query.q || req.query.search || req.query.location || '';
  const result = await vectorSearchService.search(query, {
    page: parseInt(req.query.page, 10) || 1,
    limit: parseInt(req.query.limit, 10) || 20,
    city: req.query.city,
    category: req.query.category,
    minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
    maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
    guests: req.query.guests ? Number(req.query.guests) : undefined
  });

  res.status(200).json({
    success: true,
    ...result
  });
});

// @desc    Live search suggestions with vector property previews
// @route   GET /api/properties/search/live
// @access  Public
export const liveSearchSuggestions = asyncHandler(async (req, res) => {
  const query = req.query.q || req.query.search || '';
  const result = await vectorSearchService.getLiveSuggestions(query, parseInt(req.query.limit, 10) || 5);

  res.status(200).json({
    success: true,
    ...result
  });
});

// @desc    Get all properties (with automatic vector search when search query provided)
// @route   GET /api/properties
// @access  Public
export const getProperties = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // If search query is provided, use Vector Search Engine for 100% relevant results
  const searchQuery = req.query.search || req.query.q;
  if (searchQuery && String(searchQuery).trim() !== '' && String(searchQuery).toLowerCase() !== 'anywhere') {
    const result = await vectorSearchService.search(String(searchQuery).trim(), {
      page,
      limit,
      city: req.query.city,
      category: req.query.category,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      guests: req.query.guests ? Number(req.query.guests) : undefined
    });

    const pagination = {};
    if (skip + limit < result.total) {
      pagination.next = { page: page + 1, limit };
    }
    if (skip > 0) {
      pagination.prev = { page: page - 1, limit };
    }

    return res.status(200).json({
      success: true,
      count: result.data.length,
      total: result.total,
      detectedIntent: result.detectedIntent,
      pagination,
      data: result.data
    });
  }

  let where = {
    isApproved: true,
    status: req.query.status || 'Published'
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
        images: true,
        reviews: {
          take: 1,
          orderBy: { rating: 'desc' },
          include: { guest: { select: { name: true, profileImage: true } } }
        }
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
// @access  Public (Host/Admin can view their own unapproved)
export const getProperty = asyncHandler(async (req, res) => {
  const property = await prisma.property.findUnique({
    where: { id: req.params.id },
    include: {
      host: { select: { id: true, name: true, profileImage: true, phone: true, email: true } },
      amenities: true,
      images: { orderBy: { sortOrder: 'asc' } },
      reviews: {
        include: {
          guest: { select: { id: true, name: true, profileImage: true } }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!property) {
    res.status(404);
    throw new Error(`Property not found with id of ${req.params.id}`);
  }

  // If not approved or not published, only the host owner or admin can view
  if (!property.isApproved || property.status !== 'Published') {
    const isOwnerOrAdmin = req.user && (req.user.id === property.hostId || req.user.role === 'Admin');
    if (!isOwnerOrAdmin) {
      res.status(404);
      throw new Error(`Property not found with id of ${req.params.id}`);
    }
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

// @desc    Get current host's properties
// @route   GET /api/properties/host/my-properties
// @access  Private (Authenticated User / Host)
export const getMyProperties = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const where = {
    hostId: req.user.id
  };

  if (req.query.status && req.query.status !== 'All') {
    where.status = req.query.status;
  }

  const [total, properties] = await Promise.all([
    prisma.property.count({ where }),
    prisma.property.findMany({
      where,
      skip,
      take: limit,
      orderBy: { updatedAt: 'desc' },
      include: {
        images: {
          orderBy: { sortOrder: 'asc' }
        },
        amenities: true,
        _count: {
          select: {
            reviews: true,
            bookings: true
          }
        }
      }
    })
  ]);

  const formattedProperties = properties.map(p => ({
    ...p,
    _id: p.id,
    amenities: p.amenities
  }));

  res.status(200).json({
    success: true,
    count: properties.length,
    total,
    pagination: {
      currentPage: page,
      limit,
      totalPages: Math.ceil(total / limit)
    },
    data: formattedProperties
  });
});

// @desc    Get host property for management/draft editing
// @route   GET /api/properties/manage/:id
// @access  Private (Host/Admin)
export const getManageProperty = asyncHandler(async (req, res) => {
  const property = await prisma.property.findUnique({
    where: { id: req.params.id },
    include: {
      host: { select: { id: true, name: true, email: true, phone: true, profileImage: true } },
      amenities: true,
      images: {
        orderBy: { sortOrder: 'asc' }
      }
    }
  });

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  if (property.hostId !== req.user.id && req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Not authorized to access this property');
  }

  res.status(200).json({
    success: true,
    data: {
      ...property,
      _id: property.id
    }
  });
});

// @desc    Create a draft property
// @route   POST /api/properties/draft
// @access  Private
export const createDraftProperty = asyncHandler(async (req, res) => {
  // Ensure host role or upgrade guest
  if (req.user.role === 'Guest') {
    await prisma.user.update({
      where: { id: req.user.id },
      data: { role: 'Host' }
    });
    req.user.role = 'Host';
  }

  const title = (req.body.title || '').trim() || 'Untitled Property Listing';
  const slug = generateSlug(title);

  // Safe fallback defaults for draft creation so that non-null columns are satisfied
  const category = req.body.category || 'Apartment';
  const description = req.body.description || 'Draft listing description in progress.';
  const address = req.body.address || 'Address pending';
  const city = req.body.city || 'City pending';
  const state = req.body.state || 'State pending';
  const country = req.body.country || 'India';
  const pricePerNight = Number(req.body.pricePerNight) || 0;
  const maxGuests = Number(req.body.maxGuests) || 1;
  const bedrooms = Number(req.body.bedrooms) || 1;
  const beds = Number(req.body.beds) || 1;
  const bathrooms = Number(req.body.bathrooms) || 1;

  let amenitiesData = [];
  if (req.body.amenities && Array.isArray(req.body.amenities)) {
    amenitiesData = req.body.amenities.map(item => {
      if (typeof item === 'string') return { name: item, icon: 'check', available: true };
      return { name: item.name, icon: item.icon || 'check', available: item.available !== false };
    });
  }

  const property = await prisma.property.create({
    data: {
      hostId: req.user.id,
      title,
      slug,
      description,
      category,
      propertyType: req.body.propertyType || 'Entire home',
      status: 'Draft',
      isApproved: false,
      address,
      city,
      state,
      country,
      postalCode: req.body.postalCode || null,
      latitude: req.body.latitude ? Number(req.body.latitude) : null,
      longitude: req.body.longitude ? Number(req.body.longitude) : null,
      pricePerNight,
      cleaningFee: Number(req.body.cleaningFee) || 0,
      serviceFee: Number(req.body.serviceFee) || 0,
      currency: req.body.currency || 'INR',
      maxGuests,
      bedrooms,
      beds,
      bathrooms,
      aboutProperty: req.body.aboutProperty || {},
      bookingSettings: req.body.bookingSettings || {},
      houseRules: req.body.houseRules || {},
      cancellationPolicy: req.body.cancellationPolicy || {},
      damagePolicy: req.body.damagePolicy || {},
      amenities: {
        create: amenitiesData
      }
    },
    include: {
      amenities: true,
      images: true,
      host: { select: { id: true, name: true, email: true, phone: true } }
    }
  });

  res.status(201).json({
    success: true,
    data: {
      ...property,
      _id: property.id
    }
  });
});

// @desc    Update a draft property incrementally
// @route   PUT /api/properties/:id/draft
// @access  Private (Host/Admin)
export const updateDraftProperty = asyncHandler(async (req, res) => {
  const property = await prisma.property.findUnique({
    where: { id: req.params.id },
    include: { images: true }
  });

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  if (property.hostId !== req.user.id && req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Not authorized to update this property');
  }

  const updateData = {};

  if (req.body.title !== undefined && req.body.title.trim()) {
    updateData.title = req.body.title.trim();
    if (updateData.title !== property.title) {
      updateData.slug = generateSlug(updateData.title);
    }
  }
  if (req.body.description !== undefined) updateData.description = req.body.description;
  if (req.body.category !== undefined) updateData.category = req.body.category;
  if (req.body.propertyType !== undefined) updateData.propertyType = req.body.propertyType;
  if (req.body.address !== undefined) updateData.address = req.body.address;
  if (req.body.city !== undefined) updateData.city = req.body.city;
  if (req.body.state !== undefined) updateData.state = req.body.state;
  if (req.body.country !== undefined) updateData.country = req.body.country;
  if (req.body.postalCode !== undefined) updateData.postalCode = req.body.postalCode;
  if (req.body.latitude !== undefined) updateData.latitude = req.body.latitude ? Number(req.body.latitude) : null;
  if (req.body.longitude !== undefined) updateData.longitude = req.body.longitude ? Number(req.body.longitude) : null;
  if (req.body.pricePerNight !== undefined) updateData.pricePerNight = Number(req.body.pricePerNight);
  if (req.body.cleaningFee !== undefined) updateData.cleaningFee = Number(req.body.cleaningFee);
  if (req.body.serviceFee !== undefined) updateData.serviceFee = Number(req.body.serviceFee);
  if (req.body.currency !== undefined) updateData.currency = req.body.currency;
  if (req.body.maxGuests !== undefined) updateData.maxGuests = Number(req.body.maxGuests);
  if (req.body.bedrooms !== undefined) updateData.bedrooms = Number(req.body.bedrooms);
  if (req.body.beds !== undefined) updateData.beds = Number(req.body.beds);
  if (req.body.bathrooms !== undefined) updateData.bathrooms = Number(req.body.bathrooms);
  if (req.body.featuredImage !== undefined) updateData.featuredImage = req.body.featuredImage;

  // JSON objects - merge with existing
  if (req.body.aboutProperty !== undefined) {
    updateData.aboutProperty = {
      ...(typeof property.aboutProperty === 'object' && property.aboutProperty ? property.aboutProperty : {}),
      ...req.body.aboutProperty,
      lastSavedAt: new Date().toISOString()
    };
  }
  if (req.body.bookingSettings !== undefined) {
    updateData.bookingSettings = {
      ...(typeof property.bookingSettings === 'object' && property.bookingSettings ? property.bookingSettings : {}),
      ...req.body.bookingSettings
    };
  }
  if (req.body.houseRules !== undefined) {
    updateData.houseRules = {
      ...(typeof property.houseRules === 'object' && property.houseRules ? property.houseRules : {}),
      ...req.body.houseRules
    };
  }
  if (req.body.cancellationPolicy !== undefined) {
    updateData.cancellationPolicy = {
      ...(typeof property.cancellationPolicy === 'object' && property.cancellationPolicy ? property.cancellationPolicy : {}),
      ...req.body.cancellationPolicy
    };
  }
  if (req.body.damagePolicy !== undefined) {
    updateData.damagePolicy = {
      ...(typeof property.damagePolicy === 'object' && property.damagePolicy ? property.damagePolicy : {}),
      ...req.body.damagePolicy
    };
  }

  // Handle amenities update if provided
  if (req.body.amenities && Array.isArray(req.body.amenities)) {
    await prisma.amenity.deleteMany({ where: { propertyId: req.params.id } });
    const newAmenities = req.body.amenities.map(item => {
      if (typeof item === 'string') return { name: item, icon: 'check', available: true };
      return { name: item.name, icon: item.icon || 'check', available: item.available !== false };
    });
    updateData.amenities = { create: newAmenities };
  }

  const updatedProperty = await prisma.property.update({
    where: { id: req.params.id },
    data: updateData,
    include: {
      amenities: true,
      images: { orderBy: { sortOrder: 'asc' } },
      host: { select: { id: true, name: true, email: true, phone: true } }
    }
  });

  res.status(200).json({
    success: true,
    data: {
      ...updatedProperty,
      _id: updatedProperty.id
    }
  });
});

// @desc    Submit property for review
// @route   POST /api/properties/:id/submit-for-review
// @access  Private (Host/Admin)
export const submitForReview = asyncHandler(async (req, res) => {
  const property = await prisma.property.findUnique({
    where: { id: req.params.id },
    include: { images: true, amenities: true }
  });

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  if (property.hostId !== req.user.id && req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Not authorized to submit this property');
  }

  // Strict validation on required fields for submission
  const errors = [];
  if (!property.title || property.title.trim().length < 5) errors.push('Title must be at least 5 characters');
  if (!property.description || property.description.trim().length < 20) errors.push('Description must be at least 20 characters');
  if (!property.category) errors.push('Property category is required');
  if (!property.address || property.address === 'Address pending') errors.push('Street address is required');
  if (!property.city || property.city === 'City pending') errors.push('City is required');
  if (!property.state || property.state === 'State pending') errors.push('State is required');
  if (!property.country) errors.push('Country is required');
  if (!property.pricePerNight || property.pricePerNight <= 0) errors.push('Valid nightly price is required');
  if (!property.maxGuests || property.maxGuests < 1) errors.push('Guest capacity must be at least 1');
  if (!property.images || property.images.length === 0) errors.push('At least one property photo is required');

  if (errors.length > 0) {
    res.status(400);
    return res.json({
      success: false,
      message: 'Please complete all required fields before submitting for review',
      errors
    });
  }

  // Set featured image if not set yet
  let featuredImage = property.featuredImage;
  if (!featuredImage && property.images.length > 0) {
    featuredImage = property.images[0].url;
  }

  const updatedProperty = await prisma.property.update({
    where: { id: req.params.id },
    data: {
      status: 'PendingReview',
      isApproved: false,
      rejectionReason: null,
      featuredImage
    },
    include: {
      amenities: true,
      images: { orderBy: { sortOrder: 'asc' } },
      host: { select: { id: true, name: true, email: true } }
    }
  });

  // Trigger notification to host & admin
  triggerPropertyCreated(updatedProperty, req.user);

  res.status(200).json({
    success: true,
    message: 'Property listing submitted for review successfully',
    data: {
      ...updatedProperty,
      _id: updatedProperty.id
    }
  });
});

// @desc    Toggle property listing active status or unlist
// @route   PUT /api/properties/:id/toggle-status
// @access  Private (Host/Admin)
export const toggleListingStatus = asyncHandler(async (req, res) => {
  const property = await prisma.property.findUnique({
    where: { id: req.params.id }
  });

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  if (property.hostId !== req.user.id && req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Not authorized to modify this property');
  }

  let newStatus = property.status;
  let newIsActive = property.isActive;

  if (req.body.action === 'unlist') {
    newStatus = 'Unlisted';
    newIsActive = false;
  } else if (req.body.action === 'relist' && property.isApproved) {
    newStatus = 'Published';
    newIsActive = true;
  } else if (req.body.action === 'toggle-active') {
    newIsActive = !property.isActive;
  }

  const updated = await prisma.property.update({
    where: { id: req.params.id },
    data: {
      status: newStatus,
      isActive: newIsActive
    }
  });

  res.status(200).json({
    success: true,
    data: {
      ...updated,
      _id: updated.id
    }
  });
});

