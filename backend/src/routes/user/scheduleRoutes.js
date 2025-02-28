const express = require('express');
const router = express.Router();
const { BusSchedule } = require('../../../models');

router.get('/', async (req, res) => {
  try {
    const {
      scheduleType, // Default to "Regular Schedule"
      // isActive = 'true', // Default to show only active schedules
      startPoint, // Filter by start point
      endPoint,   // Filter by end point
      direction,  // "From University" or "To University"
      page = 1,   // Default to page 1
      size = 10,  // Default page size
    } = req.query;

    // Build dynamic where clause based on provided filters
    const whereClause = {
      ...(scheduleType && { scheduleType }), // Apply default or user-provided scheduleType
      // ...(isActive !== undefined && { isActive: isActive === 'true' }), // Filter active status
      ...(startPoint && { startPoint }), // Filter by startPoint if provided
      ...(endPoint && { endPoint }),     // Filter by endPoint if provided
    };

    // Handle "From University" or "To University"
    if (direction === 'From University') {
      whereClause.startPoint = 'IIUC'; // Assuming 'University' is the default start point
    } else if (direction === 'To University') {
      whereClause.endPoint = 'IIUC'; // Assuming 'University' is the default end point
    }

    // Pagination
    const limit = parseInt(size, 10);
    const offset = (page - 1) * limit;

    // Fetch schedules with pagination
    const { count, rows } = await BusSchedule.findAndCountAll({
      where: whereClause,
      limit,
      offset,
    });

    // Respond with paginated schedules
    return res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      schedules: rows,
    });
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return res.status(500).json({ message: 'Failed to fetch schedules' });
  }
});

// Route to fetch suggestions for start and end points
router.get('/suggestions', async (req, res) => {
  try {
    const startPoints = await BusSchedule.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('startPoint')), 'startPoint']]
    });

    const endPoints = await BusSchedule.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('endPoint')), 'endPoint']]
    });

    const uniqueStartPoints = startPoints.map(point => point.startPoint);
    const uniqueEndPoints = endPoints.map(point => point.endPoint);

    return res.status(200).json({
      startPoints: uniqueStartPoints,
      endPoints: uniqueEndPoints,
    });
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return res.status(500).json({ message: 'Failed to fetch suggestions' });
  }
});

module.exports = router;