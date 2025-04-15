const mongoose = require('mongoose');

const serviceCenterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  provider_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
  contact_email: { type: String, required: true },
  contact_phone: { type: String, required: true },
  whatsapp_number: { type: String },
  location: { type: { type: String, enum: ['Point'] }, coordinates: [Number] }, // GeoJSON
  open_hours: { type: String, required: true },
  rating: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('ServiceCenter', serviceCenterSchema);
