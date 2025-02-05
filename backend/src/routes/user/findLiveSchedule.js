const express = require('express');
const router = express.Router();
const { BusInfo, BusSchedule, AssignBus } = require('../../../models');

router.get('/', async (req, res) => {
  const { date, from, to } = req.query;

  // Validate required parameters
  if (!date || !from || !to) {
    return res.status(400).json({ message: 'date, from, and to are required' });
  }

  try {
    // Parse the date and determine the day of the week
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      return res.status(400).json({ message: 'Invalid date format' });
    }
    const dayOfWeek = parsedDate.toLocaleString('en-US', { weekday: 'long' });
    const scheduleType = dayOfWeek === 'Friday' ? 'Friday Schedule' : 'Regular Schedule';

    // Build the where clause for fetching schedules
    const whereClause = {
      // isActive: true,
      startPoint: from,
      endPoint: to,
      scheduleType,
    };



    // Fetch schedules that match the criteria
    const schedules = await BusSchedule.findAll({
      where: whereClause,
    });

    if (!schedules || schedules.length === 0) {
      return res.status(404).json({ message: 'No schedules available for the selected route and day' });
    }

    // Fetch bus assignments and details
    const busDetails = await Promise.all(
      schedules.map(async (schedule) => {
        try {
          // Fetch assigned bus for the schedule
          const assignedBus = await AssignBus.findOne({
            where: { scheduleName: schedule.scheduleName, active: true },
          });
          if (!assignedBus) return null;

          // Fetch bus info for the assigned bus
          const busInfo = await BusInfo.findOne({
            where: { busNo: assignedBus.busNo },
          });
          if (!busInfo) return null;

          // Return consolidated bus details
          return {
            busId: busInfo.id,
            busNo: busInfo.busNo,
            vehicleId: busInfo.vehicleId,
            capacity: busInfo.capacity,
            startPoint: schedule.startPoint,
            endPoint: schedule.endPoint,
            routeName: schedule.route,
            scheduleDate: date,
            scheduleTime: schedule.time,
            busType: assignedBus.busType,
            additionalInfo: busInfo.additionalInfo || null,
          };
        } catch (error) {
          console.error(`Error processing schedule: ${schedule.scheduleName}`, error);
          return null;
        }
      })
    );

    // Filter out null or failed records
    const availableBusesAndRoutes = busDetails.filter(Boolean);

    if (availableBusesAndRoutes.length === 0) {
      return res.status(404).json({ message: 'No buses available for the selected route' });
    }

    // Respond with available buses and routes
    return res.status(200).json({ availableBusesAndRoutes });
  } catch (error) {
    console.error('Error fetching buses and routes:', error);
    return res.status(500).json({ message: 'Failed to fetch available buses and routes' });
  }
});

module.exports = router;