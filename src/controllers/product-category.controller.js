const ProductCategory = require('../models/product-category.model');

// Create Category
exports.createCategory = async (req, res) => {
  try {
    const category = new ProductCategory(req.body);
    await category.save();
    res.status(201).json({ message: 'Category created', data: category });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create category', details: err.message });
  }
};

// Get All Categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await ProductCategory.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories', details: err.message });
  }
};

// Get Single Category
exports.getCategory = async (req, res) => {
  try {
    const category = await ProductCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch category', details: err.message });
  }
};

// Update Category
exports.updateCategory = async (req, res) => {
  try {
    const updated = await ProductCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Category not found' });
    res.status(200).json({ message: 'Category updated', data: updated });
  } catch (err) {
    res.status(500).json({ error: 'Update failed', details: err.message });
  }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const deleted = await ProductCategory.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Category not found' });
    res.status(200).json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed', details: err.message });
  }
};
