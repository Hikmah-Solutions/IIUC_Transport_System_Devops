import React from "react";
import { NavLink } from "react-router-dom";
import { Home, ClipboardList, PlusSquare, Calendar, Info, FileText,Bus,BellIcon } from "lucide-react";
import { useNavigate } from 'react-router-dom';
const AdminSidebar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem('adminToken');
    // Redirect to the login page
    navigate('/adminLogin');
  };
  const menuItems = [
    { name: "Home", path: "/admin/dashboard", icon: <Home size={20} /> },
    { name: "Assigned Buses", path: "/assignedBuses", icon: <ClipboardList size={20} /> },
    // { name: "Add Bus", path: "/addBusInfo", icon: <PlusSquare size={20} /> },
    // { name: "Assign Bus", path: "/assignBus", icon: <ClipboardList size={20} /> },
    { name: "Bus Details", path: "/showBusInfo", icon: <Bus size={20} /> },
    // { name: "Schedule", path: "/addSchedule", icon: <Calendar size={20} /> },
    { name: "Schedule", path: "/showSchedule", icon: <Calendar size={20} /> },
    { name: "Driver Info", path: "/driverInfo", icon: <Info size={20} /> },
    { name: "Helper Info", path: "/helperInfo", icon: <Info size={20} /> },
    { name: "Trip Info", path: "/tripInfo", icon: <Info size={20} /> },
    { name: "Notification", path: "/sendNotifications", icon: <BellIcon size={20} /> },
  ];

  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 text-xl font-bold border-b border-gray-700">
        Admin Panel
      </div>

      {/* Sidebar Links */}
      <div className="flex-1">
        <ul className="mt-4">
          {menuItems.map((item, index) => (
            <li key={index} className="mb-2">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 ${
                    isActive ? "bg-gray-700" : ""
                  }`
                }
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
 
 
      {/* Footer (Optional) */}
      {/* <div className="p-4 border-t border-gray-700">
        <NavLink
          to="/admin/settings"
          className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-700"
        >
          <ClipboardList size={20} />
          <span className="ml-3">Settings</span>
        </NavLink>
      </div> */}
      <button
          onClick={handleLogout}
          className="bg-red-500  hover:bg-red-600 px-4 py-2 rounded text-white font-semibold transition duration-300"
        >
          Logout
      </button>
      {/* <footer className="bg-gray-800 text-white py-4 text-center">
    <p>&copy; {new Date().getFullYear()} Admin. All rights reserved.</p>
  </footer> */}
    </div>
    
  );
};

export default AdminSidebar;
