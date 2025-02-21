const express = require('express');
const router = express.Router();
const { BusInfo, DriverInfo, HelperInfo } = require('../../../models');

// Route to get the count of buses, drivers, and helpers
router.get('/', async (req, res) => {
  try {
    // Get the count of buses
    const busCount = await BusInfo.count();

    // Get the count of drivers
    const driverCount = await DriverInfo.count();

    // Get the count of helpers
    const helperCount = await HelperInfo.count();

    // Respond with the counts
    res.status(200).json({
      busCount,
      driverCount,
      helperCount,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;