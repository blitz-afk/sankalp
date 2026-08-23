import React from 'react';

export const Header = ({ title, subtitle, action = null }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{title}</h1>
        {subtitle && <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export default Header;
