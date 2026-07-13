import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useContext(AuthContext);

  // Show a progress indicator while verifying session
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#0f172a' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  // Redirect to login if user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to respective dashboard if role is unauthorized
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'Employee') {
      return <Navigate to="/employee" replace />;
    } else if (user.role === 'Support') {
      return <Navigate to="/support" replace />;
    } else if (user.role === 'Manager') {
      return <Navigate to="/manager" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
