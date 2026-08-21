import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import * as experienceStoryController from '../controllers/experienceStoryController.js';

const router = express.Router();

// Public route to get the active story
router.get('/active', experienceStoryController.getActiveStory);

// Admin routes
router.use(protect, authorize('Admin'));

router.route('/')
  .get(experienceStoryController.getStories)
  .post(experienceStoryController.createStory);

router.route('/:id')
  .get(experienceStoryController.getStoryById)
  .put(experienceStoryController.updateStory)
  .delete(experienceStoryController.deleteStory);

export default router;
