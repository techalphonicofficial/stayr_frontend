import { body, validationResult } from 'express-validator';

// Middleware to format validation errors
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));
  
  res.status(400).json({
    success: false,
    errors: extractedErrors,
  });
};

export const validateProperty = [
  body('title').notEmpty().withMessage('Property title is required').isLength({ max: 100 }).withMessage('Title cannot be more than 100 characters'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('state').notEmpty().withMessage('State is required'),
  body('country').notEmpty().withMessage('Country is required'),
  body('pricePerNight').isNumeric().withMessage('Price per night must be a number').custom(value => value >= 0).withMessage('Price cannot be negative'),
  body('maxGuests').isNumeric().withMessage('Max guests must be a number').custom(value => value >= 1).withMessage('Must allow at least 1 guest'),
  body('bedrooms').isNumeric().withMessage('Bedrooms must be a number').custom(value => value >= 0).withMessage('Bedrooms cannot be negative'),
  body('bathrooms').isNumeric().withMessage('Bathrooms must be a number').custom(value => value >= 0).withMessage('Bathrooms cannot be negative'),
  validate,
];

export const validateRegister = [
  body('name').notEmpty().withMessage('Please provide a name'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  validate,
];

export const validateLogin = [
  body('email').notEmpty().withMessage('Please provide an email'),
  body('password').notEmpty().withMessage('Please provide a password'),
  validate,
];

export const validateUpdateProfile = [
  body('email').not().exists().withMessage('Email cannot be updated through this endpoint'),
  body('password').not().exists().withMessage('Password cannot be updated through this endpoint'),
  validate,
];

export const validateChangePassword = [
  body('currentPassword').notEmpty().withMessage('Please provide current password'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
  validate,
];
