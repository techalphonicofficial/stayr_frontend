import express from 'express';
import multer from 'multer';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';
import * as saleListingController from '../controllers/saleListingController.js';
import * as savedSaleController from '../controllers/savedSaleController.js';

const router = express.Router();

// Sale photos: JPG/PNG/WEBP only, 5MB each, max 10 per request (15 per listing enforced in controller)
const saleImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
  fileFilter: (req, file, cb) =>
    ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error('Only JPG, PNG and WEBP images are allowed'), false),
});

// Public discovery
router.get('/', optionalAuth, saleListingController.getSaleListings);
router.get('/meta/property-types', saleListingController.getSaleMeta);

// Seller dashboard
router.get('/seller/my-listings', protect, saleListingController.getMySaleListings);
router.get('/manage/:id', protect, saleListingController.getManageSaleListing);

// Saved properties (separate from rental wishlist, which is bound to the Property model)
router.get('/saved', protect, savedSaleController.getMySavedSaleListings);
router.post('/saved/toggle', protect, savedSaleController.toggleSavedSaleListing);

// Draft & lifecycle
router.post('/draft', protect, saleListingController.createSaleListingDraft);
router.put('/:id/draft', protect, saleListingController.updateSaleListingDraft);
router.post('/:id/submit-for-review', protect, saleListingController.submitSaleListingForReview);
router.put('/:id/toggle-status', protect, saleListingController.toggleSaleListingStatus);

// Images
router.post('/:id/images', protect, saleImageUpload.array('images', 10), saleListingController.uploadSaleListingImages);
router.put('/:id/images/reorder', protect, saleListingController.reorderSaleListingImages);
router.delete('/:id/images/:imageId', protect, saleListingController.deleteSaleListingImage);
router.put('/:id/featured-image', protect, saleListingController.setSaleListingFeaturedImage);

router.delete('/:id', protect, saleListingController.deleteSaleListing);

// Public detail by slug or id (keep last)
router.get('/:slugOrId', optionalAuth, saleListingController.getSaleListingBySlugOrId);

export default router;
