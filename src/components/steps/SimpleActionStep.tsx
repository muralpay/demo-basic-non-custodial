import React from 'react';
import { Step, Button } from '../ui';

export interface SimpleActionStepProps {
  title: string;
  description?: string;
  stepNumber: number;
  currentStep: number;
  isCompleted: boolean;
  isLoading: boolean;
  buttonText: string;
  completedButtonText: string;
  onAction: () => void;
  children?: React.ReactNode;
}

export const SimpleActionStep: React.FC<SimpleActionStepProps> = ({
  title,
  description,
  stepNumber,
  currentStep,
  isCompleted,
  isLoading,
  buttonText,
  completedButtonText,
  onAction,
  children
}) => {
  const isActive = currentStep === stepNumber;

  const actions = (
    <Button
      onClick={onAction}
      disabled={!isActive}
      loading={isLoading}
      variant={isCompleted ? 'success' : 'primary'}
    >
      {isCompleted ? completedButtonText : buttonText}
    </Button>
  );

  return (
    <Step
      title={title}
      description={description}
      stepNumber={stepNumber}
      isActive={isActive}
      isCompleted={isCompleted}
      isLoading={isLoading}
      actions={actions}
    >
      {children}
    </Step>
  );
}; 