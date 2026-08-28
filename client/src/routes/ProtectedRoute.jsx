import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader as Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, allowedRole }) {
  const { user, profile, loading } = useAuth();

  if (loading) return <div className="full-center"><Loader2 size={28} className="spin" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!profile) return <Navigate to="/register" replace />;
  if (allowedRole && profile.role !== allowedRole) {
    const routes = { Citizen: '/citizen', University: '/university', Industry: '/industry', Admin: '/admin' };
    return <Navigate to={routes[profile.role] || '/'} replace />;
  }
  return children;
}
