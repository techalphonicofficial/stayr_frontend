import express from 'express';
import * as publicSettingsController from '../controllers/publicSettingsController.js';

const router = express.Router();

router.get('/', publicSettingsController.getPublicSettings);
router.get('/taxes', publicSettingsController.getPublicTaxes);
router.get('/cancellation', publicSettingsController.getPublicCancellationRules);

export default router;
