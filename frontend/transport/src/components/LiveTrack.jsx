import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const LiveTracking = () => {
    const { vehicleId } = useParams();
    const [busLocation, setBusLocation] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [center, setCenter] = useState([51.505, -0.09]); // Default center
    const location = useLocation();
    const { bus } = location.state || {}; // Extract bus object from location state

    const customIcon = new L.Icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        shadowSize: [41, 41],
    });

    // Distance calculation function
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth radius in kilometers
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c).toFixed(2); // Distance in kilometers, rounded to 2 decimal places
    };

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ latitude, longitude });
                setCenter([latitude, longitude]); // Set map center to user's location
            },
            (err) => console.error('Error fetching user location:', err.message)
        );
    }, []);

    useEffect(() => {
        if (userLocation && vehicleId) {
            const fetchBusLocation = async () => {
                try {
                    const response = await fetch(
                        `http://localhost:5000/api/user/live-track/liveLocation/${vehicleId}?userLat=${userLocation.latitude}&userLon=${userLocation.longitude}`
                    );
                    if (!response.ok) throw new Error(`Error: ${response.status}`);
                    const data = await response.json();
                    console.log('API Response:', data);

                    if (data.latitude && data.longitude) {
                        setBusLocation(data);
                        setCenter([data.latitude, data.longitude]);
                    } else {
                        console.warn('Missing latitude/longitude in API response');
                    }
                } catch (err) {
                    console.error('Error fetching bus location:', err.message);
                }
            };

            fetchBusLocation();
            const intervalId = setInterval(fetchBusLocation, 10000);
            return () => clearInterval(intervalId);
        }
    }, [userLocation, vehicleId]);

    // Updating map center dynamically based on changes in center state
    const MapCenterUpdater = ({ center }) => {
        const map = useMap();
        useEffect(() => {
            if (center) {
                map.setView(center);
            }
        }, [center, map]);
        return null;
    };

    // Calculate the distance between user's location and bus location
    const distance = busLocation && userLocation
        ? calculateDistance(userLocation.latitude, userLocation.longitude, busLocation.latitude, busLocation.longitude)
        : null;

    return (
        <div className="container mx-auto px-6 py-16">
            <h2 className="text-3xl font-bold text-center mb-8">
                Live Tracking for Vehicle ID: {vehicleId}
            </h2>
            <MapContainer center={center} zoom={13} style={{ width: '100%', height: '400px' }}>
                <MapCenterUpdater center={center} />
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                {busLocation && (
                    <Marker position={[busLocation.latitude, busLocation.longitude]} icon={customIcon}>
                        <Popup>
                            <p>Vehicle ID: {vehicleId}</p>
                            {bus && (
                                <p>Route: {bus.routeName}</p>
                               
                            )}
                            {bus && (
                                <p>Bus Number: {bus.busNo}</p>
                               
                            )}
                            {bus && (
                                <p>Bus Type : {bus.busType}</p>
                               
                            )}
                            {/* <p>Latitude: {busLocation.latitude}</p>
                            <p>Longitude: {busLocation.longitude}</p> */}
                            {distance && (
                                <p>Distance to Bus: {distance} km</p>
                            )}
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
};

export default LiveTracking;
