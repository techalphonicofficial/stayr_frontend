import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  becomeHost,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.use(protect); // Applies protect middleware to all routes below this line
router.get('/me', getMe);
router.put('/profile', upload.single('profileImage'), updateProfile);
router.put('/change-password', changePassword);
router.put('/become-host', becomeHost);

export default router;
