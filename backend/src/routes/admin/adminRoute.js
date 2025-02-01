// const express = require('express');
// const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
// const BusInfo = require('../models/BusInfo');
// const BusSchedule = require('../models/ScheduleSchema');
// const AssignBus = require('../models/AssignBusSchema');

// const router = express.Router();

// // Add Bus
// router.post('/add-bus', authenticateToken, authorizeRole('Admin', 'Manager'), async (req, res) => {
//   const { busNo, busType } = req.body;

//   try {
//     const newBus = new BusInfo({ busNo, busType });
//     await newBus.save();

//     res.status(201).json({ message: 'Bus added successfully.', bus: newBus });
//   } catch (error) {
//     console.error('Error adding bus:', error);
//     res.status(500).json({ message: 'Internal server error.' });
//   }
// });

// // Add Schedule
// router.post('/add-schedule', authenticateToken, authorizeRole('Admin', 'Manager'), async (req, res) => {
//   const { scheduleName, route, startPoint, endPoint, time, scheduleType } = req.body;

//   try {
//     const newSchedule = new BusSchedule({ scheduleName, route, startPoint, endPoint, time, scheduleType });
//     await newSchedule.save();

//     res.status(201).json({ message: 'Schedule added successfully.', schedule: newSchedule });
//   } catch (error) {
//     console.error('Error adding schedule:', error);
//     res.status(500).json({ message: 'Internal server error.' });
//   }
// });

// // Assign Bus
// router.post('/assign-bus', authenticateToken, authorizeRole('Admin', 'Manager'), async (req, res) => {
//   const { busNo, scheduleName, busType } = req.body;

//   try {
//     const newAssignment = new AssignBus({ busNo, scheduleName, busType });
//     await newAssignment.save();

//     res.status(201).json({ message: 'Bus assigned successfully.', assignment: newAssignment });
//   } catch (error) {
//     console.error('Error assigning bus:', error);
//     res.status(500).json({ message: 'Internal server error.' });
//   }
// });

// module.exports = router;


const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Example hardcoded credentials (replace with database validation)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
};

// Admin login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if credentials match
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    // Generate a JWT token
    const token = jwt.sign({ username }, 'your-secret-key', { expiresIn: '1h' });

    return res.status(200).json({ token }); // Send token to frontend
  }

  return res.status(401).json({ message: 'Invalid credentials' });
});

module.exports = router;
