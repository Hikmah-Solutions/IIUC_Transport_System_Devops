import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // Check if the user is authenticated and has the required role
  if (!token || !userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;