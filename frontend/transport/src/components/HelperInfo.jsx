import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation

const ShowHelperInfo = () => {
  const [helpers, setHelpers] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: '' });
  const [editingHelperId, setEditingHelperId] = useState(null); // Track the helper being edited
  const [editedHelper, setEditedHelper] = useState({}); // Store the edited helper data
  const navigate = useNavigate(); // Initialize navigate function

  // Function to fetch helper data
  const fetchHelperData = async () => {
    try {
      const response = await fetch('https://iiuc-transport-system.onrender.com/api/admin/helper-info');
      console.log(response.status); // Log status to debug
      const result = await response.json();
      console.log(result); // Log the response body
      if (response.ok) {
        setHelpers(result); // Use the result directly
        setStatus({ loading: false, error: '' });
      } else {
        throw new Error(result.message || 'Failed to fetch helper information.');
      }
    } catch (error) {
      console.error('Error fetching helper info:', error);
      setStatus({ loading: false, error: error.message });
    }
  };

  // Fetch helpers on component load
  useEffect(() => {
    fetchHelperData();
  }, []);

  // Handle delete action
  const handleDelete = async (helperID) => {
    if (!window.confirm('Are you sure you want to delete this helper?')) return;

    try {
      const response = await fetch(
        `https://iiuc-transport-system.onrender.com/api/admin/helper-info/${helperID}`,
        {
          method: 'DELETE',
        }
      );
      const result = await response.json();
      if (response.ok) {
        alert('Helper deleted successfully!');
        fetchHelperData(); // Refresh the helper list
      } else {
        alert(result.message || 'Error deleting helper.');
      }
    } catch (error) {
      console.error('Error deleting helper:', error);
      alert('Error deleting helper. Please try again later.');
    }
  };

  // Start editing a helper
  const startEdit = (helper) => {
    setEditingHelperId(helper.id); // Set the ID of the helper being edited
    setEditedHelper({ ...helper }); // Copy the helper's data into the editedHelper state
  };

  // Save the edited helper
  const saveEdit = async (helperID) => {
    try {
      const response = await fetch(
        `https://iiuc-transport-system.onrender.com/api/admin/helper-info/${helperID}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editedHelper),
        }
      );
      const result = await response.json();
      if (response.ok) {
        alert('Helper updated successfully!');
        setEditingHelperId(null); // Exit edit mode
        fetchHelperData(); // Refresh the helper list
      } else {
        alert(result.message || 'Error updating helper.');
      }
    } catch (error) {
      console.error('Error updating helper:', error);
      alert('Error updating helper. Please try again later.');
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingHelperId(null); // Exit edit mode
  };

  // Update edited helper field
  const handleInputChange = (e, field) => {
    setEditedHelper((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  // Add New Helper Button Handler
  const handleAddNewHelper = () => {
    navigate('/addHelper'); // Navigate to Add Helper page
  };

  // Loading state
  if (status.loading) {
    return <p className="text-center">Loading...</p>;
  }

  // Error state
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
              <th className="py-2 px-4 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {helpers.map(({ id, name, helperID, phone, address, helper_nid }) => (
              <tr key={id}>
                {/* Helper Name */}
                <td className="py-2 px-4 border-b text-center">
                  {editingHelperId === id ? (
                    <input
                      type="text"
                      value={editedHelper.name || ''}
                      onChange={(e) => handleInputChange(e, 'name')}
                      className="border px-2 py-1 rounded"
                    />
                  ) : (
                    name
                  )}
                </td>
                {/* Helper ID */}
                <td className="py-2 px-4 border-b text-center">
                  {editingHelperId === id ? (
                    <input
                      type="text"
                      value={editedHelper.helperID || ''}
                      onChange={(e) => handleInputChange(e, 'helperID')}
                      className="border px-2 py-1 rounded"
                    />
                  ) : (
                    helperID
                  )}
                </td>
                {/* Phone */}
                <td className="py-2 px-4 border-b text-center">
                  {editingHelperId === id ? (
                    <input
                      type="text"
                      value={editedHelper.phone || ''}
                      onChange={(e) => handleInputChange(e, 'phone')}
                      className="border px-2 py-1 rounded"
                    />
                  ) : (
                    phone
                  )}
                </td>
                {/* Address */}
                <td className="py-2 px-4 border-b text-center">
                  {editingHelperId === id ? (
                    <input
                      type="text"
                      value={editedHelper.address || ''}
                      onChange={(e) => handleInputChange(e, 'address')}
                      className="border px-2 py-1 rounded"
                    />
                  ) : (
                    address
                  )}
                </td>
                {/* NID */}
                <td className="py-2 px-4 border-b text-center">
                  {editingHelperId === id ? (
                    <input
                      type="text"
                      value={editedHelper.helper_nid || ''}
                      onChange={(e) => handleInputChange(e, 'helper_nid')}
                      className="border px-2 py-1 rounded"
                    />
                  ) : (
                    helper_nid
                  )}
                </td>
                {/* Action Buttons */}
                <td className="py-2 px-4 border-b text-center">
                  {editingHelperId === id ? (
                    <>
                      <button
                        onClick={() => saveEdit(id)}
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
                        onClick={() => startEdit({ id, name, helperID, phone, address, helper_nid })}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2 transition duration-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(id)}
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

export default ShowHelperInfo;