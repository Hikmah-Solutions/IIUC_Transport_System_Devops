const express = require('express');
const { Feedback } = require('../../../models'); // Adjust path as needed
const router = express.Router();


// Retrieve all feedback
router.get('/', async (req, res) => {
    try {
      const { status } = req.query;
  
      // Build query based on filters
      const query = {};
      if (status) query.status = status;
  
      // Fetch feedback from the database
      const feedback = await Feedback.findAll({
        where: query,
        order: [['createdAt', 'DESC']],
      });
  
      res.status(200).json({ message: 'Feedback retrieved successfully', data: feedback });
    } catch (error) {
      console.error('Error retrieving feedback:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
});
  
module.exports = router;
