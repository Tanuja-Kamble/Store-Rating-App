// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { auth } = useAuth();

  if (!auth) return <Navigate to="/login" />;
  if (!allowedRoles.includes(auth.user.role)) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
