const mongoose = require('mongoose');

const onRoadServiceSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicle_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  problem_description: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  status: {
    type: String,
    enum: ['requested', 'assigned', 'en_route', 'working', 'completed', 'cancelled'],
    default: 'requested',
  },
  mechanic_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assigned_at: { type: Date },
  completed_at: { type: Date },
}, { timestamps: true });

onRoadServiceSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('OnRoadService', onRoadServiceSchema);
