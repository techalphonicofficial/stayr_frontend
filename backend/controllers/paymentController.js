import crypto from 'crypto';
import prisma from '../config/prisma.js';
import razorpay from '../config/razorpay.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  triggerPaymentSuccess,
  triggerRefund
} from '../utils/notificationHelper.js';

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private (Guest)
export const createOrder = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;

  if (!razorpay) {
    res.status(500);
    throw new Error('Razorpay is not configured properly');
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { property: true }
  });

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Business Rules
  if (booking.guestId !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to pay for this booking');
  }

  if (booking.status === 'Cancelled' || booking.status === 'Completed') {
    res.status(400);
    throw new Error('Cannot pay for a cancelled or completed booking');
  }

  if (booking.paymentStatus === 'Paid') {
    res.status(400);
    throw new Error('Booking is already paid');
  }

  const amountInPaise = Math.round(booking.totalPrice * 100);

  const options = {
    amount: amountInPaise,
    currency: 'INR',
    receipt: booking.id, // UUID is 36 characters, well within Razorpay's 40-char limit
  };

  const order = await razorpay.orders.create(options);

  const payment = await prisma.payment.create({
    data: {
      bookingId: booking.id,
      propertyId: booking.property.id,
      guestId: booking.guestId,
      hostId: booking.hostId,
      razorpayOrderId: order.id,
      amount: amountInPaise,
      currency: 'INR',
      status: 'Pending',
    }
  });

  console.info(`[PAYMENT INITIATED] Order ${order.id} created for booking ${booking.id}`);

  res.status(201).json({
    success: true,
    data: {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      booking: booking.id,
      paymentId: payment.id,
    },
  });
});

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payments/verify
// @access  Private (Guest)
export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const bodyString = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(bodyString.toString())
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    res.status(400);
    throw new Error('Invalid payment signature');
  }

  // Signature is valid
  const payment = await prisma.payment.findFirst({
    where: { razorpayOrderId: razorpay_order_id }
  });

  if (!payment) {
    res.status(404);
    throw new Error('Payment record not found');
  }

  if (payment.guestId !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to verify this payment');
  }

  if (payment.status === 'Paid') {
    res.status(400);
    throw new Error('Payment already verified');
  }

  // Transaction to update Payment, Booking and Property
  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'Paid',
        transactionDate: new Date()
      }
    });

    const booking = await tx.booking.update({
      where: { id: payment.bookingId },
      data: {
        status: 'Confirmed',
        paymentStatus: 'Paid'
      }
    });

    await tx.property.update({
      where: { id: booking.propertyId },
      data: {
        totalBookings: { increment: 1 }
      }
    });
  });

  // Fetch updated payment for response
  const updatedPayment = await prisma.payment.findUnique({
    where: { id: payment.id }
  });

  console.info(`[PAYMENT VERIFIED] Payment ${payment.id} verified successfully for booking ${payment.bookingId}`);

  // Trigger Notification Fire & Forget
  const propertyDoc = await prisma.property.findUnique({ where: { id: payment.propertyId } });
  const guestUser = await prisma.user.findUnique({ where: { id: payment.guestId } });
  const hostUser = await prisma.user.findUnique({ where: { id: payment.hostId } });
  const bookingDoc = await prisma.booking.findUnique({ where: { id: payment.bookingId } });
  triggerPaymentSuccess(updatedPayment, bookingDoc, propertyDoc, guestUser, hostUser);

  res.status(200).json({
    success: true,
    data: {
      ...updatedPayment,
      _id: updatedPayment.id
    },
  });
});

// @desc    Refund a Payment
// @route   POST /api/payments/refund
// @access  Private (Host/Admin)
export const refundPayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.body;

  if (!razorpay) {
    res.status(500);
    throw new Error('Razorpay is not configured properly');
  }

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId }
  });

  if (!payment) {
    res.status(404);
    throw new Error('Payment not found');
  }

  // Authorization Check
  if (payment.hostId !== req.user.id && req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Not authorized to refund this payment');
  }

  if (payment.status !== 'Paid') {
    res.status(400);
    throw new Error('Can only refund paid transactions');
  }

  const booking = await prisma.booking.findUnique({ where: { id: payment.bookingId } });
  if (booking && booking.status === 'Cancelled' && booking.paymentStatus === 'Refunded') {
    res.status(400);
    throw new Error('Booking is already refunded and cancelled');
  }

  // Call Razorpay Refund API
  const refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
    amount: payment.amount,
  });

  // Use transaction to update Payment and Booking
  const updatedPayment = await prisma.$transaction(async (tx) => {
    const pay = await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: 'Refunded',
        refundStatus: 'Full',
        refundedAmount: payment.amount
      }
    });

    await tx.booking.update({
      where: { id: payment.bookingId },
      data: {
        status: 'Cancelled',
        paymentStatus: 'Refunded'
      }
    });

    return pay;
  });

  res.status(200).json({
    success: true,
    data: {
      ...updatedPayment,
      _id: updatedPayment.id
    },
    message: 'Refund processed successfully',
  });
  
  console.info(`[PAYMENT REFUNDED] Payment ${payment.id} fully refunded`);

  // Trigger Notification Fire & Forget
  const propertyDoc = await prisma.property.findUnique({ where: { id: payment.propertyId } });
  const guestUser = await prisma.user.findUnique({ where: { id: payment.guestId } });
  triggerRefund(updatedPayment, propertyDoc, guestUser);
});

// @desc    Get logged in guest payments
// @route   GET /api/payments/me
// @access  Private (Guest)
export const getMyPayments = asyncHandler(async (req, res) => {
  const payments = await prisma.payment.findMany({
    where: { guestId: req.user.id },
    include: {
      booking: {
        select: { id: true, checkIn: true, checkOut: true, totalPrice: true, guestsCount: true, status: true }
      },
      property: {
        select: { id: true, title: true, featuredImage: true, city: true, country: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const formattedPayments = payments.map(p => ({
    ...p,
    _id: p.id,
    booking: { ...p.booking, _id: p.booking.id },
    property: { ...p.property, _id: p.property.id }
  }));

  res.status(200).json({
    success: true,
    count: formattedPayments.length,
    data: formattedPayments,
  });
});

// @desc    Get host payments
// @route   GET /api/payments/host
// @access  Private (Host)
export const getHostPayments = asyncHandler(async (req, res) => {
  const payments = await prisma.payment.findMany({
    where: { hostId: req.user.id },
    include: {
      booking: {
        select: { id: true, checkIn: true, checkOut: true, totalPrice: true, guestsCount: true, status: true }
      },
      guest: {
        select: { id: true, name: true, profileImage: true, email: true, phone: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const formattedPayments = payments.map(p => ({
    ...p,
    _id: p.id,
    booking: { ...p.booking, _id: p.booking.id },
    guest: { ...p.guest, _id: p.guest.id }
  }));

  res.status(200).json({
    success: true,
    count: formattedPayments.length,
    data: formattedPayments,
  });
});

// @desc    Get single payment
// @route   GET /api/payments/:id
// @access  Private (Guest/Host/Admin)
export const getPayment = asyncHandler(async (req, res) => {
  const payment = await prisma.payment.findUnique({
    where: { id: req.params.id },
    include: {
      booking: {
        select: { id: true, checkIn: true, checkOut: true, totalPrice: true, guestsCount: true, status: true }
      },
      guest: {
        select: { id: true, name: true, profileImage: true, email: true, phone: true }
      },
      property: {
        select: { id: true, title: true, featuredImage: true, city: true, country: true }
      }
    }
  });

  if (!payment) {
    res.status(404);
    throw new Error('Payment not found');
  }

  // Authorization Check
  if (
    payment.guestId !== req.user.id &&
    payment.hostId !== req.user.id &&
    req.user.role !== 'Admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to view this payment');
  }

  res.status(200).json({
    success: true,
    data: {
      ...payment,
      _id: payment.id,
      booking: { ...payment.booking, _id: payment.booking.id },
      guest: { ...payment.guest, _id: payment.guest.id },
      property: { ...payment.property, _id: payment.property.id }
    },
  });
});
