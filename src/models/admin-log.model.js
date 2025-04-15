 
const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
  admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  target_table: { type: String, required: true },
  target_id: { type: String, required: true },
  details: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('AdminLog', adminLogSchema);
