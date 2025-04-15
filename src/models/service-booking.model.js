 
const mongoose = require('mongoose');

const serviceBookingSchema = new mongoose.Schema({
  service_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  center_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceCenter', required: true },
  vehicle_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  status: { type: String, enum: ['requested', 'accepted', 'in_progress', 'completed', 'cancelled'], default: 'requested' },
  booking_time: { type: Date, required: true },
  started_at: { type: Date },
  ended_at: { type: Date },
  feedback: { type: Map, of: String },
}, { timestamps: true });

module.exports = mongoose.model('ServiceBooking', serviceBookingSchema);
