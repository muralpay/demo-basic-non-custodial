import React from 'react';

export interface HeaderProps {
  title: string;
  status: {
    message: string;
    type: 'ready' | 'error' | 'warning';
  };
}

export const Header: React.FC<HeaderProps> = ({ title, status }) => {
  const headerStyles = {
    textAlign: 'center' as const,
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  };

  const titleStyles = {
    fontSize: '2.5rem',
    color: '#1e293b',
    margin: '0 0 10px 0',
    fontWeight: '700'
  };

  const statusStyles = {
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '500',
    margin: '10px 0'
  };

  const statusVariantStyles = {
    ready: {
      backgroundColor: '#dcfce7',
      color: '#166534',
      border: '1px solid #bbf7d0'
    },
    error: {
      backgroundColor: '#fecaca',
      color: '#991b1b',
      border: '1px solid #fca5a5'
    },
    warning: {
      backgroundColor: '#fef3c7',
      color: '#92400e',
      border: '1px solid #fde68a'
    }
  };

  return (
    <div style={headerStyles}>
      <h1 style={titleStyles}>{title}</h1>
      <div style={{
        ...statusStyles,
        ...statusVariantStyles[status.type]
      }}>
        Status: {status.message}
      </div>
    </div>
  );
}; 