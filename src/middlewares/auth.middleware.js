const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    req.user = {
      id: user._id,
      role: user.role
    };

    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err);
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authMiddleware;
