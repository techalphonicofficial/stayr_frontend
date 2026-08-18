import { createNotification } from '../services/notificationService.js';
import { sendEmail } from '../services/emailService.js';

// =======================
// Email Templates
// =======================
const templates = {
  bookingCreated: (guestName, propertyTitle, checkIn, checkOut) => `
    <h2>Booking Request Received</h2>
    <p>Hi ${guestName}, your booking for <strong>${propertyTitle}</strong> has been received.</p>
    <p>Check-in: ${new Date(checkIn).toLocaleDateString()}</p>
    <p>Check-out: ${new Date(checkOut).toLocaleDateString()}</p>
  `,
  bookingConfirmed: (guestName, propertyTitle) => `
    <h2>Booking Confirmed!</h2>
    <p>Great news ${guestName}, your booking for <strong>${propertyTitle}</strong> is confirmed!</p>
    <p>Get ready for your trip!</p>
  `,
  bookingCancelled: (name, propertyTitle) => `
    <h2>Booking Cancelled</h2>
    <p>Hi ${name}, the booking for <strong>${propertyTitle}</strong> has been cancelled.</p>
  `,
  paymentSuccess: (name, amount, propertyTitle) => `
    <h2>Payment Successful</h2>
    <p>Hi ${name}, we have received your payment of ₹${amount / 100} for <strong>${propertyTitle}</strong>.</p>
  `,
  refundProcessed: (name, amount, propertyTitle) => `
    <h2>Refund Processed</h2>
    <p>Hi ${name}, a refund of ₹${amount / 100} has been processed for your booking at <strong>${propertyTitle}</strong>.</p>
  `,
  reviewReceived: (hostName, propertyTitle, rating) => `
    <h2>New Review Received</h2>
    <p>Hi ${hostName}, you received a new ${rating}-star review for <strong>${propertyTitle}</strong>.</p>
  `,
};

// =======================
// Notification Triggers
// =======================

export const triggerBookingCreated = async (booking, property, guest, host) => {
  try {
    // Notify Host
    await createNotification({
      recipientId: host.id,
      senderId: guest.id,
      title: 'New Booking Request',
      message: `${guest.name} requested to book ${property.title}.`,
      type: 'BOOKING_CREATED',
      entityType: 'Booking',
      entityId: booking.id
    });

    // Notify Guest
    await createNotification({
      recipientId: guest.id,
      title: 'Booking Requested',
      message: `Your booking request for ${property.title} was sent successfully.`,
      type: 'BOOKING_CREATED',
      entityType: 'Booking',
      entityId: booking.id
    });

    // Send Email to Guest
    await sendEmail({
      to: guest.email,
      subject: `Booking Request: ${property.title}`,
      html: templates.bookingCreated(guest.name, property.title, booking.checkIn, booking.checkOut)
    });
  } catch (error) {
    console.error('[Notification] Error triggering booking created:', error.message);
  }
};

export const triggerBookingConfirmed = async (booking, property, guest, host) => {
  try {
    // Notify Guest
    await createNotification({
      recipientId: guest.id,
      senderId: host.id,
      title: 'Booking Confirmed',
      message: `Your booking for ${property.title} has been confirmed!`,
      type: 'BOOKING_CONFIRMED',
      entityType: 'Booking',
      entityId: booking.id
    });

    await sendEmail({
      to: guest.email,
      subject: `Booking Confirmed: ${property.title}`,
      html: templates.bookingConfirmed(guest.name, property.title)
    });
  } catch (error) {
    console.error('[Notification] Error triggering booking confirmed:', error.message);
  }
};

export const triggerBookingCancelled = async (booking, property, guest, host, cancelledBy) => {
  try {
    // Notify Guest if host cancelled, or Host if guest cancelled
    const recipient = cancelledBy === host.id ? guest : host;
    const sender = cancelledBy === host.id ? host : guest;

    await createNotification({
      recipientId: recipient.id,
      senderId: sender.id,
      title: 'Booking Cancelled',
      message: `The booking for ${property.title} has been cancelled.`,
      type: 'BOOKING_CANCELLED',
      entityType: 'Booking',
      entityId: booking.id
    });

    await sendEmail({
      to: recipient.email,
      subject: `Booking Cancelled: ${property.title}`,
      html: templates.bookingCancelled(recipient.name, property.title)
    });
  } catch (error) {
    console.error('[Notification] Error triggering booking cancelled:', error.message);
  }
};

export const triggerPaymentSuccess = async (payment, booking, property, guest, host) => {
  try {
    // Notify Guest
    await createNotification({
      recipientId: guest.id,
      title: 'Payment Successful',
      message: `Your payment of ₹${payment.amount / 100} for ${property.title} was successful.`,
      type: 'PAYMENT_SUCCESS',
      entityType: 'Payment',
      entityId: payment.id
    });

    // Notify Host
    await createNotification({
      recipientId: host.id,
      title: 'Payment Received',
      message: `Payment of ₹${payment.amount / 100} received for ${property.title}.`,
      type: 'PAYMENT_SUCCESS',
      entityType: 'Payment',
      entityId: payment.id
    });

    await sendEmail({
      to: guest.email,
      subject: `Payment Receipt: ${property.title}`,
      html: templates.paymentSuccess(guest.name, payment.amount, property.title)
    });
  } catch (error) {
    console.error('[Notification] Error triggering payment success:', error.message);
  }
};

export const triggerRefund = async (payment, property, guest) => {
  try {
    // Notify Guest
    await createNotification({
      recipientId: guest.id,
      title: 'Refund Processed',
      message: `A refund of ₹${payment.refundedAmount / 100} for ${property.title} has been processed.`,
      type: 'PAYMENT_REFUND',
      entityType: 'Payment',
      entityId: payment.id
    });

    await sendEmail({
      to: guest.email,
      subject: `Refund Processed: ${property.title}`,
      html: templates.refundProcessed(guest.name, payment.refundedAmount, property.title)
    });
  } catch (error) {
    console.error('[Notification] Error triggering refund:', error.message);
  }
};

export const triggerReviewReceived = async (review, property, guest, host) => {
  try {
    // Notify Host
    await createNotification({
      recipientId: host.id,
      senderId: guest.id,
      title: 'New Review',
      message: `${guest.name} left a ${review.rating}-star review for ${property.title}.`,
      type: 'NEW_REVIEW',
      entityType: 'Review',
      entityId: review.id
    });

    await sendEmail({
      to: host.email,
      subject: `New Review for ${property.title}`,
      html: templates.reviewReceived(host.name, property.title, review.rating)
    });
  } catch (error) {
    console.error('[Notification] Error triggering review received:', error.message);
  }
};

export const triggerPropertyCreated = async (property, host) => {
  try {
    // Notify Host
    await createNotification({
      recipientId: host.id,
      title: 'Property Listed Successfully',
      message: `Your property ${property.title} has been successfully listed.`,
      type: 'PROPERTY_CREATED',
      entityType: 'Property',
      entityId: property.id
    });
  } catch (error) {
    console.error('[Notification] Error triggering property created:', error.message);
  }
};
