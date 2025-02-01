const express = require('express');
const axios = require('axios');
const router = express.Router();

// const { AssignBus, BusInfo, } = require('../../../models');

const VTS_API_URL = process.env.NearestBusurl; // Replace with actual VTS API URL
const API_SECRET_KEY = process.env.SecretKey; // Replace with your API secret key
const TOKEN = process.env.Token; // Replace with your API token


const fetchNearestBusLocation = async (userLat, userLon) => {
    try {
        const payload = {
            product :"VTS API",
            version:"1.0",
            apiName:"getNearestVehicleList",
            apiSecretKey: API_SECRET_KEY,
            token: TOKEN,
            lat: userLat,
            lon: userLon,
            offset:0,
            limit: 10,
        };

        const response = await axios.post(VTS_API_URL, payload, {
            headers: { 'Content-Type': 'text/plain' },
        });
        console.log("Response Data:", response.data);

      
        const data = response.data;
        if (!data || !data.response || !data.response.length) {
            throw new Error("Invalid or empty API response");
        }

        const vehicleData = data.response[0]; // Extract vehicle response

        if (!vehicleData.detailsOfVehicle || !Array.isArray(vehicleData.detailsOfVehicle)) {
            throw new Error("Missing or invalid detailsOfVehicle array");
        }

        // Map over the array to extract each vehicle's details
        const busLocations = vehicleData.detailsOfVehicle.map(vehicle => ({
            vehicleID: vehicle.vehId,
            latitude: vehicle.lat,
            longitude: vehicle.lon,
            speed: vehicle.speed || "N/A",
            distance: vehicle.distance || "N/A",
        }));

        return busLocations;
    } catch (error) {
        console.error("Error fetching bus locations:", error.message);
        return [];
    }
}

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

        // Fetch nearest bus location
        const location = await fetchNearestBusLocation(userLat, userLon);
        if (!location) {
            return res.status(404).json({ error: 'No nearby buses found' });
        }
        console.log("Full API Response:", JSON.stringify(location, null, 2));

        res.json(location);
    } catch (error) {
        console.error('Error fetching nearest bus location:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;