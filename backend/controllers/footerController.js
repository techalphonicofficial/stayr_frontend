import prisma from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import cloudinary from '../config/cloudinary.js';

// =====================================
// Footer Settings
// =====================================

// @desc    Get complete footer settings (admin)
// @route   GET /api/admin/footer
// @access  Private/Admin
export const getFooterSettings = asyncHandler(async (req, res) => {
  let settings = await prisma.footerSetting.findFirst();
  if (!settings) {
    settings = await prisma.footerSetting.create({ data: {} });
  }

  const columns = await prisma.footerColumn.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      links: {
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  res.status(200).json({
    success: true,
    data: {
      settings,
      columns,
    },
  });
});

// @desc    Update basic footer settings
// @route   PUT /api/admin/footer
// @access  Private/Admin
export const updateFooterSettings = asyncHandler(async (req, res) => {
  const { copyright } = req.body;
  let settings = await prisma.footerSetting.findFirst();

  if (!settings) {
    settings = await prisma.footerSetting.create({ data: { copyright } });
  } else {
    settings = await prisma.footerSetting.update({
      where: { id: settings.id },
      data: { copyright },
    });
  }

  res.status(200).json({ success: true, data: settings });
});

// @desc    Upload footer logo (companyLogo, itsLogo, currencyLogo)
// @route   POST /api/admin/footer/logo
// @access  Private/Admin
export const uploadLogo = asyncHandler(async (req, res) => {
  const { type } = req.body; // 'companyLogo', 'itsLogo', or 'currencyLogo'

  if (!['companyLogo', 'itsLogo', 'currencyLogo'].includes(type)) {
    res.status(400);
    throw new Error('Invalid logo type');
  }

  if (!req.file) {
    res.status(400);
    throw new Error('No image provided');
  }

  const streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'stayr/footer' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });
  };

  try {
    const result = await streamUpload(req);

    let settings = await prisma.footerSetting.findFirst();
    if (!settings) {
      settings = await prisma.footerSetting.create({ data: { [type]: result.secure_url } });
    } else {
      settings = await prisma.footerSetting.update({
        where: { id: settings.id },
        data: { [type]: result.secure_url },
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Image uploaded',
      data: settings 
    });
  } catch (error) {
    res.status(500);
    throw new Error(`Cloudinary authentication failed: ${error.message || 'Unknown error'}`);
  }
});

// =====================================
// Footer Columns
// =====================================

// @desc    Create footer column
// @route   POST /api/admin/footer/columns
// @access  Private/Admin
export const createColumn = asyncHandler(async (req, res) => {
  const { title, sortOrder } = req.body;
  const column = await prisma.footerColumn.create({
    data: { title, sortOrder: sortOrder || 0 },
  });
  res.status(201).json({ success: true, data: column });
});

// @desc    Update footer column
// @route   PUT /api/admin/footer/columns/:id
// @access  Private/Admin
export const updateColumn = asyncHandler(async (req, res) => {
  const { title, sortOrder } = req.body;
  const column = await prisma.footerColumn.update({
    where: { id: req.params.id },
    data: { title, sortOrder },
  });
  res.status(200).json({ success: true, data: column });
});

// @desc    Delete footer column
// @route   DELETE /api/admin/footer/columns/:id
// @access  Private/Admin
export const deleteColumn = asyncHandler(async (req, res) => {
  await prisma.footerColumn.delete({
    where: { id: req.params.id },
  });
  res.status(200).json({ success: true, message: 'Column deleted' });
});

// =====================================
// Footer Links
// =====================================

// @desc    Create footer link
// @route   POST /api/admin/footer/links
// @access  Private/Admin
export const createLink = asyncHandler(async (req, res) => {
  const { columnId, title, url, icon, target, sortOrder, isActive } = req.body;
  const link = await prisma.footerLink.create({
    data: { columnId, title, url, icon, target, sortOrder: sortOrder || 0, isActive },
  });
  res.status(201).json({ success: true, data: link });
});

// @desc    Update footer link
// @route   PUT /api/admin/footer/links/:id
// @access  Private/Admin
export const updateLink = asyncHandler(async (req, res) => {
  const { title, url, icon, target, sortOrder, isActive } = req.body;
  const link = await prisma.footerLink.update({
    where: { id: req.params.id },
    data: { title, url, icon, target, sortOrder, isActive },
  });
  res.status(200).json({ success: true, data: link });
});

// @desc    Delete footer link
// @route   DELETE /api/admin/footer/links/:id
// @access  Private/Admin
export const deleteLink = asyncHandler(async (req, res) => {
  await prisma.footerLink.delete({
    where: { id: req.params.id },
  });
  res.status(200).json({ success: true, message: 'Link deleted' });
});

// @desc    Reorder columns or links
// @route   PATCH /api/admin/footer/reorder
// @access  Private/Admin
export const reorderItems = asyncHandler(async (req, res) => {
  const { type, items } = req.body; // type: 'column' or 'link', items: [{ id, sortOrder }]

  if (!items || !Array.isArray(items)) {
    res.status(400);
    throw new Error('Invalid items format');
  }

  if (type === 'column') {
    for (const item of items) {
      await prisma.footerColumn.update({
        where: { id: item.id },
        data: { sortOrder: item.sortOrder },
      });
    }
  } else if (type === 'link') {
    for (const item of items) {
      await prisma.footerLink.update({
        where: { id: item.id },
        data: { sortOrder: item.sortOrder, columnId: item.columnId }, // allowing changing columns
      });
    }
  } else {
    res.status(400);
    throw new Error('Invalid reorder type');
  }

  res.status(200).json({ success: true, message: 'Reordered successfully' });
});

// =====================================
// Public Endpoint
// =====================================

// @desc    Get complete footer settings (public)
// @route   GET /api/public/footer
// @access  Public
export const getPublicFooter = asyncHandler(async (req, res) => {
  const settings = await prisma.footerSetting.findFirst();
  const columns = await prisma.footerColumn.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      links: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
  });

  res.status(200).json({
    success: true,
    data: {
      settings,
      columns,
    },
  });
});
