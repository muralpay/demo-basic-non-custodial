import { MuralApiClient } from '../index';

export interface ExecutePayoutParams {
  orgId: string;
  payoutId: string;
  signature: string;
  addLog: (message: string, type?: 'info' | 'error' | 'success' | 'warning') => void;
  markStepComplete: (stepIndex: number) => void;
}

export const executePayout = async (params: ExecutePayoutParams) => {
  const { orgId, payoutId, signature, addLog, markStepComplete } = params;
  
  if (!orgId || !payoutId || !signature) {
    addLog('❌ Please complete all previous steps first', 'error');
    return;
  }
  addLog('🔄 Step 14: Executing payout...');
  try {
    const apiClient = new MuralApiClient();
    const result = await apiClient.executeNonCustodialPayout(payoutId, signature, orgId);
    addLog(`✅ Payout executed successfully!`, 'success');
    addLog(`📋 Payout status: ${result.status}`, 'success');
    markStepComplete(13);
    addLog(`🎉 Non-custodial flow completed successfully!`, 'success');
  } catch (error) {
    addLog(`❌ Failed to execute payout: ${error instanceof Error ? error.message : String(error)}`, 'error');
  }
}; 