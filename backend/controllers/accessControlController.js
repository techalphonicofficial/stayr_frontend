import { asyncHandler } from '../utils/asyncHandler.js';
import * as accessControlService from '../services/accessControlService.js';

// ==========================================
// ROLES
// ==========================================

export const getRoles = asyncHandler(async (req, res) => {
  const roles = await accessControlService.getRoles();
  res.status(200).json({ success: true, data: roles });
});

export const createRole = asyncHandler(async (req, res) => {
  const role = await accessControlService.createRole(req.body);
  res.status(201).json({ success: true, message: 'Role created', data: role });
});

export const updateRole = asyncHandler(async (req, res) => {
  const role = await accessControlService.updateRole(req.params.id, req.body);
  res.status(200).json({ success: true, message: 'Role updated', data: role });
});

export const deleteRole = asyncHandler(async (req, res) => {
  await accessControlService.deleteRole(req.params.id);
  res.status(200).json({ success: true, message: 'Role deleted' });
});

// ==========================================
// MODULES
// ==========================================

export const getModules = asyncHandler(async (req, res) => {
  const modules = await accessControlService.getModules();
  res.status(200).json({ success: true, data: modules });
});

export const createModule = asyncHandler(async (req, res) => {
  const module = await accessControlService.createModule(req.body);
  res.status(201).json({ success: true, message: 'Module created', data: module });
});

export const updateModule = asyncHandler(async (req, res) => {
  const module = await accessControlService.updateModule(req.params.id, req.body);
  res.status(200).json({ success: true, message: 'Module updated', data: module });
});

export const deleteModule = asyncHandler(async (req, res) => {
  await accessControlService.deleteModule(req.params.id);
  res.status(200).json({ success: true, message: 'Module deleted' });
});

// ==========================================
// PERMISSIONS
// ==========================================

export const getPermissions = asyncHandler(async (req, res) => {
  const permissions = await accessControlService.getPermissions();
  res.status(200).json({ success: true, data: permissions });
});

export const createPermission = asyncHandler(async (req, res) => {
  const permission = await accessControlService.createPermission(req.body);
  res.status(201).json({ success: true, message: 'Permission created', data: permission });
});

export const updatePermission = asyncHandler(async (req, res) => {
  const permission = await accessControlService.updatePermission(req.params.id, req.body);
  res.status(200).json({ success: true, message: 'Permission updated', data: permission });
});

export const deletePermission = asyncHandler(async (req, res) => {
  await accessControlService.deletePermission(req.params.id);
  res.status(200).json({ success: true, message: 'Permission deleted' });
});

// ==========================================
// VENDOR REQUESTS
// ==========================================

export const getVendorRequests = asyncHandler(async (req, res) => {
  const { total, requests } = await accessControlService.getVendorRequests(req.query);
  const stats = await accessControlService.getVendorRequestStats();
  res.status(200).json({ 
    success: true, 
    count: requests.length, 
    total, 
    stats,
    data: requests 
  });
});

export const approveVendorRequest = asyncHandler(async (req, res) => {
  const updated = await accessControlService.approveVendorRequest(req.params.id);
  res.status(200).json({ success: true, message: 'Vendor request approved', data: updated });
});

export const rejectVendorRequest = asyncHandler(async (req, res) => {
  const updated = await accessControlService.rejectVendorRequest(req.params.id);
  res.status(200).json({ success: true, message: 'Vendor request rejected', data: updated });
});

// ==========================================
// USERS
// ==========================================

export const createUser = asyncHandler(async (req, res) => {
  const user = await accessControlService.createUser(req.body);
  res.status(201).json({ success: true, message: 'User created', data: user });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await accessControlService.updateUserRole(req.params.id, req.body);
  res.status(200).json({ success: true, message: 'User role updated', data: user });
});
