import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';
import ProblemCard from '../../components/cards/ProblemCard';
import ProblemForm from '../../components/forms/ProblemForm';
import problemService from '../../services/problemService';
import { useAuth } from '../../hooks/useAuth';
import { Sparkles, MessageSquarePlus, Filter } from 'lucide-react';

export const CitizenDashboard = () => {
  const { currentUser } = useAuth();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzingId, setAnalyzingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const res = await problemService.getProblems(filterCategory ? { category: filterCategory } : {});
      if (res && res.data && res.data.problems) {
        setProblems(res.data.problems);
      }
    } catch (err) {
      console.warn('Could not load problems from API, displaying default state:', err.message);
      // Fallback demo state
      setProblems([
        {
          _id: 'demo-p1',
          title: 'Severe groundwater contamination & lack of filtration in peri-urban village',
          description: 'High fluoride and arsenic levels detected in 4 community borewells affecting over 1,200 households.',
          category: 'Water & Sanitation',
          location: { city: 'Nagpur', state: 'Maharashtra' },
          status: 'SUBMITTED',
          upvotes: ['u1', 'u2'],
          aiAnalysis: {
            impactScore: 88,
            urgencyScore: 92,
            summary: 'Critical public health priority requiring low-cost adsorption or community filtration technology.',
          },
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [filterCategory]);

  const handleCreateProblem = async (formData) => {
    setIsSubmitting(true);
    try {
      await problemService.createProblem(formData);
      await fetchProblems();
    } catch (err) {
      console.error('Failed to submit problem:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpvote = async (problemId) => {
    try {
      await problemService.upvoteProblem(problemId);
      await fetchProblems();
    } catch (err) {
      console.error('Upvote failed:', err);
    }
  };

  const handleAIAnalyze = async (problemId) => {
    setAnalyzingId(problemId);
    try {
      await problemService.analyzeWithAI(problemId);
      await fetchProblems();
    } catch (err) {
      console.error('AI Analysis failed:', err);
    } finally {
      setAnalyzingId(null);
    }
  };

  return (
    <div className="container page-wrapper">
      <Header
        title="Citizen Problem Reporting Portal"
        subtitle="Empowering communities to surface real societal challenges for academic R&D and institutional solutions."
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '2rem' }}>
        {/* Left Column: Problem Reporting Form */}
        <div>
          <Card padding="2rem" style={{ position: 'sticky', top: '90px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <MessageSquarePlus size={20} color="var(--primary)" />
              <h2 style={{ fontSize: '1.3rem' }}>Report a Societal Problem</h2>
            </div>
            <ProblemForm onSubmit={handleCreateProblem} isSubmitting={isSubmitting} />
          </Card>
        </div>

        {/* Right Column: Problem Feed */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.3rem' }}>Community Reported Issues</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={16} color="var(--text-dim)" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
              >
                <option value="">All Domains</option>
                <option value="Water & Sanitation">Water & Sanitation</option>
                <option value="Renewable Energy">Renewable Energy</option>
                <option value="Waste Management">Waste Management</option>
                <option value="Healthcare & Hygiene">Healthcare & Hygiene</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {problems.map((problem) => (
              <ProblemCard
                key={problem._id}
                problem={problem}
                onUpvote={handleUpvote}
                onAnalyze={handleAIAnalyze}
                isAnalyzing={analyzingId === problem._id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenDashboard;
