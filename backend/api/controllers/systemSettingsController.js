const SystemSettings = require('../models/system');
const Service = require('../models/service');

// Get system settings
exports.getSystemSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.getSettings();
    
    res.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Error fetching system settings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching system settings'
    });
  }
};

// Update system settings
exports.updateSystemSettings = async (req, res) => {
  try {
    const updates = req.body;
    
    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = new SystemSettings(updates);
      await settings.save();
    } else {
      // Use findOneAndUpdate for atomic operations
      settings = await SystemSettings.findOneAndUpdate(
        { _id: settings._id },
        { $set: updates },
        { new: true, runValidators: true }
      );
    }

    res.json({
      success: true,
      message: 'System settings updated successfully',
      settings
    });
  } catch (error) {
    console.error('Error updating system settings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating system settings'
    });
  }
};

// Update pricing settings
exports.updatePricing = async (req, res) => {
  try {
    const { basePrice, pricePerKg, expressFee, currency } = req.body;
    
    const settings = await SystemSettings.getSettings();
    settings.pricing = { basePrice, pricePerKg, expressFee, currency };
    await settings.save();

    res.json({
      success: true,
      message: 'Pricing settings updated successfully',
      pricing: settings.pricing
    });
  } catch (error) {
    console.error('Error updating pricing settings:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating pricing settings'
    });
  }
};

// Update business hours
exports.updateBusinessHours = async (req, res) => {
  try {
    const { openingTime, closingTime, workingDays } = req.body;
    
    const settings = await SystemSettings.getSettings();
    settings.businessHours = { openingTime, closingTime, workingDays };
    await settings.save();

    res.json({
      success: true,
      message: 'Business hours updated successfully',
      businessHours: settings.businessHours
    });
  } catch (error) {
    console.error('Error updating business hours:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating business hours'
    });
  }
};

// Update service options
exports.updateServiceOptions = async (req, res) => {
  try {
    const { sameDayDelivery, expressDelivery, cashOnDelivery, onlinePayment } = req.body;
    
    const settings = await SystemSettings.getSettings();
    settings.serviceOptions = { sameDayDelivery, expressDelivery, cashOnDelivery, onlinePayment };
    await settings.save();

    res.json({
      success: true,
      message: 'Service options updated successfully',
      serviceOptions: settings.serviceOptions
    });
  } catch (error) {
    console.error('Error updating service options:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating service options'
    });
  }
};

// Service Areas Management
exports.getServiceAreas = async (req, res) => {
  try {
    const settings = await SystemSettings.getSettings();
    
    res.json({
      success: true,
      serviceAreas: settings.serviceAreas
    });
  } catch (error) {
    console.error('Error fetching service areas:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching service areas'
    });
  }
};

exports.addServiceArea = async (req, res) => {
  try {
    const { name, zipCodes, deliveryFee } = req.body;
    
    const settings = await SystemSettings.getSettings();
    const newArea = {
      name,
      zipCodes: zipCodes || [],
      deliveryFee: deliveryFee || 0,
      active: true
    };
    
    settings.serviceAreas.push(newArea);
    await settings.save();

    res.json({
      success: true,
      message: 'Service area added successfully',
      serviceArea: newArea
    });
  } catch (error) {
    console.error('Error adding service area:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding service area'
    });
  }
};

exports.updateServiceArea = async (req, res) => {
  try {
    const { areaId } = req.params;
    const updates = req.body;
    
    const settings = await SystemSettings.getSettings();
    const areaIndex = settings.serviceAreas.findIndex(area => area._id.toString() === areaId);
    
    if (areaIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Service area not found'
      });
    }
    
    settings.serviceAreas[areaIndex] = {
      ...settings.serviceAreas[areaIndex].toObject(),
      ...updates
    };
    
    await settings.save();

    res.json({
      success: true,
      message: 'Service area updated successfully',
      serviceArea: settings.serviceAreas[areaIndex]
    });
  } catch (error) {
    console.error('Error updating service area:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating service area'
    });
  }
};

exports.deleteServiceArea = async (req, res) => {
  try {
    const { areaId } = req.params;
    
    const settings = await SystemSettings.getSettings();
    settings.serviceAreas = settings.serviceAreas.filter(area => area._id.toString() !== areaId);
    await settings.save();

    res.json({
      success: true,
      message: 'Service area deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting service area:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting service area'
    });
  }
};

// Get system overview (settings + services)
exports.getSystemOverview = async (req, res) => {
  try {
    const [settings, services] = await Promise.all([
      SystemSettings.getSettings(),
      Service.find({ available: true })
    ]);

    res.json({
      success: true,
      settings,
      services
    });
  } catch (error) {
    console.error('Error fetching system overview:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching system overview'
    });
  }
};