import prisma from '../config/prisma.js';

export const getDashboardStats = async () => {
  const [
    totalUsers,
    totalGuests,
    totalHosts,
    totalProperties,
    totalBookings,
    totalReviews,
    totalPayments,
    pendingBookings,
    confirmedBookings,
    cancelledBookings,
    completedBookings,
    activeUsers,
    inactiveUsers,
    unreadNotifications
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'Guest' } }),
    prisma.user.count({ where: { role: 'Host' } }),
    prisma.property.count(),
    prisma.booking.count(),
    prisma.review.count(),
    prisma.payment.count(),
    prisma.booking.count({ where: { status: 'Pending' } }),
    prisma.booking.count({ where: { status: 'Confirmed' } }),
    prisma.booking.count({ where: { status: 'Cancelled' } }),
    prisma.booking.count({ where: { status: 'Completed' } }),
    prisma.user.count({ where: { isActive: true } }),
    prisma.user.count({ where: { isActive: false } }),
    prisma.notification.count({ where: { isRead: false } }),
  ]);

  const payments = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: { status: 'Paid' }
  });

  const totalRevenue = (payments._sum.amount || 0) / 100;

  const bookings = await prisma.booking.aggregate({
    _avg: { totalPrice: true },
    where: { status: { in: ['Confirmed', 'Completed'] } }
  });
  const averageBookingValue = bookings._avg.totalPrice || 0;

  const properties = await prisma.property.aggregate({
    _avg: { averageRating: true }
  });
  const averagePropertyRating = properties._avg.averageRating || 0;

  const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const monthlyPayments = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: {
      status: 'Paid',
      transactionDate: { gte: currentMonthStart }
    }
  });
  const monthlyRevenue = (monthlyPayments._sum.amount || 0) / 100;

  return {
    totalUsers,
    totalGuests,
    totalHosts,
    totalProperties,
    totalBookings,
    totalReviews,
    totalPayments,
    confirmedBookings,
    pendingBookings,
    cancelledBookings,
    completedBookings,
    totalRevenue,
    monthlyRevenue,
    averageBookingValue,
    averagePropertyRating,
    activeUsers,
    inactiveUsers,
    unreadNotifications
  };
};

export const getUsers = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const skip = (page - 1) * limit;

  const where = {};
  if (query.role) where.role = query.role;
  if (query.status) where.isActive = query.status === 'active';
  if (query.search) {
    where.OR = [
      { name: { contains: query.search } },
      { email: { contains: query.search } }
    ];
  }

  // Handle "Employees" vs "Users" vs "Vendors"
  if (query.type === 'Employees') {
    where.role = { in: ['Admin', 'Employee'] };
  } else if (query.type === 'Users') {
    where.role = 'Guest';
  } else if (query.type === 'Vendors') {
    where.role = { in: ['Vendor', 'Host'] }; // Host/Vendor conceptually grouped based on previous assumptions
  }

  const [total, users, roleStats] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true, name: true, email: true, phone: true, role: true, isVerified: true, isActive: true, createdAt: true,
        accessRole: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.groupBy({
      by: ['role'],
      _count: { id: true }
    })
  ]);

  const stats = {
    Employees: 0,
    Users: 0,
    Vendors: 0,
    All: 0
  };

  roleStats.forEach(stat => {
    stats.All += stat._count.id;
    if (['Admin', 'Employee'].includes(stat.role)) stats.Employees += stat._count.id;
    if (['Guest'].includes(stat.role)) stats.Users += stat._count.id;
    if (['Vendor', 'Host'].includes(stat.role)) stats.Vendors += stat._count.id;
  });

  return { total, users, stats };
};
// Trigger nodemon restart

export const getUserById = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true, name: true, email: true, phone: true, profileImage: true, role: true, isVerified: true, isActive: true, lastLogin: true, createdAt: true,
      _count: {
        select: {
          hostedProperties: true,
          guestBookings: true,
          hostBookings: true,
          reviews: true,
          guestPayments: true,
          notifications: true
        }
      }
    }
  });
};

export const updateUserStatus = async (id, isActive) => {
  return prisma.user.update({
    where: { id },
    data: { isActive },
    select: { id: true, name: true, isActive: true }
  });
};

export const verifyUser = async (id, isVerified) => {
  return prisma.user.update({
    where: { id },
    data: { isVerified },
    select: { id: true, name: true, isVerified: true }
  });
};

export const getProperties = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const skip = (page - 1) * limit;

  const where = {};
  if (query.city) where.city = { contains: query.city };
  if (query.country) where.country = { contains: query.country };
  if (query.category) where.category = query.category;
  if (query.status) where.status = query.status;
  if (query.hostId) where.hostId = query.hostId;
  
  if (query.minPrice || query.maxPrice) {
    where.pricePerNight = {};
    if (query.minPrice) where.pricePerNight.gte = parseFloat(query.minPrice);
    if (query.maxPrice) where.pricePerNight.lte = parseFloat(query.maxPrice);
  }

  if (query.search) {
    where.OR = [
      { title: { contains: query.search } },
      { description: { contains: query.search } }
    ];
  }

  const orderBy = { createdAt: 'desc' };
  if (query.sort) {
    const field = query.sort.replace('-', '');
    const direction = query.sort.startsWith('-') ? 'desc' : 'asc';
    orderBy[field] = direction;
  }

  const [total, properties] = await Promise.all([
    prisma.property.count({ where }),
    prisma.property.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        host: { select: { id: true, name: true } },
        images: {
          orderBy: { sortOrder: 'asc' },
          take: 1
        }
      }
    })
  ]);

  return { total, properties };
};

export const getPropertyById = async (id) => {
  return prisma.property.findUnique({
    where: { id },
    include: {
      host: { select: { id: true, name: true, email: true } },
      images: true,
      _count: {
        select: {
          reviews: true,
          bookings: true
        }
      }
    }
  });
};

export const approveProperty = async (id) => {
  return prisma.property.update({
    where: { id },
    data: { isApproved: true, rejectionReason: null }
  });
};

export const rejectProperty = async (id, reason) => {
  return prisma.property.update({
    where: { id },
    data: { isApproved: false, rejectionReason: reason }
  });
};

export const deleteProperty = async (id) => {
  return prisma.property.delete({ where: { id } });
};

export const getBookings = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const skip = (page - 1) * limit;

  const where = {};
  if (query.status) where.status = query.status;
  if (query.paymentStatus) where.paymentStatus = query.paymentStatus;
  if (query.hostId) where.hostId = query.hostId;
  if (query.guestId) where.guestId = query.guestId;
  if (query.propertyId) where.propertyId = query.propertyId;
  if (query.dateFrom && query.dateTo) {
    where.createdAt = {
      gte: new Date(query.dateFrom),
      lte: new Date(query.dateTo)
    };
  }

  const [total, bookings] = await Promise.all([
    prisma.booking.count({ where }),
    prisma.booking.findMany({
      where,
      skip,
      take: limit,
      include: {
        guest: { select: { id: true, name: true } },
        host: { select: { id: true, name: true } },
        property: { select: { id: true, title: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
  ]);

  return { total, bookings };
};

export const getBookingById = async (id) => {
  return prisma.booking.findUnique({
    where: { id },
    include: {
      guest: { select: { id: true, name: true, email: true } },
      host: { select: { id: true, name: true, email: true } },
      property: { select: { id: true, title: true, address: true } },
      payments: true
    }
  });
};

export const updateBookingStatus = async (id, status) => {
  return prisma.booking.update({
    where: { id },
    data: { status }
  });
};

export const getPayments = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const skip = (page - 1) * limit;

  const where = {};
  if (query.status) where.status = query.status;
  if (query.refundStatus) where.refundStatus = query.refundStatus;
  if (query.guestId) where.guestId = query.guestId;
  if (query.hostId) where.hostId = query.hostId;
  if (query.amount) where.amount = parseFloat(query.amount) * 100;
  if (query.search) {
    where.OR = [
      { razorpayOrderId: { contains: query.search } },
      { razorpayPaymentId: { contains: query.search } }
    ];
  }
  if (query.dateFrom && query.dateTo) {
    where.createdAt = {
      gte: new Date(query.dateFrom),
      lte: new Date(query.dateTo)
    };
  }

  const [total, payments] = await Promise.all([
    prisma.payment.count({ where }),
    prisma.payment.findMany({
      where,
      skip,
      take: limit,
      include: {
        guest: { select: { id: true, name: true } },
        host: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' }
    })
  ]);

  return { total, payments };
};

export const getPaymentById = async (id) => {
  return prisma.payment.findUnique({
    where: { id },
    include: {
      guest: { select: { id: true, name: true, email: true } },
      host: { select: { id: true, name: true, email: true } },
      booking: true,
      property: { select: { id: true, title: true } }
    }
  });
};

export const getReviews = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const skip = (page - 1) * limit;

  const where = {};
  if (query.rating) where.rating = parseFloat(query.rating);
  if (query.propertyId) where.propertyId = query.propertyId;
  if (query.guestId) where.guestId = query.guestId;
  if (query.search) where.comment = { contains: query.search };

  const [total, reviews] = await Promise.all([
    prisma.review.count({ where }),
    prisma.review.findMany({
      where,
      skip,
      take: limit,
      include: {
        guest: { select: { id: true, name: true } },
        property: { select: { id: true, title: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
  ]);

  return { total, reviews };
};

export const deleteReview = async (id) => {
  const review = await prisma.review.findUnique({ where: { id } });
  if (review) {
    await prisma.review.delete({ where: { id } });
    
    const aggregate = await prisma.review.aggregate({
      _avg: { rating: true },
      _count: { rating: true },
      where: { propertyId: review.propertyId }
    });
    
    await prisma.property.update({
      where: { id: review.propertyId },
      data: {
        averageRating: aggregate._avg.rating || 0,
        totalReviews: aggregate._count.rating || 0
      }
    });
  }
  return true;
};

export const getNotifications = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const skip = (page - 1) * limit;

  const [total, notifications] = await Promise.all([
    prisma.notification.count(),
    prisma.notification.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    })
  ]);

  return { total, notifications };
};

export const broadcastNotification = async (target, title, message) => {
  let userQuery = {};
  
  if (target === 'Guests') userQuery = { role: 'Guest' };
  else if (target === 'Hosts') userQuery = { role: 'Host' };
  else if (target === 'Admins') userQuery = { role: 'Admin' };
  
  const users = await prisma.user.findMany({
    where: userQuery,
    select: { id: true }
  });
  
  const notifications = users.map(u => ({
    recipientId: u.id,
    title,
    message,
    type: 'SYSTEM',
    isRead: false
  }));
  
  if (notifications.length > 0) {
    await prisma.notification.createMany({
      data: notifications
    });
  }
  
  return users.length;
};

export const getRevenueAnalytics = async (period) => {
  const payments = await prisma.payment.findMany({
    where: { status: 'Paid', transactionDate: { not: null } },
    select: { transactionDate: true, amount: true }
  });
  
  const grouped = {};
  payments.forEach(p => {
    let key;
    const date = new Date(p.transactionDate);
    if (period === 'monthly') {
      key = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}`;
    } else if (period === 'yearly') {
      key = `${date.getFullYear()}`;
    } else { // daily
      key = date.toISOString().split('T')[0];
    }
    
    if (!grouped[key]) grouped[key] = 0;
    grouped[key] += (p.amount / 100);
  });
  
  return Object.keys(grouped).sort().map(k => ({ date: k, revenue: grouped[k] }));
};

export const getBookingAnalytics = async () => {
  const bookings = await prisma.booking.findMany({
    select: { createdAt: true }
  });
  
  const grouped = {};
  bookings.forEach(b => {
    const key = `${b.createdAt.getFullYear()}-${(b.createdAt.getMonth()+1).toString().padStart(2, '0')}`;
    if (!grouped[key]) grouped[key] = 0;
    grouped[key] += 1;
  });
  
  return Object.keys(grouped).sort().map(k => ({ month: k, bookings: grouped[k] }));
};

export const getPropertyAnalytics = async () => {
  const mostBooked = await prisma.property.findMany({
    orderBy: { totalBookings: 'desc' },
    take: 5,
    select: { id: true, title: true, totalBookings: true }
  });
  
  const leastBooked = await prisma.property.findMany({
    orderBy: { totalBookings: 'asc' },
    take: 5,
    select: { id: true, title: true, totalBookings: true }
  });
  
  const highestRated = await prisma.property.findMany({
    orderBy: { averageRating: 'desc' },
    take: 5,
    select: { id: true, title: true, averageRating: true, totalReviews: true }
  });
  
  return { mostBooked, leastBooked, highestRated };
};

export const getUserAnalytics = async () => {
  const users = await prisma.user.findMany({
    select: { createdAt: true, role: true }
  });
  
  let hostCount = 0;
  let guestCount = 0;
  
  const grouped = {};
  users.forEach(u => {
    if (u.role === 'Host') hostCount++;
    if (u.role === 'Guest') guestCount++;
    
    const key = `${u.createdAt.getFullYear()}-${(u.createdAt.getMonth()+1).toString().padStart(2, '0')}`;
    if (!grouped[key]) grouped[key] = 0;
    grouped[key] += 1;
  });
  
  const registrations = Object.keys(grouped).sort().map(k => ({ month: k, count: grouped[k] }));
  
  return { totalHosts: hostCount, totalGuests: guestCount, registrations };
};
