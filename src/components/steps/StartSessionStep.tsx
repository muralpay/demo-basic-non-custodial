import React from 'react';
import { Step, Button, FormInput } from '../ui';

export interface StartSessionStepProps {
  stepNumber: number;
  currentStep: number;
  isCompleted: boolean;
  isLoading: boolean;
  emailCode: string;
  setEmailCode: (value: string) => void;
  onStartSession: () => void;
}

export const StartSessionStep: React.FC<StartSessionStepProps> = ({
  stepNumber,
  currentStep,
  isCompleted,
  isLoading,
  emailCode,
  setEmailCode,
  onStartSession
}) => {
  const isActive = currentStep === stepNumber;
  const canSubmit = isActive && emailCode.trim() !== '';

  const actions = (
    <Button
      onClick={onStartSession}
      disabled={!canSubmit}
      loading={isLoading}
      variant={isCompleted ? 'success' : 'primary'}
    >
      {isCompleted ? '✅ Session Started' : 'Start Session'}
    </Button>
  );

  return (
    <Step
      title="Enter Email Code & Start Session"
      description="Check your email for the verification code and enter it below:"
      stepNumber={stepNumber}
      isActive={isActive}
      isCompleted={isCompleted}
      isLoading={isLoading}
      actions={actions}
    >
      <FormInput
        id="emailCode"
        label="Email Verification Code:"
        value={emailCode}
        onChange={setEmailCode}
        placeholder="Enter code from email"
        disabled={!isActive}
      />
    </Step>
  );
}; 