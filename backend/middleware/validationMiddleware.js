import { body, query, param, validationResult } from 'express-validator';

// Middleware to format validation errors
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];

  errors.array().forEach((err) => {
    extractedErrors.push({ [err.path]: err.msg });
  });

  return res.status(400).json({
    success: false,
    errors: extractedErrors,
  });
};

// =========================
// Property Validation
// =========================
export const validateProperty = [
  body('title')
    .notEmpty()
    .withMessage('Property title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot be more than 100 characters'),

  body('description')
    .notEmpty()
    .withMessage('Description is required'),

  body('category')
    .notEmpty()
    .withMessage('Category is required'),

  body('address')
    .notEmpty()
    .withMessage('Address is required'),

  body('city')
    .notEmpty()
    .withMessage('City is required'),

  body('state')
    .notEmpty()
    .withMessage('State is required'),

  body('country')
    .notEmpty()
    .withMessage('Country is required'),

  body('pricePerNight')
    .isNumeric()
    .withMessage('Price per night must be a number')
    .custom((value) => value >= 0 && value < 1000000)
    .withMessage('Price must be between 0 and 1,000,000'),

  body('maxGuests')
    .isNumeric()
    .withMessage('Max guests must be a number')
    .custom((value) => value >= 1 && value <= 50)
    .withMessage('Must allow between 1 and 50 guests'),

  body('bedrooms')
    .isNumeric()
    .withMessage('Bedrooms must be a number')
    .custom((value) => value >= 0)
    .withMessage('Bedrooms cannot be negative'),

  body('bathrooms')
    .isNumeric()
    .withMessage('Bathrooms must be a number')
    .custom((value) => value >= 0)
    .withMessage('Bathrooms cannot be negative'),

  validate,
];

// =========================
// Register Validation
// =========================
export const validateRegister = [
  body('name')
    .notEmpty()
    .withMessage('Please provide a name'),

  body('email')
    .isEmail()
    .withMessage('Please provide a valid email'),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),

  validate,
];

// =========================
// Login Validation
// =========================
export const validateLogin = [
  body('email')
    .notEmpty()
    .withMessage('Please provide an email'),

  body('password')
    .notEmpty()
    .withMessage('Please provide a password'),

  validate,
];

// =========================
// Update Profile Validation
// =========================
export const validateUpdateProfile = [
  body('email')
    .not()
    .exists()
    .withMessage('Email cannot be updated through this endpoint'),

  body('password')
    .not()
    .exists()
    .withMessage('Password cannot be updated through this endpoint'),

  validate,
];

// =========================
// Change Password Validation
// =========================
export const validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Please provide current password'),

  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters'),

  validate,
];

// =========================
// Featured Image Validation
// =========================
export const validateFeaturedImage = [
  body('imageId')
    .notEmpty()
    .withMessage('Please provide an imageId'),

  validate,
];

// =========================
// Booking Validation
// =========================
export const validateBooking = [
  body('propertyId')
    .notEmpty()
    .withMessage('Property ID is required')
    .isString()
    .withMessage('Property ID must be a string')
    .isUUID()
    .withMessage('Invalid Property ID'),

  body('checkIn')
    .notEmpty()
    .withMessage('Check-in date is required')
    .isISO8601()
    .withMessage('Invalid check-in date format')
    .custom((value) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (new Date(value) < today) {
        throw new Error('Check-in date cannot be in the past');
      }

      return true;
    }),

  body('checkOut')
    .notEmpty()
    .withMessage('Check-out date is required')
    .isISO8601()
    .withMessage('Invalid check-out date format')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.checkIn)) {
        throw new Error('Check-out date must be after check-in date');
      }

      return true;
    }),

  body('guestsCount')
    .isNumeric()
    .withMessage('Guests count must be a number')
    .custom((value) => value >= 1)
    .withMessage('At least 1 guest is required'),

  validate,
];

// =========================
// Booking Status Validation
// =========================
export const validateBookingStatus = [
  body('status')
    .isIn(['Pending', 'Confirmed', 'Cancelled', 'Completed'])
    .withMessage('Invalid booking status'),

  validate,
];

export const validateReview = [
  body('rating')
    .notEmpty().withMessage('Please provide a rating')
    .isNumeric().withMessage('Rating must be a number')
    .isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .isLength({ max: 1000 }).withMessage('Comment cannot exceed 1000 characters'),
  validate,
];

export const validateCreateOrder = [
  body('bookingId').notEmpty().withMessage('Booking ID is required').isUUID().withMessage('Invalid Booking ID format'),
  validate,
];

export const validateVerifyPayment = [
  body('bookingId').notEmpty().withMessage('Booking ID is required').isUUID().withMessage('Invalid Booking ID format'),
  body('razorpay_order_id').notEmpty().withMessage('Razorpay Order ID is required'),
  body('razorpay_payment_id').notEmpty().withMessage('Razorpay Payment ID is required'),
  body('razorpay_signature').notEmpty().withMessage('Razorpay Signature is required'),
  validate,
];

export const validateRefund = [
  body('paymentId').notEmpty().withMessage('Payment ID is required').isUUID().withMessage('Invalid Payment ID format'),
  validate,
];

// =========================
// Dashboard Analytics Validation
// =========================
export const validateDashboardQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 10000 })
    .withMessage('Limit must be between 1 and 10000'),
    
  validate,
];

export const validateDashboardDateFilters = [
  query('month')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Month must be between 1 and 12'),
    
  query('year')
    .optional()
    .isInt({ min: 2000, max: 2100 })
    .withMessage('Year must be valid'),
    
  query('dateFrom')
    .optional()
    .isISO8601()
    .withMessage('dateFrom must be a valid ISO8601 date'),
    
  query('dateTo')
    .optional()
    .isISO8601()
    .withMessage('dateTo must be a valid ISO8601 date')
    .custom((value, { req }) => {
      if (req.query.dateFrom && new Date(value) <= new Date(req.query.dateFrom)) {
        throw new Error('dateTo must be after dateFrom');
      }
      return true;
    }),
    
  validate,
];

// =========================
// Notification Validation
// =========================
export const validateNotificationQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
    
  query('type')
    .optional()
    .isIn([
      'BOOKING_CREATED', 'BOOKING_CONFIRMED', 'BOOKING_CANCELLED',
      'PAYMENT_SUCCESS', 'PAYMENT_REFUND', 'NEW_REVIEW',
      'PROPERTY_CREATED', 'PROPERTY_UPDATED', 'PROPERTY_APPROVED',
      'PROPERTY_REJECTED', 'SYSTEM'
    ])
    .withMessage('Invalid notification type'),
    
  query('read')
    .optional()
    .isBoolean()
    .withMessage('Read filter must be boolean'),
    
  validate,
];

export const validateNotificationId = [
  param('id').isUUID().withMessage('Invalid Notification ID format'),
  validate,
];

// =========================
// Admin Validation
// =========================
export const validateAdminRejectProperty = [
  body('rejectionReason')
    .notEmpty()
    .withMessage('Rejection reason is required')
    .isString()
    .isLength({ min: 10, max: 500 })
    .withMessage('Rejection reason must be between 10 and 500 characters'),
  validate,
];

export const validateAdminBroadcast = [
  body('target')
    .isIn(['All Users', 'Guests', 'Hosts', 'Admins'])
    .withMessage('Invalid broadcast target'),
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 }),
  body('message')
    .notEmpty()
    .withMessage('Message is required'),
  validate,
];

export const validateAdminIdParam = [
  param('id').isUUID().withMessage('Invalid ID format'),
  validate,
];