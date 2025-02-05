// src/components/AddSchedule.js
import React, { useState } from 'react';

const AddSchedule = () => {
  const [scheduleName, setScheduleName] = useState('');
  const [route, setRoute] = useState('');
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [time, setTime] = useState('');
  const [scheduleType, setScheduleType] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setMessage('');
    setIsSuccess(false);

    if (!scheduleName || !route || !startPoint || !endPoint || !time || !scheduleType) {
      setMessage('Please fill in all fields.');
      return;
    }

    try {
      const response = await fetch('https://iiuc-transport-system.onrender.com/api/admin/bus-schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scheduleName,
          route,
          startPoint,
          endPoint,
          time,
          scheduleType,

        }),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage('Schedule added successfully!');
        // Clear the form
        setScheduleName('');
        setRoute('');
        setStartPoint('');
        setEndPoint('');
        setTime('');
        setScheduleType('');
      } else {
        setMessage(result.error || 'Error adding schedule.');
      }
    } catch (error) {
      console.error('Error adding schedule:', error);
      setMessage('Error adding schedule. Please try again later.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-center mb-6">Add New Schedule</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        {message && (
          <p className={`text-center ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}

        <div className="mb-4">
          <label htmlFor="scheduleName" className="block text-sm font-medium text-gray-700 mb-2">
            Schedule Name
          </label>
          <input
            type="text"
            id="scheduleName"
            value={scheduleName}
            onChange={(e) => setScheduleName(e.target.value)}
            className="block w-full px-4 py-2 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="route" className="block text-sm font-medium text-gray-700 mb-2">
            Route
          </label>
          <input
            type="text"
            id="route"
            value={route}
            onChange={(e) => setRoute(e.target.value)}
            className="block w-full px-4 py-2 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="startPoint" className="block text-sm font-medium text-gray-700 mb-2">
            Start Point
          </label>
          <input
            type="text"
            id="startPoint"
            value={startPoint}
            onChange={(e) => setStartPoint(e.target.value)}
            className="block w-full px-4 py-2 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="endPoint" className="block text-sm font-medium text-gray-700 mb-2">
            End Point
          </label>
          <input
            type="text"
            id="endPoint"
            value={endPoint}
            onChange={(e) => setEndPoint(e.target.value)}
            className="block w-full px-4 py-2 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
            Time
          </label>
          <input
            type="time"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="block w-full px-4 py-2 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
  <label htmlFor="scheduleType" className="block text-sm font-medium text-gray-700 mb-2">
    Schedule Type
  </label>
  <select
    id="scheduleType"
    value={scheduleType}
    onChange={(e) => setScheduleType(e.target.value)}
    className="block w-full px-4 py-2 rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500"
    required
  >
    <option value="" disabled>Select Schedule Type</option>
    <option value="Regular Schedule">Regular Schedule</option>
    <option value="Friday Schedule">Friday Schedule</option>
    <option value="Exam Schedule">Exam Schedule</option>
    <option value="Special Schedule">Special Schedule</option>
  </select>
</div>


        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-all"
        >
          Add Schedule
        </button>
      </form>
    </div>
  );
};

export default AddSchedule;
