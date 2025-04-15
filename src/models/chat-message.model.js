 
const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service_booking_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceBooking' },
  message: { type: String, required: true },
  message_type: { type: String, enum: ['text', 'image', 'file'], required: true },
  message_image: { type: String }, // URL to the image or file
  sent_at: { type: Date, default: Date.now },
  status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
}, { timestamps: true });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
