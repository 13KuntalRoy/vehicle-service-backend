const express = require('express');
const router = express.Router();
const controller = require('../controllers/product-category.controller');

// Routes
router.post('/', controller.createCategory);
router.get('/', controller.getAllCategories);
router.get('/:id', controller.getCategory);
router.put('/:id', controller.updateCategory);
router.delete('/:id', controller.deleteCategory);

module.exports = router;
