import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import prisma from '../config/prisma.js';

// Protect routes
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check cookies for token
  if (req.cookies.token) {
    token = req.cookies.token;
  }
  // Check authorization header for Bearer token (optional fallback)
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    res.status(401);
    throw new Error('Not authorized to access this route');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user and attach to request
    req.user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });
    
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized to access this route');
    }

    next();
  } catch (err) {
    res.status(401);
    throw new Error('Not authorized to access this route');
  }
});

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`User role ${req.user ? req.user.role : 'Unknown'} is not authorized to access this route`);
    }
    next();
  };
};

// Optional auth - populates req.user if token is valid, but does not block if unauthenticated
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await prisma.user.findUnique({
        where: { id: decoded.id }
      });
    } catch (err) {
      // Valid to continue without user
    }
  }
  next();
});

