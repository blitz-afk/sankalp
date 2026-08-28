import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/Landing/LandingPage';
import LoginPage from '../pages/Login/LoginPage';
import RegisterPage from '../pages/Register/RegisterPage';
import CitizenDashboard from '../pages/Citizen/CitizenDashboard';
import RoleDashboard from '../pages/RoleDashboard';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return <BrowserRouter><Routes>
    <Route path="/" element={<LandingPage />} /><Route path="/login" element={<LoginPage />} /><Route path="/register" element={<RegisterPage />} />
    <Route path="/citizen" element={<ProtectedRoute allowedRole="Citizen"><CitizenDashboard /></ProtectedRoute>} />
    <Route path="/admin" element={<ProtectedRoute allowedRole="Admin"><RoleDashboard /></ProtectedRoute>} />
    <Route path="/evaluator" element={<ProtectedRoute allowedRole="Evaluator"><RoleDashboard /></ProtectedRoute>} />
    <Route path="/industry" element={<ProtectedRoute allowedRole="Industry"><RoleDashboard /></ProtectedRoute>} />
    <Route path="/university" element={<ProtectedRoute allowedRole="University"><RoleDashboard /></ProtectedRoute>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></BrowserRouter>;
}
