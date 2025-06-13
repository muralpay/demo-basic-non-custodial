import { MuralApiClient } from '../index';

export interface CreatePayoutParams {
  orgId: string;
  accountId: string;
  addLog: (message: string, type?: 'info' | 'error' | 'success' | 'warning') => void;
  setPayoutId: (id: string) => void;
  markStepComplete: (stepIndex: number) => void;
}

export const createPayout = async (params: CreatePayoutParams) => {
  const { orgId, accountId, addLog, setPayoutId, markStepComplete } = params;
  
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
  }
}; 