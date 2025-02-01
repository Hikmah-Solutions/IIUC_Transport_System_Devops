const express = require('express');
const router = express.Router();
const { DriverInfo } = require('../../../models');

// Create a new driver information
router.post('/', async (req, res) => {
    try {
        // Basic input validation can be added here (optional)
        if (!req.body.driverName || !req.body.driverID || !req.body.phone || !req.body.address || !req.body.driverNID || !req.body.driverLicense) {
            return res.status(400).json({ error: 'Please provide all the required fields.' });
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
        const driverInfo = await DriverInfo.findByPk(req.params.id);
        if (!driverInfo) {
            return res.status(404).json({ error: 'Driver information not found' });
        }

        // Optional: Check if the body contains valid data
        if (!req.body.name && !req.body.id && !req.body.phone && !req.body.address && !req.body.nid && !req.body.license) {
            return res.status(400).json({ error: 'No valid fields to update' });
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
