const express = require('express');
const axios = require('axios'); // For making HTTP requests to the proxy server
const router = express.Router();
const WebSocket = require('ws');

// Proxy server URL (replace with your actual proxy server URL)
const PROXY_SERVER_URL = process.env.PROXY_SERVER_URL || 'http://localhost:3000';

// Function to calculate distance between two points (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Route to fetch live bus location via the proxy server
router.get('/:id', async (req, res) => {
    const vehicleID = req.params.id;
    const { userLat, userLon } = req.query;

    if (!vehicleID || isNaN(userLat) || isNaN(userLon)) {
        return res.status(400).json({ error: 'Invalid parameters' });
    }

    try {
        // Call the proxy server's live location API
        const proxyResponse = await axios.get(`${PROXY_SERVER_URL}/api/proxy/bus-location/${vehicleID}`);
        const location = proxyResponse.data;

        if (!location) {
            return res.status(404).json({ error: 'Location not found' });
        }

        // Calculate the distance
        const distance = calculateDistance(
            parseFloat(userLat),
            parseFloat(userLon),
            location.latitude,
            location.longitude
        );

        // Respond with the calculated data
        res.json({
            vehicleID: location.vehicleID,
            latitude: location.latitude,
            longitude: location.longitude,
            distance: `${distance.toFixed(2)} km`,
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// WebSocket Server: Real-Time Updates
const wss = new WebSocket.Server({ noServer: true });
wss.on('connection', (ws, req) => {
    const vehicleID = req.url.split('/').pop(); // Extract vehicleID from URL
    console.log(`Client connected for vehicleID: ${vehicleID}`);

    const interval = setInterval(async () => {
        try {
            // Call the proxy server's live location API
            const proxyResponse = await axios.get(`${PROXY_SERVER_URL}/api/proxy/live-location/${vehicleID}`);
            const location = proxyResponse.data;

            if (location) {
                ws.send(JSON.stringify(location));
            }
        } catch (error) {
            console.error(`Error fetching data for vehicle ${vehicleID}:`, error.message);
        }
    }, 5000); // Send updates every 5 seconds

    ws.on('close', () => {
        console.log(`Client disconnected for vehicleID: ${vehicleID}`);
        clearInterval(interval);
    });
});

// Upgrade HTTP Server to WebSocket
const server = require('http').createServer();
server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

module.exports = router;