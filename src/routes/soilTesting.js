const express = require('express');
const {
  sendEmailToSupport,
  getAllRequests,
  createRequest,
  getRequestById,
  updateRequestStatus,
  deleteRequest
} = require('../controllers/soilTestingController');
const { body, param } = require('express-validator');

const router = express.Router();

// Validation middleware for sending email to support
const emailSupportValidation = [
  body('crop')
    .notEmpty()
    .withMessage('Crop is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Crop name must be between 2 and 50 characters'),
  body('farmArea')
    .notEmpty()
    .withMessage('Farm area is required')
    .isNumeric()
    .withMessage('Farm area must be a number'),
  body('addressLine')
    .notEmpty()
    .withMessage('Address line is required')
    .isLength({ min: 5, max: 100 })
    .withMessage('Address line must be between 5 and 100 characters'),
  body('city')
    .notEmpty()
    .withMessage('City is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  body('state')
    .notEmpty()
    .withMessage('State is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be between 2 and 50 characters'),
  body('pincode')
    .notEmpty()
    .withMessage('Pincode is required')
    .matches(/^\d{6}$/)
    .withMessage('Pincode must be exactly 6 digits'),
  body('contact')
    .notEmpty()
    .withMessage('Contact is required')
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('packageType')
    .isIn(['inStore', 'onFarm'])
    .withMessage('Package type must be either inStore or onFarm'),
  body('bagItems')
    .isArray({ min: 1 })
    .withMessage('At least one bag item is required'),
  body('bagItems.*.name')
    .notEmpty()
    .withMessage('Bag item name is required'),
  body('bagItems.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Bag item quantity must be at least 1')
];

// Validation middleware for creating requests
const createRequestValidation = [
  body('crop')
    .notEmpty()
    .withMessage('Crop is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Crop name must be between 2 and 50 characters'),
  body('farmArea')
    .notEmpty()
    .withMessage('Farm area is required')
    .isNumeric()
    .withMessage('Farm area must be a number'),
  body('addressLine')
    .notEmpty()
    .withMessage('Address line is required')
    .isLength({ min: 5, max: 100 })
    .withMessage('Address line must be between 5 and 100 characters'),
  body('city')
    .notEmpty()
    .withMessage('City is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),
  body('state')
    .notEmpty()
    .withMessage('State is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be between 2 and 50 characters'),
  body('pincode')
    .notEmpty()
    .withMessage('Pincode is required')
    .matches(/^\d{6}$/)
    .withMessage('Pincode must be exactly 6 digits'),
  body('packageType')
    .isIn(['inStore', 'onFarm'])
    .withMessage('Package type must be either inStore or onFarm'),
  body('bagItems')
    .isArray({ min: 1 })
    .withMessage('At least one bag item is required'),
  body('bagItems.*.name')
    .notEmpty()
    .withMessage('Bag item name is required'),
  body('bagItems.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Bag item quantity must be at least 1')
];

// Validation middleware for updating status
const updateStatusValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid request ID'),
  body('status')
    .isIn(['pending', 'in_progress', 'completed'])
    .withMessage('Status must be one of: pending, in_progress, completed')
];

// Validation middleware for ID parameter
const idValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid request ID')
];

// Routes

// POST /api/soil-testing/send-email-support
// Send email to store support with soil testing request details
router.post('/send-email-support', emailSupportValidation, sendEmailToSupport);

// GET /api/soil-testing/requests
// Get all soil testing requests
router.get('/requests', getAllRequests);

// POST /api/soil-testing/requests
// Create a new soil testing request
router.post('/requests', createRequestValidation, createRequest);

// GET /api/soil-testing/requests/:id
// Get a specific soil testing request by ID
router.get('/requests/:id', idValidation, getRequestById);

// PATCH /api/soil-testing/requests/:id/status
// Update the status of a soil testing request
router.patch('/requests/:id/status', updateStatusValidation, updateRequestStatus);

// DELETE /api/soil-testing/requests/:id
// Delete a soil testing request
router.delete('/requests/:id', idValidation, deleteRequest);

module.exports = router;