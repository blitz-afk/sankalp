import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/Landing/LandingPage';
import LoginPage from '../pages/Login/LoginPage';
import RegisterPage from '../pages/Register/RegisterPage';
import CitizenDashboard from '../pages/Citizen/CitizenDashboard';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/citizen" element={<ProtectedRoute allowedRole="Citizen"><CitizenDashboard /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
