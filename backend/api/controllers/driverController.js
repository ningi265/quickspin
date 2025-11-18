const Driver = require('../models/drivers');
const { validationResult } = require('express-validator');

// Get all drivers
exports.getDrivers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = { isActive: true };
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { 'vehicle.licensePlate': { $regex: search, $options: 'i' } },
        { 'vehicle.model': { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const drivers = await Driver.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Driver.countDocuments(query);

    res.json({
      success: true,
      drivers,
      pagination: {
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching drivers:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching drivers'
    });
  }
};

// Get driver by ID
exports.getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    res.json({
      success: true,
      driver
    });
  } catch (error) {
    console.error('Error fetching driver:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching driver'
    });
  }
};

// Create new driver
exports.createDriver = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      name,
      email,
      phone,
      vehicleModel,
      licensePlate,
      vehicleColor,
      vehicleYear
    } = req.body;

    // Check if driver already exists
    const existingDriver = await Driver.findOne({ 
      $or: [{ email }, { phone }, { 'vehicle.licensePlate': licensePlate }] 
    });

    if (existingDriver) {
      return res.status(409).json({
        success: false,
        message: 'Driver with this email, phone or license plate already exists'
      });
    }

    const driver = new Driver({
      name,
      email,
      phone,
      vehicle: {
        model: vehicleModel,
        licensePlate,
        color: vehicleColor,
        year: vehicleYear
      }
    });

    await driver.save();

    res.status(201).json({
      success: true,
      message: 'Driver created successfully',
      driver
    });
  } catch (error) {
    console.error('Error creating driver:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Driver with this email, phone or license plate already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while creating driver'
    });
  }
};

// Update driver status
exports.updateDriverStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['active', 'offline', 'on-delivery'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be active, offline, or on-delivery'
      });
    }

    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    res.json({
      success: true,
      message: 'Driver status updated successfully',
      driver
    });
  } catch (error) {
    console.error('Error updating driver status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating driver status'
    });
  }
};

// Update driver details
exports.updateDriver = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const updates = req.body;
    
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    res.json({
      success: true,
      message: 'Driver updated successfully',
      driver
    });
  } catch (error) {
    console.error('Error updating driver:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating driver'
    });
  }
};

// Delete driver (soft delete)
exports.deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    res.json({
      success: true,
      message: 'Driver deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting driver:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting driver'
    });
  }
};

// Get driver statistics
exports.getDriverStats = async (req, res) => {
  try {
    const stats = await Driver.getStats();
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching driver stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching driver statistics'
    });
  }
};