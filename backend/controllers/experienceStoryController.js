import prisma from '../config/prisma.js';

// @desc    Get all experience stories
// @route   GET /api/experience-stories
// @access  Admin
export const getStories = async (req, res) => {
  try {
    const stories = await prisma.experienceStory.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: stories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get active experience story
// @route   GET /api/experience-stories/active
// @access  Public
export const getActiveStory = async (req, res) => {
  try {
    const story = await prisma.experienceStory.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' }
    });
    res.json({ success: true, data: story });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single experience story
// @route   GET /api/experience-stories/:id
// @access  Admin
export const getStoryById = async (req, res) => {
  try {
    const story = await prisma.experienceStory.findUnique({
      where: { id: req.params.id }
    });
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }
    res.json({ success: true, data: story });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create an experience story
// @route   POST /api/experience-stories
// @access  Admin
export const createStory = async (req, res) => {
  try {
    const { title, subtitle, description, price, currency, packageText, image, timeline, isActive } = req.body;
    
    // If setting this one to active, we might want to deactivate others, but keeping it simple for now
    if (isActive) {
      await prisma.experienceStory.updateMany({
        where: { isActive: true },
        data: { isActive: false }
      });
    }

    const story = await prisma.experienceStory.create({
      data: {
        title,
        subtitle,
        description,
        price: parseFloat(price),
        currency: currency || 'INR',
        packageText: packageText || 'Complete Package',
        image,
        timeline: timeline || [],
        isActive: Boolean(isActive)
      }
    });

    res.status(201).json({ success: true, data: story });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update an experience story
// @route   PUT /api/experience-stories/:id
// @access  Admin
export const updateStory = async (req, res) => {
  try {
    const { title, subtitle, description, price, currency, packageText, image, timeline, isActive } = req.body;

    if (isActive) {
      await prisma.experienceStory.updateMany({
        where: { isActive: true, id: { not: req.params.id } },
        data: { isActive: false }
      });
    }

    const story = await prisma.experienceStory.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title }),
        ...(subtitle !== undefined && { subtitle }),
        ...(description && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(currency && { currency }),
        ...(packageText && { packageText }),
        ...(image && { image }),
        ...(timeline && { timeline }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) })
      }
    });

    res.json({ success: true, data: story });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete an experience story
// @route   DELETE /api/experience-stories/:id
// @access  Admin
export const deleteStory = async (req, res) => {
  try {
    await prisma.experienceStory.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true, message: 'Story deleted' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
