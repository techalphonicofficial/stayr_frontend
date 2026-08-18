import express from 'express';
import {
  createOrder,
  verifyPayment,
  refundPayment,
  getMyPayments,
  getHostPayments,
  getPayment,
} from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  validateCreateOrder,
  validateVerifyPayment,
  validateRefund,
} from '../middleware/validationMiddleware.js';

const router = express.Router();

// Guest specific routes
router.route('/create-order')
  .post(protect, authorize('Guest'), validateCreateOrder, createOrder);

router.route('/verify')
  .post(protect, authorize('Guest'), validateVerifyPayment, verifyPayment);

router.route('/me')
  .get(protect, authorize('Guest'), getMyPayments);

// Host specific routes
router.route('/refund')
  .post(protect, authorize('Host', 'Admin'), validateRefund, refundPayment);

router.route('/host')
  .get(protect, authorize('Host', 'Admin'), getHostPayments);

// Single payment
router.route('/:id')
  .get(protect, getPayment);

export default router;
