import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa'; // Import search icon
import { useNavigate } from 'react-router-dom';

const ShowBusInfo = () => {
  const [busData, setBusData] = useState([]);
  const [status, setStatus] = useState({
    loading: true,
    error: '',
  });

  const navigate = useNavigate(); // Initialize navigate function

  const handleAddNewBus = () => {
    navigate('/addBusInfo'); // Navigate to Add Bus page
  };
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  const fetchBusData = async () => {
    try {
      const response = await fetch('http://147.93.107.88:5000/api/admin/bus-info');
      const result = await response.json();
  
      console.log(result); // Inspect response structure
  
      if (response.ok) {
        setBusData(result.buses || []); // Match the "buses" key
        setStatus({ loading: false, error: '' });
      } else {
        throw new Error(result.message || 'Failed to fetch bus information.');
      }
    } catch (error) {
      console.error('Error fetching bus info:', error);
      setStatus({ loading: false, error: error.message });
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bus?')) {
      try {
        const response = await fetch(`http://147.93.107.88:5000/api/admin/bus-info/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          const result = await response.json();
          setBusData(busData.filter((bus) => bus._id !== id)); // Update the state
          alert(result.message);
        } else {
          const text = await response.text();
          throw new Error(`Server error: ${response.status} - ${text}`);
        }
      } catch (error) {
        console.error('Error deleting bus:', error);
        alert(`Error: ${error.message}`);
      }
    }
  };

  const handleUpdate = (id) => {
    const selectedBus = busData.find((bus) => bus._id === id);
    if (selectedBus) {
      const updatedBusNo = prompt('Enter new Bus Number:', selectedBus.busNo) || selectedBus.busNo;
      const updatedVehicleId = prompt('Enter new Bus Number:', selectedBus.vehicleId) || selectedBus.vehicleId;
      const updatedCapacity = prompt('Enter new Capacity:', selectedBus.capacity) || selectedBus.capacity;

      if (updatedBusNo && updatedVehicleId&& updatedCapacity) {
        updateBus(id, { busNo: updatedBusNo,vehicleId: updatedVehicleId, capacity: updatedCapacity });
      }
    }
  };

  const updateBus = async (id, updatedFields) => {
    try {
      const response = await fetch(`http://147.93.107.88:5000/api/admin/bus-info/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFields),
      });

      if (response.ok) {
        const updatedBus = await response.json();
        setBusData(
          busData.map((bus) => (bus._id === id ? { ...bus, ...updatedFields } : bus))
        );
        alert('Bus updated successfully.');
      } else {
        const result = await response.json();
        throw new Error(result.message || 'Failed to update the bus.');
      }
    } catch (error) {
      console.error('Error updating bus:', error);
      alert(`Error: ${error.message}`);
    }
  };

  // Filter bus data based on search term
  const filteredBusData = busData.filter((bus) =>
    String(bus.busNo).toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(bus.driverName).toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(bus.helperName).toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  useEffect(() => {
    fetchBusData();
  }, []);

  if (status.loading) {
    return <p className="text-center">Loading...</p>;
  }

  if (status.error) {
    return <p className="text-center text-red-500">{status.error}</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-center mb-6">Bus Information</h2>

      {/* Add New Bus Button */}
      <div className="flex justify-end mb-4">
      <button
          onClick={handleAddNewBus} // Trigger navigation on button click
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition duration-300"
        >
          Add New Bus
        </button>
      </div>

      {/* Search Bar with Icon */}
      <div className="flex justify-center mb-6">
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="Search by Bus Number, Driver, or Helper..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term on change
          />
          <div className="absolute top-3 right-3 text-gray-500">
            <FaSearch />
          </div>
        </div>
      </div>

      {filteredBusData.length === 0 ? (
        <p className="text-center">No bus information available.</p>
      ) : (
        <table className="min-w-full bg-white border rounded shadow-md">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Bus Number</th>
              <th className="py-2 px-4 border-b">Vehicle ID</th>
              <th className="py-2 px-4 border-b">Capacity</th>
              <th className="py-2 px-4 border-b">Driver Name</th>
              <th className="py-2 px-4 border-b">Driver Phone</th>
              <th className="py-2 px-4 border-b">Helper Name</th>
              <th className="py-2 px-4 border-b">Helper Phone</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBusData.map(({ _id, busNo, vehicleId, driverName, driverPhone, helperName, helperPhone,capacity, }) => (
              <tr key={_id}>
                <td className="py-2 px-4 border-b text-center">{busNo}</td>
                <td className="py-2 px-4 border-b text-center">{vehicleId}</td>
                <td className="py-2 px-4 border-b text-center">{capacity}</td>
                <td className="py-2 px-4 border-b text-center">{driverName}</td>
                <td className="py-2 px-4 border-b text-center">{driverPhone}</td>
                <td className="py-2 px-4 border-b text-center">{helperName}</td>
                <td className="py-2 px-4 border-b text-center">{helperPhone}</td>
                <td className="py-2 px-4 border-b text-center">
                  <button
                    onClick={() => handleUpdate(_id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mr-2"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(_id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ShowBusInfo;
