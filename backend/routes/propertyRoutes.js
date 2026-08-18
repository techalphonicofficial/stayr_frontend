import express from 'express';
import {
  createProperty,
  getProperties,
  getProperty,
  updateProperty,
  deleteProperty,
  checkAvailability,
} from '../controllers/propertyController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  uploadPropertyImages,
  getPropertyImages,
  deletePropertyImage,
  setFeaturedImage,
} from '../controllers/propertyImageController.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { validateProperty, validateFeaturedImage } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProperties)
  .post(protect, authorize('Host', 'Admin'), validateProperty, createProperty);

router.route('/:id')
  .get(getProperty)
  .put(protect, authorize('Host', 'Admin'), validateProperty, updateProperty)
  .delete(protect, authorize('Host', 'Admin'), deleteProperty);

router.route('/:id/availability')
  .get(checkAvailability);

// Image routes
router.route('/:id/images')
  .post(protect, authorize('Host', 'Admin'), upload.array('images', 10), uploadPropertyImages)
  .get(getPropertyImages);

router.route('/:id/images/:imageId')
  .delete(protect, authorize('Host', 'Admin'), deletePropertyImage);

router.route('/:id/featured-image')
  .put(protect, authorize('Host', 'Admin'), validateFeaturedImage, setFeaturedImage);

export default router;
