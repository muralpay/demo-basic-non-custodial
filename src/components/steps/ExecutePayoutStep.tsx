import React from 'react';
import { Step, Button, InfoBox, ResultDisplay } from '../ui';
import { MuralApiClient } from '../../index';

export interface ExecutePayoutStepProps {
  stepNumber: number;
  currentStep: number;
  isCompleted: boolean;
  isLoading: boolean;
  payoutStatus: string;
  orgId: string;
  payoutId: string;
  signature: string;
  addLog: (message: string, type?: 'info' | 'error' | 'success' | 'warning') => void;
  setPayoutStatus: (status: string) => void;
  markStepComplete: (stepIndex: number) => void;
  setLoading: (loading: boolean) => void;
}

export const ExecutePayoutStep: React.FC<ExecutePayoutStepProps> = ({
  stepNumber,
  currentStep,
  isCompleted,
  isLoading,
  payoutStatus,
  orgId,
  payoutId,
  signature,
  addLog,
  setPayoutStatus,
  markStepComplete,
  setLoading
}) => {
  const isActive = currentStep === stepNumber;

  const handleExecutePayout = async () => {
    if (!orgId || !payoutId || !signature) {
      addLog('❌ Please complete all previous steps first', 'error');
      return;
    }
    
    setLoading(true);
    addLog('🔄 Step 14: Executing payout...');
    
    try {
      const apiClient = new MuralApiClient();
      const result = await apiClient.executeNonCustodialPayout(payoutId, signature, orgId);
      addLog(`✅ Payout executed successfully!`, 'success');
      addLog(`📋 Payout status: ${result.status}`, 'success');
      setPayoutStatus(result.status);
      markStepComplete(13);
      addLog(`🎉 Non-custodial flow completed successfully!`, 'success');
    } catch (error) {
      addLog(`❌ Failed to execute payout: ${error instanceof Error ? error.message : String(error)}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const actions = (
    <Button
      onClick={handleExecutePayout}
      disabled={!isActive}
      loading={isLoading}
      variant={isCompleted ? 'success' : 'primary'}
    >
      {isCompleted ? '✅ Payout Executed' : 'Execute Payout'}
    </Button>
  );

  const getStatusVariant = () => {
    if (payoutStatus === 'completed' || payoutStatus === 'success') return 'success';
    if (payoutStatus === 'pending' || payoutStatus === 'processing') return 'warning';
    return 'error';
  };

  return (
    <Step
      title="Execute Payout"
      description="Submit the signed payout for execution"
      stepNumber={stepNumber}
      isActive={isActive}
      isCompleted={isCompleted}
      isLoading={isLoading}
      actions={actions}
    >
      {isCompleted && (
        <InfoBox variant="success">
          <h4 style={{ marginTop: 0 }}>🎉 Congratulations!</h4>
          <p>You have successfully completed the non-custodial payout flow:</p>
          <ul style={{ marginBottom: '10px' }}>
            <li>✅ Created organization and completed KYC</li>
            <li>✅ Initialized SDK and authenticated</li>
            <li>✅ Created and funded account</li>
            <li>✅ Created, signed, and executed $2 USDC payout</li>
          </ul>
          <p style={{ marginBottom: 0, fontWeight: 'bold' }}>
            The payout is now being processed and will be delivered to John Smith's bank account.
          </p>
        </InfoBox>
      )}
      
      {payoutStatus && (
        <ResultDisplay>
          <InfoBox variant={getStatusVariant()}>
            <strong>Payout Status:</strong> {payoutStatus.toUpperCase()}
          </InfoBox>
        </ResultDisplay>
      )}
    </Step>
  );
}; 