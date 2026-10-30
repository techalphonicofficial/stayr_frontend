import prisma from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import slugify from 'slugify';
import cloudinary from '../config/cloudinary.js';
import {
  pickSaleFields,
  validateForSubmission,
  toPublicListing,
  pricePerSqFt,
  SALE_PROPERTY_TYPES,
  NON_RESIDENTIAL_LAYOUT_TYPES,
} from '../utils/saleListingFields.js';

const MAX_IMAGES = 15;

const generateSlug = (title) => {
  const base = slugify(title || 'property-for-sale', { lower: true, strict: true, trim: true }).slice(0, 80);
  return `${base || 'property-for-sale'}-${Date.now().toString(36)}`;
};

const isOwnerOrAdmin = (listing, user) => !!user && (listing.sellerId === user.id || user.role === 'Admin');

const publicSellerSelect = { id: true, name: true, profileImage: true, isVerified: true, createdAt: true };

const loadOwned = async (id, user, res, include = { images: true }) => {
  const listing = await prisma.saleListing.findUnique({ where: { id }, include });
  if (!listing) {
    res.status(404);
    throw new Error('Sale listing not found');
  }
  if (!isOwnerOrAdmin(listing, user)) {
    res.status(403);
    throw new Error('Not authorized to modify this listing');
  }
  return listing;
};

// ============================================================================
// PUBLIC
// ============================================================================

// @route GET /api/sale-listings
export const getSaleListings = asyncHandler(async (req, res) => {
  const q = req.query;
  const page = Math.max(1, parseInt(q.page, 10) || 1);
  const limit = Math.max(1, Math.min(48, parseInt(q.limit, 10) || 12));
  const skip = (page - 1) * limit;

  // Only approved + published listings are ever public. Sold / withdrawn are excluded.
  const where = { isApproved: true, status: 'Published' };
  const and = [];

  if (['Residential', 'Commercial'].includes(q.category)) where.category = q.category;
  if (q.propertyType) where.propertyType = String(q.propertyType);

  if (q.city) {
    const rawCity = String(q.city).trim();
    const terms = rawCity.split(/[\/,]/).map((t) => t.replace(/^(the)\s+/i, '').trim()).filter(Boolean);
    const orCityConditions = [
      { city: { contains: rawCity } },
      { locality: { contains: rawCity } },
      { state: { contains: rawCity } }
    ];

    terms.forEach((term) => {
      if (term.length >= 3) {
        orCityConditions.push(
          { city: { contains: term } },
          { locality: { contains: term } },
          { state: { contains: term } }
        );
      }
    });

    and.push({ OR: orCityConditions });
  }

  const num = (v) => (v !== undefined && v !== '' && Number.isFinite(parseFloat(v)) ? parseFloat(v) : undefined);
  const minPrice = num(q.minPrice), maxPrice = num(q.maxPrice);
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }
  const minArea = num(q.minArea), maxArea = num(q.maxArea);
  if (minArea !== undefined || maxArea !== undefined) {
    where.area = {};
    if (minArea !== undefined) where.area.gte = minArea;
    if (maxArea !== undefined) where.area.lte = maxArea;
    // Comparing areas only makes sense in one unit
    where.areaUnit = q.areaUnit || 'sq ft';
  }

  if (q.bedrooms) {
    const beds = parseInt(q.bedrooms, 10);
    if (Number.isFinite(beds)) where.bedrooms = beds >= 4 ? { gte: 4 } : beds;
  }
  if (q.furnishingStatus) where.furnishingStatus = String(q.furnishingStatus);
  if (q.possessionStatus) where.possessionStatus = String(q.possessionStatus);
  if (q.propertyAge) where.propertyAge = String(q.propertyAge);
  if (q.isVerified === 'true') where.isVerified = true;

  if (q.lifestyle) {
    const life = String(q.lifestyle).trim();
    and.push({
      OR: [
        { title: { contains: life } },
        { description: { contains: life } },
        { propertyType: { contains: life } },
        { locality: { contains: life } },
        { city: { contains: life } },
      ],
    });
  }

  if (q.development === 'true' || q.isNewDevelopment === 'true') {
    and.push({
      OR: [
        { possessionStatus: 'Under Construction' },
        { propertyAge: '0-1 Years' },
        { title: { contains: 'Project' } },
        { title: { contains: 'Phase' } },
        { description: { contains: 'Development' } },
      ],
    });
  }

  if (q.search) {
    const s = String(q.search).trim();
    and.push({
      OR: [
        { title: { contains: s } },
        { city: { contains: s } },
        { locality: { contains: s } },
        { propertyType: { contains: s } },
      ],
    });
  }
  if (and.length) where.AND = and;

  const sortMap = {
    price_asc: { price: 'asc' },
    price_desc: { price: 'desc' },
    area_asc: { area: 'asc' },
    area_desc: { area: 'desc' },
    newest: { createdAt: 'desc' },
  };
  const orderBy = sortMap[q.sort] || sortMap.newest;

  const [total, listings] = await Promise.all([
    prisma.saleListing.count({ where }),
    prisma.saleListing.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        seller: { select: publicSellerSelect },
        images: { orderBy: { sortOrder: 'asc' }, take: 1 },
      },
    }),
  ]);

  let savedIds = new Set();
  if (req.user && listings.length) {
    const saved = await prisma.savedSaleListing.findMany({
      where: { userId: req.user.id, saleListingId: { in: listings.map((l) => l.id) } },
      select: { saleListingId: true },
    });
    savedIds = new Set(saved.map((s) => s.saleListingId));
  }

  res.status(200).json({
    success: true,
    count: listings.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    data: listings.map((l) => ({ ...toPublicListing(l), isSaved: savedIds.has(l.id), pricePerSqFt: pricePerSqFt(l) })),
  });
});

// @route GET /api/sale-listings/meta/property-types
export const getSaleMeta = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: { propertyTypes: SALE_PROPERTY_TYPES, nonResidentialTypes: NON_RESIDENTIAL_LAYOUT_TYPES } });
});

// @route GET /api/sale-listings/:slugOrId
export const getSaleListingBySlugOrId = asyncHandler(async (req, res) => {
  const { slugOrId } = req.params;
  const listing = await prisma.saleListing.findFirst({
    where: { OR: [{ id: slugOrId }, { slug: slugOrId }] },
    include: {
      seller: { select: publicSellerSelect },
      images: { orderBy: { sortOrder: 'asc' } },
    },
  });

  if (!listing) {
    res.status(404);
    throw new Error('Sale listing not found');
  }

  const owner = isOwnerOrAdmin(listing, req.user);
  const isPublic = listing.isApproved && listing.status === 'Published';
  // Sold listings stay reachable by URL (marked as sold) but never appear in search.
  if (!isPublic && !owner && listing.status !== 'Sold') {
    res.status(404);
    throw new Error('Sale listing not found');
  }

  if (isPublic && !owner) {
    prisma.saleListing.update({ where: { id: listing.id }, data: { viewsCount: { increment: 1 } } }).catch(() => {});
  }

  let isSaved = false;
  if (req.user) {
    const saved = await prisma.savedSaleListing.findUnique({
      where: { userId_saleListingId: { userId: req.user.id, saleListingId: listing.id } },
    });
    isSaved = !!saved;
  }

  res.status(200).json({
    success: true,
    data: { ...(owner ? listing : toPublicListing(listing)), isOwner: owner, isSaved, pricePerSqFt: pricePerSqFt(listing) },
  });
});

// ============================================================================
// SELLER
// ============================================================================

// @route POST /api/sale-listings/draft
export const createSaleListingDraft = asyncHandler(async (req, res) => {
  const data = pickSaleFields(req.body);
  const title = data.title || 'Untitled sale listing';

  const listing = await prisma.saleListing.create({
    data: {
      title,
      description: '',
      propertyType: '',
      address: '',
      city: '',
      state: '',
      price: 0,
      area: 0,
      ...data,
      slug: generateSlug(title),
      sellerId: req.user.id,
      status: 'Draft',
      isApproved: false,
      isVerified: false,
    },
    include: { images: true },
  });

  res.status(201).json({ success: true, data: listing });
});

// @route PUT /api/sale-listings/:id/draft
export const updateSaleListingDraft = asyncHandler(async (req, res) => {
  const existing = await loadOwned(req.params.id, req.user, res);

  if (existing.status === 'Sold') {
    res.status(400);
    throw new Error('Sold listings cannot be edited');
  }

  const data = pickSaleFields(req.body);
  if (data.title && data.title !== existing.title) data.slug = generateSlug(data.title);

  // Editing a live / reviewed listing sends it back through moderation.
  // Verification is also reset because the verified facts may have changed.
  if (['Published', 'PendingReview'].includes(existing.status) && req.user.role !== 'Admin') {
    data.status = 'PendingReview';
    data.isApproved = false;
    data.isVerified = false;
  }

  const updated = await prisma.saleListing.update({
    where: { id: existing.id },
    data,
    include: { images: { orderBy: { sortOrder: 'asc' } } },
  });

  res.status(200).json({ success: true, data: updated });
});

// @route POST /api/sale-listings/:id/submit-for-review
export const submitSaleListingForReview = asyncHandler(async (req, res) => {
  const listing = await loadOwned(req.params.id, req.user, res, { images: { orderBy: { sortOrder: 'asc' } } });

  if (!['Draft', 'ChangesRequested', 'Rejected', 'Withdrawn'].includes(listing.status)) {
    res.status(400);
    throw new Error(`A listing in status "${listing.status}" cannot be submitted for review`);
  }

  if (req.body?.confirmAccuracy === false) {
    res.status(400);
    throw new Error('Please confirm the listing is accurate and that you are authorised to advertise this property');
  }

  const errors = validateForSubmission(listing);
  if (errors.length) {
    return res.status(400).json({ success: false, message: 'Please complete all required fields before submitting', errors });
  }

  const updated = await prisma.saleListing.update({
    where: { id: listing.id },
    data: {
      status: 'PendingReview',
      isApproved: false,
      rejectionReason: null,
      featuredImage: listing.featuredImage || listing.images[0]?.url || null,
    },
    include: { images: { orderBy: { sortOrder: 'asc' } } },
  });

  res.status(200).json({
    success: true,
    message: 'Listing submitted for review. It becomes visible to buyers once an administrator approves it.',
    data: updated,
  });
});

// @route GET /api/sale-listings/seller/my-listings
export const getMySaleListings = asyncHandler(async (req, res) => {
  const sellerId = req.user.id;
  const where = { sellerId };
  if (req.query.status && req.query.status !== 'All') where.status = req.query.status;

  const [listings, grouped] = await Promise.all([
    prisma.saleListing.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        images: { orderBy: { sortOrder: 'asc' }, take: 1 },
        _count: { select: { inquiries: true, savedBy: true } },
      },
    }),
    prisma.saleListing.groupBy({ by: ['status'], where: { sellerId }, _count: { id: true } }),
  ]);

  const counts = { All: 0, Draft: 0, PendingReview: 0, Published: 0, ChangesRequested: 0, Rejected: 0, Sold: 0, Withdrawn: 0 };
  grouped.forEach((g) => {
    counts[g.status] = g._count.id;
    counts.All += g._count.id;
  });

  res.status(200).json({ success: true, counts, data: listings });
});

// @route GET /api/sale-listings/manage/:id   (owner/admin full record for editing)
export const getManageSaleListing = asyncHandler(async (req, res) => {
  const listing = await loadOwned(req.params.id, req.user, res, { images: { orderBy: { sortOrder: 'asc' } } });
  res.status(200).json({ success: true, data: listing });
});

// @route PUT /api/sale-listings/:id/toggle-status  body: { action: sold | withdraw | relist }
export const toggleSaleListingStatus = asyncHandler(async (req, res) => {
  const listing = await loadOwned(req.params.id, req.user, res);
  const { action } = req.body || {};
  const normAction = String(action || '').toLowerCase().trim();
  let status;

  if (['sold', 'mark_sold', 'mark-sold'].includes(normAction)) {
    if (listing.status === 'Sold') {
      res.status(400);
      throw new Error('Listing is already marked as sold');
    }
    status = 'Sold';
  } else if (['withdraw', 'withdrawn', 'unpublish'].includes(normAction)) {
    if (['Sold', 'Withdrawn'].includes(listing.status)) {
      res.status(400);
      throw new Error(`Listing is already ${listing.status.toLowerCase()}`);
    }
    status = 'Withdrawn';
  } else if (['relist', 'publish', 're-publish', 'republish'].includes(normAction)) {
    if (listing.status !== 'Withdrawn' && listing.status !== 'Draft') {
      res.status(400);
      throw new Error('Only withdrawn or draft listings can be published');
    }
    // Re-publish only if it was previously approved; otherwise go back to review.
    status = listing.isApproved ? 'Published' : 'PendingReview';
  } else {
    res.status(400);
    throw new Error('Invalid action. Use "sold", "withdraw" or "relist".');
  }

  const updated = await prisma.saleListing.update({ where: { id: listing.id }, data: { status } });
  res.status(200).json({ success: true, message: `Listing status updated to ${status}`, data: updated });
});

// @route POST /api/sale-listings/:id/images
export const uploadSaleListingImages = asyncHandler(async (req, res) => {
  const listing = await loadOwned(req.params.id, req.user, res);

  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('Please upload at least one image file');
  }
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (req.files.some((f) => !allowed.includes(f.mimetype))) {
    res.status(400);
    throw new Error('Only JPG, PNG and WEBP images are allowed');
  }
  if (listing.images.length + req.files.length > MAX_IMAGES) {
    res.status(400);
    throw new Error(`Maximum ${MAX_IMAGES} images allowed. You can add ${MAX_IMAGES - listing.images.length} more.`);
  }

  // Upload each file; only successful uploads are persisted.
  const results = await Promise.allSettled(
    req.files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: `stayr/sale-listings/${listing.id}` },
            (error, result) => (result ? resolve({ url: result.secure_url, publicId: result.public_id }) : reject(error))
          );
          stream.end(file.buffer);
        })
    )
  );
  const uploaded = results.filter((r) => r.status === 'fulfilled').map((r) => r.value);
  const failedCount = results.length - uploaded.length;

  if (!uploaded.length) {
    res.status(502);
    throw new Error('Image upload failed. Please try again.');
  }

  const start = listing.images.length;
  const created = await prisma.$transaction(async (tx) => {
    const rows = [];
    for (let i = 0; i < uploaded.length; i++) {
      rows.push(
        await tx.saleListingImage.create({
          data: {
            saleListingId: listing.id,
            url: uploaded[i].url,
            publicId: uploaded[i].publicId,
            sortOrder: start + i,
            isPrimary: start === 0 && i === 0,
          },
        })
      );
    }
    if (!listing.featuredImage) {
      await tx.saleListing.update({ where: { id: listing.id }, data: { featuredImage: uploaded[0].url } });
    }
    return rows;
  });

  res.status(201).json({
    success: true,
    data: created,
    message: failedCount ? `${failedCount} image(s) failed to upload and were not saved.` : undefined,
  });
});

// @route DELETE /api/sale-listings/:id/images/:imageId
export const deleteSaleListingImage = asyncHandler(async (req, res) => {
  const listing = await loadOwned(req.params.id, req.user, res);
  const img = listing.images.find((i) => i.id === req.params.imageId);
  if (!img) {
    res.status(404);
    throw new Error('Image not found');
  }

  if (img.publicId) {
    try {
      await cloudinary.uploader.destroy(img.publicId);
    } catch (e) {
      console.warn('Cloudinary delete warning:', e.message);
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.saleListingImage.delete({ where: { id: img.id } });
    if (listing.featuredImage === img.url) {
      const next = listing.images.filter((i) => i.id !== img.id).sort((a, b) => a.sortOrder - b.sortOrder)[0];
      await tx.saleListing.update({ where: { id: listing.id }, data: { featuredImage: next ? next.url : null } });
      if (next) await tx.saleListingImage.update({ where: { id: next.id }, data: { isPrimary: true } });
    }
  });

  res.status(200).json({ success: true, message: 'Image deleted' });
});

// @route PUT /api/sale-listings/:id/featured-image  body: { imageId }
export const setSaleListingFeaturedImage = asyncHandler(async (req, res) => {
  const listing = await loadOwned(req.params.id, req.user, res);
  const target = listing.images.find((i) => i.id === req.body?.imageId);
  if (!target) {
    res.status(404);
    throw new Error('Image not found');
  }

  await prisma.$transaction([
    prisma.saleListingImage.updateMany({ where: { saleListingId: listing.id }, data: { isPrimary: false } }),
    prisma.saleListingImage.update({ where: { id: target.id }, data: { isPrimary: true } }),
    prisma.saleListing.update({ where: { id: listing.id }, data: { featuredImage: target.url } }),
  ]);

  res.status(200).json({ success: true, data: { featuredImage: target.url } });
});

// @route PUT /api/sale-listings/:id/images/reorder  body: { imageIds: [] }
export const reorderSaleListingImages = asyncHandler(async (req, res) => {
  const listing = await loadOwned(req.params.id, req.user, res);
  const ids = Array.isArray(req.body?.imageIds) ? req.body.imageIds : [];
  const owned = new Set(listing.images.map((i) => i.id));
  if (ids.length !== owned.size || ids.some((id) => !owned.has(id))) {
    res.status(400);
    throw new Error('imageIds must contain every image of this listing exactly once');
  }

  await prisma.$transaction(ids.map((id, idx) => prisma.saleListingImage.update({ where: { id }, data: { sortOrder: idx } })));
  const images = await prisma.saleListingImage.findMany({ where: { saleListingId: listing.id }, orderBy: { sortOrder: 'asc' } });
  res.status(200).json({ success: true, data: images });
});

// @route DELETE /api/sale-listings/:id
export const deleteSaleListing = asyncHandler(async (req, res) => {
  const listing = await loadOwned(req.params.id, req.user, res);
  if (listing.status !== 'Draft' && req.user.role !== 'Admin') {
    res.status(400);
    throw new Error('Only drafts can be deleted. Withdraw the listing instead.');
  }
  for (const img of listing.images) {
    if (img.publicId) {
      try {
        await cloudinary.uploader.destroy(img.publicId);
      } catch (e) {
        /* ignore */
      }
    }
  }
  await prisma.saleListing.delete({ where: { id: listing.id } });
  res.status(200).json({ success: true, message: 'Listing deleted' });
});
