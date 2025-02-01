import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-blue-600 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-lg font-bold">Bus Management System</h1>
        <nav>
          <Link className="mx-2 hover:text-gray-200" to="/">Home</Link>
          <Link className="mx-2 hover:text-gray-200" to="/liveTrack">Nearest Bus</Link>
          {/* <Link className="mx-2 hover:text-gray-200" to="/showBusInfo">Bus Details</Link> */}
          {/* <Link className="mx-2 hover:text-gray-200" to="/showSchedule">ShowSchedule</Link> */}
        </nav>
      </div>
    </header>
  );
};

export default Header;
