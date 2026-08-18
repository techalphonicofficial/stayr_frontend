import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import * as accessControlController from '../controllers/accessControlController.js';

const router = express.Router();

// Currently protecting with Admin only. If granular permissions are added to authMiddleware, 
// they can be swapped in here (e.g., requirePermission('access_control.users.view')).
router.use(protect, authorize('Admin'));

// =========================
// Roles
// =========================
router.route('/roles')
  .get(accessControlController.getRoles)
  .post(accessControlController.createRole);

router.route('/roles/:id')
  .put(accessControlController.updateRole)
  .delete(accessControlController.deleteRole);

// =========================
// Modules
// =========================
router.route('/modules')
  .get(accessControlController.getModules)
  .post(accessControlController.createModule);

router.route('/modules/:id')
  .put(accessControlController.updateModule)
  .delete(accessControlController.deleteModule);

// =========================
// Permissions
// =========================
router.route('/permissions')
  .get(accessControlController.getPermissions)
  .post(accessControlController.createPermission);

router.route('/permissions/:id')
  .put(accessControlController.updatePermission)
  .delete(accessControlController.deletePermission);

// =========================
// Vendor Requests
// =========================
router.route('/vendor-requests')
  .get(accessControlController.getVendorRequests);

router.put('/vendor-requests/:id/approve', accessControlController.approveVendorRequest);
router.put('/vendor-requests/:id/reject', accessControlController.rejectVendorRequest);

// =========================
// Users
// =========================
router.post('/users', accessControlController.createUser);
router.put('/users/:id/role', accessControlController.updateUserRole);

export default router;
