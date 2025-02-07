import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex">
     

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Overview Cards */}
        <div className="flex space-x-4">
          <div className="bg-white p-6 rounded-lg shadow-md w-1/4">
            <h2 className="text-xl font-semibold">Total Users</h2>
            <p className="text-3xl font-bold mt-2">500</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md w-1/4">
            <h2 className="text-xl font-semibold">Bus Schedules</h2>
            <p className="text-3xl font-bold mt-2">30</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-4 p-6">
          <button onClick={() => navigate('/addSchedule')} className="bg-green-500 text-white px-4 py-2 rounded">
            Add New Schedule
          </button>
          <button onClick={() => navigate('/showSchedule')} className="bg-blue-500 text-white px-4 py-2 rounded">
            View Schedules
          </button>
        </div>

        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <ul>
            <li className="border-b py-2">Admin added a new bus schedule</li>
            <li className="border-b py-2">User updated his profile</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
