import React from 'react';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { Shield, Sparkles, Users, FileText, CheckCircle2, TrendingUp } from 'lucide-react';

export const AdminDashboard = () => {
  const platformStats = [
    { title: 'Reported Problems', count: '142', change: '+18% this month', icon: FileText },
    { title: 'Active Challenges', count: '28', change: '8 under evaluation', icon: Sparkles },
    { title: 'Registered Universities', count: '64', change: '+12 new campuses', icon: Users },
    { title: 'Verified Pilots Deployed', count: '19', change: 'Across 6 states', icon: CheckCircle2 },
  ];

  return (
    <div className="container page-wrapper">
      <Header
        title="SANKALP Platform Administration"
        subtitle="Oversight of societal problem intake, AI analysis orchestration, challenge formulations, and pilot verifications."
      />

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {platformStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} padding="1.5rem">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{stat.title}</span>
                <Icon size={20} color="var(--primary)" />
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>{stat.count}</div>
              <div style={{ color: 'var(--status-success)', fontSize: '0.8rem', marginTop: '0.35rem' }}>{stat.change}</div>
            </Card>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <Card padding="2rem">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>AI Automation & Categorization Pipeline</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Gemini AI services automatically cluster incoming citizen problem tickets, detect duplicate filings in identical geographic coordinates, and score urgency/impact.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Badge variant="success">Gemini 2.5 Active</Badge>
            <Badge variant="primary">99.4% Uptime</Badge>
            <Badge variant="info">Auto-Deduplication ON</Badge>
          </div>
        </Card>

        <Card padding="2rem">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Government Pilot Clearances</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Coordinate field deployment testing zones with district collectors, urban local bodies (ULBs), and gram panchayats.
          </p>
          <Button variant="outline" size="sm">
            Manage Pilot Verification Zones
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
