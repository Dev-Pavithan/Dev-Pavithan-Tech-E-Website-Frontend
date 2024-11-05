// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if the user is logged in
  const isLoggedIn = sessionStorage.getItem('role') === 'user'; // Check if the user is logged in

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
