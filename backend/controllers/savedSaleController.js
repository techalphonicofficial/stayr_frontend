import prisma from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Toggle saving a sale listing to favorites
// @route   POST /api/sale-listings/saved/toggle
// @access  Private
export const toggleSavedSaleListing = asyncHandler(async (req, res) => {
  const { saleListingId } = req.body;
  const userId = req.user.id;

  if (!saleListingId) {
    res.status(400);
    throw new Error('Sale listing ID is required');
  }

  const existing = await prisma.savedSaleListing.findUnique({
    where: {
      userId_saleListingId: {
        userId,
        saleListingId
      }
    }
  });

  if (existing) {
    await prisma.savedSaleListing.delete({ where: { id: existing.id } });
    return res.status(200).json({
      success: true,
      isSaved: false,
      message: 'Removed from saved properties'
    });
  } else {
    await prisma.savedSaleListing.create({
      data: {
        userId,
        saleListingId
      }
    });
    return res.status(201).json({
      success: true,
      isSaved: true,
      message: 'Added to saved properties'
    });
  }
});

// @desc    Get user's saved sale listings
// @route   GET /api/sale-listings/saved
// @access  Private
export const getMySavedSaleListings = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const saved = await prisma.savedSaleListing.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      saleListing: {
        include: {
          seller: {
            select: { id: true, name: true, profileImage: true, isVerified: true }
          },
          images: {
            orderBy: { sortOrder: 'asc' },
            take: 1
          }
        }
      }
    }
  });

  const listings = saved
    .filter(item => item.saleListing !== null)
    .map(item => ({
      ...item.saleListing,
      isSaved: true,
      savedAt: item.createdAt
    }));

  res.status(200).json({
    success: true,
    count: listings.length,
    data: listings
  });
});

