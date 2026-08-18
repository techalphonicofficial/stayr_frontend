import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import * as crmSettingsController from '../controllers/crmSettingsController.js';

const router = express.Router();

// All CRM Settings routes are restricted to Admin
router.use(protect, authorize('Admin'));

// Core CRM Settings (Automations, Email, Forex, Company)
router.route('/')
  .get(crmSettingsController.getCrmSettings)
  .put(crmSettingsController.updateCrmSettings);

// Taxes
router.route('/taxes')
  .get(crmSettingsController.getTaxes)
  .post(crmSettingsController.createTax);
router.route('/taxes/:id')
  .put(crmSettingsController.updateTax)
  .delete(crmSettingsController.deleteTax);

// Cancellation Rules
router.route('/cancellation')
  .get(crmSettingsController.getCancellationRules)
  .post(crmSettingsController.createCancellationRule);
router.route('/cancellation/:id')
  .put(crmSettingsController.updateCancellationRule)
  .delete(crmSettingsController.deleteCancellationRule);

// API Keys
router.route('/apikeys')
  .get(crmSettingsController.getApiKeys)
  .post(crmSettingsController.createApiKey);
router.delete('/apikeys/:id', crmSettingsController.deleteApiKey);

// Theme
router.route('/theme')
  .get(crmSettingsController.getTheme)
  .put(crmSettingsController.updateTheme);

router.route('/themes')
  .get(crmSettingsController.getThemes)
  .post(crmSettingsController.createTheme);

router.put('/themes/:id/activate', crmSettingsController.activateTheme);
router.delete('/themes/:id', crmSettingsController.deleteTheme);

// Category Mapping
router.route('/category-mapping')
  .get(crmSettingsController.getCategoryMappings)
  .post(crmSettingsController.createCategoryMapping);
router.delete('/category-mapping/:id', crmSettingsController.deleteCategoryMapping);

export default router;
