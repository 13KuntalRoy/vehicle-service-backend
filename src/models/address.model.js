 
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  line1: String,
  city: String,
  state: String,
  postal_code: String,
  latitude: Number,
  longitude: Number,
  is_primary: Boolean
});

module.exports = mongoose.model('Address', addressSchema);
