import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import LandingPage from '../pages/Landing/LandingPage';
import LoginPage from '../pages/Login/LoginPage';
import RegisterPage from '../pages/Register/RegisterPage';
import CitizenDashboard from '../pages/Citizen/CitizenDashboard';
import UniversityDashboard from '../pages/University/UniversityDashboard';
import IndustryDashboard from '../pages/Industry/IndustryDashboard';
import EvaluatorDashboard from '../pages/Evaluator/EvaluatorDashboard';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import ProtectedRoute from './ProtectedRoute';
import { ROLES } from '../utils/constants';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Citizen / Open Problem Portal */}
      <Route path="/citizen" element={<CitizenDashboard />} />

      {/* University Portal (Public exploration, authenticated submission) */}
      <Route path="/university" element={<UniversityDashboard />} />

      {/* Industry Portal */}
      <Route path="/industry" element={<IndustryDashboard />} />

      {/* Evaluator Portal */}
      <Route path="/evaluator" element={<EvaluatorDashboard />} />

      {/* Admin Protected Route */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      {/* Catch-all fallback */}
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
};

export default AppRoutes;
