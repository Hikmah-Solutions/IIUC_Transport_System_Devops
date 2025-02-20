const express = require('express');
const router = express.Router();
const { DriverInfo } = require('../../../models');
const Joi = require('joi');

// Validation schema
const driverInfoSchema = Joi.object({
  driverName: Joi.string().required(),
  driverID: Joi.string().required(),
  phone: Joi.string().pattern(/^01[0-9]{9}$/).required(), // Phone number must start with 01 and be 11 characters long
  address: Joi.string().required(),
  driverNID: Joi.string().required(),
  driverLicense: Joi.string().required(),
});

// Create a new driver information
router.post('/', async (req, res) => {
  try {
    const { error } = driverInfoSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const createDriverInfo = await DriverInfo.create(req.body);
    res.status(201).json(createDriverInfo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all driver information
router.get('/', async (req, res) => {
  try {
    const driverInfo = await DriverInfo.findAll();
    res.status(200).json(driverInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get driver information by ID
router.get('/:id', async (req, res) => {
  try {
    const driverInfo = await DriverInfo.findByPk(req.params.id);
    if (!driverInfo) {
      return res.status(404).json({ error: 'Driver information not found' });
    }
    res.status(200).json(driverInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update driver information by ID
router.put('/:id', async (req, res) => {
  try {
    const { error } = driverInfoSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const driverInfo = await DriverInfo.findByPk(req.params.id);
    if (!driverInfo) {
      return res.status(404).json({ error: 'Driver information not found' });
    }

    await driverInfo.update(req.body);
    res.status(200).json(driverInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete driver information by ID
router.delete('/:id', async (req, res) => {
  try {
    const driverInfo = await DriverInfo.findByPk(req.params.id);
    if (!driverInfo) {
      return res.status(404).json({ error: 'Driver information not found' });
    }
    await driverInfo.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;