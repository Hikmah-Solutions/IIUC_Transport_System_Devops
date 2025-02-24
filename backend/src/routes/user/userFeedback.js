const express = require('express');
const { Feedback } = require('../../../models'); // Adjust path as needed
const router = express.Router();

// Submit feedback
router.post('/', async (req, res) => {
  try {
    const { name, universityId, department,userType,feedbackType, message } = req.body;

    // Validate input
    if (!name || !universityId || !department ||!userType||!feedbackType || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Save feedback to the database
    const feedback = await Feedback.create({
      name,
      universityId,
      department,
      userType,
      feedbackType,
      message,
    });

    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    console.error('Error submitting feedback:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;