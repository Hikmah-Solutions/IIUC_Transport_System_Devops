const express = require('express');
const router = express.Router();
const { BusInfo, BusSchedule, AssignBus } = require('../../../models');


router.get('/', async (req, res) => {
  const { date, from, to } = req.query;
  if (!date || !from || !to) {
    return res.status(400).json({ message: 'date, from, and to are required' });
  }
  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      return res.status(400).json({ message: 'Invalid date format' });
    }
    const dayOfWeek = parsedDate.toLocaleString('en-US', { weekday: 'long' });
    const scheduleType = dayOfWeek === 'Friday' ? 'Friday Schedule' : 'Regular Schedule';
    const whereClause = {
      startPoint: from,
      endPoint: to,
      scheduleType,
    };

    // Fetch schedules
    const schedules = await BusSchedule.findAll({
      where: whereClause,
    });
    console.log('Fetched Schedules:', JSON.stringify(schedules, null, 2));

    if (!schedules || schedules.length === 0) {
      return res.status(404).json({ message: 'No schedules available for the selected route and day' });
    }

    // Fetch bus details
    const busDetails = await Promise.all(
      schedules.map(async (schedule) => {
        console.log(`Processing schedule: ${schedule.scheduleName}`);
        const assignedBus = await AssignBus.findOne({
          where: { scheduleName: schedule.scheduleName},
        });
        console.log(`Assigned Bus for ${schedule.scheduleName}:`, assignedBus);

        if (!assignedBus) return null;

        const busInfo = await BusInfo.findOne({
          where: { busNo: assignedBus.busNo },
        });
        console.log(`Bus Info for busNo ${assignedBus.busNo}:`, busInfo);

        if (!busInfo) return null;

        return {
          busId: busInfo.id,
          busNo: busInfo.busNo,
          vehicleId: busInfo.vehicleId,
          capacity: busInfo.capacity,
          driverName: busInfo.driverName,
          driverPhone: busInfo.driverPhone,
          helperName: busInfo.helperName,
          helperPhone: busInfo.helperPhone,
          startPoint: schedule.startPoint,
          endPoint: schedule.endPoint,
          routeName: schedule.route,
          scheduleDate: date,
          scheduleTime: schedule.time,
          busType: assignedBus.busType,
          gender: assignedBus.Gender,
          additionalInfo: busInfo.additionalInfo || null,
        };
      })
    );

    const availableBusesAndRoutes = busDetails.filter(Boolean);
    console.log('Available Buses and Routes:', JSON.stringify(availableBusesAndRoutes, null, 2));

    if (availableBusesAndRoutes.length === 0) {
      return res.status(404).json({ message: 'No buses available for the selected route' });
    }

    return res.status(200).json({ availableBusesAndRoutes });
  } catch (error) {
    console.error('Error fetching buses and routes:', error);
    return res.status(500).json({ message: 'Failed to fetch available buses and routes' });
  }
});
module.exports = router;