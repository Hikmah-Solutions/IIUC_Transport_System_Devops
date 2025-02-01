import React, { useState, useEffect } from 'react';

const AddBus = () => {
  const [busNo, setBusNo] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [capacity, setCapacity] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [helperName, setHelperName] = useState('');
  const [helperPhone, setHelperPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const [drivers, setDrivers] = useState([]); // Store driver data
  const [helpers, setHelpers] = useState([]); // Store helper data
  const [filteredDrivers, setFilteredDrivers] = useState([]); // Filtered driver data for search
  const [filteredHelpers, setFilteredHelpers] = useState([]); // Filtered helper data for search

  // Fetch Driver and Helper Data
  useEffect(() => {
    const fetchDriverAndHelperData = async () => {
      try {
        const driverResponse = await fetch('http://localhost:5000/api/admin/driver-info');
        const helperResponse = await fetch('http://localhost:5000/api/admin/helper-info');

        const driverData = await driverResponse.json();
        const helperData = await helperResponse.json();

        if (driverResponse.ok && helperResponse.ok) {
          setDrivers(driverData || []);
          setHelpers(helperData || []);
          setFilteredDrivers(driverData || []); // Initial filtered drivers
          setFilteredHelpers(helperData || []); // Initial filtered helpers
        } else {
          throw new Error('Failed to fetch drivers or helpers');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage('Error fetching driver or helper data.');
      }
    };

    fetchDriverAndHelperData();
  }, []);

  const handleDriverChange = (e) => {
    const name = e.target.value;
    setDriverName(name);

    const matchedDriver = drivers.find((driver) => driver.driverName.toLowerCase().includes(name.toLowerCase()));
    if (matchedDriver) {
      setDriverPhone(matchedDriver.phone); // Set driver phone based on selection
    }
    // Update filtered drivers based on input
    setFilteredDrivers(drivers.filter(driver => driver.driverName.toLowerCase().includes(name.toLowerCase())));
  };

  const handleHelperChange = (e) => {
    const name = e.target.value;
    setHelperName(name);

    const matchedHelper = helpers.find((helper) => helper.name.toLowerCase().includes(name.toLowerCase()));
    if (matchedHelper) {
      setHelperPhone(matchedHelper.phone); // Set helper phone based on selection
    }
    // Update filtered helpers based on input
    setFilteredHelpers(helpers.filter(helper => helper.name.toLowerCase().includes(name.toLowerCase())));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous message and status
    setMessage('');
    setIsSuccess(false);

    if (!busNo || !vehicleId || !capacity || !driverName || !helperName) {
      setMessage('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/admin/bus-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          busNo,
          vehicleId,
          driverName,
          driverPhone,
          helperName,
          helperPhone,
          capacity,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage('Bus added successfully!');
        setBusNo('');
        setVehicleId('');
        setCapacity('');
        setDriverName('');
        setDriverPhone('');
        setHelperName('');
        setHelperPhone('');
      } else {
        setIsSuccess(false);
        setMessage(result.message || 'Error adding bus.');
      }
    } catch (error) {
      console.error('Error adding bus:', error);
      setIsSuccess(false);
      setMessage('Error adding bus. Please try again later.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-center mb-6">Add New Bus</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        {message && (
          <p className={`text-center ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>{message}</p>
        )}

        {/* Bus Details */}
        <div className="mb-4">
          <label htmlFor="busNo" className="block text-sm font-medium text-gray-700 mb-2">
            Bus Number
          </label>
          <input
            type="number"
            id="busNo"
            value={busNo}
            onChange={(e) => setBusNo(e.target.value)}
            className="block w-full px-4 py-2 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-700 mb-2">
            Vehicle ID
          </label>
          <input
            type="text"
            id="vehicleId"
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            className="block w-full px-4 py-2 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
            Capacity
          </label>
          <input
            type="number"
            id="capacity"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className="block w-full px-4 py-2 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Driver Information */}
        <div className="mb-4">
          <label htmlFor="driverName" className="block text-sm font-medium text-gray-700 mb-2">
            Driver Name
          </label>
          <input
            type="text"
            id="driverName"
            value={driverName}
            onChange={handleDriverChange}
            className="block w-full px-4 py-2 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Type to search driver"
            required
          />
          <div>
            {filteredDrivers.length > 0 && driverName && (
              <ul className="mt-2 bg-white shadow-md rounded-md">
                {filteredDrivers.map(driver => (
                  <li
                    key={driver.driverID}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => {
                      setDriverName(driver.driverName);
                      setDriverPhone(driver.phone);
                      setFilteredDrivers([]); // Clear suggestions after selection
                    }}
                  >
                    {driver.driverName}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="driverPhone" className="block text-sm font-medium text-gray-700 mb-2">
            Driver Phone
          </label>
          <input
            type="text"
            id="driverPhone"
            value={driverPhone}
            readOnly
            className="block w-full px-4 py-2 rounded-md border-gray-300 bg-gray-100"
          />
        </div>

        {/* Helper Information */}
        <div className="mb-4">
          <label htmlFor="helperName" className="block text-sm font-medium text-gray-700 mb-2">
            Helper Name
          </label>
          <input
            type="text"
            id="helperName"
            value={helperName}
            onChange={handleHelperChange}
            className="block w-full px-4 py-2 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Type to search helper"
            required
          />
          <div>
            {filteredHelpers.length > 0 && helperName && (
              <ul className="mt-2 bg-white shadow-md rounded-md">
                {filteredHelpers.map(helper => (
                  <li
                    key={helper.helperID}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => {
                      setHelperName(helper.name);
                      setHelperPhone(helper.phone);
                      setFilteredHelpers([]); // Clear suggestions after selection
                    }}
                  >
                    {helper.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="helperPhone" className="block text-sm font-medium text-gray-700 mb-2">
            Helper Phone
          </label>
          <input
            type="text"
            id="helperPhone"
            value={helperPhone}
            readOnly
            className="block w-full px-4 py-2 rounded-md border-gray-300 bg-gray-100"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-all"
        >
          Add Bus
        </button>
      </form>
    </div>
  );
};

export default AddBus;
