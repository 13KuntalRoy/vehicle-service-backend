 
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  method: { type: String, enum: ['card', 'wallet', 'cod', 'upi'] },
  status: { type: String, enum: ['pending', 'successful', 'failed', 'refunded'] },
  transaction_id: String,
  paid_at: Date
});

module.exports = mongoose.model('Payment', paymentSchema);
