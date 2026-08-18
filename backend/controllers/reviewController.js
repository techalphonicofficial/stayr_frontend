import prisma from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { updatePropertyRating } from '../utils/updatePropertyRating.js';
import { triggerReviewReceived } from '../utils/notificationHelper.js';

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private (Guest)
export const createReview = asyncHandler(async (req, res) => {
  const { bookingId, rating, comment } = req.body;

  if (!bookingId) {
    res.status(400);
    throw new Error('Please provide a bookingId');
  }

  // 1. Fetch the booking
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId }
  });

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // 2. Business rules checks
  if (booking.guestId !== req.user.id) {
    res.status(403);
    throw new Error('You can only review your own bookings');
  }

  if (booking.status !== 'Completed') {
    res.status(400);
    throw new Error('You can only review completed bookings');
  }

  if (booking.paymentStatus !== 'Paid') {
    res.status(400);
    throw new Error('You can only review paid bookings');
  }

  // 3. Prevent duplicate reviews for the same booking
  const existingReview = await prisma.review.findFirst({
    where: {
      bookingId: bookingId,
      guestId: req.user.id,
    }
  });

  if (existingReview) {
    res.status(400);
    throw new Error('You have already reviewed this booking');
  }

  // 4. Create review
  const review = await prisma.review.create({
    data: {
      propertyId: booking.propertyId,
      guestId: req.user.id,
      bookingId: bookingId,
      rating,
      comment,
    }
  });

  // 5. Update Property Rating
  await updatePropertyRating(booking.propertyId);

  // Trigger Notification Fire & Forget
  const propertyDoc = await prisma.property.findUnique({ where: { id: booking.propertyId } });
  const hostUser = await prisma.user.findUnique({ where: { id: propertyDoc.hostId } });
  triggerReviewReceived(review, propertyDoc, req.user, hostUser);

  res.status(201).json({
    success: true,
    data: {
      ...review,
      _id: review.id,
      property: review.propertyId,
      guest: review.guestId,
      booking: review.bookingId,
    },
  });
});

// @desc    Get all reviews for a property
// @route   GET /api/reviews/property/:propertyId
// @access  Public
export const getPropertyReviews = asyncHandler(async (req, res) => {
  const reviews = await prisma.review.findMany({
    where: { propertyId: req.params.propertyId },
    include: {
      guest: {
        select: { id: true, name: true, profileImage: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const formattedReviews = reviews.map(r => ({
    ...r,
    _id: r.id,
    guest: { ...r.guest, _id: r.guest.id },
  }));

  res.status(200).json({
    success: true,
    count: formattedReviews.length,
    data: formattedReviews,
  });
});

// @desc    Get logged in user's reviews
// @route   GET /api/reviews/me
// @access  Private (Guest)
export const getMyReviews = asyncHandler(async (req, res) => {
  const reviews = await prisma.review.findMany({
    where: { guestId: req.user.id },
    include: {
      guest: {
        select: { id: true, name: true, profileImage: true }
      },
      property: {
        select: { id: true, title: true, featuredImage: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const formattedReviews = reviews.map(r => ({
    ...r,
    _id: r.id,
    guest: { ...r.guest, _id: r.guest.id },
    property: { ...r.property, _id: r.property.id },
  }));

  res.status(200).json({
    success: true,
    count: formattedReviews.length,
    data: formattedReviews,
  });
});

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
export const getReview = asyncHandler(async (req, res) => {
  const review = await prisma.review.findUnique({
    where: { id: req.params.id },
    include: {
      guest: {
        select: { id: true, name: true, profileImage: true }
      },
      property: {
        select: { id: true, title: true, featuredImage: true }
      },
      booking: {
        select: { id: true, checkIn: true, checkOut: true }
      }
    }
  });

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  res.status(200).json({
    success: true,
    data: {
      ...review,
      _id: review.id,
      guest: { ...review.guest, _id: review.guest.id },
      property: { ...review.property, _id: review.property.id },
      booking: { ...review.booking, _id: review.booking.id },
    },
  });
});

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private (Guest)
export const updateReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const review = await prisma.review.findUnique({
    where: { id: req.params.id }
  });

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Authorization Check
  if (review.guestId !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to update this review');
  }

  const updatedReview = await prisma.review.update({
    where: { id: req.params.id },
    data: {
      rating: rating !== undefined ? rating : review.rating,
      comment: comment !== undefined ? comment : review.comment,
    }
  });

  // Update Property Rating
  await updatePropertyRating(review.propertyId);

  res.status(200).json({
    success: true,
    data: {
      ...updatedReview,
      _id: updatedReview.id,
    },
  });
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (Guest)
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await prisma.review.findUnique({
    where: { id: req.params.id }
  });

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Authorization Check
  if (review.guestId !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to delete this review');
  }

  const propertyId = review.propertyId;

  await prisma.review.delete({
    where: { id: req.params.id }
  });

  // Update Property Rating
  await updatePropertyRating(propertyId);

  res.status(200).json({
    success: true,
    data: {},
    message: 'Review deleted successfully',
  });
});
