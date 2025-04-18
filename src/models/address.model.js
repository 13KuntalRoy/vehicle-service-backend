const mongoose = require('mongoose');

// Define Address Schema
const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    line1: {
      type: String,
      required: true,
    },
    line2: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere', // Geospatial index for efficient location-based queries
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Create a model based on the schema
const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
