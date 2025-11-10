const express = require('express');
const { getTracking, updateTracking } = require('../controllers/trackingController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/:orderId', getTracking);
router.patch('/:orderId', updateTracking);

module.exports = router;