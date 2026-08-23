import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import solutionService from '../../services/solutionService';
import { Briefcase, HeartHandshake, CheckCircle, ExternalLink, Sparkles } from 'lucide-react';

export const IndustryDashboard = () => {
  const [solutions, setSolutions] = useState([]);
  const [sponsoredMap, setSponsoredMap] = useState({});

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const res = await solutionService.getSolutions();
        if (res && res.data && res.data.solutions) {
          setSolutions(res.data.solutions);
        }
      } catch (err) {
        setSolutions([
          {
            _id: 'sol-1',
            title: 'IoT Multi-Stage Nanotech Arsenic Adsorbent Cartridge',
            abstract: 'Low-cost gravity flow filtration cartridge utilizing modified biochar for high-arsenic removal in rural groundwater wells.',
            status: 'EVALUATED',
            averageScore: 92,
            universityName: 'COEP Technological University',
            repositoryUrl: 'https://github.com/example/arsenic-filter',
          },
          {
            _id: 'sol-2',
            title: 'Pre-Sorted Microbial Accelerated Dry Digester for Market Waste',
            abstract: 'Plug-and-play modular bio-methane generator unit reducing organic municipal waste volume by 85% in 24 hours.',
            status: 'EVALUATED',
            averageScore: 89,
            universityName: 'IIT Bombay R&D Lab',
            repositoryUrl: 'https://github.com/example/biowaste-digester',
          },
        ]);
      }
    };
    fetchSolutions();
  }, []);

  const handleSponsor = (id) => {
    setSponsoredMap((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="container page-wrapper">
      <Header
        title="Industry & CSR Partnership Portal"
        subtitle="Discover verified, evaluated academic solutions aligned with ESG goals and CSR deployment mandates."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {solutions.map((sol) => (
          <Card key={sol._id} padding="1.75rem">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <Badge variant="success">Score: {sol.averageScore || 90}/100</Badge>
              <Badge variant="primary">{sol.status}</Badge>
            </div>

            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{sol.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>{sol.abstract}</p>

            <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-dim)' }}>Innovator: </span>
              <strong>{sol.universityName || 'Academic Research Team'}</strong>
            </div>

            {sponsoredMap[sol._id] ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--status-success)', fontWeight: 600, padding: '0.5rem' }}>
                <CheckCircle size={18} />
                <span>Partnership Request Dispatched!</span>
              </div>
            ) : (
              <Button
                variant="primary"
                size="md"
                icon={HeartHandshake}
                onClick={() => handleSponsor(sol._id)}
                style={{ width: '100%' }}
              >
                Offer CSR Sponsorship & Pilot Grant
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default IndustryDashboard;
