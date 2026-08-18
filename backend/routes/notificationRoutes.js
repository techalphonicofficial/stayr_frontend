import express from 'express';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllRead
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  validateNotificationQuery,
  validateNotificationId
} from '../middleware/validationMiddleware.js';

const router = express.Router();

// All notification routes require authentication
router.use(protect);

router.get('/', validateNotificationQuery, getNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', validateNotificationId, markAsRead);
router.delete('/', deleteAllRead);
router.delete('/:id', validateNotificationId, deleteNotification);

export default router;
