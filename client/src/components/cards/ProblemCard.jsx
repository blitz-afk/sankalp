import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { ThumbsUp, MapPin, Sparkles } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

export const ProblemCard = ({ problem, onUpvote, onAnalyze, isAnalyzing = false }) => {
  return (
    <Card className="problem-card" padding="1.5rem">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <Badge variant="info">{problem.category || 'General'}</Badge>
        <Badge variant={problem.status === 'SOLVED' ? 'success' : 'primary'}>{problem.status}</Badge>
      </div>

      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{problem.title}</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.5' }}>
        {problem.description}
      </p>

      {problem.location?.city && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-dim)', fontSize: '0.8rem', marginBottom: '1rem' }}>
          <MapPin size={14} />
          <span>{problem.location.city}, {problem.location.state}</span>
        </div>
      )}

      {/* AI Analysis Summary if Available */}
      {problem.aiAnalysis?.urgencyScore && (
        <div style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px dashed var(--primary)', borderRadius: 'var(--radius-sm)', padding: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.25rem' }}>
            <Sparkles size={14} />
            <span>AI Impact Score: {problem.aiAnalysis.impactScore}/100 | Urgency: {problem.aiAnalysis.urgencyScore}/100</span>
          </div>
          {problem.aiAnalysis.summary && (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{problem.aiAnalysis.summary}</p>
          )}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-glass)' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
          {formatDate(problem.createdAt)}
        </span>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {onAnalyze && (
            <Button
              variant="outline"
              size="sm"
              icon={Sparkles}
              onClick={() => onAnalyze(problem._id)}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? 'Analyzing...' : 'AI Analyze'}
            </Button>
          )}

          {onUpvote && (
            <Button
              variant="secondary"
              size="sm"
              icon={ThumbsUp}
              onClick={() => onUpvote(problem._id)}
            >
              {problem.upvotes?.length || 0}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProblemCard;
