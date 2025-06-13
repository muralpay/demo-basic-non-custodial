import React from 'react';
import { Button } from './Button';

export interface StepProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  stepNumber: number;
  isActive: boolean;
  isCompleted: boolean;
  isLoading?: boolean;
  className?: string;
}

export const Step: React.FC<StepProps> = ({
  title,
  description,
  children,
  actions,
  stepNumber,
  isActive,
  isCompleted,
  isLoading = false,
  className = ''
}) => {
  const sectionStyles = {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    ...(isActive ? { borderLeft: '4px solid #3b82f6' } : {}),
    ...(isCompleted ? { borderLeft: '4px solid #10b981' } : {})
  };

  const titleStyles = {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '20px',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const getStepIcon = () => {
    if (isCompleted) return '✅';
    if (isActive && isLoading) return '🔄';
    if (isActive) return '🔄';
    return '⏳';
  };

  const buttonGroupStyles = {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
    flexWrap: 'wrap' as const
  };

  return (
    <div style={sectionStyles} className={className}>
      <h3 style={titleStyles}>
        <span>{getStepIcon()}</span>
        Step {stepNumber}: {title}
      </h3>
      
      {description && (
        <p style={{ marginBottom: '20px', color: '#6b7280' }}>
          {description}
        </p>
      )}
      
      {children}
      
      {actions && (
        <div style={buttonGroupStyles}>
          {actions}
        </div>
      )}
    </div>
  );
}; 