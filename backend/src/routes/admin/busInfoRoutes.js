const express = require('express');
const router = express.Router();
const { BusInfo, DriverInfo, HelperInfo } = require('../../../models');
const Joi = require('joi');

// Validation schema
const busInfoSchema = Joi.object({
    busNo: Joi.number().required(),
    vehicleId: Joi.string().required(),
    driverName: Joi.string().required(),
    driverPhone: Joi.string().required(),
    helperName: Joi.string().required(),
    helperPhone: Joi.string().required(),
    capacity: Joi.number().required(),
    isActive: Joi.boolean().default(true),
});

router.post('/', async (req, res) => {
    try {
        console.log("Received Bus Data:", req.body); // Debugging line
        
        const newBusInfo = await BusInfo.create(req.body);
        res.status(201).json(newBusInfo);
    } catch (error) {
        console.error("Error adding bus:", error); // Log full error message
        res.status(500).json({ error: error.message });
    }
});

// Get all bus information with search and pagination
router.get('/', async (req, res) => {
    try {
        const {
            busNo,
            isActive,// Search by bus number
            page = 1,     // Default to page 1
            size = 10     // Default page size
        } = req.query;

        const limit = parseInt(size, 10); // Convert size to integer
        const offset = (parseInt(page, 10) - 1) * limit; // Calculate offset

        // Build dynamic where clause for filtering by bus number
        const whereClause = {};
        if (busNo) {
            whereClause.busNo = busNo;
        }

        // Fetch data with pagination and optional search
        const busInfos = await BusInfo.findAndCountAll({
            where: whereClause,
            limit,
            offset,
        });

        // Send paginated response
        res.status(200).json({
            totalItems: busInfos.count, // Total records matching the criteria
            totalPages: Math.ceil(busInfos.count / limit), // Total pages
            currentPage: parseInt(page, 10), // Current page
            buses: busInfos.rows, // Data for the current page
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get bus information by bus number
router.get('/:busNo', async (req, res) => {
    try {
        const { busNo } = req.params;
        console.log(`Fetching bus information for bus number: ${busNo}`); // Add logging

        const busInfo = await BusInfo.findOne({ where: { busNo } });

        if (!busInfo) {
            console.log('Bus information not found'); // Add logging
            return res.status(404).json({ error: 'Bus information not found' });
        }

        res.status(200).json(busInfo);
    } catch (error) {
        console.error('Error fetching bus information:', error); // Add logging
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const busInfo = await BusInfo.findByPk(id);

        if (!busInfo) {
            return res.status(404).json({ error: 'Bus information not found' });
        }

        await busInfo.update(req.body);
        res.status(200).json(busInfo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const busInfo = await BusInfo.findByPk(id);

        if (!busInfo) {
            return res.status(404).json({ error: 'Bus information not found' });
        }

        await busInfo.destroy();
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }   
});


module.exports = router;