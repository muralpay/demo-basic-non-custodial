import React from 'react';

export interface ResultDisplayProps {
  children: React.ReactNode;
  className?: string;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({
  children,
  className = ''
}) => {
  const styles = {
    backgroundColor: '#f8fafc',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    marginTop: '15px'
  };

  return (
    <div style={styles} className={className}>
      {children}
    </div>
  );
}; 