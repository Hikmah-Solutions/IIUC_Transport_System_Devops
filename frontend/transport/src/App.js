import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DefualtLayout from './layouts/User/DefualtLayout';
import AdminPanelLayout from './layouts/AdminPanelLayout';
// import Footer from './layouts/Footer';
// import Home from './layouts/User/Home';
// import AdminSideBar from './layouts/AdminSideBar';
import AddBusInfo from './components/AddBusInfo';
import SendNotifications from './components/SendNotifications';
import DriverInfo from './components/DriverInfo';
import AddDriver from './components/AddDriver';
import AddHelper from './components/AddHelper';
import HelperInfo from './components/HelperInfo';
import ShowBusInfo from './components/BusInfoShow';
import TripInfo from './components/TripInfo';
import AddSchedule from './components/Schedule';
import ShowSchedule from './components/ShowSchedule';
import AssignBus from './components/AssignBus';
import LiveTrack from './components/LiveTrack';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ShowassignedBuses from './components/ShowAssignedBus';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (token) => {
    setIsAuthenticated(true);
    localStorage.setItem('adminToken', token); // Store token in localStorage
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminToken');
  };

  return (
    <Router>
      <Routes>
        {/* <Route
          path="/"
          element={
            <DefualtLayout>
              <Home />
            </DefualtLayout>
          }
        /> */}
        <Route
          path="/"
          element={
            <DefualtLayout>
              <Login onLogin={handleLogin} />
            </DefualtLayout>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
               <AdminPanelLayout>
                <AdminDashboard onLogout={handleLogout} />
              </AdminPanelLayout>   
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/live-tracking/:vehicleId"
          element={
            <DefualtLayout>
              <LiveTrack />
            </DefualtLayout>
          }
        /> */}
        <Route
          path="/addBusInfo"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminPanelLayout>
                <AddBusInfo />
              </AdminPanelLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/driverInfo"
          element={
            // <ProtectedRoute isAuthenticated={isAuthenticated}>
              // <AdminPanelLayout>
                <DriverInfo />
              // </AdminPanelLayout>
            // </ProtectedRoute>
          }
        />
        <Route
          path="/addDriver"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminPanelLayout>
                <AddDriver />
              </AdminPanelLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/addHelper"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminPanelLayout>
                <AddHelper />
              </AdminPanelLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/helperInfo"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminPanelLayout>
                <HelperInfo />
              </AdminPanelLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sendNotifications"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminPanelLayout>
                <SendNotifications />
              </AdminPanelLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/showBusInfo"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminPanelLayout>
                <ShowBusInfo />
              </AdminPanelLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tripInfo"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminPanelLayout>
                <TripInfo />
              </AdminPanelLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/assignedBuses"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminPanelLayout>
                <ShowassignedBuses />
              </AdminPanelLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/addSchedule"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminPanelLayout>
                <AddSchedule />
              </AdminPanelLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/showSchedule"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminPanelLayout>
                <ShowSchedule />
              </AdminPanelLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/assignBus"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminPanelLayout>
                <AssignBus />
              </AdminPanelLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    
    </Router>
  );
};

export default App;
