import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { Target, Calendar, ArrowRight } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

export const ChallengeCard = ({ challenge, onApply = null }) => {
  return (
    <Card padding="1.5rem">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <Badge variant="primary">{challenge.domain || 'Innovation'}</Badge>
        <Badge variant="info">{challenge.status}</Badge>
      </div>

      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{challenge.title}</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: '1.5' }}>
        {challenge.statement}
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '1.25rem' }}>
        {challenge.deadline && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={14} />
            <span>Deadline: {formatDate(challenge.deadline)}</span>
          </div>
        )}
        {challenge.rewardOrGrant && (
          <div style={{ color: 'var(--status-success)', fontWeight: 600 }}>
            {challenge.rewardOrGrant}
          </div>
        )}
      </div>

      {onApply && (
        <Button variant="primary" size="sm" onClick={() => onApply(challenge)} style={{ width: '100%' }}>
          Submit Solution <ArrowRight size={16} />
        </Button>
      )}
    </Card>
  );
};

export default ChallengeCard;
