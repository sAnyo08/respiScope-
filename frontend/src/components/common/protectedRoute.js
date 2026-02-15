// src/components/common/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, role, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    const redirectTo =
      requiredRole === "doctor" ? "/doctor-login" : "/patient-login";
    return <Navigate to={redirectTo} replace />;
  }

  // ✅ Support array or single role
  if (
    requiredRole &&
    Array.isArray(requiredRole) &&
    !requiredRole.includes(role)
  ) {
    return <Navigate to="/" replace />;
  }

  if (
    requiredRole &&
    typeof requiredRole === "string" &&
    role !== requiredRole
  ) {
    return <Navigate to="/" replace />;
  }
  return children;
}
