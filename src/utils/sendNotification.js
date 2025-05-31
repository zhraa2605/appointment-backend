const Notification = require('../models/notificationModel');

async function sendNotification({ user_id, type = 'in-app', message }) {
  try {
    await Notification.create({ user_id, type, message });
  } catch (err) {
    console.error('Notification error:', err);
  }
}

module.exports = sendNotification;