 
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  phone_number: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'customer', 'mechanic', 'seller'] },
  gender: String,
  dob: Date,
  profile_image: String,
  is_verified: Boolean,
  status: { type: String, enum: ['active', 'banned'] },
  kyc_document_url: String,
  location: { type: { type: String }, coordinates: [Number] },
  wallet: { balance: Number, last_updated: Date },
  subscription: { plan: String, price: Number, benefits: [String], valid_till: Date },
  mechanic_profile: { skills: [String], certifications: [String], experience_years: Number, hourly_rate: Number },
  seller_profile: { business_name: String, license_number: String, gst_number: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: Date
});

module.exports = mongoose.model('User', userSchema);
