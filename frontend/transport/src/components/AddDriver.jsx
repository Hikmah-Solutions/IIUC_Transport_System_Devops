import React, { useState } from 'react';

const AddDriver = () => {
  const [driverName, setDriverName] = useState('');
  const [driverID, setDriverID] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setaddress] = useState('');
  const [driverNID, setDriverNID] = useState('');
  const [driverLicense, setDriverLicense] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous message and status
    setMessage('');
    setIsSuccess(false);

    if (!driverName || !driverID || !phone || !address || !driverNID || !driverLicense) {
      setMessage('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/admin/driver-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          driverName,
          driverID,
          phone,
          address,
          driverNID,
          driverLicense,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage('Driver added successfully!');
        setDriverName('');
        setDriverID('');
        setPhone('');
        setaddress('');
        setDriverNID('');
        setDriverLicense('');
      } else {
        setIsSuccess(false);
        setMessage(result.message || 'Error adding driver.');
      }
    } catch (error) {
      console.error('Error adding driver:', error);
      setIsSuccess(false);
      setMessage('Error adding driver. Please try again later.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-center mb-6">Add New Driver</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        {message && (
          <p className={`text-center ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>{message}</p>
        )}

        <div className="mb-4">
          <label htmlFor="driverName" className="block text-sm font-medium text-gray-700 mb-2">
            Driver Name
          </label>
          <input
            type="text"
            id="driverName"
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
            className="block w-full px-4 py-2 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="driverID" className="block text-sm font-medium text-gray-700 mb-2">
            Driver ID
          </label>
          <input
            type="text"
            id="driverID"
            value={driverID}
            onChange={(e) => setDriverID(e.target.value)}
            className="block w-full px-4 py-2 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="driverPhone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone
          </label>
          <input
            type="text"
            id="driverPhone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="block w-full px-4 py-2 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="driverAddress" className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <input
            type="text"
            id="driverAddress"
            value={address}
            onChange={(e) => setaddress(e.target.value)}
            className="block w-full px-4 py-2 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="driverNID" className="block text-sm font-medium text-gray-700 mb-2">
            NID (National ID)
          </label>
          <input
            type="text"
            id="driverNID"
            value={driverNID}
            onChange={(e) => setDriverNID(e.target.value)}
            className="block w-full px-4 py-2 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="driverLicense" className="block text-sm font-medium text-gray-700 mb-2">
            License Number
          </label>
          <input
            type="text"
            id="driverLicense"
            value={driverLicense}
            onChange={(e) => setDriverLicense(e.target.value)}
            className="block w-full px-4 py-2 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-all"
        >
          Add Driver
        </button>
      </form>
    </div>
  );
};

export default AddDriver;
