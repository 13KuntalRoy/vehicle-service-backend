 
const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['car', 'bike', 'truck', 'scooter', 'other'] },
  brand: String,
  model: String,
  registration_number: { type: String, unique: true },
  fuel_type: String,
  manufacture_year: Number,
  color: String,
  service_logs: [{ date: Date, service_id: mongoose.Schema.Types.ObjectId, mechanic_id: mongoose.Schema.Types.ObjectId, notes: String, rating: Number, cost: Number }]
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
