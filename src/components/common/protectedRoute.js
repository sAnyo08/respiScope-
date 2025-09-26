// src/components/common/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, role, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) {
    const redirectTo = requiredRole === 'doctor' ? '/doctor-login' : '/patient-login';
    return <Navigate to={redirectTo} replace />;
  }
  if (requiredRole && role !== requiredRole) return <Navigate to="/" replace />;
  return children;
}
