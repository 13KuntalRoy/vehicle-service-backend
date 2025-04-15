 
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  description: String,
  price: Number,
  stock_quantity: Number,
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductCategory' },
  specifications: [{ title: String, description: String }],
  images: [String],
  warranty_months: Number,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
