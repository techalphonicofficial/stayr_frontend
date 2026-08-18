import express from 'express';
import { getPublicFooter } from '../controllers/footerController.js';
import * as publicSettingsController from '../controllers/publicSettingsController.js';

const router = express.Router();

router.get('/footer', getPublicFooter);
router.get('/settings', publicSettingsController.getPublicSettings);
router.get('/settings/taxes', publicSettingsController.getPublicTaxes);
router.get('/settings/cancellation', publicSettingsController.getPublicCancellationRules);

export default router;
