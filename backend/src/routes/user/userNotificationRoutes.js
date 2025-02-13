const express = require('express');
const { Notification } = require('../../../models'); // Adjust path as needed
const router = express.Router();

// Get notifications for students
router.get('/', async (req, res) => {
  try {
    const { isRead } = req.query;

    // Build query based on filters
    const query = { recipientType: 'Student' };
    if (isRead !== undefined) {
      query.isRead = isRead === 'true';
    }

    // Fetch notifications from the database
    const notifications = await Notification.findAll({
      where: query,
      order: [['sentAt', 'DESC']],
    });

    res.status(200).json({ message: 'Notifications retrieved successfully', data: notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.patch('/:id/mark-as-read', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the notification
      const notification = await Notification.findByPk(id);
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }
  
      // Update the notification's read status
      notification.isRead = true;
      await notification.save();
  
      res.status(200).json({ message: 'Notification marked as read', notification });
    } catch (error) {
      console.error('Error marking notification as read:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

module.exports = router;