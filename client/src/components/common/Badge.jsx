import React from 'react';

export const Badge = ({ children, variant = 'info', className = '' }) => {
  const badgeStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.2rem 0.65rem',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.75rem',
    fontWeight: '600',
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
  };

  const variants = {
    info: { background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA', border: '1px solid rgba(59, 130, 246, 0.3)' },
    success: { background: 'rgba(16, 185, 129, 0.15)', color: '#34D399', border: '1px solid rgba(16, 185, 129, 0.3)' },
    warning: { background: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24', border: '1px solid rgba(245, 158, 11, 0.3)' },
    danger: { background: 'rgba(239, 68, 68, 0.15)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.3)' },
    primary: { background: 'rgba(99, 102, 241, 0.15)', color: '#A5B4FC', border: '1px solid rgba(99, 102, 241, 0.3)' },
  };

  return (
    <span style={{ ...badgeStyles, ...variants[variant] }} className={className}>
      {children}
    </span>
  );
};

export default Badge;
