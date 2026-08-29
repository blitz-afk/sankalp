import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/Landing/LandingPage";
import RegisterPage from "./pages/Register/RegisterPage";
import CitizenRegister from "./pages/Register/CitizenRegister";
import LoginPage from "./pages/Login/LoginPage";
import CitizenDashboard from "./pages/Citizen/CitizenDashboard";
import CitizenReports from "./pages/Citizen/CitizenReports";
import UniversityRegister from "./pages/Register/UniversityRegister";
import UniversityDashboard from "./pages/University/UniversityDashboard";

function Placeholder({ title }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f8f5]">
      <div className="text-center">
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="mt-3 text-[#171914]/50">
          Registration form coming next.
        </p>

        <a
          href="/register"
          className="mt-6 inline-block bg-[#171914] px-6 py-3 text-sm text-white"
        >
          Back
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/register/citizen"
        element={<CitizenRegister />}
      />

      <Route
        path="/register/university"
        element={<UniversityRegister />}
      />

      <Route
        path="/register/industry"
        element={<Placeholder title="Industry Registration" />}
      />

      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/citizen"
        element={<CitizenDashboard />}
      />
      <Route
        path="/university"
        element={<UniversityDashboard />}
      />
      <Route
        path="/citizen/reports"
        element={<CitizenReports />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}