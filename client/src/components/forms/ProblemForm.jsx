import React, { useState } from 'react';
import Button from '../common/Button';
import { PROBLEM_CATEGORIES } from '../../utils/constants';
import { Send, AlertCircle } from 'lucide-react';

export const ProblemForm = ({ onSubmit, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Water & Sanitation',
    city: '',
    state: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Please provide both a title and description.');
      return;
    }
    setError('');
    await onSubmit({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      location: {
        city: formData.city,
        state: formData.state,
      },
    });
    setFormData({
      title: '',
      description: '',
      category: 'Water & Sanitation',
      city: '',
      state: '',
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
          Problem Title
        </label>
        <input
          type="text"
          name="title"
          placeholder="e.g. Chronic water logging and drainage blockage in Ward 12"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            Category
          </label>
          <select name="category" value={formData.category} onChange={handleChange}>
            {PROBLEM_CATEGORIES.map((cat) => (
              <option key={cat} value={cat} style={{ background: '#0F172A' }}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            City / Town
          </label>
          <input
            type="text"
            name="city"
            placeholder="e.g. Pune"
            value={formData.city}
            onChange={handleChange}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            State
          </label>
          <input
            type="text"
            name="state"
            placeholder="e.g. Maharashtra"
            value={formData.state}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
          Detailed Description & Societal Impact
        </label>
        <textarea
          name="description"
          rows={4}
          placeholder="Describe what is happening, who is affected, how long this issue has persisted, and any attempted measures..."
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="md"
        icon={Send}
        disabled={isSubmitting}
        style={{ alignSelf: 'flex-start' }}
      >
        {isSubmitting ? 'Submitting Problem...' : 'Report Societal Problem'}
      </Button>
    </form>
  );
};

export default ProblemForm;
