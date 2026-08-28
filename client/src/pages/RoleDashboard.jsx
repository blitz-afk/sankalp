import { useEffect, useMemo, useState } from 'react';
import Header from '../components/common/Header';
import { BarChart3, Building2, ClipboardCheck, GraduationCap, Loader2, RefreshCw, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { completePilot, getRoleWorkspace, startPilot } from '../services/roleService';

const roleCopy = {
  Admin: ['Operations overview', 'Coordinate assigned pilots and civic outcomes from one calm workspace.', BarChart3],
  Evaluator: ['Evaluation queue', 'Review incoming civic reports and help prioritize the work that matters most.', ClipboardCheck],
  Industry: ['Partner workspace', 'Track matched opportunities and keep delivery updates visible to the civic team.', Building2],
  University: ['Research workspace', 'Explore matched challenges and contribute evidence-based solutions.', GraduationCap],
};

const getItemTitle = (item) => item.title || item.name || item.challenge?.title || item.solution?.title || 'Matched opportunity';

export default function RoleDashboard() {
  const { profile } = useAuth();
  const role = profile?.role || 'Admin';
  const [heading, copy, Icon] = roleCopy[role] || roleCopy.Admin;
  const [data, setData] = useState({ profile: null, recommendations: [], pilots: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState('');

  const loadWorkspace = async () => {
    setLoading(true);
    setError('');
    try {
      setData(await getRoleWorkspace(role));
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || 'Unable to load workspace');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadWorkspace(); }, [role]);

  const items = useMemo(() => data.recommendations?.length ? data.recommendations : data.pilots || [], [data]);
  const profileName = data.profile?.name || data.profile?.organizationName || 'Workspace ready';

  const handleStart = async (pilot) => {
    setActionId(pilot._id);
    try { await startPilot(pilot._id); await loadWorkspace(); }
    catch (requestError) { setError(requestError.response?.data?.message || 'Could not start pilot'); }
    finally { setActionId(''); }
  };

  const handleComplete = async (pilot) => {
    const results = window.prompt('Add pilot results (at least 20 characters):');
    if (!results) return;
    setActionId(pilot._id);
    try { await completePilot(pilot._id, results); await loadWorkspace(); }
    catch (requestError) { setError(requestError.response?.data?.message || 'Could not complete pilot'); }
    finally { setActionId(''); }
  };

  return <div className="dashboard"><Header title={heading} /><main className="dashboard-content">
    <div className="workspace-heading"><div><span className="eyebrow">{role} workspace</span><h1 className="page-heading">{heading}</h1><p className="page-copy">{copy}</p></div><button className="secondary-btn" onClick={loadWorkspace} disabled={loading}><RefreshCw size={16} className={loading ? 'spin' : ''} /> Refresh</button></div>
    {error && <div className="error-banner" role="alert">{error}</div>}
    {loading ? <div className="loading-state"><Loader2 size={22} className="spin" /><p>Loading live workspace data…</p></div> : <div className="citizen-layout" style={{ marginTop: 28 }}>
      <section className="panel"><div className="panel-heading"><div><span className="eyebrow">Live connection</span><h2>{profileName}</h2></div><Icon size={22} /></div><p className="panel-copy">Authenticated data from the Sankalp API and MongoDB services.</p><div className="role-data"><Users size={20} /><div><strong>{items.length} {data.recommendations?.length ? 'matched opportunities' : 'assigned pilots'}</strong><p>Updates refresh from your role-specific endpoint.</p></div></div></section>
      <section className="panel"><div className="panel-heading"><div><span className="eyebrow">Your queue</span><h2>{data.recommendations?.length ? 'Recommended work' : 'Assigned work'}</h2></div></div>{items.length ? <div className="action-list">{items.slice(0, 6).map((item) => <div className="role-item" key={item._id || item.id || getItemTitle(item)}><div><strong>{getItemTitle(item)}</strong><span>{item.status || item.description || 'Available in the live workspace.'}</span></div>{role === 'Admin' && item.status === 'Planned' && <button className="small-btn" onClick={() => handleStart(item)} disabled={actionId === item._id}>{actionId === item._id ? 'Saving…' : 'Start pilot'}</button>}{role === 'Admin' && item.status === 'In Progress' && <button className="small-btn" onClick={() => handleComplete(item)} disabled={actionId === item._id}>{actionId === item._id ? 'Saving…' : 'Complete'}</button>}</div>)}</div> : <p className="empty-state">No live items are available for this account yet.</p>}</section>
    </div>}
  </main></div>;
}
