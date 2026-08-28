import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { registerCitizen } from '../../services/authService';
import { SELF_REGISTRATION_ROLES } from '../../utils/constants';
import { Mail, Lock, Loader as Loader2, CircleAlert as AlertCircle, User, Building2, GraduationCap } from 'lucide-react';

const ROLE_ICONS = { Citizen: User, University: GraduationCap, Industry: Building2 };
const ROLE_DESCRIPTIONS = {
  Citizen: 'Report societal problems in your community',
  University: 'Develop solutions for published challenges',
  Industry: 'Sponsor and support promising solutions',
};

export default function RegisterPage() {
  const { signUp, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState('role');
  const [selectedRole, setSelectedRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setStep('credentials');
    setError('');
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signUp(email, password);
      if (selectedRole === 'Citizen') {
        await registerCitizen();
        await refreshProfile();
        navigate('/citizen');
      } else {
        await refreshProfile();
        navigate(selectedRole === 'University' ? '/university' : '/industry');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {step === 'role' && (
          <>
            <h1 className="auth-title">Create your account</h1>
            <p className="auth-subtitle">Choose how you'll participate in SANKALP</p>
            <div className="role-grid">
              {SELF_REGISTRATION_ROLES.map((role) => {
                const Icon = ROLE_ICONS[role];
                return (
                  <button key={role} className="role-card" onClick={() => handleRoleSelect(role)}>
                    <Icon size={24} />
                    <span className="role-name">{role}</span>
                    <span className="role-desc">{ROLE_DESCRIPTIONS[role]}</span>
                  </button>
                );
              })}
            </div>
            <p className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></p>
          </>
        )}
        {step === 'credentials' && (
          <>
            <div className="role-badge">
              {(() => { const Icon = ROLE_ICONS[selectedRole]; return <><Icon size={16} /> {selectedRole}</>; })()}
            </div>
            <h1 className="auth-title">Create your account</h1>
            <p className="auth-subtitle">Enter your details to get started</p>
            {error && <div className="alert alert-error"><AlertCircle size={16} /> {error}</div>}
            <form onSubmit={handleSignUp} className="auth-form">
              <div className="form-field">
                <label>Email</label>
                <div className="input-wrapper">
                  <Mail size={16} className="input-icon" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email" />
                </div>
              </div>
              <div className="form-field">
                <label>Password</label>
                <div className="input-wrapper">
                  <Lock size={16} className="input-icon" />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" required minLength="6" autoComplete="new-password" />
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? <Loader2 size={16} className="spin" /> : `Continue as ${selectedRole}`}
              </button>
            </form>
            <button className="btn btn-ghost btn-block" onClick={() => setStep('role')}>← Back to role selection</button>
          </>
        )}
      </div>
    </div>
  );
}
