import express from 'express';
import {
  createReview,
  getPropertyReviews,
  getMyReviews,
  getReview,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validateReview } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Public route
router.route('/property/:propertyId')
  .get(getPropertyReviews);

// Guest protected routes
router.route('/')
  .post(protect, authorize('Guest'), validateReview, createReview);

router.route('/me')
  .get(protect, authorize('Guest'), getMyReviews);

// Public and protected operations on specific review ID
router.route('/:id')
  .get(getReview) // Public read
  .put(protect, authorize('Guest'), validateReview, updateReview)
  .delete(protect, authorize('Guest'), deleteReview);

export default router;
