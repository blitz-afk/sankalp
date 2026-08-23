import React, { useState } from 'react';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { ShieldCheck, CheckCircle2, Award } from 'lucide-react';

export const EvaluatorDashboard = () => {
  const [solutionsToEvaluate, setSolutionsToEvaluate] = useState([
    {
      _id: 'sol-eval-1',
      title: 'Solar Powered IoT Telemetry for Urban Water Distribution Contamination',
      challengeTitle: 'Automated Micro-Filtration for High-Arsenic Groundwater Wells',
      abstract: 'Real-time sensors with LoRaWAN connectivity transmitting chlorine, pH, turbidity, and arsenic levels directly to district water dashboards.',
      university: 'National Institute of Technology',
      scores: { feasibility: 85, innovation: 90, impact: 92, scalability: 88, costEffectiveness: 80 },
    },
  ]);

  const [activeSolution, setActiveSolution] = useState(solutionsToEvaluate[0]);
  const [submitted, setSubmitted] = useState(false);

  const handleScoreChange = (key, value) => {
    setActiveSolution({
      ...activeSolution,
      scores: {
        ...activeSolution.scores,
        [key]: parseInt(value) || 0,
      },
    });
  };

  const handleSubmitEvaluation = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="container page-wrapper">
      <Header
        title="Expert Evaluator Scorecard Panel"
        subtitle="Blind peer review and multi-criteria evaluation of submitted academic and prototype innovations."
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem' }}>
        {/* Solution Proposal Preview */}
        <div>
          <Card padding="2rem">
            <Badge variant="primary" style={{ marginBottom: '0.75rem' }}>Solution Under Review</Badge>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{activeSolution.title}</h2>
            <p style={{ color: 'var(--primary)', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: 600 }}>
              Challenge: {activeSolution.challengeTitle}
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              {activeSolution.abstract}
            </p>
            <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-dim)' }}>Submitted by: </span>
              <strong>{activeSolution.university}</strong>
            </div>
          </Card>
        </div>

        {/* Evaluation Score Form */}
        <div>
          <Card padding="2rem">
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={20} color="var(--primary)" />
              <span>Multi-Dimensional Scoring Rubric</span>
            </h3>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <CheckCircle2 size={48} color="var(--status-success)" style={{ margin: '0 auto 1rem auto' }} />
                <h3>Evaluation Recorded Successfully!</h3>
                <p style={{ color: 'var(--text-muted)' }}>The aggregate scorecard has been recalculated.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitEvaluation} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {Object.entries(activeSolution.scores).map(([criterion, val]) => (
                  <div key={criterion}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <label style={{ textTransform: 'capitalize', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                        {criterion.replace(/([A-Z])/g, ' $1')}
                      </label>
                      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{val} / 100</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={val}
                      onChange={(e) => handleScoreChange(criterion, e.target.value)}
                      style={{ width: '100%', accentColor: 'var(--primary)' }}
                    />
                  </div>
                ))}

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                    Qualitative Evaluator Feedback & Feasibility Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe specific strengths, potential bottlenecks, and scalability advice..."
                    defaultValue="Well-designed prototype with robust low-power telemetry. Recommend field testing in high turbidity conditions."
                  />
                </div>

                <Button type="submit" variant="primary" size="md" icon={ShieldCheck}>
                  Submit Verified Scorecard
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EvaluatorDashboard;
