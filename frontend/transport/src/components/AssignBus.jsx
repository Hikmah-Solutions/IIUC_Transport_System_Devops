import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AssignNewBus = () => {
  const navigate = useNavigate();
  const [newAssignment, setNewAssignment] = useState({
    busNo: '',
    scheduleName: '',
    busType: 'Students',
    driverName: '',
    driverPhone: '',
    helperName: '',
    helperPhone: '',
  });
  const [loading, setLoading] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  // Fetch bus details when the busNo changes
  const fetchBusDetails = async (busNo) => {
    setLoading(true);
    try {
      const response = await fetch(`https://iiuc-transport-system.onrender.com/api/admin/bus-info/${busNo}`);
      if (response.ok) {
        const busData = await response.json();
        setNewAssignment((prev) => ({
          ...prev,
          driverName: busData.driverName || '',
          driverPhone: busData.driverPhone || '',
          helperName: busData.helperName || '',
          helperPhone: busData.helperPhone || '',
        }));
      } else {
        throw new Error('Bus not found or an error occurred.');
      }
    } catch (error) {
      console.error('Error fetching bus details:', error);
      alert('Failed to fetch bus details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Debounce the busNo input
  const handleBusNoChange = (e) => {
    const busNo = e.target.value;
    setNewAssignment((prev) => ({ ...prev, busNo }));

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    setDebounceTimeout(
      setTimeout(() => {
        if (busNo) {
          fetchBusDetails(busNo);
        }
      }, 500)
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newAssignment.busNo || !newAssignment.scheduleName) {
      alert('Please fill all required fields.');
      return;
    }

    // Payload excluding driver and helper info
    const payload = {
      busNo: newAssignment.busNo,
      scheduleName: newAssignment.scheduleName,
      busType: newAssignment.busType,
    };

    try {
      const response = await fetch('https://iiuc-transport-system.onrender.com/api/admin/assign-bus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Bus assigned successfully.');
        navigate('/');
      } else {
        const result = await response.json();
        throw new Error(result.error || 'Failed to assign bus.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Assign New Bus</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Bus Number</label>
          <input
            type="text"
            className="w-full border px-4 py-2 rounded"
            value={newAssignment.busNo}
            onChange={handleBusNoChange}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Schedule Name</label>
          <input
            type="text"
            className="w-full border px-4 py-2 rounded"
            value={newAssignment.scheduleName}
            onChange={(e) => setNewAssignment({ ...newAssignment, scheduleName: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Bus Type</label>
          <select
            className="w-full border px-4 py-2 rounded"
            value={newAssignment.busType}
            onChange={(e) => setNewAssignment({ ...newAssignment, busType: e.target.value })}
          >
            <option value="Students">Students</option>
            <option value="Teachers">Teachers</option>
            <option value="Staff">Staff</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Driver Name</label>
          <input
            type="text"
            className="w-full border px-4 py-2 rounded"
            value={newAssignment.driverName}
            readOnly
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Driver Phone</label>
          <input
            type="text"
            className="w-full border px-4 py-2 rounded"
            value={newAssignment.driverPhone}
            readOnly
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Helper Name</label>
          <input
            type="text"
            className="w-full border px-4 py-2 rounded"
            value={newAssignment.helperName}
            readOnly
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Helper Phone</label>
          <input
            type="text"
            className="w-full border px-4 py-2 rounded"
            value={newAssignment.helperPhone}
            readOnly
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Assigning...' : 'Assign Bus'}
        </button>
        <button
          type="button"
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded ml-4"
          onClick={() => navigate('/')}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AssignNewBus;
