const express = require('express');
const router = express.Router();
const { BusSchedule } = require('../../../models');
const Joi = require('joi');

// Validation schema
const busScheduleSchema = Joi.object({
  scheduleName: Joi.string().required(),
  route: Joi.string().required(),
  startPoint: Joi.string().required(),
  endPoint: Joi.string().required(),
  time: Joi.string().required(),
  scheduleType: Joi.string()
    .valid(
      'Regular Schedule',
      'Friday Schedule',
      'Residential Schedule',
      'Library Schedule',
      'Exam Schedule',
      'Admission Schedule',
      'Special Schedule'
    )
    .required(),
  isActive: Joi.boolean().optional(), // Allow admin to set isActive status directly
});

// Create a new bus schedule
router.post('/', async (req, res) => {
  try {
    const { error } = busScheduleSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const newSchedule = await BusSchedule.create(req.body);
    res.status(201).json(newSchedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all bus schedules with optional filters, pagination, and sorting
router.get('/', async (req, res) => {
  try {
    const {
      scheduleType, // Filter by schedule type
      isActive,     // Filter by active status
      startPoint,   // Filter by start point
      endPoint,     // Filter by end point
      route,        // Filter by route
      page = 1,     // Default to page 1
      size = 10,    // Default page size
      orderBy = 'time', // Default sorting by time
      orderDir = 'ASC', // Default sorting direction
    } = req.query;

    // Build dynamic where clause based on provided filters
    const whereClause = {
      ...(scheduleType && { scheduleType }),
      ...(isActive && { isActive: isActive === 'true' }), // Convert string to boolean
      ...(startPoint && { startPoint }),
      ...(endPoint && { endPoint }),
      ...(route && { route }),
    };

    // Fetch data with pagination and sorting
    const limit = parseInt(size, 10); // Convert size to integer
    const offset = (parseInt(page, 10) - 1) * limit; // Calculate offset

    const busSchedules = await BusSchedule.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [[orderBy, orderDir.toUpperCase()]], // Apply sorting
    });

    // Send paginated response
    res.status(200).json({
      totalItems: busSchedules.count, // Total number of records
      totalPages: Math.ceil(busSchedules.count / limit), // Total pages
      currentPage: parseInt(page, 10), // Current page number
      schedules: busSchedules.rows, // Data for the current page
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single bus schedule by ID
router.get('/:id', async (req, res) => {
  try {
    const busSchedule = await BusSchedule.findByPk(req.params.id);
    if (busSchedule) {
      res.status(200).json(busSchedule);
    } else {
      res.status(404).json({ error: 'Bus schedule not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a bus schedule by ID
router.put('/:id', async (req, res) => {
  try {
    // const { error } = busScheduleSchema.validate(req.body);
    // if (error) {
    //   return res.status(400).json({ error: error.details[0].message });
    // }

    const [updated] = await BusSchedule.update(req.body, {
      where: { scheduleId: req.params.id },
    });
    if (updated) {
      const updatedBusSchedule = await BusSchedule.findByPk(req.params.id);
      res.status(200).json(updatedBusSchedule);
    } else {
      res.status(404).json({ error: 'Bus schedule not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a bus schedule by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await BusSchedule.destroy({
      where: { scheduleId: req.params.id },
    });
    if (deleted) {
      res.status(204).json('Deleted successfully.');
    } else {
      res.status(404).json({ error: 'Bus schedule not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Activate/Deactivate a single schedule by ID
router.put('/:id/toggle', async (req, res) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ error: 'Invalid isActive value.' });
    }

    const [updated] = await BusSchedule.update(
      { isActive },
      { where: { scheduleId: req.params.id } }
    );
    if (updated) {
      const updatedBusSchedule = await BusSchedule.findByPk(req.params.id);
      res.status(200).json(updatedBusSchedule);
    } else {
      res.status(404).json({ error: 'Bus schedule not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Activate/Deactivate all schedules by type
router.put('/toggleByType', async (req, res) => {
  try {
    const { type, isActive } = req.body;

    if (!type || typeof isActive !== 'boolean') {
      return res.status(400).json({ error: 'Invalid type or isActive value.' });
    }

    const updatedCount = await BusSchedule.update(
      { isActive },
      { where: { scheduleType: type } }
    );

    res.status(200).json({
      message: `${updatedCount} schedules updated successfully.`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
