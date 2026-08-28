import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { DASHBOARD_ROUTES } from '../../utils/constants';
import { LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const dashboard = profile ? DASHBOARD_ROUTES[profile.role] : null;

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">SANKALP</Link>
      <div className="navbar-links">
        {user && dashboard && <Link to={dashboard} className="navbar-link">Dashboard</Link>}
        {user ? (
          <button className="btn btn-ghost btn-sm" onClick={handleSignOut}>
            <LogOut size={16} /> Sign Out
          </button>
        ) : (
          <>
            <Link to="/login" className="navbar-link">Sign In</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
}
