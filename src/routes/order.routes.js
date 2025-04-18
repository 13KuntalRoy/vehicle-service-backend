const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

const authMiddleware= require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');


router.post('/', authMiddleware, orderController.placeOrder);
router.get('/', authMiddleware, orderController.getUserOrders);
router.get('/:id', authMiddleware, orderController.getOrderById);
router.put('/:id/status', authMiddleware, adminMiddleware, orderController.updateOrderStatus);
router.put('/:id/return', authMiddleware, orderController.requestReturn);
router.put('/:id/cancel', authMiddleware, orderController.cancelOrder);

module.exports = router;
