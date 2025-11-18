const { body, validationResult } = require('express-validator');

// Order validation
const validateOrder = (req, res, next) => {
  const { services, pickupDate, pickupTimeSlot, location } = req.body;

  if (!services || services.length === 0) {
    return res.status(400).json({ message: 'At least one service is required' });
  }

  if (!pickupDate || !pickupTimeSlot) {
    return res.status(400).json({ message: 'Pickup date and time are required' });
  }

  if (!location || !location.address) {
    return res.status(400).json({ message: 'Location address is required' });
  }

  next();
};

// Driver creation validation
const validateDriver = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Driver name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
    .isLength({ max: 255 })
    .withMessage('Email cannot exceed 255 characters'),
  
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^\+?[\d\s\-()]{10,}$/)
    .withMessage('Please enter a valid phone number (minimum 10 digits)')
    .isLength({ max: 20 })
    .withMessage('Phone number cannot exceed 20 characters'),
  
  body('vehicleModel')
    .trim()
    .notEmpty()
    .withMessage('Vehicle model is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Vehicle model must be between 2 and 50 characters'),
  
  body('licensePlate')
    .trim()
    .notEmpty()
    .withMessage('License plate is required')
    .isLength({ min: 3, max: 15 })
    .withMessage('License plate must be between 3 and 15 characters')
    .matches(/^[A-Z0-9\s-]+$/)
    .withMessage('License plate can only contain uppercase letters, numbers, spaces, and hyphens'),
  
  body('vehicleColor')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Vehicle color cannot exceed 30 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Vehicle color can only contain letters and spaces'),
  
  body('vehicleYear')
    .optional()
    .isInt({ min: 1990, max: new Date().getFullYear() + 1 })
    .withMessage(`Vehicle year must be between 1990 and ${new Date().getFullYear() + 1}`),

  // Custom validation to check for validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(error => ({
          field: error.path,
          message: error.msg
        }))
      });
    }
    next();
  }
];

// Driver update validation
const validateDriverUpdate = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Driver name cannot be empty')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
    .isLength({ max: 255 })
    .withMessage('Email cannot exceed 255 characters'),
  
  body('phone')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Phone number cannot be empty')
    .matches(/^\+?[\d\s\-()]{10,}$/)
    .withMessage('Please enter a valid phone number (minimum 10 digits)')
    .isLength({ max: 20 })
    .withMessage('Phone number cannot exceed 20 characters'),
  
  body('vehicle.model')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Vehicle model cannot be empty')
    .isLength({ min: 2, max: 50 })
    .withMessage('Vehicle model must be between 2 and 50 characters'),
  
  body('vehicle.licensePlate')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('License plate cannot be empty')
    .isLength({ min: 3, max: 15 })
    .withMessage('License plate must be between 3 and 15 characters')
    .matches(/^[A-Z0-9\s-]+$/)
    .withMessage('License plate can only contain uppercase letters, numbers, spaces, and hyphens'),
  
  body('vehicle.color')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Vehicle color cannot exceed 30 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Vehicle color can only contain letters and spaces'),
  
  body('vehicle.year')
    .optional()
    .isInt({ min: 1990, max: new Date().getFullYear() + 1 })
    .withMessage(`Vehicle year must be between 1990 and ${new Date().getFullYear() + 1}`),
  
  body('status')
    .optional()
    .isIn(['active', 'offline', 'on-delivery'])
    .withMessage('Status must be active, offline, or on-delivery'),
  
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating must be between 0 and 5'),
  
  body('deliveries')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Deliveries count cannot be negative'),

  // Custom validation to check for validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(error => ({
          field: error.path,
          message: error.msg
        }))
      });
    }
    next();
  }
];

// Status update validation
const validateDriverStatus = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['active', 'offline', 'on-delivery'])
    .withMessage('Status must be active, offline, or on-delivery'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(error => ({
          field: error.path,
          message: error.msg
        }))
      });
    }
    next();
  }
];

module.exports = {
  validateOrder,
  validateDriver,
  validateDriverUpdate,
  validateDriverStatus
};