import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import * as adminController from '../controllers/adminController.js';
import * as validation from '../middleware/validationMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import accessControlRoutes from './accessControlRoutes.js';

const router = express.Router();

// All admin routes must be protected and restricted to 'Admin'
router.use(protect, authorize('Admin'));

// =========================
// Dashboard Overview
// =========================
router.get('/dashboard', adminController.getDashboardStats);

// =========================
// Access Control Module
// =========================
router.use('/access-control', accessControlRoutes);

// =========================
// User Management
// =========================
router.get('/users', validation.validateDashboardQuery, adminController.getUsers);
router.get('/users/:id', validation.validateAdminIdParam, adminController.getUserById);
router.put('/users/:id/status', validation.validateAdminIdParam, adminController.updateUserStatus);
router.put('/users/:id/verify', validation.validateAdminIdParam, adminController.verifyUser);

// =========================
// Property Management
// =========================
router.get('/properties', validation.validateDashboardQuery, adminController.getProperties);
router.get('/properties/:id', validation.validateAdminIdParam, adminController.getPropertyById);
router.put('/properties/:id/approve', validation.validateAdminIdParam, adminController.approveProperty);
router.put('/properties/:id/reject', validation.validateAdminIdParam, validation.validateAdminRejectProperty, adminController.rejectProperty);
router.delete('/properties/:id', validation.validateAdminIdParam, adminController.deleteProperty);

// =========================
// Booking Management
// =========================
router.get('/bookings', validation.validateDashboardQuery, adminController.getBookings);
router.get('/bookings/:id', validation.validateAdminIdParam, adminController.getBookingById);
router.put('/bookings/:id/status', validation.validateAdminIdParam, validation.validateBookingStatus, adminController.updateBookingStatus);

// =========================
// Payment Management
// =========================
router.get('/payments', validation.validateDashboardQuery, adminController.getPayments);
router.get('/payments/:id', validation.validateAdminIdParam, adminController.getPaymentById);
router.post('/payments/:id/refund', validation.validateAdminIdParam, adminController.refundPaymentProxy);

// =========================
// Review Moderation
// =========================
router.get('/reviews', validation.validateDashboardQuery, adminController.getReviews);
router.post('/reviews/upload', upload.single('image'), adminController.uploadReviewImage);
router.post('/reviews', adminController.createReview);
router.put('/reviews/:id', validation.validateAdminIdParam, adminController.updateReview);
router.delete('/reviews/:id', validation.validateAdminIdParam, adminController.deleteReview);

// =========================
// Notification Management
// =========================
router.get('/notifications', validation.validateDashboardQuery, adminController.getNotifications);
router.post('/notifications/broadcast', validation.validateAdminBroadcast, adminController.broadcastNotification);

// =========================
// Analytics
// =========================
router.get('/analytics/revenue', adminController.getRevenueAnalytics);
router.get('/analytics/bookings', adminController.getBookingAnalytics);
router.get('/analytics/properties', adminController.getPropertyAnalytics);
router.get('/analytics/users', adminController.getUserAnalytics);

export default router;
