// src/middlewares/admin.middleware.js
const User = require('../models/user.model');

const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied, admin only' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: 'Error checking admin status' });
  }
};

module.exports = adminMiddleware;
