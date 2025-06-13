import React from 'react';
import { Step, Button, FormInput, ResultDisplay } from '../ui';
import { MuralApiClient } from '../../index';

export interface GetPayoutBodyStepProps {
  stepNumber: number;
  currentStep: number;
  isCompleted: boolean;
  isLoading: boolean;
  payoutPayload: string;
  orgId: string;
  payoutId: string;
  addLog: (message: string, type?: 'info' | 'error' | 'success' | 'warning') => void;
  setPayoutPayload: (payload: string) => void;
  markStepComplete: (stepIndex: number) => void;
  setLoading: (loading: boolean) => void;
}

export const GetPayoutBodyStep: React.FC<GetPayoutBodyStepProps> = ({
  stepNumber,
  currentStep,
  isCompleted,
  isLoading,
  payoutPayload,
  orgId,
  payoutId,
  addLog,
  setPayoutPayload,
  markStepComplete,
  setLoading
}) => {
  const isActive = currentStep === stepNumber;

  const handleGetPayoutBody = async () => {
    if (!orgId || !payoutId) {
      addLog('❌ Please create a payout first', 'error');
      return;
    }
    
    setLoading(true);
    addLog('🔄 Step 12: Getting payout body to sign...');
    
    try {
      const apiClient = new MuralApiClient();
      const body = await apiClient.getPayoutRequestBody(payoutId, orgId);
      addLog(`✅ Payout body retrieved successfully!`, 'success');
      setPayoutPayload(JSON.stringify(body, null, 2));
      markStepComplete(11);
      addLog(`➡️ Next: Sign the payout`, 'info');
    } catch (error) {
      addLog(`❌ Failed to get payout body: ${error instanceof Error ? error.message : String(error)}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const actions = (
    <Button
      onClick={handleGetPayoutBody}
      disabled={!isActive}
      loading={isLoading}
      variant={isCompleted ? 'success' : 'primary'}
    >
      {isCompleted ? '✅ Payout Body Retrieved' : 'Get Payout Body'}
    </Button>
  );

  return (
    <Step
      title="Get Payout Body"
      description="Retrieve the payout data that needs to be signed"
      stepNumber={stepNumber}
      isActive={isActive}
      isCompleted={isCompleted}
      isLoading={isLoading}
      actions={actions}
    >
      {payoutPayload && (
        <ResultDisplay>
          <FormInput
            id="payoutPayload"
            label="Payout Payload:"
            type="textarea"
            value={payoutPayload}
            onChange={() => {}}
            readOnly
            fontFamily="monospace"
            fontSize="small"
            rows={6}
          />
        </ResultDisplay>
      )}
    </Step>
  );
}; 