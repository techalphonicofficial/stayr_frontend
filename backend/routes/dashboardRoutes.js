import express from 'express';
import {
  getDashboardSummary,
  getRevenueAnalytics,
  getBookingAnalytics,
  getPropertyAnalytics,
  getRecentActivity
} from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  validateDashboardQuery,
  validateDashboardDateFilters
} from '../middleware/validationMiddleware.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);
router.use(authorize('Host', 'Admin'));

router.get('/host', getDashboardSummary);

router.get(
  '/revenue',
  validateDashboardDateFilters,
  getRevenueAnalytics
);

router.get(
  '/bookings',
  validateDashboardQuery,
  validateDashboardDateFilters,
  getBookingAnalytics
);

router.get(
  '/properties',
  validateDashboardQuery,
  getPropertyAnalytics
);

router.get('/recent', getRecentActivity);

export default router;
