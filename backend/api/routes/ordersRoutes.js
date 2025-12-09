const express = require('express');
const { createOrder, getOrders, getOrderById, updateOrderStatus,verifyQRCode, getAllOrders } = require('../controllers/orderController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/all', getAllOrders);
router.get('/:id', getOrderById);
router.patch('/:id/status', updateOrderStatus);
router.post('/verify-qr', verifyQRCode);


module.exports = router;