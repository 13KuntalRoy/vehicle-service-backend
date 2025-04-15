 
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['order', 'chat', 'service', 'system'], required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], required: true },
  is_read: { type: Boolean, default: false },
  metadata: { type: Map, of: String },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
