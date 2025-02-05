import React, { useState } from 'react';

const AddHelper = () => {
  const [name, setName] = useState('');
  const [helperID, setHelperID] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [helperNID, setHelperNID] = useState('');
  
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false); // To track success/failure message

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Clear previous message and status
    setMessage('');
    setIsSuccess(false);
  
    if (!name || !helperID || !phone || !address || !helperNID) {
      setMessage('Please fill in all fields.');
      return;
    }
  
    try {
      const response = await fetch('https://iiuc-transport-system.onrender.com/api/admin/helper-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          helperID,  // Updated field name
          phone,
          address,
          helperNID,  // Updated field name
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setIsSuccess(true); // Set success status
        setMessage('Helper added successfully!');
        setName('');
        setHelperID('');  // Reset helperID field
        setPhone('');
        setAddress('');
        setHelperNID('');  // Reset helperNID field
      } else {
        setIsSuccess(false);
        setMessage(result.message || 'Error adding helper.');
      }
    } catch (error) {
      console.error('Error adding helper:', error);
      setIsSuccess(false);
      setMessage('Error adding helper. Please try again later.');
    }
  };
  
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-center mb-6">Add New Helper</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        {message && (
          <p className={`text-center ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>{message}</p>
        )}

        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Helper Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full px-4 py-2 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-2">
            Helper ID
          </label>
          <input
            type="text"
            id="id"
            value={helperID}
            onChange={(e) => setHelperID(e.target.value)}
            className="block w-full px-4 py-2 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone
          </label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="block w-full px-4 py-2 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            Address
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="block w-full px-4 py-2 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="nid" className="block text-sm font-medium text-gray-700 mb-2">
            NID (National ID)
          </label>
          <input
            type="text"
            id="nid"
            value={helperNID}
            onChange={(e) => setHelperNID(e.target.value)}
            className="block w-full px-4 py-2 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-all"
        >
          Add Helper
        </button>
      </form>
    </div>
  );
};

export default AddHelper;
