const express = require('express');
const router = express.Router();
const controller = require('../controllers/vehicle.controller');

// CRUD + service log routes
router.post('/', controller.addVehicle);
router.get('/user/:userId', controller.getUserVehicles);
router.get('/:id', controller.getVehicleById);
router.put('/:id', controller.updateVehicle);
router.delete('/:id', controller.deleteVehicle);

// Add service log
router.post('/:vehicleId/service-log', controller.addServiceLog);

module.exports = router;
