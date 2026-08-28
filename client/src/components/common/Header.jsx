import { useAuth } from '../../hooks/useAuth';
import { LogOut } from 'lucide-react';

export default function Header({ title }) {
  const { user, signOut } = useAuth();
  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="header-title">{title}</h1>
      </div>
      <div className="header-right">
        <span className="header-email">{user?.email}</span>
        <button className="btn btn-ghost btn-sm" onClick={signOut}>
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </header>
  );
}
