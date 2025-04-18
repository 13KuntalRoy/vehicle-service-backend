const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
const authMiddleware = require('../middlewares/auth.middleware');


router.post('/', authMiddleware, notificationController.sendNotification);
router.get('/', authMiddleware, notificationController.getUserNotifications);
router.put('/:id/read', authMiddleware, notificationController.markAsRead);
router.put('/mark-all-read', authMiddleware, notificationController.markAllAsRead);
router.delete('/:id', authMiddleware, notificationController.deleteNotification);

module.exports = router;
