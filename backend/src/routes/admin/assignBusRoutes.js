const express = require('express');
const router = express.Router();
const { AssignBus, BusInfo, BusSchedule } = require('../../../models');
const Joi = require('joi');

// Validation schema
const assignBusSchema = Joi.object({
  busNo: Joi.number().integer().required(),
  scheduleName: Joi.string().required(),
  busType: Joi.string().valid('Students', 'Teachers', 'Staff').required(),
  Gender: Joi.string().valid('N/A','Male', 'Female', 'Both').required(), // Add gender field
  active: Joi.boolean(), // Optional, defaults to true
});
// Create a new assign bus
router.post('/', async (req, res) => {
  try {
    const { error } = assignBusSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if the busNo exists in the BusInfo table
    const busExists = await BusInfo.findOne({
      where: { busNo: req.body.busNo }
    });

    if (!busExists) {
      return res.status(400).json({ error: 'Bus number does not exist' });
    }

    // Check if the scheduleName exists in the BusSchedule table
    const scheduleExists = await BusSchedule.findOne({
      where: { scheduleName: req.body.scheduleName }
    });

    if (!scheduleExists) {
      return res.status(400).json({ error: 'Schedule name does not exist' });
    }

    const newAssignBus = await AssignBus.create(req.body);
    res.status(201).json(newAssignBus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Get all assign buses
router.get('/', async (req, res) => {
  try {
    const {
      busNo,
      scheduleName,
      busType,
      active, // New filter
      page = 1,
      size = 10,
    } = req.query;

    const limit = parseInt(size, 10);
    const offset = (parseInt(page, 10) - 1) * limit;

    const assignBusWhereClause = {};
    if (busNo) assignBusWhereClause.busNo = busNo;
    if (scheduleName) assignBusWhereClause.scheduleName = scheduleName;
    if (busType) assignBusWhereClause.busType = busType;
    if (active !== undefined) assignBusWhereClause.active = active === 'true';

    const assignBuses = await AssignBus.findAndCountAll({
      where: assignBusWhereClause,
      include: [
        {
          model: BusInfo,
          as: 'busInfo',
        },
        {
          model: BusSchedule,
          as: 'scheduleDetails',
        },
      ],
      limit,
      offset,
    });

    res.status(200).json({
      totalItems: assignBuses.count,
      totalPages: Math.ceil(assignBuses.count / limit),
      currentPage: parseInt(page, 10),
      buses: assignBuses.rows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sequelize associations
AssignBus.belongsTo(BusInfo, {
  foreignKey: 'busNo',
  targetKey: 'busNo',
  as: 'busInfo',
});

AssignBus.belongsTo(BusSchedule, {
  foreignKey: 'scheduleName',
  targetKey: 'scheduleName',
  as: 'scheduleDetails',
});


// Get a single assign bus by ID
router.get('/:id', async (req, res) => {
  try {
    const assignBus = await AssignBus.findByPk(req.params.id, {
      include: [
        {
          model: BusInfo,
          as: 'busInfo',
        },
        {
          model: BusSchedule,
          as: 'scheduleDetails',
        },
      ],
    });

    if (assignBus) {
      res.status(200).json(assignBus);
    } else {
      res.status(404).json({ error: 'Assign bus not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an assign bus by ID
router.put('/:id', async (req, res) => {
  try {
    const { error } = assignBusSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if the busNo exists in the BusInfo table
    const busExists = await BusInfo.findOne({
      where: { busNo: req.body.busNo }
    });

    if (!busExists) {
      return res.status(400).json({ error: 'Bus number does not exist' });
    }

    // Check if the scheduleName exists in the BusSchedule table
    const scheduleExists = await BusSchedule.findOne({
      where: { scheduleName: req.body.scheduleName }
    });

    if (!scheduleExists) {
      return res.status(400).json({ error: 'Schedule name does not exist' });
    }

    const [updated] = await AssignBus.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedAssignBus = await AssignBus.findByPk(req.params.id);
      res.status(200).json(updatedAssignBus);
    } else {
      res.status(404).json({ error: 'Assign bus not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete an assign bus by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await AssignBus.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).json("Deleted successfully.");
    } else {
      res.status(404).json({ error: 'Assign bus not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.patch('/:id/toggle-active', async (req, res) => {
  try {
    const assignBus = await AssignBus.findByPk(req.params.id);

    if (!assignBus) {
      return res.status(404).json({ error: 'Assign bus not found' });
    }

    assignBus.active = !assignBus.active;
    await assignBus.save();

    res.status(200).json(assignBus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;