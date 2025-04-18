const express = require('express');
const router = express.Router();
const orderItemController = require('../controllers/orderItem.controller');

const authMiddleware= require('../middlewares/auth.middleware');

router.post('/', authMiddleware, orderItemController.addOrderItem);
router.get('/order/:orderId', authMiddleware, orderItemController.getItemsByOrder);
router.put('/:id', authMiddleware, orderItemController.updateOrderItem);
router.delete('/:id', authMiddleware, orderItemController.deleteOrderItem);

module.exports = router;
