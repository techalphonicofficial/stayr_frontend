import prisma from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { calculateBookingPrice } from '../utils/pricingCalculator.js';
import {
  triggerBookingCreated,
  triggerBookingConfirmed,
  triggerBookingCancelled
} from '../utils/notificationHelper.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private (Guest)
export const createBooking = asyncHandler(async (req, res) => {
  const {
    propertyId,
    checkIn,
    checkOut,
    guestsCount,
    specialRequests,
    bookingNotes,
  } = req.body;

  if (!propertyId) {
    res.status(400);
    throw new Error('Property ID is required');
  }

  // Basic UUID format validation
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  if (!uuidRegex.test(propertyId)) {
    res.status(400);
    throw new Error('Invalid Property ID format');
  }

  // 1. Find Property
  const propertyDoc = await prisma.property.findUnique({
    where: { id: propertyId }
  });

  if (!propertyDoc) {
    res.status(404);
    throw new Error('Property not found');
  }

  // 2. Validate Property Status
  if (!propertyDoc.isActive || propertyDoc.status !== 'Published') {
    res.status(400);
    throw new Error('Property is not currently available for booking');
  }

  // 3. Prevent Host from booking their own property
  if (propertyDoc.hostId === req.user.id) {
    res.status(400);
    throw new Error('You cannot book your own property');
  }

  // 4. Validate Guest Count
  if (guestsCount > propertyDoc.maxGuests) {
    res.status(400);
    throw new Error(`This property only allows up to ${propertyDoc.maxGuests} guests`);
  }

  // 5. Automatic Price Calculation with Dynamic Tax
  const defaultTax = await prisma.tax.findFirst({
    where: { active: true },
    orderBy: { createdAt: 'desc' }
  });
  const taxPercentage = defaultTax ? defaultTax.defaultPercentage : 0;

  const { nights, subtotal, tax, grandTotal } = calculateBookingPrice(
    propertyDoc,
    new Date(checkIn),
    new Date(checkOut),
    taxPercentage
  );

  // 6. Overlap Prevention & Booking Creation in Transaction
  let booking;
  try {
    booking = await prisma.$transaction(async (tx) => {
      const overlappingBookings = await tx.booking.findMany({
        where: {
          propertyId,
          status: { in: ['Pending', 'Confirmed'] },
          OR: [
            {
              checkIn: { lt: new Date(checkOut) },
              checkOut: { gt: new Date(checkIn) }
            }
          ]
        }
      });

      if (overlappingBookings.length > 0) {
        throw new Error('Property is unavailable for selected dates');
      }

      return await tx.booking.create({
        data: {
          propertyId,
          guestId: req.user.id,
          hostId: propertyDoc.hostId,
          checkIn: new Date(checkIn),
          checkOut: new Date(checkOut),
          nights,
          guestsCount,
          pricePerNight: propertyDoc.pricePerNight,
          cleaningFee: propertyDoc.cleaningFee,
          serviceFee: propertyDoc.serviceFee,
          subtotal,
          taxes: tax,
          totalPrice: grandTotal,
          specialRequests,
          bookingNotes,
        }
      });
    }, {
      isolationLevel: 'Serializable'
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message || 'Failed to create booking');
  }

  console.info(`[BOOKING CREATED] Booking ${booking.id} created for property ${propertyId} by guest ${req.user.id}`);

  // Trigger Notification Fire & Forget
  const hostUser = await prisma.user.findUnique({ where: { id: propertyDoc.hostId } });
  triggerBookingCreated(booking, propertyDoc, req.user, hostUser);

  res.status(201).json({
    success: true,
    data: {
      ...booking,
      _id: booking.id,
      property: booking.propertyId,
      guest: booking.guestId,
      host: booking.hostId,
    },
  });
});

// @desc    Get logged in user bookings
// @route   GET /api/bookings/me
// @access  Private (Guest)
export const getMyBookings = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
  const skip = limit ? (page - 1) * limit : undefined;

  const bookings = await prisma.booking.findMany({
    where: { guestId: req.user.id },
    take: limit,
    skip: skip,
    include: {
      property: {
        select: { id: true, title: true, featuredImage: true, city: true, country: true }
      },
      host: {
        select: { id: true, name: true, profileImage: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const formattedBookings = bookings.map(b => ({
    ...b,
    _id: b.id,
    property: { ...b.property, _id: b.property.id },
    host: { ...b.host, _id: b.host.id },
  }));

  res.status(200).json({
    success: true,
    count: formattedBookings.length,
    data: formattedBookings,
  });
});

// @desc    Get host bookings
// @route   GET /api/bookings/host
// @access  Private (Host)
export const getHostBookings = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
  const skip = limit ? (page - 1) * limit : undefined;

  const bookings = await prisma.booking.findMany({
    where: { hostId: req.user.id },
    take: limit,
    skip: skip,
    include: {
      property: {
        select: { id: true, title: true, featuredImage: true, city: true, country: true }
      },
      guest: {
        select: { id: true, name: true, profileImage: true, email: true, phone: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const formattedBookings = bookings.map(b => ({
    ...b,
    _id: b.id,
    property: { ...b.property, _id: b.property.id },
    guest: { ...b.guest, _id: b.guest.id },
  }));

  res.status(200).json({
    success: true,
    count: formattedBookings.length,
    data: formattedBookings,
  });
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private (Guest/Host/Admin)
export const getBooking = asyncHandler(async (req, res) => {
  const booking = await prisma.booking.findUnique({
    where: { id: req.params.id },
    include: {
      property: {
        select: { id: true, title: true, featuredImage: true, address: true, city: true, country: true, maxGuests: true }
      },
      guest: {
        select: { id: true, name: true, profileImage: true, email: true, phone: true }
      },
      host: {
        select: { id: true, name: true, profileImage: true, email: true, phone: true }
      }
    }
  });

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Authorization Check
  if (
    booking.guest.id !== req.user.id &&
    booking.host.id !== req.user.id &&
    req.user.role !== 'Admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to access this booking');
  }

  res.status(200).json({
    success: true,
    data: {
      ...booking,
      _id: booking.id,
      property: { ...booking.property, _id: booking.property.id },
      guest: { ...booking.guest, _id: booking.guest.id },
      host: { ...booking.host, _id: booking.host.id },
    },
  });
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (Host/Admin)
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const booking = await prisma.booking.findUnique({
    where: { id: req.params.id }
  });

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Authorization Check
  if (booking.hostId !== req.user.id && req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Not authorized to modify this booking status');
  }

  // Business Logic Validations
  if (booking.status === 'Completed') {
    res.status(400);
    throw new Error('Cannot change status of a completed booking');
  }

  if (booking.status === 'Cancelled' && status === 'Confirmed') {
    res.status(400);
    throw new Error('Cannot confirm a cancelled booking');
  }

  if (status === 'Cancelled' && new Date(booking.checkOut) < new Date()) {
    res.status(400);
    throw new Error('Cannot cancel a booking that is already in the past');
  }

  const updatedBooking = await prisma.booking.update({
    where: { id: req.params.id },
    data: { status }
  });

  if (status === 'Confirmed') {
    const propertyDoc = await prisma.property.findUnique({ where: { id: booking.propertyId } });
    const guestUser = await prisma.user.findUnique({ where: { id: booking.guestId } });
    triggerBookingConfirmed(updatedBooking, propertyDoc, guestUser, req.user); // req.user is host
  }

  res.status(200).json({
    success: true,
    data: {
      ...updatedBooking,
      _id: updatedBooking.id
    },
  });
});

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private (Guest/Host/Admin)
export const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await prisma.booking.findUnique({
    where: { id: req.params.id }
  });

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Authorization Check
  if (
    booking.guestId !== req.user.id &&
    booking.hostId !== req.user.id &&
    req.user.role !== 'Admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to cancel this booking');
  }

  if (booking.status === 'Completed') {
    res.status(400);
    throw new Error('Cannot cancel a completed booking');
  }

  if (booking.status === 'Cancelled') {
    res.status(400);
    throw new Error('Booking is already cancelled');
  }

  if (new Date(booking.checkOut) < new Date()) {
    res.status(400);
    throw new Error('Cannot cancel a booking that is already in the past');
  }

  const cancelledBooking = await prisma.booking.update({
    where: { id: req.params.id },
    data: { status: 'Cancelled' }
  });

  const propertyDoc = await prisma.property.findUnique({ where: { id: booking.propertyId } });
  const guestUser = await prisma.user.findUnique({ where: { id: booking.guestId } });
  const hostUser = await prisma.user.findUnique({ where: { id: booking.hostId } });
  triggerBookingCancelled(cancelledBooking, propertyDoc, guestUser, hostUser, req.user.id);

  res.status(200).json({
    success: true,
    data: {
      ...cancelledBooking,
      _id: cancelledBooking.id
    },
    message: 'Booking cancelled successfully',
  });
});
