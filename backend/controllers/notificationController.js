import { asyncHandler } from '../utils/asyncHandler.js';
import * as notificationService from '../services/notificationService.js';

// @desc    Get current user's notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = asyncHandler(async (req, res) => {
  const filters = {
    type: req.query.type,
    read: req.query.read
  };

  const pagination = {
    page: req.query.page ? parseInt(req.query.page) : 1,
    limit: req.query.limit ? parseInt(req.query.limit) : 20,
    sort: req.query.sort
  };

  const result = await notificationService.getNotifications(req.user.id, filters, pagination);

  res.status(200).json({
    success: true,
    count: result.data.length,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: result.total
    },
    data: result.data
  });
});

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
export const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await notificationService.getUnreadCount(req.user.id);
  
  res.status(200).json({
    success: true,
    data: {
      unread: count
    }
  });
});

// @desc    Mark one notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = asyncHandler(async (req, res) => {
  await notificationService.markAsRead(req.params.id, req.user.id);
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = asyncHandler(async (req, res) => {
  const count = await notificationService.markAllAsRead(req.user.id);
  
  res.status(200).json({
    success: true,
    data: {
      updated: count
    }
  });
});

// @desc    Delete one notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = asyncHandler(async (req, res) => {
  await notificationService.deleteNotification(req.params.id, req.user.id);
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Delete all read notifications
// @route   DELETE /api/notifications
// @access  Private
export const deleteAllRead = asyncHandler(async (req, res) => {
  const count = await notificationService.deleteAllRead(req.user.id);
  
  res.status(200).json({
    success: true,
    data: {
      deleted: count
    }
  });
});
