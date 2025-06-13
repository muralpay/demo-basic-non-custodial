import React from 'react';
import { Step, Button, ResultDisplay } from '../ui';
import { NonCustodialSDKWrapper } from '../../index';

export interface SignPayoutStepProps {
  stepNumber: number;
  currentStep: number;
  isCompleted: boolean;
  isLoading: boolean;
  signature: string;
  wrapper: NonCustodialSDKWrapper | null;
  payoutPayload: string;
  addLog: (message: string, type?: 'info' | 'error' | 'success' | 'warning') => void;
  setSignature: (signature: string) => void;
  markStepComplete: (stepIndex: number) => void;
  setLoading: (loading: boolean) => void;
}

export const SignPayoutStep: React.FC<SignPayoutStepProps> = ({
  stepNumber,
  currentStep,
  isCompleted,
  isLoading,
  signature,
  wrapper,
  payoutPayload,
  addLog,
  setSignature,
  markStepComplete,
  setLoading
}) => {
  const isActive = currentStep === stepNumber;

  const handleSignPayout = async () => {
    if (!wrapper || !payoutPayload) {
      addLog('❌ Please get the payout body first', 'error');
      return;
    }
    
    setLoading(true);
    
    try {
      const payload = JSON.parse(payoutPayload);
      addLog('🔄 Step 13: Signing payout payload...');
      const sig = await wrapper.signPayoutPayload(payload);
      if (sig) {
        addLog(`✅ Payout signed successfully!`, 'success');
        addLog(`✍️ Signature: ${sig}`, 'success');
        setSignature(sig);
        markStepComplete(12);
        addLog(`➡️ Next: Execute the payout`, 'info');
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('JSON')) {
        addLog('❌ Invalid JSON in payout payload', 'error');
      } else {
        addLog(`❌ Signing failed: ${error instanceof Error ? error.message : String(error)}`, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const signatureDisplayStyles = {
    backgroundColor: '#f8fafc',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '0.75rem',
    fontFamily: 'Monaco, Consolas, "Lucida Console", monospace',
    wordBreak: 'break-all' as const,
    lineHeight: '1.4',
    maxHeight: '200px',
    overflowY: 'auto' as const
  };

  const actions = (
    <Button
      onClick={handleSignPayout}
      disabled={!isActive}
      loading={isLoading}
      variant={isCompleted ? 'success' : 'primary'}
    >
      {isCompleted ? '✅ Payout Signed' : 'Sign Payout'}
    </Button>
  );

  return (
    <Step
      title="Sign Payout"
      description="Cryptographically sign the payout payload using your private key"
      stepNumber={stepNumber}
      isActive={isActive}
      isCompleted={isCompleted}
      isLoading={isLoading}
      actions={actions}
    >
      {signature && (
        <div style={{ marginTop: '15px' }}>
          <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
            Signature:
          </label>
          <div style={signatureDisplayStyles}>
            {signature}
          </div>
        </div>
      )}
    </Step>
  );
}; 