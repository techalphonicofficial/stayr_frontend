import express from 'express';
import rateLimit from 'express-rate-limit';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import * as saleInquiryController from '../controllers/saleInquiryController.js';

const router = express.Router();

// Spam protection for buyer-generated messages
const inquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});

// Buyer inquiry & callback submission (allows logged-in or guest with phone/email)
router.post('/', optionalAuth, inquiryLimiter, saleInquiryController.createInquiry);

// Reporting
router.post('/report', optionalAuth, inquiryLimiter, saleInquiryController.reportListing);
router.post('/:listingId/report', optionalAuth, inquiryLimiter, saleInquiryController.reportListing);

// Private: each user only ever sees their own inquiries
router.get('/seller', protect, saleInquiryController.getMyReceivedInquiries);
router.get('/seller-inquiries', protect, saleInquiryController.getMyReceivedInquiries);
router.get('/mine', protect, saleInquiryController.getMySentInquiries);
router.get('/my-inquiries', protect, saleInquiryController.getMySentInquiries);
router.put('/:id/status', protect, saleInquiryController.updateInquiryStatus);
router.patch('/:id/status', protect, saleInquiryController.updateInquiryStatus);

export default router;
