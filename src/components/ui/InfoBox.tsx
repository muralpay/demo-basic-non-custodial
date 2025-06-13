import React from 'react';

export interface InfoBoxProps {
  children: React.ReactNode;
  variant?: 'info' | 'warning' | 'error' | 'success';
  className?: string;
}

export const InfoBox: React.FC<InfoBoxProps> = ({
  children,
  variant = 'info',
  className = ''
}) => {
  const baseStyles = {
    padding: '16px',
    borderRadius: '8px',
    marginTop: '15px',
    fontSize: '0.95rem',
    lineHeight: '1.5',
    border: '1px solid'
  };

  const variantStyles = {
    info: {
      backgroundColor: '#dbeafe',
      color: '#1e40af',
      borderColor: '#93c5fd'
    },
    warning: {
      backgroundColor: '#fef3c7',
      color: '#92400e',
      borderColor: '#fde68a'
    },
    error: {
      backgroundColor: '#fecaca',
      color: '#991b1b',
      borderColor: '#fca5a5'
    },
    success: {
      backgroundColor: '#dcfce7',
      color: '#166534',
      borderColor: '#bbf7d0'
    }
  };

  const styles = {
    ...baseStyles,
    ...variantStyles[variant]
  };

  return (
    <div style={styles} className={className}>
      {children}
    </div>
  );
}; 