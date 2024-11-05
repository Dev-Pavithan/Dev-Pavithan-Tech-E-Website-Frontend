import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isLoggedIn, openLoginModal, children }) => {
  if (!isLoggedIn) {
    openLoginModal();  
    return <Navigate to="/" replace />;  
  }

  return children;
};

export default ProtectedRoute;
