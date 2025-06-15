import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from './auth';

function ProtectedRoute({ children }) {
  const location = useLocation();
  
  if (!isAuthenticated()) {
    return <Navigate to={`/login?from=${encodeURIComponent(location.pathname)}`} />;
  }
  
  return children;
}

export default ProtectedRoute;
