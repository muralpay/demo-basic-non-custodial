import React from 'react';
import { Step, Button, InfoBox, ResultDisplay } from '../ui';
import { MuralApiClient, NonCustodialSDKWrapper } from '../../index';

export interface InitiateChallengeStepProps {
  stepNumber: number;
  currentStep: number;
  isCompleted: boolean;
  isLoading: boolean;
  approversList: Array<{id: string, name: string, email: string}>;
  selectedApproverIndex: number;
  authenticatorId: string;
  orgId: string;
  approverId: string;
  wrapper: NonCustodialSDKWrapper | null;
  addLog: (message: string, type?: 'info' | 'error' | 'success' | 'warning') => void;
  setAuthenticatorId: (id: string) => void;
  markStepComplete: (stepIndex: number) => void;
  setLoading: (loading: boolean) => void;
}

export const InitiateChallengeStep: React.FC<InitiateChallengeStepProps> = ({
  stepNumber,
  currentStep,
  isCompleted,
  isLoading,
  approversList,
  selectedApproverIndex,
  authenticatorId,
  orgId,
  approverId,
  wrapper,
  addLog,
  setAuthenticatorId,
  markStepComplete,
  setLoading
}) => {
  const isActive = currentStep === stepNumber;

  const handleInitiateChallenge = async () => {
    if (!orgId || !approverId || !wrapper) {
      addLog('❌ Please complete previous steps first', 'error');
      return;
    }
    
    const publicKey = wrapper.getPublicKey();
    if (!publicKey) {
      addLog('❌ Failed to get public key', 'error');
      return;
    }
    
    setLoading(true);
    addLog('🔄 Step 5: Initiating authentication challenge...');
    addLog(`🔑 Using Public Key: ${publicKey}`, 'info');
    addLog(`📋 Using Approver ID: ${approverId}`, 'info');
    
    try {
      const apiClient = new MuralApiClient();
      const result = await apiClient.initiateChallenge({ publicKey, approverId }, orgId);
      addLog(`✅ Challenge initiated successfully!`, 'success');
      addLog(`📋 Authenticator ID: ${result.authenticatorId}`, 'success');
      setAuthenticatorId(result.authenticatorId);
      markStepComplete(4);
      addLog(`📧 Check your email for the verification code`, 'warning');
      addLog(`➡️ Next: Enter the email code and start session`, 'info');
    } catch (error) {
      addLog(`❌ Failed to initiate challenge: ${error instanceof Error ? error.message : String(error)}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const actions = (
    <Button
      onClick={handleInitiateChallenge}
      disabled={!isActive}
      loading={isLoading}
      variant={isCompleted ? 'success' : 'primary'}
    >
      {isCompleted ? '✅ Challenge Initiated' : 'Initiate Challenge'}
    </Button>
  );

  return (
    <Step
      title="Initiate Authentication Challenge"
      stepNumber={stepNumber}
      isActive={isActive}
      isCompleted={isCompleted}
      isLoading={isLoading}
      actions={actions}
    >
      {/* Show selected approver info */}
      {approversList.length > 0 && (
        <InfoBox variant="info">
          <strong>👤 Selected Approver:</strong><br/>
          <span>{approversList[selectedApproverIndex]?.name} ({approversList[selectedApproverIndex]?.email})</span>
          {approversList.length > 1 && (
            <p style={{ marginTop: '5px', fontSize: '12px' }}>
              💡 You can change the approver selection in Step 1 if needed.
            </p>
          )}
        </InfoBox>
      )}
      
      {authenticatorId && (
        <ResultDisplay>
          <strong>Authenticator ID:</strong> {authenticatorId}
        </ResultDisplay>
      )}
    </Step>
  );
}; 