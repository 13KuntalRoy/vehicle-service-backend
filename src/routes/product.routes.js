const express = require('express');
const router = express.Router();
const controller = require('../controllers/product.controller');

// Routes
router.post('/', controller.createProduct);
router.get('/', controller.getAllProducts);
router.get('/:id', controller.getProduct);
router.get('/seller/:sellerId', controller.getProductsBySeller);
router.get('/category/:categoryId', controller.getProductsByCategory);
router.put('/:id', controller.updateProduct);
router.delete('/:id', controller.deleteProduct);

module.exports = router;
