import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendTokenResponse } from '../utils/generateToken.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, profileImage, role } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email: email.toLowerCase() });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    phone,
    profileImage,
    role,
  });

  // Generate token and send response
  const token = user.getSignedJwtToken();
  sendTokenResponse(res, token);

  const responsePayload = {
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      isActive: user.isActive,
    }
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
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid credentials');
  }
  
  if (!user.isActive) {
    res.status(403);
    throw new Error('Your account has been deactivated');
  }

  // Update last login
  user.lastLogin = Date.now();
  await user.save({ validateBeforeSave: false });

  // Generate token and send response
  const token = user.getSignedJwtToken();
  sendTokenResponse(res, token);

  const responsePayload = {
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
    }
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
  const user = await User.findById(req.user.id);

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
  const user = await User.findById(req.user.id);

  if (name) user.name = name;
  if (phone) user.phone = phone;

  // Handle profile image upload
  if (req.file) {
    // Wrap upload_stream in a promise
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'stayr/profiles' },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        stream.end(req.file.buffer);
      });
    };

    const result = await streamUpload(req);
    user.profileImage = result.secure_url;
  }

  await user.save();

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Upgrade Guest to Host
// @route   PUT /api/auth/become-host
// @access  Private
export const becomeHost = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user.role === 'Admin') {
    res.status(400);
    throw new Error('Admin role cannot be changed through this endpoint');
  }

  if (user.role === 'Host') {
    res.status(400);
    throw new Error('User is already a Host');
  }

  user.role = 'Host';
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Successfully upgraded to Host role',
    data: user,
  });
});

// @desc    Update password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(currentPassword))) {
    res.status(401);
    throw new Error('Incorrect current password');
  }

  user.password = newPassword;
  await user.save(); // pre-save hook will hash it

  // Re-issue token
  const token = user.getSignedJwtToken();
  sendTokenResponse(res, token);

  res.status(200).json({
    success: true,
    data: {},
    message: 'Password changed successfully',
  });
});
