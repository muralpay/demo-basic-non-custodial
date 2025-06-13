import React from 'react';
import { Step, Button, InfoBox, ResultDisplay } from '../ui';
import { MuralApiClient } from '../../index';

export interface CreatePayoutStepProps {
  stepNumber: number;
  currentStep: number;
  isCompleted: boolean;
  isLoading: boolean;
  payoutId: string;
  orgId: string;
  accountId: string;
  addLog: (message: string, type?: 'info' | 'error' | 'success' | 'warning') => void;
  setPayoutId: (id: string) => void;
  markStepComplete: (stepIndex: number) => void;
  setLoading: (loading: boolean) => void;
}

export const CreatePayoutStep: React.FC<CreatePayoutStepProps> = ({
  stepNumber,
  currentStep,
  isCompleted,
  isLoading,
  payoutId,
  orgId,
  accountId,
  addLog,
  setPayoutId,
  markStepComplete,
  setLoading
}) => {
  const isActive = currentStep === stepNumber;

  const handleCreatePayout = async () => {
    if (!orgId || !accountId) {
      addLog('❌ Please create account first', 'error');
      return;
    }
    
    const payload = {
      sourceAccountId: accountId,
      memo: 'Demo payout for John Smith',
      payouts: [
        {
          amount: {
            tokenAmount: 2,
            tokenSymbol: 'USDC'
          },
          payoutDetails: {
            type: 'fiat' as const,
            bankName: 'Chase Bank',
            bankAccountOwner: 'John Smith',
            fiatAndRailDetails: {
              type: 'usd' as const,
              symbol: 'USD' as const,
              accountType: 'CHECKING' as const,
              bankAccountNumber: '1234567890',
              bankRoutingNumber: '021000021'
            }
          },
          recipientInfo: {
            type: 'individual' as const,
            firstName: 'John',
            lastName: 'Smith',
            email: 'john.smith@example.com',
            dateOfBirth: '1990-01-01',
            physicalAddress: {
              address1: '123 Main St',
              country: 'US',
              state: 'NY',
              city: 'New York',
              zip: '10001'
            }
          }
        }
      ]
    };
    
    setLoading(true);
    addLog('🔄 Step 11: Creating $2 USDC payout request...');
    addLog(`💰 Amount: $2 USDC`, 'info');
    addLog(`👤 Recipient: John Smith`, 'info');
    addLog(`🏦 Bank Account: 1234567890`, 'info');
    
    try {
      const apiClient = new MuralApiClient();
      const result = await apiClient.createPayout(payload, orgId);
      addLog(`✅ Payout created successfully!`, 'success');
      addLog(`📋 Payout ID: ${result.id}`, 'success');
      setPayoutId(result.id);
      markStepComplete(10);
      addLog(`➡️ Next: Get payout body to sign`, 'info');
    } catch (error) {
      addLog(`❌ Failed to create payout: ${error instanceof Error ? error.message : String(error)}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const actions = (
    <Button
      onClick={handleCreatePayout}
      disabled={!isActive}
      loading={isLoading}
      variant={isCompleted ? 'success' : 'primary'}
    >
      {isCompleted ? '✅ Payout Created' : 'Create Payout'}
    </Button>
  );

  return (
    <Step
      title="Create Payout Request"
      description="Create a $2 USDC payout to John Smith's bank account"
      stepNumber={stepNumber}
      isActive={isActive}
      isCompleted={isCompleted}
      isLoading={isLoading}
      actions={actions}
    >
      <InfoBox variant="info">
        <h4 style={{ marginTop: 0 }}>💰 Payout Details:</h4>
        <p><strong>Amount:</strong> $2 USDC</p>
        <p><strong>Recipient:</strong> John Smith</p>
        <p><strong>Bank:</strong> Chase Bank</p>
        <p><strong>Account:</strong> 1234567890</p>
        <p style={{ marginBottom: 0 }}><strong>Type:</strong> Individual Bank Transfer</p>
      </InfoBox>
      
      {payoutId && (
        <ResultDisplay>
          <strong>Payout ID:</strong> {payoutId}
        </ResultDisplay>
      )}
    </Step>
  );
}; 