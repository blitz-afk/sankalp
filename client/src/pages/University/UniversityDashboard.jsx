import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import ChallengeCard from '../../components/cards/ChallengeCard';
import SolutionForm from '../../components/forms/SolutionForm';
import challengeService from '../../services/challengeService';
import solutionService from '../../services/solutionService';
import { GraduationCap, Award, CheckCircle, Sparkles } from 'lucide-react';

export const UniversityDashboard = () => {
  const [challenges, setChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await challengeService.getChallenges();
        if (res && res.data && res.data.challenges) {
          setChallenges(res.data.challenges);
        }
      } catch (err) {
        // Fallback demo state
        setChallenges([
          {
            _id: 'ch-1',
            title: 'Automated Micro-Filtration for High-Arsenic Groundwater Wells',
            domain: 'Water & Sanitation',
            statement: 'Design an off-grid solar-powered adsorption filtration system capable of reducing arsenic to <10ppb with low replacement cartridge cost.',
            status: 'ACTIVE',
            rewardOrGrant: '₹5,00,000 Prototype Seed Grant',
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            _id: 'ch-2',
            title: 'Smart Decentralized Bio-Waste to Bio-Gas Conversion for Municipal Markets',
            domain: 'Waste Management',
            statement: 'Develop an automated compact anaerobic digestor with odor suppression for wet vegetable market waste.',
            status: 'ACTIVE',
            rewardOrGrant: '₹7,50,000 Pilot Deployment Grant',
            deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ]);
      }
    };
    fetchChallenges();
  }, []);

  const handleSolutionSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await solutionService.createSolution(formData);
      setSubmissionSuccess(true);
      setTimeout(() => {
        setSubmissionSuccess(false);
        setSelectedChallenge(null);
      }, 2500);
    } catch (err) {
      console.error('Solution submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container page-wrapper">
      <Header
        title="University Innovation & R&D Hub"
        subtitle="Engage academic faculties, research labs, and student innovators to develop verified prototypes for societal challenges."
      />

      {/* University Stats Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <Card padding="1.25rem">
          <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Active Challenges</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '0.25rem' }}>{challenges.length}</div>
        </Card>
        <Card padding="1.25rem">
          <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Available CSR Grants</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--status-success)', marginTop: '0.25rem' }}>₹35,00,000+</div>
        </Card>
        <Card padding="1.25rem">
          <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>AI Matching Score</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)', marginTop: '0.25rem' }}>94% Fit</div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedChallenge ? '1fr 1fr' : '1fr', gap: '2rem' }}>
        {/* Challenges List */}
        <div>
          <h2 style={{ fontSize: '1.3rem', marginBottom: '1.25rem' }}>Open Societal Innovation Challenges</h2>
          <div style={{ display: 'grid', gridTemplateColumns: selectedChallenge ? '1fr' : 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
            {challenges.map((ch) => (
              <ChallengeCard
                key={ch._id}
                challenge={ch}
                onApply={(challenge) => setSelectedChallenge(challenge)}
              />
            ))}
          </div>
        </div>

        {/* Solution Submission Form Modal/Panel */}
        {selectedChallenge && (
          <div>
            <Card padding="2rem" style={{ position: 'sticky', top: '90px', border: '1px solid var(--primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem' }}>Submit Proposal for: {selectedChallenge.title}</h3>
                <Button variant="secondary" size="sm" onClick={() => setSelectedChallenge(null)}>
                  Close
                </Button>
              </div>

              {submissionSuccess ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <CheckCircle size={48} color="var(--status-success)" style={{ margin: '0 auto 1rem auto' }} />
                  <h3>Solution Proposal Submitted!</h3>
                  <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    Your solution has been forwarded to the expert evaluation panel.
                  </p>
                </div>
              ) : (
                <SolutionForm
                  challengeId={selectedChallenge._id}
                  onSubmit={handleSolutionSubmit}
                  isSubmitting={isSubmitting}
                />
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversityDashboard;
