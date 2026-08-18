import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import * as cmsController from '../controllers/cmsController.js';

const router = express.Router();

router.use(protect, authorize('Admin'));

router.post('/upload', upload.single('image'), cmsController.uploadImage);

router.route('/')
  .get(cmsController.getPages)
  .post(cmsController.createPage);

router.route('/:id')
  .get(cmsController.getPageById)
  .put(cmsController.updatePage)
  .delete(cmsController.deletePage);

router.route('/:id/status')
  .patch(cmsController.updatePageStatus);

export default router;
