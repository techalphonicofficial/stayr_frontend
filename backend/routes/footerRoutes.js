import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import * as footerController from '../controllers/footerController.js';

const router = express.Router();

// All footer routes are protected and admin only
router.use(protect, authorize('Admin'));

// Footer Settings
router.route('/')
  .get(footerController.getFooterSettings)
  .put(footerController.updateFooterSettings);

// Logo Upload
router.post('/logo', upload.single('image'), footerController.uploadLogo);

// Columns
router.route('/columns')
  .post(footerController.createColumn);

router.route('/columns/:id')
  .put(footerController.updateColumn)
  .delete(footerController.deleteColumn);

// Links
router.route('/links')
  .post(footerController.createLink);

router.route('/links/:id')
  .put(footerController.updateLink)
  .delete(footerController.deleteLink);

// Reorder
router.patch('/reorder', footerController.reorderItems);

export default router;
