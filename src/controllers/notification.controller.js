const Notification = require('../models/notification.model');

// 1. Create a new notification
exports.sendNotification = async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.status(201).json({ message: 'Notification sent', data: notification });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send notification', details: error.message });
  }
};

// 2. Get all notifications for a user
exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user_id: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications', details: error.message });
  }
};

// 3. Mark a single notification as read
exports.markAsRead = async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(req.params.id, { is_read: true }, { new: true });
    res.status(200).json({ message: 'Notification marked as read', data: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark as read', details: error.message });
  }
};

// 4. Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete notification', details: error.message });
  }
};

// 5. Optional: Mark all as read
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user_id: req.user._id, is_read: false }, { is_read: true });
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notifications', details: error.message });
  }
};
