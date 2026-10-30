import { asyncHandler } from '../utils/asyncHandler.js';
import * as adminService from '../services/adminService.js';
import cloudinary from '../config/cloudinary.js';
import { refundPayment as originalRefundPayment } from './paymentController.js';

const formatWithId = (item) => {
  if (!item) return item;
  const formatted = { ...item, _id: item.id };
  return formatted;
};

const formatArrayWithId = (arr) => arr.map(formatWithId);

const getPagination = (query, total) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 20; // Default limit in adminService is 20
  const skip = (page - 1) * limit;

  const pagination = {};
  if (skip + limit < total) {
    pagination.next = { page: page + 1, limit };
  }
  if (skip > 0) {
    pagination.prev = { page: page - 1, limit };
  }
  return pagination;
};

export const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await adminService.getDashboardStats();
  res.status(200).json({ success: true, data: stats });
});

export const getUsers = asyncHandler(async (req, res) => {
  const { total, users, stats } = await adminService.getUsers(req.query);
  const pagination = getPagination(req.query, total);
  res.status(200).json({ success: true, count: users.length, total, pagination, stats, data: formatArrayWithId(users) });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await adminService.getUserById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.status(200).json({ success: true, data: formatWithId(user) });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (status !== 'activate' && status !== 'deactivate') {
    res.status(400);
    throw new Error('Invalid status. Use activate or deactivate');
  }
  const updated = await adminService.updateUserStatus(req.params.id, status === 'activate');
  res.status(200).json({ success: true, message: `User status updated to ${status}`, data: formatWithId(updated) });
});

export const verifyUser = asyncHandler(async (req, res) => {
  const { isVerified } = req.body;
  if (typeof isVerified !== 'boolean') {
    res.status(400);
    throw new Error('isVerified must be a boolean');
  }
  const updated = await adminService.verifyUser(req.params.id, isVerified);
  res.status(200).json({ success: true, message: `User verify status updated`, data: formatWithId(updated) });
});

export const getProperties = asyncHandler(async (req, res) => {
  const { total, properties } = await adminService.getProperties(req.query);
  const pagination = getPagination(req.query, total);
  res.status(200).json({ success: true, count: properties.length, total, pagination, data: formatArrayWithId(properties) });
});

export const getPropertyById = asyncHandler(async (req, res) => {
  const property = await adminService.getPropertyById(req.params.id);
  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }
  res.status(200).json({ success: true, data: formatWithId(property) });
});

export const approveProperty = asyncHandler(async (req, res) => {
  const property = await adminService.approveProperty(req.params.id);
  res.status(200).json({ success: true, message: 'Property approved', data: formatWithId(property) });
});

export const rejectProperty = asyncHandler(async (req, res) => {
  const { rejectionReason } = req.body;
  const property = await adminService.rejectProperty(req.params.id, rejectionReason);
  res.status(200).json({ success: true, message: 'Property rejected', data: formatWithId(property) });
});

export const requestChangesProperty = asyncHandler(async (req, res) => {
  const { rejectionReason } = req.body;
  const property = await adminService.requestChangesProperty(req.params.id, rejectionReason);
  res.status(200).json({ success: true, message: 'Changes requested from host', data: formatWithId(property) });
});

export const deleteProperty = asyncHandler(async (req, res) => {
  await adminService.deleteProperty(req.params.id);
  res.status(200).json({ success: true, message: 'Property deleted successfully' });
});

export const getBookings = asyncHandler(async (req, res) => {
  const { total, bookings } = await adminService.getBookings(req.query);
  const pagination = getPagination(req.query, total);
  res.status(200).json({ success: true, count: bookings.length, total, pagination, data: formatArrayWithId(bookings) });
});

export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await adminService.getBookingById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  res.status(200).json({ success: true, data: formatWithId(booking) });
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!status) {
    res.status(400);
    throw new Error('Status is required');
  }
  const booking = await adminService.updateBookingStatus(req.params.id, status);
  res.status(200).json({ success: true, message: 'Booking status updated', data: formatWithId(booking) });
});

export const getPayments = asyncHandler(async (req, res) => {
  const { total, payments } = await adminService.getPayments(req.query);
  const pagination = getPagination(req.query, total);
  res.status(200).json({ success: true, count: payments.length, total, pagination, data: formatArrayWithId(payments) });
});

export const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await adminService.getPaymentById(req.params.id);
  if (!payment) {
    res.status(404);
    throw new Error('Payment not found');
  }
  res.status(200).json({ success: true, data: formatWithId(payment) });
});

// Reuse existing refund service without duplication
export const refundPaymentProxy = (req, res, next) => {
  // Inject paymentId into req.body as expected by original refundPayment
  req.body.paymentId = req.params.id;
  return originalRefundPayment(req, res, next);
};

export const getReviews = asyncHandler(async (req, res) => {
  const { total, reviews } = await adminService.getReviews(req.query);
  const pagination = getPagination(req.query, total);
  res.status(200).json({ success: true, count: reviews.length, total, pagination, data: formatArrayWithId(reviews) });
});

export const createReview = asyncHandler(async (req, res) => {
  const review = await adminService.createReview(req.body);
  res.status(201).json({ success: true, data: formatWithId(review) });
});

export const updateReview = asyncHandler(async (req, res) => {
  const review = await adminService.updateReview(req.params.id, req.body);
  res.status(200).json({ success: true, data: formatWithId(review) });
});

export const deleteReview = asyncHandler(async (req, res) => {
  await adminService.deleteReview(req.params.id);
  res.status(200).json({ success: true, message: 'Review deleted successfully' });
});

export const uploadReviewImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No image uploaded');
  }
  const file = req.file;

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'stayr/reviews' },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    stream.end(file.buffer);
  });

  res.status(200).json({ success: true, url: result.secure_url });
});

export const getNotifications = asyncHandler(async (req, res) => {
  const { total, notifications } = await adminService.getNotifications(req.query);
  const pagination = getPagination(req.query, total);
  res.status(200).json({ success: true, count: notifications.length, total, pagination, data: formatArrayWithId(notifications) });
});

export const broadcastNotification = asyncHandler(async (req, res) => {
  const { target, title, message } = req.body;
  const count = await adminService.broadcastNotification(target, title, message);
  res.status(200).json({ success: true, message: `Broadcast sent to ${count} users` });
});

export const getRevenueAnalytics = asyncHandler(async (req, res) => {
  const period = req.query.period || 'monthly';
  const data = await adminService.getRevenueAnalytics(period);
  res.status(200).json({ success: true, data });
});

export const getBookingAnalytics = asyncHandler(async (req, res) => {
  const data = await adminService.getBookingAnalytics();
  res.status(200).json({ success: true, data });
});

export const getPropertyAnalytics = asyncHandler(async (req, res) => {
  const data = await adminService.getPropertyAnalytics();
  res.status(200).json({ success: true, data });
});

export const getUserAnalytics = asyncHandler(async (req, res) => {
  const data = await adminService.getUserAnalytics();
  res.status(200).json({ success: true, data });
});


// ==========================================
// Real Estate Sale Moderation Controllers
// ==========================================
export const getAdminSaleListings = asyncHandler(async (req, res) => {
  const result = await adminService.getAdminSaleListings(req.query);
  res.status(200).json({ success: true, count: result.saleListings.length, total: result.total, data: result.saleListings, page: result.page, limit: result.limit });
});

export const approveSaleListing = asyncHandler(async (req, res) => {
  const listing = await adminService.approveSaleListing(req.params.id, req.user.id, req.body.notes);
  res.status(200).json({ success: true, message: 'Sale listing approved successfully', data: listing });
});

export const rejectSaleListing = asyncHandler(async (req, res) => {
  const listing = await adminService.rejectSaleListing(req.params.id, req.user.id, req.body.reason);
  res.status(200).json({ success: true, message: 'Sale listing rejected', data: listing });
});

export const requestChangesSaleListing = asyncHandler(async (req, res) => {
  const listing = await adminService.requestChangesSaleListing(req.params.id, req.user.id, req.body.feedback);
  res.status(200).json({ success: true, message: 'Changes requested from seller', data: listing });
});

export const deleteSaleListing = asyncHandler(async (req, res) => {
  const listing = await adminService.deleteSaleListing(req.params.id);
  res.status(200).json({ success: true, message: 'Sale listing deleted successfully', data: listing });
});
