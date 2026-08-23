import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import {
  Users,
  GraduationCap,
  Briefcase,
  Award,
  Landmark,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();

  const lifecycleSteps = [
    { title: '1. Citizen Reports', desc: 'Citizens highlight ground-level community issues.', icon: Users },
    { title: '2. AI Analysis', desc: 'Gemini categorizes, prioritizes & deduplicates problems.', icon: Sparkles },
    { title: '3. Challenge Formulation', desc: 'Problems transform into competitive challenges.', icon: Award },
    { title: '4. University Solutions', desc: 'Faculty and student innovators build technical prototypes.', icon: GraduationCap },
    { title: '5. Expert Evaluation', desc: 'Rigorous multi-criteria assessment & scorecards.', icon: ShieldCheck },
    { title: '6. Industry & CSR Funding', desc: 'Corporate partners sponsor and mentor high-impact solutions.', icon: Briefcase },
    { title: '7. Government Pilot & Scale', desc: 'Municipal zone verification and large-scale deployment.', icon: Landmark },
  ];

  const stakeholders = [
    { role: 'CITIZEN', title: 'Citizens & Communities', desc: 'Report pain points, track progress, and validate neighborhood solutions.', path: '/citizen', badge: 'Grassroots' },
    { role: 'UNIVERSITY', title: 'Universities & Labs', desc: 'Engage research talent on real societal challenges with incubation support.', path: '/university', badge: 'Innovators' },
    { role: 'INDUSTRY', title: 'Industry & CSR Partners', desc: 'Direct CSR funds and enterprise mentorship towards validated innovations.', path: '/industry', badge: 'Sponsors' },
    { role: 'EVALUATOR', title: 'Domain Evaluators', desc: 'Score projects on feasibility, novelty, budget, and environmental impact.', path: '/evaluator', badge: 'Experts' },
  ];

  return (
    <div className="container page-wrapper">
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '3.5rem 1rem', maxWidth: '850px', margin: '0 auto' }}>
        <Badge variant="primary" className="animate-fade-in" style={{ marginBottom: '1.25rem' }}>
          Societal Innovation Collaboration Platform
        </Badge>
        <h1 style={{ fontSize: '3.25rem', lineHeight: '1.15', marginBottom: '1.5rem' }}>
          From Citizen Pain Points to <span className="gradient-text">Scalable Solutions</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '2.5rem' }}>
          SANKALP orchestrates the complete innovation lifecycle — uniting citizens, academia, evaluators, industry sponsors, and governance authorities to solve societal problems at scale.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Button variant="primary" size="lg" onClick={() => navigate('/register')}>
            Get Started <ArrowRight size={18} />
          </Button>
          <Button variant="secondary" size="lg" onClick={() => navigate('/citizen')}>
            Report a Problem
          </Button>
        </div>
      </section>

      {/* Lifecycle Flow */}
      <section style={{ marginTop: '4rem', marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>The SANKALP Innovation Lifecycle</h2>
          <p style={{ color: 'var(--text-muted)' }}>An integrated, transparent pathway from ground reality to deployment</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {lifecycleSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <Card key={idx} padding="1.5rem">
                <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius-sm)', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '1rem' }}>
                  <Icon size={22} />
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{step.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5' }}>{step.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Stakeholder Gateways */}
      <section style={{ marginTop: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Role-Specific Portals</h2>
          <p style={{ color: 'var(--text-muted)' }}>Collaborative workspaces tailored for every stakeholder</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {stakeholders.map((sh, idx) => (
            <Card key={idx} padding="1.75rem" onClick={() => navigate(sh.path)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <Badge variant="primary">{sh.badge}</Badge>
                <ArrowRight size={18} color="var(--text-dim)" />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{sh.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>{sh.desc}</p>
              <Button variant="outline" size="sm" style={{ width: '100%' }}>
                Enter Portal
              </Button>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
