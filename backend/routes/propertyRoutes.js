import express from 'express';
import {
  createProperty,
  getProperties,
  getProperty,
  updateProperty,
  deleteProperty,
} from '../controllers/propertyController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validateProperty } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProperties)
  .post(protect, authorize('Host', 'Admin'), validateProperty, createProperty);

router.route('/:id')
  .get(getProperty)
  .put(protect, authorize('Host', 'Admin'), validateProperty, updateProperty)
  .delete(protect, authorize('Host', 'Admin'), deleteProperty);

export default router;
