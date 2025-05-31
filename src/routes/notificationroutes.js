const express = require('express');
const router = express.Router();
const { Auth } = require('../middleware/Auth');
const {
  createNotification,
  getNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
} = require('../controllers/notificationcontrollers');

// Create notification
router.post('/', Auth, createNotification);

// Get all notifications (optionally filter by user_id)
router.get('/', Auth, getNotifications);

// Get a single notification by ID
router.get('/:id', Auth, getNotificationById);

// Update a notification by ID
router.put('/:id', Auth, updateNotification);

// Delete a notification by ID
router.delete('/:id', Auth, deleteNotification);

module.exports = router;