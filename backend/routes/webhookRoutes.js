import express from 'express';
import crypto from 'crypto';
import prisma from '../config/prisma.js';

const router = express.Router();

router.post('/razorpay', async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  // The req.body is a raw buffer because we will configure express.raw for this route in app.js
  const shasum = crypto.createHmac('sha256', secret);
  shasum.update(req.body);
  const digest = shasum.digest('hex');

  const signature = req.headers['x-razorpay-signature'];

  if (digest === signature) {
    try {
      const event = JSON.parse(req.body);

      // Handle different event types
      if (event.event === 'payment.captured') {
        const paymentData = event.payload.payment.entity;
        
        const payment = await prisma.payment.findFirst({ where: { razorpayOrderId: paymentData.order_id } });
        if (payment && payment.status === 'Pending') {
          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: 'Paid',
              razorpayPaymentId: paymentData.id,
              transactionDate: new Date()
            }
          });

          const booking = await prisma.booking.findUnique({ where: { id: payment.bookingId } });
          if (booking) {
            await prisma.booking.update({
              where: { id: booking.id },
              data: {
                status: 'Confirmed',
                paymentStatus: 'Paid'
              }
            });

            await prisma.property.update({
              where: { id: booking.propertyId },
              data: {
                totalBookings: { increment: 1 }
              }
            });
          }
        }
      } else if (event.event === 'payment.failed') {
        const paymentData = event.payload.payment.entity;
        
        const payment = await prisma.payment.findFirst({ where: { razorpayOrderId: paymentData.order_id } });
        if (payment) {
          await prisma.payment.update({
            where: { id: payment.id },
            data: { status: 'Failed' }
          });

          const booking = await prisma.booking.findUnique({ where: { id: payment.bookingId } });
          if (booking) {
            await prisma.booking.update({
              where: { id: booking.id },
              data: { paymentStatus: 'Failed' }
            });
          }
        }
      } else if (event.event === 'refund.processed') {
        const refundData = event.payload.refund.entity;
        
        const payment = await prisma.payment.findFirst({ where: { razorpayPaymentId: refundData.payment_id } });
        if (payment) {
          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: 'Refunded',
              refundStatus: 'Full',
              refundedAmount: refundData.amount
            }
          });

          const booking = await prisma.booking.findUnique({ where: { id: payment.bookingId } });
          if (booking) {
            await prisma.booking.update({
              where: { id: booking.id },
              data: {
                status: 'Cancelled',
                paymentStatus: 'Refunded'
              }
            });
          }
        }
      }

      res.status(200).json({ status: 'ok' });
    } catch (error) {
      console.error('Webhook Error:', error);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  } else {
    res.status(400).json({ status: 'error', message: 'Invalid Signature' });
  }
});

export default router;
