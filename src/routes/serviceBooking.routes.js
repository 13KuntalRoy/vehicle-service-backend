const express = require('express');
const router = express.Router();
const controller = require('../controllers/serviceBooking.controller');

// CRUD endpoints
router.post('/', controller.createBooking);
router.get('/', controller.getAllBookings);
router.get('/user/:userId', controller.getBookingsByUser);
router.get('/center/:centerId', controller.getBookingsByCenter);
router.get('/:id', controller.getBookingById);
router.put('/:id', controller.updateBookingStatus);
router.delete('/:id', controller.deleteBooking);

module.exports = router;
