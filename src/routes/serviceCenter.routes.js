const express = require('express');
const router = express.Router();
const controller = require('../controllers/serviceCenter.controller');

// CRUD endpoints
router.post('', controller.createServiceCenter);
router.get('/', controller.getAllServiceCenters);
router.get('/:id', controller.getServiceCenterById);
router.put('/:id', controller.updateServiceCenter);
router.delete('/:id', controller.deleteServiceCenter);

module.exports = router;
