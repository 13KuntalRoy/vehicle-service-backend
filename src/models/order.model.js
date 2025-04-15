 
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] },
  delivery_address_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Address' },
  total_price: Number,
  payment_status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'] },
  return_request: { status: String, reason: String, initiated_at: Date, resolved_at: Date },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
