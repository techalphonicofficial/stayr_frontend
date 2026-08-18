import prisma from '../config/prisma.js';

/**
 * Fetch notifications for a specific user
 * @param {string} userId - ID of the user (recipient)
 * @param {object} filters - { type, read }
 * @param {object} pagination - { page, limit, sort }
 */
export const getNotifications = async (userId, filters = {}, pagination = {}) => {
  const { type, read } = filters;
  const { page = 1, limit = 10, sort = '-createdAt' } = pagination;

  let where = { recipientId: userId };
  if (type) where.type = type;
  if (read !== undefined) where.isRead = read === 'true' || read === true;

  const skip = (page - 1) * limit;
  const field = sort.replace('-', '');
  const direction = sort.startsWith('-') ? 'desc' : 'asc';

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [field]: direction },
      include: {
        sender: { select: { id: true, name: true, profileImage: true } }
      }
    }),
    prisma.notification.count({ where })
  ]);

  return { data: notifications, total };
};

/**
 * Get unread notification count
 * @param {string} userId 
 */
export const getUnreadCount = async (userId) => {
  const count = await prisma.notification.count({
    where: { recipientId: userId, isRead: false }
  });
  return count;
};

/**
 * Mark a specific notification as read
 * @param {string} id 
 * @param {string} userId 
 */
export const markAsRead = async (id, userId) => {
  // Ensure notification belongs to user
  const notification = await prisma.notification.findFirst({
    where: { id, recipientId: userId }
  });

  if (!notification) throw new Error('Notification not found');

  return prisma.notification.update({
    where: { id },
    data: { isRead: true }
  });
};

/**
 * Mark all notifications as read for a user
 * @param {string} userId 
 */
export const markAllAsRead = async (userId) => {
  const result = await prisma.notification.updateMany({
    where: { recipientId: userId, isRead: false },
    data: { isRead: true }
  });
  return result.count;
};

/**
 * Delete a specific notification
 * @param {string} id 
 * @param {string} userId 
 */
export const deleteNotification = async (id, userId) => {
  const notification = await prisma.notification.findFirst({
    where: { id, recipientId: userId }
  });

  if (!notification) throw new Error('Notification not found');

  await prisma.notification.delete({ where: { id } });
  return true;
};

/**
 * Delete all read notifications for a user
 * @param {string} userId 
 */
export const deleteAllRead = async (userId) => {
  const result = await prisma.notification.deleteMany({
    where: { recipientId: userId, isRead: true }
  });
  return result.count;
};

/**
 * Internal helper to create a notification directly
 */
export const createNotification = async (data) => {
  return prisma.notification.create({ data });
};
