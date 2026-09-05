import { Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./pages/Landing/LandingPage";
import RegisterPage from "./pages/Register/RegisterPage";

import CitizenRegister from "./pages/Register/CitizenRegister";
import UniversityRegister from "./pages/Register/UniversityRegister";
import IndustryRegister from "./pages/Register/IndustryRegister";

import LoginPage from "./pages/Login/LoginPage";

import CitizenHome from "./pages/Citizen/CitizenHome";
import CitizenDashboard from "./pages/Citizen/CitizenDashboard";
import CitizenReports from "./pages/Citizen/CitizenReports";

import UniversityDashboard from "./pages/University/UniversityDashboard";
import ChallengeDetails from "./pages/University/ChallengeDetails";
import SubmitSolution from "./pages/University/SubmitSolution";
import UniversitySubmission from "./pages/University/UniversitySubmission";

import IndustryDashboard from "./pages/Industry/IndustryDashboard";

export default function App() {
  return (
    <Routes>

      {/* ================================
                    PUBLIC
          ================================= */}

      <Route
        path="/"
        element={<LandingPage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

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
        element={<IndustryRegister />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />


      {/* ================================
                    CITIZEN
          ================================= */}

      <Route
        path="/citizen"
        element={<CitizenHome />}
      />

      <Route
        path="/citizen/report"
        element={<CitizenDashboard />}
      />

      <Route
        path="/citizen/reports"
        element={<CitizenReports />}
      />


      {/* ================================
                  UNIVERSITY
          ================================= */}

      <Route
        path="/university"
        element={<UniversityDashboard />}
      />

      <Route
        path="/university/challenges/:id"
        element={<ChallengeDetails />}
      />

      <Route
        path="/university/challenges/:id/submit"
        element={<SubmitSolution />}
      />

      <Route
        path="/university/challenges/:id/submission"
        element={<UniversitySubmission />}
      />


      {/* ================================
                    INDUSTRY
          ================================= */}

      <Route
        path="/industry"
        element={<IndustryDashboard />}
      />


      {/* ================================
                    FALLBACK
          ================================= */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}