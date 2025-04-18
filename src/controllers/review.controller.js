const Review = require('../models/review.model');

// Add review
exports.addReview = async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json({ message: 'Review added', data: review });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add review', details: err.message });
  }
};

// Get reviews for a specific reviewable entity
exports.getReviewsForEntity = async (req, res) => {
  try {
    const { reviewable_id, reviewable_type } = req.query;
    const reviews = await Review.find({ reviewable_id, reviewable_type });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews', details: err.message });
  }
};

// Get all reviews by a user
exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user_id: req.params.userId });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user reviews', details: err.message });
  }
};

// Update review
exports.updateReview = async (req, res) => {
  try {
    const updated = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Review not found' });
    res.status(200).json({ message: 'Review updated', data: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update review', details: err.message });
  }
};

// Delete review
exports.deleteReview = async (req, res) => {
  try {
    const deleted = await Review.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Review not found' });
    res.status(200).json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete review', details: err.message });
  }
};
