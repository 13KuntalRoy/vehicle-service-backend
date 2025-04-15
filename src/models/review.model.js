 
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewable_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  reviewable_type: { type: String, enum: ['product', 'service', 'mechanic'], required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
