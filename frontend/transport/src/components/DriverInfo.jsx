import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ShowDriverInfo = () => {
  const [drivers, setDrivers] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: '' });

  const navigate = useNavigate();

  const handleAddNewDriver = () => {
    navigate('/addDriver');
  };

  const fetchDriverData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/driver-info');
      const result = await response.json();

      if (response.ok) {
        setDrivers(result|| []);
        setStatus({ loading: false, error: '' });
      } else {
        throw new Error(result.message || 'Failed to fetch driver information.');
      }
    } catch (error) {
      console.error('Error fetching driver info:', error);
      setStatus({ loading: false, error: error.message });
    }
  };

  useEffect(() => {
    fetchDriverData();
  }, []);

  if (status.loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl">Loading...</p>
      </div>
    );
  }

  if (status.error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl text-red-600">{status.error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-center mb-6">Driver Information</h2>

      <div className="flex justify-end mb-4">
        <button
          onClick={handleAddNewDriver}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition duration-300"
        >
          Add New Driver
        </button>
      </div>

      {drivers.length === 0 ? (
        <p className="text-center">No driver information available.</p>
      ) : (
        <table className="min-w-full bg-white border rounded shadow-md">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Driver Name</th>
              <th className="py-2 px-4 border-b">Driver ID</th>
              <th className="py-2 px-4 border-b">Phone</th>
              <th className="py-2 px-4 border-b">Address</th>
              <th className="py-2 px-4 border-b">NID</th>
              <th className="py-2 px-4 border-b">License</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map(({ driverName, driverID, phone, address, driverNID, driverLicense }) => (
              <tr key={driverID}>
                <td className="py-2 px-4 border-b text-center">{driverName}</td>
                <td className="py-2 px-4 border-b text-center">{driverID}</td>
                <td className="py-2 px-4 border-b text-center">{phone}</td>
                <td className="py-2 px-4 border-b text-center">{address}</td>
                <td className="py-2 px-4 border-b text-center">{driverNID}</td>
                <td className="py-2 px-4 border-b text-center">{driverLicense}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ShowDriverInfo;
