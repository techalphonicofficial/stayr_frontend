import prisma from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Upload CMS page image
// @route   POST /api/admin/pages/upload
// @access  Private/Admin
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No image provided');
  }

  const streamUpload = (req) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'stayr/pages' },
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

    res.status(200).json({ 
      success: true, 
      message: 'Image uploaded',
      data: {
        url: result.secure_url,
        publicId: result.public_id
      }
    });
  } catch (error) {
    res.status(500);
    throw new Error(`Cloudinary authentication failed: ${error.message || 'Unknown error'}`);
  }
});

// @desc    Get all CMS pages
// @route   GET /api/admin/pages
// @access  Private/Admin
export const getPages = asyncHandler(async (req, res) => {
  const { search = '', status, page = 1, limit = 10 } = req.query;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const where = {
    deletedAt: null,
  };

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { slug: { contains: search } },
    ];
  }

  if (status) {
    where.status = status;
  }

  const [total, pages] = await prisma.$transaction([
    prisma.cmsPage.count({ where }),
    prisma.cmsPage.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  res.status(200).json({
    success: true,
    data: pages,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  });
});

// @desc    Get single CMS page by ID
// @route   GET /api/admin/pages/:id
// @access  Private/Admin
export const getPageById = asyncHandler(async (req, res) => {
  const page = await prisma.cmsPage.findFirst({
    where: {
      id: req.params.id,
      deletedAt: null,
    },
  });

  if (!page) {
    res.status(404);
    throw new Error('Page not found');
  }

  res.status(200).json({
    success: true,
    data: page,
  });
});

// @desc    Create new CMS page
// @route   POST /api/admin/pages
// @access  Private/Admin
export const createPage = asyncHandler(async (req, res) => {
  const { 
    title, slug, description, pageType, content, 
    seoTitle, seoDescription, seoKeywords, 
    canonicalUrl, robots, ogTitle, ogDescription, ogImage, twitterTitle, twitterDescription, jsonLd,
    status, featuredImage 
  } = req.body;

  // Check if slug exists
  const existing = await prisma.cmsPage.findFirst({
    where: { slug },
  });

  if (existing) {
    res.status(400);
    throw new Error('Slug already exists');
  }

  const newPage = await prisma.cmsPage.create({
    data: {
      title,
      slug,
      description,
      pageType: pageType || 'standard',
      content: content || [],
      seoTitle, seoDescription, seoKeywords, 
      canonicalUrl, robots, ogTitle, ogDescription, ogImage, twitterTitle, twitterDescription, jsonLd,
      status: status || 'Draft',
      isPublished: status === 'Published',
      featuredImage,
      createdBy: req.user.id,
    },
  });

  res.status(201).json({
    success: true,
    data: newPage,
  });
});

// @desc    Update CMS page
// @route   PUT /api/admin/pages/:id
// @access  Private/Admin
export const updatePage = asyncHandler(async (req, res) => {
  const { 
    title, slug, description, pageType, content, 
    seoTitle, seoDescription, seoKeywords, 
    canonicalUrl, robots, ogTitle, ogDescription, ogImage, twitterTitle, twitterDescription, jsonLd,
    status, featuredImage 
  } = req.body;

  const page = await prisma.cmsPage.findFirst({
    where: { id: req.params.id, deletedAt: null },
  });

  if (!page) {
    res.status(404);
    throw new Error('Page not found');
  }

  // If slug is changed, verify it doesn't clash
  if (slug && slug !== page.slug) {
    const slugExists = await prisma.cmsPage.findFirst({
      where: { slug },
    });
    if (slugExists) {
      res.status(400);
      throw new Error('Slug already exists');
    }
  }

  const updatedPage = await prisma.cmsPage.update({
    where: { id: req.params.id },
    data: {
      title,
      slug,
      description,
      pageType,
      content,
      seoTitle, seoDescription, seoKeywords, 
      canonicalUrl, robots, ogTitle, ogDescription, ogImage, twitterTitle, twitterDescription, jsonLd,
      status,
      isPublished: status === 'Published',
      featuredImage,
      updatedBy: req.user.id,
    },
  });

  res.status(200).json({
    success: true,
    data: updatedPage,
  });
});

// @desc    Soft delete CMS page
// @route   DELETE /api/admin/pages/:id
// @access  Private/Admin
export const deletePage = asyncHandler(async (req, res) => {
  const page = await prisma.cmsPage.findFirst({
    where: { id: req.params.id, deletedAt: null },
  });

  if (!page) {
    res.status(404);
    throw new Error('Page not found');
  }

  await prisma.cmsPage.update({
    where: { id: req.params.id },
    data: { deletedAt: new Date() },
  });

  res.status(200).json({
    success: true,
    message: 'Page deleted successfully',
  });
});

// @desc    Update CMS page status
// @route   PATCH /api/admin/pages/:id/status
// @access  Private/Admin
export const updatePageStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const page = await prisma.cmsPage.findFirst({
    where: { id: req.params.id, deletedAt: null },
  });

  if (!page) {
    res.status(404);
    throw new Error('Page not found');
  }

  const updatedPage = await prisma.cmsPage.update({
    where: { id: req.params.id },
    data: { 
      status,
      isPublished: status === 'Published',
      updatedBy: req.user.id,
    },
  });

  res.status(200).json({
    success: true,
    data: updatedPage,
  });
});
