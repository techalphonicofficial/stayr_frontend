import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { toggleWishlist, getMyWishlist } from '../controllers/wishlistController.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getMyWishlist);

router.route('/toggle')
  .post(toggleWishlist);

export default router;
