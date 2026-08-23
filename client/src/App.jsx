import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/navbar/Navbar';
import AppRoutes from './routes/AppRoutes';
import './App.css';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-layout">
          <Navbar />
          <main className="main-content">
            <AppRoutes />
          </main>
          <footer className="app-footer">
            <div className="container">
              <p>
                <strong>SANKALP</strong> — Societal Innovation Collaboration Platform. Built for open collaboration between citizens, academia, industry, and governance.
              </p>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
