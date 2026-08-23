import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { Sparkles, LogOut, User as UserIcon } from 'lucide-react';
import './Navbar.css';

export const Navbar = () => {
  const { currentUser, mongoUser, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">
            <Sparkles size={20} />
          </div>
          <span>SANKALP</span>
        </Link>

        <ul className="navbar-links">
          <li>
            <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
              Overview
            </Link>
          </li>
          <li>
            <Link to="/citizen" className={`nav-item ${isActive('/citizen') ? 'active' : ''}`}>
              Citizen Portal
            </Link>
          </li>
          <li>
            <Link to="/university" className={`nav-item ${isActive('/university') ? 'active' : ''}`}>
              Universities
            </Link>
          </li>
          <li>
            <Link to="/industry" className={`nav-item ${isActive('/industry') ? 'active' : ''}`}>
              Industry & CSR
            </Link>
          </li>
          <li>
            <Link to="/evaluator" className={`nav-item ${isActive('/evaluator') ? 'active' : ''}`}>
              Evaluators
            </Link>
          </li>
          {role === 'ADMIN' && (
            <li>
              <Link to="/admin" className={`nav-item ${isActive('/admin') ? 'active' : ''}`}>
                Admin
              </Link>
            </li>
          )}
        </ul>

        <div className="navbar-auth">
          {currentUser ? (
            <div className="user-profile-badge">
              <UserIcon size={16} color="var(--primary)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                {mongoUser?.displayName || currentUser.email.split('@')[0]}
              </span>
              <Badge variant="primary">{role}</Badge>
              <button
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px',
                }}
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Button variant="secondary" size="sm" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
                Join Platform
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
