import React, { useState } from 'react';
import Button from '../common/Button';
import { Send, AlertCircle } from 'lucide-react';

export const SolutionForm = ({ challengeId, onSubmit, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    technicalDetails: '',
    repositoryUrl: '',
    demoUrl: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.abstract.trim()) {
      setError('Please provide a solution title and abstract summary.');
      return;
    }
    setError('');
    await onSubmit({
      ...formData,
      challengeId,
    });
    setFormData({
      title: '',
      abstract: '',
      technicalDetails: '',
      repositoryUrl: '',
      demoUrl: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--status-danger)', color: '#F87171', padding: '0.75rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
          Solution Project Title
        </label>
        <input
          type="text"
          name="title"
          placeholder="e.g. IoT-based Automated Urban Drainage Silt Detection and Clearing Robot"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
          Executive Abstract
        </label>
        <textarea
          name="abstract"
          rows={3}
          placeholder="Summarize the core innovation, methodology, and expected societal impact..."
          value={formData.abstract}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
          Technical Architecture & Feasibility
        </label>
        <textarea
          name="technicalDetails"
          rows={4}
          placeholder="Detail the hardware/software stack, bill of materials, algorithms, and prototype readiness level..."
          value={formData.technicalDetails}
          onChange={handleChange}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            Repository URL (GitHub / GitLab)
          </label>
          <input
            type="url"
            name="repositoryUrl"
            placeholder="https://github.com/..."
            value={formData.repositoryUrl}
            onChange={handleChange}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            Demo / Video URL
          </label>
          <input
            type="url"
            name="demoUrl"
            placeholder="https://youtube.com/... or live demo"
            value={formData.demoUrl}
            onChange={handleChange}
          />
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        icon={Send}
        disabled={isSubmitting}
        style={{ alignSelf: 'flex-start' }}
      >
        {isSubmitting ? 'Submitting Solution...' : 'Submit University Solution'}
      </Button>
    </form>
  );
};

export default SolutionForm;
