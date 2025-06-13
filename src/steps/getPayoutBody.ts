import { MuralApiClient } from '../index';

export interface GetPayoutBodyParams {
  orgId: string;
  payoutId: string;
  addLog: (message: string, type?: 'info' | 'error' | 'success' | 'warning') => void;
  setPayoutPayload: (payload: string) => void;
  markStepComplete: (stepIndex: number) => void;
}

export const getPayoutBody = async (params: GetPayoutBodyParams) => {
  const { orgId, payoutId, addLog, setPayoutPayload, markStepComplete } = params;
  
  if (!orgId || !payoutId) {
    addLog('❌ Please create a payout first', 'error');
    return;
  }
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
  }
}; 