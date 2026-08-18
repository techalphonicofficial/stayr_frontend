import prisma from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import cloudinary from '../config/cloudinary.js';

// Helper function to check property ownership or admin rights
const checkOwnershipOrAdmin = (property, user) => {
  return property.hostId === user.id || user.role === 'Admin';
};

// @desc    Upload property images
// @route   POST /api/properties/:id/images
// @access  Private (Host/Admin)
export const uploadPropertyImages = asyncHandler(async (req, res) => {
  const propertyId = req.params.id;

  let property = await prisma.property.findUnique({
    where: { id: propertyId },
    include: { images: true, amenities: true, host: true }
  });

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  if (!checkOwnershipOrAdmin(property, req.user)) {
    res.status(401);
    throw new Error('Not authorized to modify this property');
  }

  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('Please upload at least one image');
  }

  // Check if adding these images exceeds the limit of 10
  if (property.images.length + req.files.length > 10) {
    res.status(400);
    throw new Error(`Maximum 10 images allowed. You can only upload ${10 - property.images.length} more.`);
  }

  // Upload to Cloudinary concurrently
  const uploadPromises = req.files.map((file) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: `stayr/properties/${propertyId}` },
        (error, result) => {
          if (result) {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          } else {
            reject(error);
          }
        }
      );
      stream.end(file.buffer);
    });
  });

  const uploadedImages = await Promise.all(uploadPromises);

  // Add to property using Prisma transactions
  const imagesData = uploadedImages.map(img => ({
    url: img.url,
    publicId: img.publicId,
    propertyId
  }));

  await prisma.propertyImage.createMany({
    data: imagesData
  });

  // Set first image as featured if not set yet
  if (!property.featuredImage && uploadedImages.length > 0) {
    await prisma.property.update({
      where: { id: propertyId },
      data: { featuredImage: uploadedImages[0].url }
    });
  }

  property = await prisma.property.findUnique({
    where: { id: propertyId },
    include: { images: true, amenities: true }
  });

  res.status(201).json({
    success: true,
    data: {
      ...property,
      _id: property.id,
      amenities: property.amenities.map(a => a.name)
    },
  });
});

// @desc    Get property images
// @route   GET /api/properties/:id/images
// @access  Public
export const getPropertyImages = asyncHandler(async (req, res) => {
  const property = await prisma.property.findUnique({
    where: { id: req.params.id },
    include: { images: true }
  });

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  const formattedImages = property.images.map(img => ({
    ...img,
    _id: img.id
  }));

  res.status(200).json({
    success: true,
    count: formattedImages.length,
    data: formattedImages,
  });
});

// @desc    Delete single property image
// @route   DELETE /api/properties/:id/images/:imageId
// @access  Private (Host/Admin)
export const deletePropertyImage = asyncHandler(async (req, res) => {
  const { id: propertyId, imageId } = req.params;

  let property = await prisma.property.findUnique({
    where: { id: propertyId },
    include: { images: true, amenities: true }
  });

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  if (!checkOwnershipOrAdmin(property, req.user)) {
    res.status(401);
    throw new Error('Not authorized to modify this property');
  }

  // Find image in array
  const imageObj = property.images.find(img => img.id === imageId || img._id === imageId);

  if (!imageObj) {
    res.status(404);
    throw new Error('Image not found');
  }

  // Destroy on Cloudinary
  if (imageObj.publicId) {
    await cloudinary.uploader.destroy(imageObj.publicId);
  }

  // Remove from DB
  await prisma.propertyImage.delete({
    where: { id: imageObj.id }
  });

  // Fetch updated property
  property = await prisma.property.findUnique({
    where: { id: propertyId },
    include: { images: true, amenities: true }
  });

  // If the deleted image was the featured image, clear it or pick a new one
  if (property.featuredImage === imageObj.url) {
    const newFeaturedImage = property.images.length > 0 ? property.images[0].url : null;
    property = await prisma.property.update({
      where: { id: propertyId },
      data: { featuredImage: newFeaturedImage },
      include: { images: true, amenities: true }
    });
  }

  res.status(200).json({
    success: true,
    data: {
      ...property,
      _id: property.id,
      amenities: property.amenities.map(a => a.name)
    },
  });
});

// @desc    Set featured image
// @route   PUT /api/properties/:id/featured-image
// @access  Private (Host/Admin)
export const setFeaturedImage = asyncHandler(async (req, res) => {
  const { id: propertyId } = req.params;
  const { imageId } = req.body;

  let property = await prisma.property.findUnique({
    where: { id: propertyId },
    include: { images: true, amenities: true }
  });

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  if (!checkOwnershipOrAdmin(property, req.user)) {
    res.status(401);
    throw new Error('Not authorized to modify this property');
  }

  // Validate image exists in array
  const imageObj = property.images.find(img => img.id === imageId || img._id === imageId);

  if (!imageObj) {
    res.status(404);
    throw new Error('Image not found in property images');
  }

  property = await prisma.property.update({
    where: { id: propertyId },
    data: { featuredImage: imageObj.url },
    include: { images: true, amenities: true }
  });

  res.status(200).json({
    success: true,
    data: {
      ...property,
      _id: property.id,
      amenities: property.amenities.map(a => a.name)
    },
  });
});
