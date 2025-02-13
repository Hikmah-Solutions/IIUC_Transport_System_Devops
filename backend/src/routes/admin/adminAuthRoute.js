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


// const express = require('express');
// const jwt = require('jsonwebtoken');
// const router = express.Router();

// // Example hardcoded credentials (replace with database validation)
// const ADMIN_CREDENTIALS = {
//   username: 'admin',
//   password: 'admin123',
// };

// // Admin login route
// router.post('/login', (req, res) => {
//   const { username, password } = req.body;

//   // Check if credentials match
//   if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
//     // Generate a JWT token
//     const token = jwt.sign({ username }, 'your-secret-key', { expiresIn: '1h' });

//     return res.status(200).json({ token }); // Send token to frontend
//   }

//   return res.status(401).json({ message: 'Invalid credentials' });
// });

// module.exports = router;


const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AdminUser } = require('../../../models');
const { body, validationResult } = require('express-validator');
const router = express.Router();
require('dotenv').config();

// Register a new user
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['Super Admin', 'Admin', 'Manager']).withMessage('Invalid role'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password, role } = req.body;

    try {
      const existingUser = await AdminUser.findOne({ where: { email } });
      if (existingUser) return res.status(400).json({ message: 'User already exists' });

      const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS));
      const user = await AdminUser.create({ name, email, password: hashedPassword, role });
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }
);

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Use the imported model
    const user = await AdminUser.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
module.exports = router;