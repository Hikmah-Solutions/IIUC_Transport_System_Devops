const express = require('express');
const axios = require('axios'); // For making HTTP requests to the proxy server
const router = express.Router();

// Proxy server URL (replace with your actual proxy server URL)
const PROXY_SERVER_URL = process.env.PROXY_SERVER_URL || 'http://localhost:3000';

// Route to fetch nearest buses via the proxy server
router.get('/', async (req, res) => {
    try {
        // Extract and validate parameters
        let { userLat, userLon } = req.query;
        if (!userLat || !userLon || isNaN(userLat) || isNaN(userLon)) {
            return res.status(400).json({ error: 'Invalid latitude or longitude parameters' });
        }

        // Convert to numbers
        userLat = Number(userLat);
        userLon = Number(userLon);

        // Call the proxy server's nearest bus API
        const proxyResponse = await axios.get(`${PROXY_SERVER_URL}/api/proxy/nearest-bus`, {
            params: { userLat, userLon }, // Pass query parameters
        });

        // Extract data from the proxy server's response
        const busLocations = proxyResponse.data;

        if (!busLocations || busLocations.length === 0) {
            return res.status(404).json({ error: 'No nearby buses found' });
        }

        // Log the full API response for debugging
        // console.log("Full API Response:", JSON.stringify(busLocations, null, 2));

        // Send the response to the client
        res.json(busLocations);
    } catch (error) {
        console.error('Error fetching nearest bus location:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;