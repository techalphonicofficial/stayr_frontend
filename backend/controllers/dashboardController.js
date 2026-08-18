import { asyncHandler } from '../utils/asyncHandler.js';
import * as dashboardService from '../services/dashboardService.js';
import prisma from '../config/prisma.js';

// Helper to check if host has properties
const verifyHostProperties = async (hostId, res) => {
  const propertyCount = await prisma.property.count({
    where: { hostId }
  });
  
  if (propertyCount === 0) {
    res.status(404);
    throw new Error('Host has no properties to display analytics for');
  }
};

// @desc    Get dashboard summary
// @route   GET /api/dashboard/host
// @access  Private (Host/Admin)
export const getDashboardSummary = asyncHandler(async (req, res) => {
  await verifyHostProperties(req.user.id, res);
  
  const summary = await dashboardService.getSummary(req.user.id);
  
  res.status(200).json({
    success: true,
    data: summary
  });
});

// @desc    Get revenue analytics
// @route   GET /api/dashboard/revenue
// @access  Private (Host/Admin)
export const getRevenueAnalytics = asyncHandler(async (req, res) => {
  await verifyHostProperties(req.user.id, res);

  const filters = {
    month: req.query.month ? parseInt(req.query.month) : undefined,
    year: req.query.year ? parseInt(req.query.year) : undefined,
    dateFrom: req.query.dateFrom,
    dateTo: req.query.dateTo
  };

  const revenueData = await dashboardService.getRevenueAnalytics(req.user.id, filters);

  res.status(200).json({
    success: true,
    data: revenueData
  });
});

// @desc    Get booking analytics
// @route   GET /api/dashboard/bookings
// @access  Private (Host/Admin)
export const getBookingAnalytics = asyncHandler(async (req, res) => {
  await verifyHostProperties(req.user.id, res);

  const filters = {
    status: req.query.status,
    property: req.query.property,
    dateFrom: req.query.dateFrom,
    dateTo: req.query.dateTo
  };

  const pagination = {
    page: req.query.page ? parseInt(req.query.page) : 1,
    limit: req.query.limit ? parseInt(req.query.limit) : 10,
    sort: req.query.sort,
    search: req.query.search
  };

  const bookingData = await dashboardService.getBookingAnalytics(req.user.id, filters, pagination);

  res.status(200).json({
    success: true,
    count: bookingData.data.length,
    pagination: {
      page: pagination.page,
      limit: pagination.limit
    },
    data: bookingData
  });
});

// @desc    Get property analytics
// @route   GET /api/dashboard/properties
// @access  Private (Host/Admin)
export const getPropertyAnalytics = asyncHandler(async (req, res) => {
  await verifyHostProperties(req.user.id, res);

  const filters = {
    category: req.query.category,
    city: req.query.city,
    status: req.query.status
  };

  const pagination = {
    page: req.query.page ? parseInt(req.query.page) : 1,
    limit: req.query.limit ? parseInt(req.query.limit) : 10,
    sort: req.query.sort,
    search: req.query.search
  };

  const propertyData = await dashboardService.getPropertyAnalytics(req.user.id, filters, pagination);

  res.status(200).json({
    success: true,
    count: propertyData.data.length,
    pagination: {
      page: pagination.page,
      limit: pagination.limit
    },
    data: propertyData
  });
});

// @desc    Get recent activity
// @route   GET /api/dashboard/recent
// @access  Private (Host/Admin)
export const getRecentActivity = asyncHandler(async (req, res) => {
  await verifyHostProperties(req.user.id, res);

  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  
  const activityData = await dashboardService.getRecentActivity(req.user.id, limit);

  res.status(200).json({
    success: true,
    count: activityData.length,
    data: activityData
  });
});
