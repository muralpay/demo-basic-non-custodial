import React from 'react';

export interface ProgressTrackerProps {
  steps: string[];
  currentStep: number;
  completedSteps: boolean[];
  className?: string;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  steps,
  currentStep,
  completedSteps,
  className = ''
}) => {
  const containerStyles = {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    marginBottom: '30px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  };

  const titleStyles = {
    fontSize: '1.5rem',
    color: '#1e293b',
    marginBottom: '20px',
    fontWeight: '600'
  };

  const gridStyles = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '12px'
  };

  const stepStyles = {
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    border: '2px solid transparent'
  };

  const stepCompletedStyles = {
    backgroundColor: '#dcfce7',
    color: '#166534',
    border: '2px solid #bbf7d0'
  };

  const stepCurrentStyles = {
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
    border: '2px solid #93c5fd',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
  };

  const stepPendingStyles = {
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    border: '2px solid #e2e8f0'
  };

  const getStepStatus = (stepIndex: number) => {
    if (completedSteps[stepIndex]) return '✅';
    if (currentStep === stepIndex + 1) return '🔄';
    return '⏳';
  };

  const getStepStyles = (stepIndex: number) => {
    if (completedSteps[stepIndex]) {
      return { ...stepStyles, ...stepCompletedStyles };
    }
    if (currentStep === stepIndex + 1) {
      return { ...stepStyles, ...stepCurrentStyles };
    }
    return { ...stepStyles, ...stepPendingStyles };
  };

  return (
    <div style={containerStyles} className={className}>
      <h3 style={titleStyles}>📋 Complete Non-Custodial Flow Progress</h3>
      <div style={gridStyles}>
        {steps.map((stepName, index) => (
          <div
            key={index}
            style={getStepStyles(index)}
          >
            {getStepStatus(index)} Step {index + 1}: {stepName}
          </div>
        ))}
      </div>
    </div>
  );
}; 