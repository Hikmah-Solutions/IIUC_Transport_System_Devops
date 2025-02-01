const express = require('express');
const router = express.Router();
const { AssignBus, BusInfo, TripTable } = require('../../../models');
const { Op } = require('sequelize');

// Fetch trip information based on busNo and/or tripDate
router.get('/fetch-trip-info', async (req, res) => {
  try {
    const { busNo, tripDate } = req.query;

    // If busNo is provided, fetch trip info for that bus only
    if (busNo) {
      const tripInfo = await TripTable.findAll({
        where: { busNo },
        order: [['tripDate', 'DESC']],
      });
      
      return res.status(200).json({ data: tripInfo });

    } else if (tripDate) {
      // If tripDate is provided, fetch trip info for that date only


      // Fetch trip info for the provided date

      const tripInfo = await TripTable.findAll({
        where: { tripDate },
        order: [['tripDate', 'DESC']],
      });

      return res.status(200).json({ data: tripInfo });
    } else {
      // If neither busNo nor tripDate is provided, fetch all trip info
      const tripInfo = await TripTable.findAll({
        order: [['tripDate', 'DESC']],
      });

      return res.status(200).json({ data: tripInfo });
    }
  } catch (error) {
    console.error('Error fetching trip info:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate and save trip information to TripTable
router.post('/generate-trip-info', async (req, res) => {
  try {
    const { tripDate } = req.body;

    // If tripDate is not provided, set it to today's date
    const dateFilter = tripDate ? new Date(tripDate) : new Date();

    // Fetch all assigned buses for the given date (or today's date if no date is provided)
    const trips = await AssignBus.findAll({
      attributes: ['busNo', 'scheduleName'],
      include: [
        {
          model: BusInfo,
          as: 'busDetails', // Alias used for association
          attributes: ['startPoint', 'driverName', 'helperName'],
        },
      ],
    });

    // Map through the trips and prepare the trip data for saving
    const tripData = trips.map((trip) => ({
      busNo: trip.busNo,
      startPoint: trip.busDetails.startPoint,
      driverName: trip.busDetails.driverName,
      helperName: trip.busDetails.helperName,
      noOfStudents: 0, // Default to 0 for now, can be updated later
      tripDate: dateFilter,
    }));

    // Save the generated trip data to TripTable
    const savedTrips = await TripTable.bulkCreate(tripData);

    res.status(201).json({
      message: 'Trip info generated and saved successfully.',
      data: savedTrips,
    });
  } catch (error) {
    console.error('Error generating trip info:', error);
    res.status(500).json({ error: error.message });
  }
});

// Manual trip logging (logging a trip manually)
router.post('/manual-trip', async (req, res) => {
  try {
    const { busNo, startPoint, noOfStudents, subsDriverName, subsHelperName } = req.body;

    // ✅ Validate required fields
    if (!busNo || !startPoint || !noOfStudents) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // ✅ Ensure data types are correct
    if (isNaN(busNo) || isNaN(noOfStudents)) {
      return res.status(400).json({ error: 'Invalid data type for busNo or noOfStudents' });
    }

    // ✅ Fetch the bus info based on busNo to get driverName and helperName
    const busInfo = await BusInfo.findOne({ where: { busNo } });

    if (!busInfo) {
      return res.status(404).json({ error: 'Bus not found for the provided busNo' });
    }

    // Get driver and helper details from BusInfo
    const { driverName, helperName } = busInfo;

    // ✅ Create the trip entry manually with default values for subsDriverName and subsHelperName
    const newTrip = await TripTable.create({
      busNo,
      startPoint,
      driverName, // Use the driverName from the bus info
      helperName, // Use the helperName from the bus info
      subDriverName: subsDriverName || "N/A", // Provide default if null
      subHelperName: subsHelperName || "N/A", // Provide default if null
      noOfStudents,
      noOfTrips: 1,
      tripDate: new Date().toISOString().split("T")[0], // Format to YYYY-MM-DD
    });

    res.status(201).json({
      message: 'Manual trip logged successfully.',
      data: newTrip,
    });
  } catch (error) {
    console.error('❌ Error logging manual trip:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
