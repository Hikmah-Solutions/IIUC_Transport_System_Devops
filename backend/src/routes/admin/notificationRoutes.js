const express = require('express');
const { Notification } = require('../../../models'); // Adjust path as needed
const router = express.Router();

// Create a new notification
router.post('/', async (req, res) => {
  try {
    const { title, message, type, recipientType } = req.body;

    // Validate input
    if (!title || !message || !type || !recipientType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Save notification to the database
    const notification = await Notification.create({
      title,
      message,
      type,
      recipientType,
    });

    // Send push notifications or SMS alerts (optional integration)
    sendNotificationToRecipients(recipientType, title, message);

    res.status(201).json({ message: 'Notification created successfully', notification });
  } catch (error) {
    console.error('Error creating notification:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Helper function to send notifications (e.g., via Firebase or Twilio)
const sendNotificationToRecipients = (recipientType, title, message) => {
  // Example: Use Firebase Cloud Messaging (FCM) or Twilio for sending notifications
  console.log(`Sending ${title} to ${recipientType}: ${message}`);
};

router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      order: [['createdAt', 'DESC']], // Sort by newest first
      limit: 20,
    });

    res.status(200).json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;