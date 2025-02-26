const express = require('express');
const router = express.Router();
const { BusInfo, DriverInfo, HelperInfo, TripTable,BusSchedule } = require('../../../models');
const { Op, fn, col, literal } = require('sequelize');

// Route to get the count of buses, drivers, and helpers
router.get('/', async (req, res) => {
  try {
    // Get the count of buses
    const TotalbusCount = await BusInfo.count();

    // Get the count of active buses
    const activeBusCount = await BusInfo.count({ where: { isActive: true } });

    // Get the count of inactive buses
    const inactiveBusCount = await BusInfo.count({ where: { isActive: false } });

    // Get the count of drivers
    const driverCount = await DriverInfo.count();

    // Get the count of helpers
    const helperCount = await HelperInfo.count();

    // Get the count of students who came today
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const previousDay = new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0];
    const dayBeforePrevious = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0];

    const totalStudentsToday = await TripTable.sum('noOfStudents', {
      where: {
        startPoint: {
          [Op.notRegexp]: '^\\s*iiuc\\s*$' // Case insensitive and ignoring spaces
        },
        tripDate: today
      }
    });

    const totalStudentsPreviousDay = await TripTable.sum('noOfStudents', {
      where: {
        startPoint: {
          [Op.notRegexp]: '^\\s*iiuc\\s*$' // Case insensitive and ignoring spaces
        },
        tripDate: previousDay
      }
    });

    const totalStudentsDayBeforePrevious = await TripTable.sum('noOfStudents', {
      where: {
        startPoint: {
          [Op.notRegexp]: '^\\s*iiuc\\s*$' // Case insensitive and ignoring spaces
        },
        tripDate: dayBeforePrevious
      }
    });

    // Respond with the counts
    res.status(200).json({
      TotalbusCount,
      activeBusCount,
      inactiveBusCount,
      driverCount,
      helperCount,
      totalStudentsToday,
      totalStudentsPreviousDay,
      totalStudentsDayBeforePrevious,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// // Route to get the number of students coming to the university today from different start points and in different time slots
// router.get('/students-today', async (req, res) => {
//   try {
//     const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

//     // Define time slots
//     const slots = [
//       { start: '07:30:00', end: '09:00:00' },
//       { start: '09:30:00', end: '11:00:00' },
//     ];

//     // Query to get the number of students for each start point and time slot
//     const results = await Promise.all(slots.map(async (slot) => {
//       const studentsInSlot = await TripTable.findAll({
//         attributes: ['startPoint', [fn('SUM', col('noOfStudents')), 'totalStudents']],
//         where: {
//           endPoint: 'IIUC',
//           tripDate: today,
//           [Op.and]: [
//             literal(`TIME("createdAt") BETWEEN '${slot.start}' AND '${slot.end}'`)
//           ]
//         },
//         group: ['startPoint']
//       });

//       return {
//         slot: `${slot.start} - ${slot.end}`,
//         data: studentsInSlot
//       };
//     }));

//     // Respond with the results
//     res.status(200).json(results);
//   } catch (error) {
//     console.error('Error fetching students today:', error.message);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// Route to get all schedule types with their active/inactive status
router.get('/schedule-types', async (req, res) => {
  try {
    const scheduleTypes = await BusSchedule.findAll({
      attributes: ['scheduleType', [fn('COUNT', col('id')), 'count'], 'isActive'],
      group: ['scheduleType', 'isActive']
    });

    res.status(200).json(scheduleTypes);
  } catch (error) {
    console.error('Error fetching schedule types:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to toggle the active/inactive status of a schedule type
router.put('/schedule-types/:type/toggle', async (req, res) => {
  try {
    const { type } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ error: 'Invalid isActive value. It should be a boolean.' });
    }

    const [updatedCount] = await BusSchedule.update(
      { isActive },
      { where: { scheduleType: type } }
    );

    res.status(200).json({
      message: `${updatedCount} schedules updated successfully.`,
    });
  } catch (error) {
    console.error('Error toggling schedule type status:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;