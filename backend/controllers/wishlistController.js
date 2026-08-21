import prisma from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Toggle property in wishlist
// @route   POST /api/wishlist/toggle
// @access  Private
export const toggleWishlist = asyncHandler(async (req, res) => {
  const { propertyId } = req.body;
  const userId = req.user.id;

  if (!propertyId) {
    res.status(400);
    throw new Error('Property ID is required');
  }

  // Check if it already exists
  const existingWishlist = await prisma.wishlist.findUnique({
    where: {
      userId_propertyId: {
        userId,
        propertyId,
      },
    },
  });

  if (existingWishlist) {
    // Remove from wishlist
    await prisma.wishlist.delete({
      where: {
        id: existingWishlist.id,
      },
    });
    res.status(200).json({ success: true, isSaved: false, message: 'Removed from wishlist' });
  } else {
    // Add to wishlist
    await prisma.wishlist.create({
      data: {
        userId,
        propertyId,
      },
    });
    res.status(201).json({ success: true, isSaved: true, message: 'Added to wishlist' });
  }
});

// @desc    Get user's wishlist properties
// @route   GET /api/wishlist
// @access  Private
export const getMyWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const wishlists = await prisma.wishlist.findMany({
    where: { userId },
    include: {
      property: {
        include: {
          images: true,
          reviews: {
            select: { rating: true, comment: true },
            orderBy: { createdAt: 'desc' },
            take: 1
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.status(200).json({ success: true, data: wishlists });
});
