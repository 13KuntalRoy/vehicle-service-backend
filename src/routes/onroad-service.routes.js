const express = require('express');
const router = express.Router();
const controller = require('../controllers/onroad-service.controller');
const auth = require('../middlewares/auth.middleware');

// Customer requests a service
router.post('/request', auth, controller.requestService);

// Customer views their service requests
router.get('/my', auth, controller.getUserRequests);

// Mechanic fetches nearby requests
router.get('/nearby', auth, controller.getNearbyRequests);

// Mechanic assigns self to a request
router.post('/:service_id/assign', auth, controller.assignMechanic);

// Mechanic updates status (en_route, working, completed)
router.patch('/:service_id/status', auth, controller.updateServiceStatus);

module.exports = router;
