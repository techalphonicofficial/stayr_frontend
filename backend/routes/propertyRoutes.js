import express from 'express';
import {
  createProperty,
  getProperties,
  getProperty,
  updateProperty,
  deleteProperty,
  checkAvailability,
  getMyProperties,
  getManageProperty,
  createDraftProperty,
  updateDraftProperty,
  submitForReview,
  toggleListingStatus,
  vectorSearchProperties,
  liveSearchSuggestions,
} from '../controllers/propertyController.js';
import { protect, authorize, optionalAuth } from '../middleware/authMiddleware.js';
import {
  uploadPropertyImages,
  getPropertyImages,
  deletePropertyImage,
  setFeaturedImage,
  reorderPropertyImages,
} from '../controllers/propertyImageController.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { validateProperty, validateFeaturedImage } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Public / General routes
router.get('/search/vector', vectorSearchProperties);
router.get('/search/live', liveSearchSuggestions);

router.route('/')
  .get(getProperties)
  .post(protect, authorize('Host', 'Admin'), validateProperty, createProperty);

// Host-specific routes (MUST be defined before /:id)
router.get('/host/my-properties', protect, getMyProperties);
router.post('/draft', protect, createDraftProperty);
router.get('/manage/:id', protect, getManageProperty);

// Parameterized property routes
router.route('/:id')
  .get(optionalAuth, getProperty)
  .put(protect, authorize('Host', 'Admin'), validateProperty, updateProperty)
  .delete(protect, authorize('Host', 'Admin'), deleteProperty);

router.put('/:id/draft', protect, updateDraftProperty);
router.post('/:id/submit-for-review', protect, submitForReview);
router.put('/:id/toggle-status', protect, toggleListingStatus);

router.route('/:id/availability')
  .get(checkAvailability);

// Image routes
router.route('/:id/images')
  .post(protect, upload.array('images', 10), uploadPropertyImages)
  .get(getPropertyImages);

router.put('/:id/images/reorder', protect, reorderPropertyImages);

router.route('/:id/images/:imageId')
  .delete(protect, deletePropertyImage);

router.route('/:id/featured-image')
  .put(protect, validateFeaturedImage, setFeaturedImage);

export default router;
