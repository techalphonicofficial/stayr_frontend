import prisma from '../config/prisma.js';

export const getSummary = async (hostId) => {
  const [
    properties,
    bookings,
    totalGuestsAggr,
    totalRevenueAggr,
    unreadNotificationCount,
    latestNotifications
  ] = await Promise.all([
    prisma.property.groupBy({
      by: ['status', 'isActive'],
      where: { hostId },
      _count: { id: true }
    }),
    prisma.booking.groupBy({
      by: ['status'],
      where: { hostId },
      _count: { id: true }
    }),
    prisma.booking.aggregate({
      where: { hostId, status: { in: ['Pending', 'Confirmed', 'Completed'] } },
      _sum: { guestsCount: true }
    }),
    prisma.payment.aggregate({
      where: { hostId, status: 'Paid' },
      _sum: { amount: true }
    }),
    prisma.notification.count({
      where: { recipientId: hostId, isRead: false }
    }),
    prisma.notification.findMany({
      where: { recipientId: hostId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, title: true, type: true, isRead: true, createdAt: true }
    })
  ]);

  let totalProperties = 0, activeProperties = 0, inactiveProperties = 0;
  properties.forEach(p => {
    totalProperties += p._count.id;
    if (p.status === 'Published' && p.isActive) {
      activeProperties += p._count.id;
    } else {
      inactiveProperties += p._count.id;
    }
  });

  let totalBookings = 0, pendingBookings = 0, confirmedBookings = 0, completedBookings = 0, cancelledBookings = 0;
  bookings.forEach(b => {
    totalBookings += b._count.id;
    if (b.status === 'Pending') pendingBookings += b._count.id;
    if (b.status === 'Confirmed') confirmedBookings += b._count.id;
    if (b.status === 'Completed') completedBookings += b._count.id;
    if (b.status === 'Cancelled') cancelledBookings += b._count.id;
  });

  const totalGuests = totalGuestsAggr._sum.guestsCount || 0;
  // amount is in paise, convert to currency unit
  const totalRevenue = (totalRevenueAggr._sum.amount || 0) / 100;

  // Monthly Revenue
  const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const monthlyRevenueAggr = await prisma.payment.aggregate({
    where: { 
      hostId, 
      status: 'Paid', 
      transactionDate: { gte: currentMonthStart } 
    },
    _sum: { amount: true }
  });
  const monthlyRevenue = (monthlyRevenueAggr._sum.amount || 0) / 100;

  // Average Rating
  const avgRatingAggr = await prisma.property.aggregate({
    where: { hostId },
    _avg: { averageRating: true }
  });
  const averageRating = avgRatingAggr._avg.averageRating || 0;

  // Occupancy Rate (Current Month)
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const availableNights = activeProperties * daysInMonth;
  
  const currentMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
  const bookedNightsAggr = await prisma.booking.aggregate({
    where: {
      hostId,
      status: { in: ['Confirmed', 'Completed'] },
      checkIn: { lte: currentMonthEnd },
      checkOut: { gte: currentMonthStart }
    },
    _sum: { nights: true }
  });
  const bookedNights = bookedNightsAggr._sum.nights || 0;
  const occupancyRate = availableNights > 0 ? (bookedNights / availableNights) * 100 : 0;

  return {
    totalProperties,
    activeProperties,
    inactiveProperties,
    totalBookings,
    pendingBookings,
    confirmedBookings,
    completedBookings,
    cancelledBookings,
    totalRevenue,
    monthlyRevenue,
    totalGuests,
    averageRating,
    occupancyRate,
    unreadNotificationCount,
    latestNotifications
  };
};

export const getRevenueAnalytics = async (hostId, filters, pagination) => {
  const { month, year, dateFrom, dateTo } = filters;
  
  let whereClause = { hostId };
  let currentPeriodStart, currentPeriodEnd, prevPeriodStart, prevPeriodEnd;

  if (month && year) {
    currentPeriodStart = new Date(year, month - 1, 1);
    currentPeriodEnd = new Date(year, month, 0);
    prevPeriodStart = new Date(month === 1 ? year - 1 : year, month === 1 ? 11 : month - 2, 1);
    prevPeriodEnd = new Date(month === 1 ? year - 1 : year, month === 1 ? 12 : month - 1, 0);
  } else if (year) {
    currentPeriodStart = new Date(year, 0, 1);
    currentPeriodEnd = new Date(year, 11, 31, 23, 59, 59, 999);
    prevPeriodStart = new Date(year - 1, 0, 1);
    prevPeriodEnd = new Date(year - 1, 11, 31, 23, 59, 59, 999);
  } else if (dateFrom && dateTo) {
    currentPeriodStart = new Date(dateFrom);
    currentPeriodEnd = new Date(dateTo);
    const duration = currentPeriodEnd.getTime() - currentPeriodStart.getTime();
    prevPeriodStart = new Date(currentPeriodStart.getTime() - duration);
    prevPeriodEnd = new Date(currentPeriodEnd.getTime() - duration);
  } else {
    // Default to Current Year
    const currentYear = new Date().getFullYear();
    currentPeriodStart = new Date(currentYear, 0, 1);
    currentPeriodEnd = new Date(currentYear, 11, 31, 23, 59, 59, 999);
    prevPeriodStart = new Date(currentYear - 1, 0, 1);
    prevPeriodEnd = new Date(currentYear - 1, 11, 31, 23, 59, 59, 999);
  }

  whereClause.transactionDate = { gte: currentPeriodStart, lte: currentPeriodEnd };

  const [
    currentPeriodAggr,
    prevPeriodAggr,
    yearRevenueAggr,
    statusAggr
  ] = await Promise.all([
    prisma.payment.aggregate({
      where: { hostId, status: 'Paid', transactionDate: { gte: currentPeriodStart, lte: currentPeriodEnd } },
      _sum: { amount: true },
      _count: { id: true }
    }),
    prisma.payment.aggregate({
      where: { hostId, status: 'Paid', transactionDate: { gte: prevPeriodStart, lte: prevPeriodEnd } },
      _sum: { amount: true }
    }),
    prisma.payment.aggregate({
      where: { hostId, status: 'Paid', transactionDate: { gte: new Date(new Date().getFullYear(), 0, 1) } },
      _sum: { amount: true }
    }),
    prisma.payment.groupBy({
      by: ['status'],
      where: { hostId },
      _sum: { amount: true, refundedAmount: true }
    })
  ]);

  const currentRevenue = (currentPeriodAggr._sum.amount || 0) / 100;
  const previousRevenue = (prevPeriodAggr._sum.amount || 0) / 100;
  const yearRevenue = (yearRevenueAggr._sum.amount || 0) / 100;
  
  const averageBookingValue = currentPeriodAggr._count.id > 0 ? currentRevenue / currentPeriodAggr._count.id : 0;
  
  let revenueGrowth = 0;
  if (previousRevenue > 0) {
    revenueGrowth = ((currentRevenue - previousRevenue) / previousRevenue) * 100;
  } else if (currentRevenue > 0) {
    revenueGrowth = 100;
  }

  let refundAmount = 0, paidAmount = 0, pendingPaymentsAmount = 0;
  statusAggr.forEach(s => {
    if (s.status === 'Paid') paidAmount += (s._sum.amount || 0) / 100;
    if (s.status === 'Refunded') refundAmount += (s._sum.refundedAmount || 0) / 100;
    if (s.status === 'Pending') pendingPaymentsAmount += (s._sum.amount || 0) / 100;
  });

  // Monthly Chart Data (for current year)
  const chartPayments = await prisma.payment.findMany({
    where: { 
      hostId, 
      status: 'Paid', 
      transactionDate: { gte: new Date(new Date().getFullYear(), 0, 1) }
    },
    select: { amount: true, transactionDate: true }
  });

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlyChartMap = new Map();
  monthNames.forEach(m => monthlyChartMap.set(m, 0));

  chartPayments.forEach(p => {
    if (p.transactionDate) {
      const monthStr = monthNames[p.transactionDate.getMonth()];
      monthlyChartMap.set(monthStr, monthlyChartMap.get(monthStr) + (p.amount / 100));
    }
  });

  const monthlyChartData = Array.from(monthlyChartMap, ([month, revenue]) => ({ month, revenue }));

  return {
    currentPeriodRevenue: currentRevenue,
    previousPeriodRevenue: previousRevenue,
    yearRevenue,
    averageBookingValue,
    revenueGrowth,
    refundAmount,
    paidAmount,
    pendingPaymentsAmount,
    monthlyChartData
  };
};

export const getBookingAnalytics = async (hostId, filters, pagination) => {
  const { status, property, dateFrom, dateTo } = filters;
  
  let where = { hostId };
  if (status) where.status = status;
  if (property) where.propertyId = property;
  if (dateFrom && dateTo) {
    where.createdAt = { gte: new Date(dateFrom), lte: new Date(dateTo) };
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const [
    todaysBookings,
    statusAggr,
    overallAggr
  ] = await Promise.all([
    prisma.booking.count({
      where: { hostId, createdAt: { gte: todayStart, lte: todayEnd } }
    }),
    prisma.booking.groupBy({
      by: ['status'],
      where: { hostId },
      _count: { id: true }
    }),
    prisma.booking.aggregate({
      where: { hostId, status: { in: ['Completed', 'Confirmed'] } },
      _avg: { nights: true, guestsCount: true },
      _count: { id: true }
    })
  ]);

  let upcomingBookings = 0, completedBookings = 0, cancelledBookings = 0, pendingBookings = 0, totalBookings = 0;
  statusAggr.forEach(s => {
    totalBookings += s._count.id;
    if (s.status === 'Confirmed') upcomingBookings += s._count.id;
    if (s.status === 'Completed') completedBookings += s._count.id;
    if (s.status === 'Cancelled') cancelledBookings += s._count.id;
    if (s.status === 'Pending') pendingBookings += s._count.id;
  });

  const averageStay = overallAggr._avg.nights || 0;
  const averageGuests = overallAggr._avg.guestsCount || 0;
  
  const bookingConversion = totalBookings > 0 ? ((completedBookings + upcomingBookings) / totalBookings) * 100 : 0;
  
  // Growth comparing this month vs last month bookings
  const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const prevMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
  const prevMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth(), 0);

  const [currentMonthBookings, prevMonthBookings] = await Promise.all([
    prisma.booking.count({ where: { hostId, createdAt: { gte: currentMonthStart } } }),
    prisma.booking.count({ where: { hostId, createdAt: { gte: prevMonthStart, lte: prevMonthEnd } } })
  ]);

  let bookingGrowth = 0;
  if (prevMonthBookings > 0) {
    bookingGrowth = ((currentMonthBookings - prevMonthBookings) / prevMonthBookings) * 100;
  } else if (currentMonthBookings > 0) {
    bookingGrowth = 100;
  }

  // Fetch paginated bookings if needed (as detailed list)
  let detailedBookings = [];
  if (pagination) {
    const { page = 1, limit = 10, sort } = pagination;
    const skip = (page - 1) * limit;
    let orderBy = { createdAt: 'desc' };
    
    if (sort) {
      const field = sort.replace('-', '');
      const direction = sort.startsWith('-') ? 'desc' : 'asc';
      orderBy = { [field]: direction };
    }

    detailedBookings = await prisma.booking.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        property: { select: { title: true } },
        guest: { select: { name: true, email: true } }
      }
    });
  }

  return {
    summary: {
      todaysBookings,
      upcomingBookings,
      completedBookings,
      cancelledBookings,
      pendingBookings,
      averageStay,
      averageGuests,
      bookingConversion,
      bookingGrowth
    },
    data: detailedBookings
  };
};

export const getPropertyAnalytics = async (hostId, filters, pagination) => {
  const { category, city, status } = filters;
  
  let where = { hostId };
  if (category) where.category = category;
  if (city) where.city = city;
  if (status) where.status = status;

  const [
    categoryAggr,
    cityAggr
  ] = await Promise.all([
    prisma.property.groupBy({
      by: ['category'],
      where: { hostId },
      _count: { id: true }
    }),
    prisma.property.groupBy({
      by: ['city'],
      where: { hostId },
      _count: { id: true }
    })
  ]);

  const propertyCountByCategory = categoryAggr.map(c => ({ category: c.category, count: c._count.id }));
  const propertyCountByCity = cityAggr.map(c => ({ city: c.city, count: c._count.id }));

  // Get properties ordered by different metrics
  const topRatedProperties = await prisma.property.findMany({
    where: { hostId },
    orderBy: { averageRating: 'desc' },
    take: 5,
    select: { id: true, title: true, averageRating: true, totalReviews: true }
  });

  const mostBookedProperties = await prisma.property.findMany({
    where: { hostId },
    orderBy: { totalBookings: 'desc' },
    take: 5,
    select: { id: true, title: true, totalBookings: true }
  });

  // Since revenue isn't stored directly on property, we can fetch all properties and aggregate payments
  const properties = await prisma.property.findMany({
    where: { hostId },
    select: { id: true, title: true, status: true, category: true, city: true }
  });

  const propertyRevenues = await Promise.all(properties.map(async (p) => {
    const rev = await prisma.payment.aggregate({
      where: { propertyId: p.id, status: 'Paid' },
      _sum: { amount: true }
    });
    return {
      ...p,
      revenue: (rev._sum.amount || 0) / 100
    };
  }));

  propertyRevenues.sort((a, b) => b.revenue - a.revenue);
  const highestRevenueProperties = propertyRevenues.slice(0, 5);
  const lowestPerformingProperties = propertyRevenues.slice(-5).reverse();

  // Paginated List
  let paginatedProperties = [];
  if (pagination) {
    const { page = 1, limit = 10, sort } = pagination;
    const skip = (page - 1) * limit;
    let orderBy = { createdAt: 'desc' };
    
    if (sort) {
      const field = sort.replace('-', '');
      const direction = sort.startsWith('-') ? 'desc' : 'asc';
      orderBy = { [field]: direction };
    }

    paginatedProperties = await prisma.property.findMany({
      where,
      skip,
      take: limit,
      orderBy,
    });
  }

  return {
    summary: {
      topRatedProperties,
      mostBookedProperties,
      highestRevenueProperties,
      lowestPerformingProperties,
      propertyCountByCategory,
      propertyCountByCity
    },
    data: paginatedProperties
  };
};

export const getRecentActivity = async (hostId, limit = 10) => {
  const [bookings, payments, reviews, properties] = await Promise.all([
    prisma.booking.findMany({
      where: { hostId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: { id: true, createdAt: true, status: true, property: { select: { title: true } }, guest: { select: { name: true } } }
    }),
    prisma.payment.findMany({
      where: { hostId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: { id: true, createdAt: true, status: true, amount: true, property: { select: { title: true } } }
    }),
    prisma.review.findMany({
      where: { property: { hostId } },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: { id: true, createdAt: true, rating: true, property: { select: { title: true } }, guest: { select: { name: true } } }
    }),
    prisma.property.findMany({
      where: { hostId },
      orderBy: { updatedAt: 'desc' }, // covers created and updated
      take: limit,
      select: { id: true, updatedAt: true, createdAt: true, title: true, status: true }
    })
  ]);

  let activities = [];

  bookings.forEach(b => activities.push({
    type: 'Booking',
    id: b.id,
    date: b.createdAt,
    description: `Booking ${b.status} for ${b.property.title} by ${b.guest.name}`
  }));

  payments.forEach(p => activities.push({
    type: 'Payment',
    id: p.id,
    date: p.createdAt,
    description: `Payment ${p.status} of ₹${p.amount / 100} for ${p.property.title}`
  }));

  reviews.forEach(r => activities.push({
    type: 'Review',
    id: r.id,
    date: r.createdAt,
    description: `New ${r.rating}-star review for ${r.property.title} by ${r.guest.name}`
  }));

  properties.forEach(p => {
    if (p.createdAt.getTime() === p.updatedAt.getTime()) {
      activities.push({
        type: 'Property',
        id: p.id,
        date: p.createdAt,
        description: `Property created: ${p.title} (${p.status})`
      });
    } else {
      activities.push({
        type: 'Property',
        id: p.id,
        date: p.updatedAt,
        description: `Property updated: ${p.title} (${p.status})`
      });
    }
  });

  // Sort all activities by date descending and take top limit
  activities.sort((a, b) => b.date.getTime() - a.date.getTime());
  return activities.slice(0, limit);
};
