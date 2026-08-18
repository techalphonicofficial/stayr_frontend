import express from 'express';
import {
  createBooking,
  getMyBookings,
  getHostBookings,
  getBooking,
  updateBookingStatus,
  cancelBooking,
} from '../controllers/bookingController.js';

import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  validateBooking,
  validateBookingStatus,
} from '../middleware/validationMiddleware.js';

const router = express.Router();

// All booking routes require authentication
router.use(protect);

// Create Booking
router.post('/', validateBooking, createBooking);

// Guest Bookings
router.get('/me', getMyBookings);

// Host Bookings
router.get('/host', authorize('Host', 'Admin'), getHostBookings);

// Single Booking
router
  .route('/:id')
  .get(getBooking)
  .delete(cancelBooking);

// Update Booking Status
router.put(
  '/:id/status',
  authorize('Host', 'Admin'),
  validateBookingStatus,
  updateBookingStatus
);

export default router;