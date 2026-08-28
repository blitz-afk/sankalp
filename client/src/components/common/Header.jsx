import { useAuth } from '../../hooks/useAuth';
import { LogOut } from 'lucide-react';

export default function Header({ title }) {
  const { user, profile, signOut } = useAuth();
  const role = profile?.role || 'Citizen';
  return <header className="app-header"><div className="brand-lockup"><div className="brand-mark">S</div><span className="brand-name">Sankalp</span><span className="brand-tag">Civic action, together</span></div><div className="header-right"><span className="header-title">{title}</span><span className="role-pill">{role}</span><span className="header-email">{user?.email}</span><button className="btn btn-ghost" onClick={signOut}><LogOut size={16} /> Sign out</button></div></header>;
}
