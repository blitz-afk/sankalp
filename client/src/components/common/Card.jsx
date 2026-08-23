import React from 'react';

export const Card = ({ children, className = '', padding = '1.5rem', onClick = null, ...props }) => {
  return (
    <div
      className={`glass-panel ${className}`}
      onClick={onClick}
      style={{
        padding,
        cursor: onClick ? 'pointer' : 'default',
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
