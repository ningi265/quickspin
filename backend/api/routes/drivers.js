const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const { validateDriver, validateDriverUpdate } = require('../middleware/validation');
const auth = require('../middleware/auth');

// @route   GET /api/drivers
// @desc    Get all drivers with filtering and pagination
// @access  Private
router.get('/', auth, driverController.getDrivers);

// @route   GET /api/drivers/stats
// @desc    Get driver statistics
// @access  Private
router.get('/stats', auth, driverController.getDriverStats);

// @route   GET /api/drivers/:id
// @desc    Get driver by ID
// @access  Private
router.get('/:id', auth, driverController.getDriverById);

// @route   POST /api/drivers
// @desc    Create new driver
// @access  Private
router.post('/', auth, validateDriver, driverController.createDriver);

// @route   PATCH /api/drivers/:id/status
// @desc    Update driver status
// @access  Private
router.patch('/:id/status', auth, driverController.updateDriverStatus);

// @route   PUT /api/drivers/:id
// @desc    Update driver details
// @access  Private
router.put('/:id', auth, validateDriverUpdate, driverController.updateDriver);

// @route   DELETE /api/drivers/:id
// @desc    Delete driver (soft delete)
// @access  Private
router.delete('/:id', auth, driverController.deleteDriver);

module.exports = router;