import React from 'react';
import { Link } from 'react-router-dom';
import { Search, User } from 'lucide-react'; // Import icons from lucide-react

const Header = () => {
  return (
    <header className="bg-gray-800 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo Section */}
        {/* <div className="flex items-center">
          <Link to="/admin/dashboard" className="flex items-center">
            <img
              src="https://via.placeholder.com/40" // Random placeholder logo
              alt="Logo"
              className="h-8 w-8 mr-2"
            />
            <h1 className="text-lg font-bold">Bus Management System</h1>
          </Link>
        </div> */}

        {/* Search Bar */}
        <div className="mx-2 w-1/3 relative">
          <h2>IIUC Transport</h2>
          {/* <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 rounded-lg focus:outline-none text-gray-700"
          /> */}
          {/* <Search className="absolute top-2 right-3 text-gray-500" size={20} /> */}
        </div>

        {/* Admin Profile */}
        <div className="relative">
          <button className="flex items-center space-x-2 bg-blue-800 px-3 py-2 rounded-lg hover:bg-blue-900 focus:outline-none">
            <User className="text-white" size={20} />
            <span className="text-sm">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
