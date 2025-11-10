const express = require('express');
const { getServices, createService, updateService } = require('../controllers/serviceController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', getServices);
router.post('/', auth, createService);
router.patch('/:id', auth, updateService);

module.exports = router;