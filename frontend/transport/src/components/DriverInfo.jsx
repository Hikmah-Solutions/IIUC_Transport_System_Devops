import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ShowDriverInfo = () => {
  const [drivers, setDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState({ loading: true, error: '' });
  const [editingDriverId, setEditingDriverId] = useState(null); // Track the driver being edited
  const [editedDriver, setEditedDriver] = useState({}); // Store the edited driver data
  const navigate = useNavigate();
  // Function to fetch driver data
  const fetchDriverData = async () => {
    try {
      const response = await fetch('http://147.93.107.88:5000/api/admin/driver-info');
      const result = await response.json();
      if (response.ok) {
        setDrivers(result || []);
        setStatus({ loading: false, error: '' });
      } else {
        throw new Error(result.message || 'Failed to fetch driver information.');
      }
    } catch (error) {
      console.error('Error fetching driver info:', error);
      setStatus({ loading: false, error: error.message });
    }
  };

  // Fetch drivers on component load
  useEffect(() => {
    fetchDriverData();
  }, []);

  // Handle delete action
  const handleDelete = async (driverID) => {
    if (!window.confirm('Are you sure you want to delete this driver?')) return;

    try {
      const response = await fetch(
        `http://147.93.107.88:5000/api/admin/driver-info/${driverID}`,
        {
          method: 'DELETE',
        }
      );
      const result = await response.json();
      if (response.ok) {
        alert('Driver deleted successfully!');
        fetchDriverData(); // Refresh the driver list
      } else {
        alert(result.message || 'Error deleting driver.');
      }
    } catch (error) {
      console.error('Error deleting driver:', error);
      alert('Error deleting driver. Please try again later.');
    }
  };

  // Start editing a driver
  const startEdit = (driver) => {
    setEditingDriverId(driver.id); // Set the ID of the driver being edited
    setEditedDriver({ ...driver }); // Copy the driver's data into the editedDriver state
  };

  // Save the edited driver
  const saveEdit = async (driverID) => {
    try {
      const response = await fetch(
        `http://147.93.107.88:5000/api/admin/driver-info/${driverID}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editedDriver),
        }
      );
      const result = await response.json();
      if (response.ok) {
        alert('Driver updated successfully!');
        setEditingDriverId(null); // Exit edit mode
        fetchDriverData(); // Refresh the driver list
      } else {
        alert(result.message || 'Error updating driver.');
      }
    } catch (error) {
      console.error('Error updating driver:', error);
      alert('Error updating driver. Please try again later.');
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingDriverId(null); // Exit edit mode
  };

  // Update edited driver field
  const handleInputChange = (e, field) => {
    setEditedDriver((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  // Filter drivers based on search term
  const filteredDrivers = drivers.filter((driver) =>
    Object.values(driver).some(
      (value) =>
        typeof value === 'string' &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Loading state
  if (status.loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-2xl">Loading...</p>
      </div>
    );
  }

  // Error state
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
      <div className="flex justify-between mb-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by Name, ID, Phone, or Address"
          className="border px-4 py-2 rounded w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* Add New Driver Button */}
        <button
          onClick={()=> navigate('/addDriver')}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition duration-300"
        >
          Add New Driver
        </button>
      </div>

      {/* Table to Display Drivers */}
      {filteredDrivers.length === 0 ? (
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
              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrivers.map((driver) => (
              <tr key={driver.id}>
                {/* Driver Name */}
                <td className="py-2 px-4 border-b text-center">
                  {editingDriverId === driver.id ? (
                    <input
                      type="text"
                      value={editedDriver.driverName || ''}
                      onChange={(e) => handleInputChange(e, 'driverName')}
                      className="border px-2 py-1 rounded"
                    />
                  ) : (
                    driver.driverName
                  )}
                </td>
                {/* Driver ID */}
                <td className="py-2 px-4 border-b text-center">
                  {editingDriverId === driver.id ? (
                    <input
                      type="text"
                      value={editedDriver.driverID || ''}
                      onChange={(e) => handleInputChange(e, 'driverID')}
                      className="border px-2 py-1 rounded"
                    />
                  ) : (
                    driver.driverID
                  )}
                </td>
                {/* Phone */}
                <td className="py-2 px-4 border-b text-center">
                  {editingDriverId === driver.id ? (
                    <input
                      type="text"
                      value={editedDriver.phone || ''}
                      onChange={(e) => handleInputChange(e, 'phone')}
                      className="border px-2 py-1 rounded"
                    />
                  ) : (
                    driver.phone
                  )}
                </td>
                {/* Address */}
                <td className="py-2 px-4 border-b text-center">
                  {editingDriverId === driver.id ? (
                    <input
                      type="text"
                      value={editedDriver.address || ''}
                      onChange={(e) => handleInputChange(e, 'address')}
                      className="border px-2 py-1 rounded"
                    />
                  ) : (
                    driver.address
                  )}
                </td>
                {/* NID */}
                <td className="py-2 px-4 border-b text-center">
                  {editingDriverId === driver.id ? (
                    <input
                      type="text"
                      value={editedDriver.driverNID || ''}
                      onChange={(e) => handleInputChange(e, 'driverNID')}
                      className="border px-2 py-1 rounded"
                    />
                  ) : (
                    driver.driverNID
                  )}
                </td>
                {/* License */}
                <td className="py-2 px-4 border-b text-center">
                  {editingDriverId === driver.id ? (
                    <input
                      type="text"
                      value={editedDriver.driverLicense || ''}
                      onChange={(e) => handleInputChange(e, 'driverLicense')}
                      className="border px-2 py-1 rounded"
                    />
                  ) : (
                    driver.driverLicense
                  )}
                </td>
                {/* Action Buttons */}
                <td className="py-2 px-4 border-b text-center">
                  {editingDriverId === driver.id ? (
                    <>
                      <button
                        onClick={() => saveEdit(driver.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2 transition duration-300"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded transition duration-300"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(driver)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2 transition duration-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(driver.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition duration-300"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ShowDriverInfo;