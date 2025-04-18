const Product = require('../models/product.model');

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ message: 'Product created', data: product });
  } catch (err) {
    res.status(500).json({ error: 'Product creation failed', details: err.message });
  }
};

// Get All Products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category_id').populate('seller_id');
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products', details: err.message });
  }
};

// Get Products by Seller
exports.getProductsBySeller = async (req, res) => {
  try {
    const products = await Product.find({ seller_id: req.params.sellerId }).populate('category_id');
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch seller products', details: err.message });
  }
};

// Get Products by Category
exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category_id: req.params.categoryId }).populate('seller_id');
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch category products', details: err.message });
  }
};

// Get Single Product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category_id').populate('seller_id');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product', details: err.message });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    req.body.updated_at = new Date();
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json({ message: 'Product updated', data: updated });
  } catch (err) {
    res.status(500).json({ error: 'Update failed', details: err.message });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed', details: err.message });
  }
};
