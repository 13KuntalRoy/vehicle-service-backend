const Order = require('../models/order.model');

// 1. Place an Order
exports.placeOrder = async (req, res) => {
  try {
    const order = new Order({ ...req.body, user_id: req.user._id });
    await order.save();
    res.status(201).json({ message: 'Order placed successfully', data: order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to place order', details: error.message });
  }
};

// 2. Get All Orders (User)
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user_id: req.user._id }).populate('delivery_address_id');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
  }
};

// 3. Get Order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('delivery_address_id');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order', details: error.message });
  }
};

// 4. Update Order Status (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, updated_at: new Date() },
      { new: true }
    );
    res.status(200).json({ message: 'Order status updated', data: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status', details: error.message });
  }
};

// 5. Request Return
exports.requestReturn = async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      {
        return_request: {
          status: 'requested',
          reason: req.body.reason,
          initiated_at: new Date()
        }
      },
      { new: true }
    );
    res.status(200).json({ message: 'Return requested', data: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to request return', details: error.message });
  }
};

// 6. Cancel Order
exports.cancelOrder = async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled', updated_at: new Date() },
      { new: true }
    );
    res.status(200).json({ message: 'Order cancelled', data: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel order', details: error.message });
  }
};
