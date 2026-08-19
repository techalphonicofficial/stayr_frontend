import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from '../config/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendTokenResponse } from '../utils/generateToken.js';
import cloudinary from '../config/cloudinary.js';

// Helper to generate JWT
const getSignedJwtToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, profileImage } = req.body;

  // Check if user exists
  const userExists = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      profileImage,
      role: 'Guest',
    },
  });

  // Generate token and send response
  const token = getSignedJwtToken(user.id);
  sendTokenResponse(res, token);

  const responsePayload = {
    success: true,
    data: {
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      isActive: user.isActive,
    },
  };

  if (process.env.NODE_ENV === 'development') {
    responsePayload.token = token;
  }

  res.status(201).json(responsePayload);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    console.warn(`[AUTH FAILED] Login attempt with non-existent email: ${email}`);
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Check if password matches
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    console.warn(`[AUTH FAILED] Incorrect password for email: ${email}`);
    res.status(401);
    throw new Error('Invalid credentials');
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error('Your account has been deactivated');
  }

  // Update last login
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  // Generate token and send response
  const token = getSignedJwtToken(updatedUser.id);
  sendTokenResponse(res, token);

  const responsePayload = {
    success: true,
    data: {
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isVerified: updatedUser.isVerified,
      isActive: updatedUser.isActive,
      lastLogin: updatedUser.lastLogin,
    },
  };

  if (process.env.NODE_ENV === 'development') {
    responsePayload.token = token;
  }

  res.status(200).json(responsePayload);
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logout = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
    message: 'User logged out successfully',
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (user) delete user.password;

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Update user details (with profile image upload)
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  
  let updateData = {};
  if (name) updateData.name = name;
  if (phone) updateData.phone = phone;

  // Handle profile image upload
  if (req.file) {
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'stayr/profiles' },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        stream.end(req.file.buffer);
      });
    };

    const result = await streamUpload(req);
    updateData.profileImage = result.secure_url;
  }

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: updateData,
  });

  if (user) delete user.password;

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Upgrade Guest to Host
// @route   PUT /api/auth/become-host
// @access  Private
export const becomeHost = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });

  if (user.role === 'Admin') {
    res.status(400);
    throw new Error('Admin role cannot be changed through this endpoint');
  }

  if (user.role === 'Host') {
    res.status(400);
    throw new Error('User is already a Host');
  }

  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: { role: 'Host' },
  });

  if (updatedUser) delete updatedUser.password;

  res.status(200).json({
    success: true,
    message: 'Successfully upgraded to Host role',
    data: updatedUser,
  });
});

// @desc    Update password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  // Check current password
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Incorrect current password');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await prisma.user.update({
    where: { id: req.user.id },
    data: { password: hashedPassword },
  });

  // Re-issue token
  const token = getSignedJwtToken(user.id);
  sendTokenResponse(res, token);

  res.status(200).json({
    success: true,
    data: {},
    message: 'Password changed successfully',
  });
});
