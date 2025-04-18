const OrderItem = require('../models/order-item.model');

// 1. Add item to order
exports.addOrderItem = async (req, res) => {
  try {
    const item = new OrderItem(req.body);
    await item.save();
    res.status(201).json({ message: 'Item added to order', data: item });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add item', details: error.message });
  }
};

// 2. Get all items for an order
exports.getItemsByOrder = async (req, res) => {
  try {
    const items = await OrderItem.find({ order_id: req.params.orderId }).populate('product_id');
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items', details: error.message });
  }
};

// 3. Update quantity or price of an item
exports.updateOrderItem = async (req, res) => {
  try {
    const updated = await OrderItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ message: 'Item updated', data: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item', details: error.message });
  }
};

// 4. Delete an item from an order
exports.deleteOrderItem = async (req, res) => {
  try {
    await OrderItem.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Item removed from order' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item', details: error.message });
  }
};
