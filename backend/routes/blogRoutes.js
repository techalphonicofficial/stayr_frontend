import express from 'express';
import * as blogController from '../controllers/blogController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Apply auth middleware to all blog routes
router.use(protect);
router.use(authorize('Admin'));

// Categories
router.route('/categories')
  .get(blogController.getCategories)
  .post(blogController.createCategory);

router.delete('/categories/:id', blogController.deleteCategory);

// Image Upload
router.post('/upload', upload.single('image'), blogController.uploadImage);

// Posts
router.route('/posts')
  .get(blogController.getPosts)
  .post(blogController.createPost);

router.route('/posts/:id')
  .get(blogController.getPost)
  .put(blogController.updatePost)
  .delete(blogController.deletePost);

export default router;
