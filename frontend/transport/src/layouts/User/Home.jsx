import React, { useState } from 'react';
import debounce from 'lodash.debounce';
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [date, setDate] = useState('');
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [availableBuses, setAvailableBuses] = useState([]);
  const [startPointSuggestions, setStartPointSuggestions] = useState([]);
  const [endPointSuggestions, setEndPointSuggestions] = useState([]);
  const navigate = useNavigate();

  // Debounced function to fetch suggestions
  const fetchSuggestions = debounce(async (input, type) => {
    if (!input) return;

    try {
      // Updated route API with recent models
      const response = await fetch(`http://localhost:5000/findSchedule/getSchedule?search=${input}`);
      const suggestions = await response.json();

      if (type === 'start') setStartPointSuggestions(suggestions.data || []);
      if (type === 'end') setEndPointSuggestions(suggestions.data || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  }, 300);

  // Handle Search Submission
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!date || !startPoint || !endPoint) {
      alert('Please fill all the fields before searching.');
      return;
    }

    try {
      // Updated buses API with recent model structure
      const response = await fetch(
        `http://localhost:5000/findSchedule/getSchedule?date=${encodeURIComponent(date)}&from=${encodeURIComponent(startPoint)}&to=${encodeURIComponent(endPoint)}`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const { availableBusesAndRoutes } = await response.json();
      setAvailableBuses(availableBusesAndRoutes);
    } catch (error) {
      console.error('Error fetching buses:', error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-extrabold mb-4">Welcome to IIUC Transport System</h1>
          <p className="text-lg mb-8">
            Track buses in real-time, manage assignments, and explore routes with ease.
          </p>
        </div>
      </section>

      {/* Search Buses Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Search for Buses</h2>
        <form
          onSubmit={handleSearch}
          className="grid md:grid-cols-3 gap-8 bg-white p-6 rounded-lg shadow-lg"
        >
          {/* Date Input */}
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="block w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            />
          </div>

          {/* Start Point Input */}
          <div className="relative">
            <label
              htmlFor="startPoint"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Start Point
            </label>
            <input
              type="text"
              id="startPoint"
              value={startPoint}
              onChange={(e) => {
                setStartPoint(e.target.value);
                fetchSuggestions(e.target.value, 'start');
              }}
              className="block w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Enter start point"
              required
            />
            {startPointSuggestions.length > 0 && (
              <ul className="absolute bg-white border rounded-md shadow-lg mt-2 z-10 max-h-40 overflow-y-auto">
                {startPointSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-blue-100 cursor-pointer transition-all"
                    onClick={() => {
                      setStartPoint(suggestion.start_point); // Set start point value
                      setStartPointSuggestions([]); // Clear suggestions
                    }}
                  >
                    {suggestion.start_point} {/* Render start_point */}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* End Point Input */}
          <div className="relative">
            <label
              htmlFor="endPoint"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              End Point
            </label>
            <input
              type="text"
              id="endPoint"
              value={endPoint}
              onChange={(e) => {
                setEndPoint(e.target.value);
                fetchSuggestions(e.target.value, 'end');
              }}
              className="block w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Enter end point"
              required
            />
            {endPointSuggestions.length > 0 && (
              <ul className="absolute bg-white border rounded-md shadow-lg mt-2 z-10 max-h-40 overflow-y-auto">
                {endPointSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-blue-100 cursor-pointer transition-all"
                    onClick={() => {
                      setEndPoint(suggestion.end_point); // Set end point value
                      setEndPointSuggestions([]); // Clear suggestions
                    }}
                  >
                    {suggestion.end_point} {/* Render end_point */}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="submit"
            className="col-span-3 md:col-span-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:from-blue-600 hover:to-indigo-700 transition-all"
          >
            Search
          </button>
        </form>

        {/* Available Buses Section */}
        {availableBuses.length > 0 && (
          <div className="mt-16">
            <h3 className="text-3xl font-bold text-gray-800 mb-8">Available Buses</h3>
            <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableBuses.map((bus) => (
                <li
                  key={bus.busId}
                  className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="p-6">
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">
                      Bus No: {bus.busNo}
                    </h4>
                    <p className="text-gray-600">Route: {bus.routeName}</p>
                    {/* <p className="text-gray-600">Route: {bus.vehicleId}</p> */}
                    <p className="text-gray-600">Bus Type: {bus.busType}</p>
                    <p className="text-gray-600">Bus Time: {bus.scheduleTime}</p>
                    <p className="text-gray-600">Capacity: {bus.capacity}</p>
                  </div>
                  <div className="bg-gray-100 px-6 py-3 text-right">
    <button
        onClick={() =>
            navigate(`/live-tracking/${bus.vehicleId}`, {
                state: { bus }, // Pass the `bus` object here
            })
        }
        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all"
    >
        Live Track
    </button>
</div>

                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
