const express = require('express');
const axios = require('axios');
const router = express.Router();
const WebSocket = require('ws');


const VTS_API_URL = process.env.SingleTrackurl; // Replace with actual VTS API URL
const API_SECRET_KEY = process.env.SecretKey; // Replace with your API secret key
const TOKEN = process.env.Token; // Replace with your API token

const fetchBusLocation = async (vehicleID) => {
    try {
        const payload = {
            product: "VTS API",
            version: "1.0",
            apiName: "getVehicleLocation",
            apiSecretKey: API_SECRET_KEY,
            token: TOKEN,
            vehicleID: vehicleID,
        };

        const response = await axios.post(VTS_API_URL, payload, {
            headers: { 'Content-Type': 'text/plain' },
        });

        const data = response.data;
        const vehicleLocation = data?.response?.[0]?.detailsOfLocation?.[0];
        if (vehicleLocation) {
            return {
                vehicleID,
                latitude: vehicleLocation.lat,
                longitude: vehicleLocation.lon,
            };
        } else {
            throw new Error('Location data not found');
        }
    } catch (error) {
        console.error(`Error fetching data for vehicle ${vehicleID}:`, error.message);
        return null;
    }
};

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

router.get('/:id', async (req, res) => {
    const vehicleID = req.params.id;
    const { userLat, userLon } = req.query;

    if (!vehicleID || isNaN(userLat) || isNaN(userLon)) {
        return res.status(400).json({ error: 'Invalid parameters' });
    }

    try {
        const location = await fetchBusLocation(vehicleID);
        if (!location) return res.status(404).json({ error: 'Location not found' });

        const distance = calculateDistance(
            parseFloat(userLat),
            parseFloat(userLon),
            location.latitude,
            location.longitude
        );

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
        const location = await fetchBusLocation(vehicleID);
        if (location) {
            ws.send(JSON.stringify(location));
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

module.exports = { router, server };


module.exports = router;

