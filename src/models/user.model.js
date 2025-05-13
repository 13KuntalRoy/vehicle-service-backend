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
  is_verified: Boolean, // Flag to mark if the user is fully verified
  phone_verified: { type: Boolean, default: false }, // Flag for OTP verification
  otp: String, // Store the OTP sent to the user
  otp_expiry: Date, // Expiry time for OTP
  status: { type: String, enum: ['active', 'banned'] },
  kyc_document_url: String,
  location: { type: { type: String }, coordinates: [Number] },
  wallet: { balance: Number, last_updated: Date },
  subscription: { plan: String, price: Number, benefits: [String], valid_till: Date },
  mechanic_profile: { skills: [String], certifications: [String], experience_years: Number, hourly_rate: Number },
  seller_profile: { business_name: String, license_number: String, gst_number: String },
  secret: { type: String }, // 2FA Secret
  two_factor_enabled: { type: Boolean, default: false }, // 2FA Status
   // New field for Face Authentication
   face_data: {
    image_url: { type: String }, // URL of the face image
    descriptor: { type: [Number] } // Face descriptor for comparison
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: Date
});

// Automatically update `updated_at` before saving a document
userSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);
