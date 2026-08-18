import prisma from '../config/prisma.js';
import cloudinary from '../config/cloudinary.js';

// ==========================================
// BLOG CATEGORIES
// ==========================================
export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.blogCategory.findMany({
      orderBy: { name: 'asc' }
    });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve categories' });
  }
};

export const createCategory = async (req, res) => {
  try {
    let { name, slug } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Category name is required' });
    
    if (!slug) slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const category = await prisma.blogCategory.create({
      data: { name, slug }
    });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'Category name or slug already exists' });
    }
    res.status(500).json({ success: false, message: 'Failed to create category' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.blogCategory.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete category' });
  }
};

// ==========================================
// BLOG POSTS
// ==========================================
export const getPosts = async (req, res) => {
  try {
    const posts = await prisma.blogPost.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ success: true, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve posts' });
  }
};

export const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: { category: true }
    });
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve post' });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, slug, content, image, status, isFeatured, metaTitle, metaDescription, author, categoryId, shortSummary, publishDate, metaKeywords, schemaMarkup, details } = req.body;
    
    if (!title || !content) return res.status(400).json({ success: false, message: 'Title and content are required' });
    if (!slug) slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const post = await prisma.blogPost.create({
      data: {
        title, slug, content, image, status, isFeatured, metaTitle, metaDescription, author,
        categoryId: categoryId || null,
        shortSummary: shortSummary || null,
        publishDate: publishDate ? new Date(publishDate) : null,
        metaKeywords: metaKeywords || null,
        schemaMarkup: schemaMarkup || null,
        details: details ? (typeof details === 'string' ? JSON.parse(details) : details) : null,
      }
    });
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'Slug already exists' });
    }
    console.error("Create Post Error:", error);
    res.status(500).json({ success: false, message: 'Failed to create post', error: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, content, image, status, isFeatured, metaTitle, metaDescription, author, categoryId, shortSummary, publishDate, metaKeywords, schemaMarkup, details } = req.body;

    const post = await prisma.blogPost.update({
      where: { id },
      data: { 
        title, slug, content, image, status, isFeatured, metaTitle, metaDescription, author, 
        categoryId: categoryId || null,
        shortSummary: shortSummary || null,
        publishDate: publishDate ? new Date(publishDate) : null,
        metaKeywords: metaKeywords || null,
        schemaMarkup: schemaMarkup || null,
        details: details ? (typeof details === 'string' ? JSON.parse(details) : details) : null,
      }
    });
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'Slug already exists' });
    }
    res.status(500).json({ success: false, message: 'Failed to update post' });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.blogPost.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete post' });
  }
};

// ==========================================
// IMAGE UPLOAD (For Thumbnail)
// ==========================================
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image uploaded' });
    }
    const file = req.file;

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'stayr/blogs' },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );
      stream.end(file.buffer);
    });

    res.status(200).json({ success: true, url: result.secure_url });
  } catch (error) {
    console.error("Image Upload Error:", error);
    res.status(500).json({ success: false, message: 'Failed to save image' });
  }
};
