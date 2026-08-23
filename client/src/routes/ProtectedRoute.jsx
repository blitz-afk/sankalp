import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { currentUser, role, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading authentication state...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role) && role !== 'ADMIN') {
    return (
      <div className="container page-wrapper" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2>Access Restricted</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          This portal requires role: {allowedRoles.join(' or ')}. Your current role is {role}.
        </p>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
