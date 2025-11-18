const express = require('express');
const router = express.Router();
const systemSettingsController = require('../controllers/systemSettingsController');
const auth = require('../middleware/auth');

// System settings routes
router.get('/', auth, systemSettingsController.getSystemSettings);
router.put('/', auth, systemSettingsController.updateSystemSettings);
router.get('/overview', auth, systemSettingsController.getSystemOverview);

// Pricing routes
router.patch('/pricing', auth, systemSettingsController.updatePricing);

// Business hours routes
router.patch('/business-hours', auth, systemSettingsController.updateBusinessHours);

// Service options routes
router.patch('/service-options', auth, systemSettingsController.updateServiceOptions);

// Service areas routes
router.get('/service-areas', auth, systemSettingsController.getServiceAreas);
router.post('/service-areas', auth, systemSettingsController.addServiceArea);
router.patch('/service-areas/:areaId', auth, systemSettingsController.updateServiceArea);
router.delete('/service-areas/:areaId', auth, systemSettingsController.deleteServiceArea);

module.exports = router;