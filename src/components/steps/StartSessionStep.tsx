import React from 'react';
import { Step, Button, FormInput } from '../ui';
import { NonCustodialSDKWrapper } from '../../index';

export interface StartSessionStepProps {
  stepNumber: number;
  currentStep: number;
  isCompleted: boolean;
  isLoading: boolean;
  emailCode: string;
  setEmailCode: (value: string) => void;
  wrapper: NonCustodialSDKWrapper | null;
  authenticatorId: string;
  addLog: (message: string, type?: 'info' | 'error' | 'success' | 'warning') => void;
  markStepComplete: (stepIndex: number) => void;
  setLoading: (loading: boolean) => void;
}

export const StartSessionStep: React.FC<StartSessionStepProps> = ({
  stepNumber,
  currentStep,
  isCompleted,
  isLoading,
  emailCode,
  setEmailCode,
  wrapper,
  authenticatorId,
  addLog,
  markStepComplete,
  setLoading
}) => {
  const isActive = currentStep === stepNumber;
  const canSubmit = isActive && emailCode.trim() !== '';

  const handleStartSession = async () => {
    if (!wrapper || !emailCode || !authenticatorId) {
      addLog('❌ Please enter the email verification code first', 'error');
      return;
    }
    
    setLoading(true);
    addLog('🔄 Step 6: Starting session with verification code...');
    
    try {
      await wrapper.startSession({
        code: emailCode,
        authenticatorId: authenticatorId
      });
      addLog(`✅ Session started successfully!`, 'success');
      markStepComplete(5);
      addLog(`➡️ Next: Get KYC link`, 'info');
    } catch (error) {
      addLog(`❌ Failed to start session: ${error instanceof Error ? error.message : String(error)}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const actions = (
    <Button
      onClick={handleStartSession}
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