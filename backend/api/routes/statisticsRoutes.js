const express = require('express');
const router = express.Router();
const { getQuickStats } = require('../controllers/statisticsController');
const authMiddleware = require('../middleware/auth');

// @route   GET api/statistics/quick-stats
// @desc    Get quick statistics for admin dashboard
// @access  Private
router.get('/quick-stats', authMiddleware, getQuickStats);

module.exports = router;
