const express = require('express');
const router = express.Router();
const controller = require('../controllers/review.controller');

// Routes
router.post('/', controller.addReview);
router.get('/entity', controller.getReviewsForEntity); // pass reviewable_id & reviewable_type as query
router.get('/user/:userId', controller.getUserReviews);
router.put('/:id', controller.updateReview);
router.delete('/:id', controller.deleteReview);

module.exports = router;
