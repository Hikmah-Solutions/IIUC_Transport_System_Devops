import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation

const ShowHelperInfo = () => {
  const [helpers, setHelpers] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: '' });

  const navigate = useNavigate(); // Initialize navigate function

  const handleAddNewHelper = () => {
    navigate('/addHelper'); // Navigate to Add Helper page
  };

  const fetchHelperData = async () => {
    try {
      const response = await fetch('https://iiuc-transport-system.onrender.com/api/admin/helper-info');
      console.log(response.status); // Log status to debug
      const result = await response.json();
      console.log(result); // Log the response body

      if (response.ok) {
        setHelpers(result);  // Use the result directly
        setStatus({ loading: false, error: '' });
      } else {
        throw new Error(result.message || 'Failed to fetch helper information.');
      }
    } catch (error) {
      console.error('Error fetching helper info:', error);
      setStatus({ loading: false, error: error.message });
    }
  };

  useEffect(() => {
    fetchHelperData();
  }, []);

  if (status.loading) {
    return <p className="text-center">Loading...</p>;
  }

  if (status.error) {
    return <p className="text-center text-red-500">{status.error}</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-center mb-6">Helper Information</h2>

      {/* Add New Helper Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleAddNewHelper} // Trigger navigation on button click
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition duration-300"
        >
          Add New Helper
        </button>
      </div>

      {/* Display Helper Info */}
      {helpers.length === 0 ? (
        <p className="text-center">No helper information available.</p>
      ) : (
        <table className="min-w-full bg-white border rounded shadow-md">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Helper Name</th>
              <th className="py-2 px-4 border-b">Helper ID</th>
              <th className="py-2 px-4 border-b">Phone</th>
              <th className="py-2 px-4 border-b">Address</th>
              <th className="py-2 px-4 border-b">NID</th>
            </tr>
          </thead>
          <tbody>
            {helpers.map(({ id, name, helperID, phone, address, helper_nid }) => (
              <tr key={id}>
                <td className="py-2 px-4 border-b text-center">{name}</td>
                <td className="py-2 px-4 border-b text-center">{helperID}</td>
                <td className="py-2 px-4 border-b text-center">{phone}</td>
                <td className="py-2 px-4 border-b text-center">{address}</td>
                <td className="py-2 px-4 border-b text-center">{helper_nid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ShowHelperInfo;
