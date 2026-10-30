import prisma from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const INQUIRY_TYPES = ['General', 'Callback', 'Contact', 'Site Visit', 'Price Offer'];
const CONTACT_METHODS = ['Phone', 'Email', 'WhatsApp'];
const INQUIRY_STATUSES = ['New', 'Contacted', 'SiteVisitScheduled', 'Closed', 'Archived'];

// @desc    Submit a buyer inquiry for a published sale listing
// @route   POST /api/sale-inquiries
// @access  Public / Optional Auth
export const createInquiry = asyncHandler(async (req, res) => {
  const body = req.body || {};
  const saleListingId = body.saleListingId || body.listingId;
  const name = body.name;
  const email = body.email;
  const phone = body.phone;
  const message = body.message;
  const inquiryType = body.inquiryType || 'General';
  const preferredContactMethod = body.preferredContactMethod || (phone ? 'Phone' : 'Email');
  const consent = body.consent === true || body.consent === 'true' || body.consentShareContact === true || body.consentShareContact === 'true';

  if (!consent) {
    res.status(400);
    throw new Error('Please consent to sharing your contact details with the seller');
  }
  if (!saleListingId) {
    res.status(400);
    throw new Error('Sale listing ID is required');
  }
  if (!name || String(name).trim().length < 2) {
    res.status(400);
    throw new Error('Please provide your name');
  }
  const cleanPhone = String(phone || '').replace(/[\s-]/g, '');
  const cleanEmail = String(email || '').trim().toLowerCase();
  if (cleanPhone && !/^\+?\d{7,15}$/.test(cleanPhone)) {
    res.status(400);
    throw new Error('Please provide a valid phone number');
  }
  if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    res.status(400);
    throw new Error('Please provide a valid email address');
  }
  if (!cleanPhone && !cleanEmail) {
    res.status(400);
    throw new Error('Please provide a phone number or email address');
  }
  const contactMethod = CONTACT_METHODS.includes(preferredContactMethod) ? preferredContactMethod : (cleanPhone ? 'Phone' : 'Email');
  const type = INQUIRY_TYPES.includes(inquiryType) ? inquiryType : 'General';
  const text = String(message || '').trim();
  if (type !== 'Callback' && text.length < 3) {
    res.status(400);
    throw new Error('Please write a short message for the seller');
  }

  const listing = await prisma.saleListing.findUnique({
    where: { id: saleListingId },
    select: { id: true, title: true, sellerId: true, status: true, isApproved: true },
  });
  if (!listing || !listing.isApproved || listing.status !== 'Published') {
    res.status(404);
    throw new Error('This property is not available for inquiries');
  }

  const buyerId = req.user?.id || null;

  // Basic duplicate protection (30 seconds window)
  const recent = await prisma.saleInquiry.findFirst({
    where: {
      saleListingId: listing.id,
      inquiryType: type,
      OR: [
        ...(buyerId ? [{ buyerId }] : []),
        ...(cleanPhone ? [{ phone: cleanPhone }] : []),
        ...(cleanEmail ? [{ email: cleanEmail }] : [])
      ],
      createdAt: { gte: new Date(Date.now() - 30 * 1000) }
    },
  });
  if (recent) {
    res.status(429);
    throw new Error('You already contacted this seller a few moments ago. Please wait before sending another request.');
  }

  const inquiry = await prisma.$transaction(async (tx) => {
    const created = await tx.saleInquiry.create({
      data: {
        saleListingId: listing.id,
        sellerId: listing.sellerId,
        buyerId,
        name: String(name).trim().slice(0, 120),
        email: cleanEmail || `${cleanPhone}@phone.stayr.com`,
        phone: cleanPhone || 'Not provided',
        message: (text || 'Please call me back about this property.').slice(0, 2000),
        inquiryType: type,
        preferredContactMethod: contactMethod,
        status: 'New',
      },
    });
    await tx.saleListing.update({ where: { id: listing.id }, data: { inquiriesCount: { increment: 1 } } });
    await tx.notification.create({
      data: {
        recipientId: listing.sellerId,
        senderId: buyerId,
        type: 'SALE_INQUIRY_RECEIVED',
        title: type === 'Callback' ? 'Callback requested' : 'New buyer inquiry',
        message: `${created.name} sent a ${type.toLowerCase()} request about "${listing.title}".`,
        entityType: 'SaleListing',
        entityId: listing.id,
        metadata: { inquiryId: created.id },
      },
    }).catch(e => console.error('Failed to create inquiry notification', e));
    return created;
  });

  res.status(201).json({
    success: true,
    message: type === 'Callback' ? 'Callback request sent to the seller.' : 'Your inquiry was sent to the seller.',
    data: { id: inquiry.id, inquiryType: inquiry.inquiryType, createdAt: inquiry.createdAt },
  });
});

// @desc    Inquiries received by the logged-in seller
// @route   GET /api/sale-inquiries/seller
// @access  Private (seller sees only their own)
export const getMyReceivedInquiries = asyncHandler(async (req, res) => {
  const where = { sellerId: req.user.id };
  if (req.query.saleListingId) where.saleListingId = String(req.query.saleListingId);
  if (INQUIRY_STATUSES.includes(req.query.status)) where.status = req.query.status;

  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, Math.min(50, parseInt(req.query.limit, 10) || 20));

  const [total, inquiries] = await Promise.all([
    prisma.saleInquiry.count({ where }),
    prisma.saleInquiry.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { saleListing: { select: { id: true, title: true, slug: true, price: true, city: true, locality: true, featuredImage: true } } },
    }),
  ]);

  res.status(200).json({ success: true, total, page, limit, data: inquiries });
});

// @desc    Inquiries sent by the logged-in buyer (their own only)
// @route   GET /api/sale-inquiries/mine
export const getMySentInquiries = asyncHandler(async (req, res) => {
  const inquiries = await prisma.saleInquiry.findMany({
    where: { buyerId: req.user.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, inquiryType: true, status: true, message: true, createdAt: true,
      saleListing: { select: { id: true, title: true, slug: true, price: true, city: true, featuredImage: true } },
    },
  });
  res.status(200).json({ success: true, data: inquiries });
});

// @desc    Update inquiry status
// @route   PUT /api/sale-inquiries/:id/status
export const updateInquiryStatus = asyncHandler(async (req, res) => {
  const { status } = req.body || {};
  if (!INQUIRY_STATUSES.includes(status)) {
    res.status(400);
    throw new Error('Invalid status. Valid values: New, Contacted, Closed');
  }
  const inquiry = await prisma.saleInquiry.findUnique({ where: { id: req.params.id } });
  if (!inquiry) {
    res.status(404);
    throw new Error('Inquiry not found');
  }
  if (inquiry.sellerId !== req.user.id && req.user.role !== 'Admin') {
    res.status(403);
    throw new Error('Not authorized to update this inquiry');
  }
  const updated = await prisma.saleInquiry.update({ where: { id: inquiry.id }, data: { status } });
  res.status(200).json({ success: true, data: updated });
});

// @desc    Report a listing to administrators
// @route   POST /api/sale-inquiries/report
export const reportListing = asyncHandler(async (req, res) => {
  const targetListingId = req.params.listingId || req.body.saleListingId || req.body.listingId;
  const reason = req.body.reason || 'Other';
  const details = req.body.details || '';

  const listing = await prisma.saleListing.findUnique({
    where: { id: String(targetListingId || '') },
    select: { id: true },
  });
  if (!listing) {
    res.status(404);
    throw new Error('Listing not found');
  }

  const reporterId = req.user?.id || 'anonymous';
  const existing = await prisma.saleListingReport.findFirst({
    where: { saleListingId: listing.id, reporterId, status: 'Open' },
  });
  if (existing) {
    return res.status(200).json({ success: true, message: 'You have already reported this listing. Our team is reviewing it.' });
  }
  await prisma.saleListingReport.create({
    data: {
      saleListingId: listing.id,
      reporterId,
      reason,
      details: String(details || '').trim().slice(0, 1000) || null,
    },
  });
  res.status(201).json({ success: true, message: 'Thanks. Our team will review this listing.' });
});
