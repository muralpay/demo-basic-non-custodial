import React from 'react';
import { Step, Button } from '../ui';
import { NonCustodialSDKWrapper } from '../../index';

export interface InitializeSDKStepProps {
  stepNumber: number;
  currentStep: number;
  isCompleted: boolean;
  isLoading: boolean;
  addLog: (message: string, type?: 'info' | 'error' | 'success' | 'warning') => void;
  setWrapper: (wrapper: NonCustodialSDKWrapper | null) => void;
  markStepComplete: (stepIndex: number) => void;
  updateStatus: (message: string, type?: 'ready' | 'error' | 'warning') => void;
  setLoading: (loading: boolean) => void;
}

export const InitializeSDKStep: React.FC<InitializeSDKStepProps> = ({
  stepNumber,
  currentStep,
  isCompleted,
  isLoading,
  addLog,
  setWrapper,
  markStepComplete,
  updateStatus,
  setLoading
}) => {
  const isActive = currentStep === stepNumber;

  const handleInitializeSDK = async () => {
    setLoading(true);
    addLog('🔄 Step 4: Initializing SDK...');
    
    try {
      const newWrapper = new NonCustodialSDKWrapper();
      const success = await newWrapper.initialize('auth-iframe-container-id');
      if (success) {
        setWrapper(newWrapper);
        addLog('✅ SDK initialized successfully!', 'success');
        markStepComplete(3);
        addLog(`➡️ Next: Get public key and initiate challenge`, 'info');
        updateStatus('SDK Initialized');
      } else {
        throw new Error('SDK initialization failed');
      }
    } catch (error) {
      addLog(`❌ Error: ${error instanceof Error ? error.message : String(error)}`, 'error');
      updateStatus('Error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const actions = (
    <Button
      onClick={handleInitializeSDK}
      disabled={!isActive}
      loading={isLoading}
      variant={isCompleted ? 'success' : 'primary'}
    >
      {isCompleted ? '✅ SDK Initialized' : 'Initialize SDK'}
    </Button>
  );

  return (
    <Step
      title="Initialize SDK"
      stepNumber={stepNumber}
      isActive={isActive}
      isCompleted={isCompleted}
      isLoading={isLoading}
      actions={actions}
    >
      <div id="auth-iframe-container-id" style={{ height: '1px', width: '1px', overflow: 'hidden' }}></div>
    </Step>
  );
}; 