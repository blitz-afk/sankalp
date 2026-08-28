import { useEffect, useState } from 'react';
import Header from '../components/common/Header';
import { BarChart3, ClipboardCheck, Building2, GraduationCap, Users, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getGovernmentBody, getIndustryProfile, getUniversityProfile } from '../services/roleService';

const roleCopy = { Admin: ['Operations overview', 'Coordinate reports, teams, and civic outcomes from one calm workspace.', BarChart3], Evaluator: ['Evaluation queue', 'Review incoming civic reports and help prioritize the work that matters most.', ClipboardCheck], Industry: ['Partner workspace', 'Track assigned issues and keep delivery updates visible to the civic team.', Building2], University: ['Research workspace', 'Explore civic patterns and contribute evidence-based solutions.', GraduationCap] };

export default function RoleDashboard() {
  const { profile } = useAuth();
  const role = profile?.role || 'Admin';
  const [heading, copy, Icon] = roleCopy[role] || roleCopy.Admin;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const result = role === 'Industry' ? await getIndustryProfile() : role === 'University' ? await getUniversityProfile() : role === 'Admin' ? await getGovernmentBody() : null;
        if (active) setData(result);
      } catch (requestError) {
        if (active) setError(requestError.message);
      } finally { if (active) setLoading(false); }
    };
    load();
    return () => { active = false; };
  }, [role]);

  return <div className="dashboard"><Header title={heading} /><main className="dashboard-content"><span className="eyebrow">{role} workspace</span><h1 className="page-heading">{heading}</h1><p className="page-copy">{copy}</p><div className="citizen-layout" style={{ marginTop: 28 }}><section className="panel"><div className="panel-heading"><div><span className="eyebrow">Live workspace</span><h2>Connected to Sankalp services</h2></div><Icon size={22} /></div>{loading ? <div className="loading-state"><Loader2 size={22} className="spin" /><p>Loading your workspace…</p></div> : error ? <p className="error-text">{error}</p> : <div className="role-data"><Users size={20} /><div><strong>{data?.name || data?.organizationName || 'Workspace ready'}</strong><p>Live data is being served from the Sankalp backend.</p></div></div>}</section><section className="panel"><div className="panel-heading"><div><span className="eyebrow">Next actions</span><h2>Keep work moving</h2></div></div><div className="action-list"><div><strong>Review assigned work</strong><span>Open your queue and update civic outcomes.</span></div><div><strong>Stay accountable</strong><span>Every action is secured with your Firebase session.</span></div></div></section></div></main></div>;
}
