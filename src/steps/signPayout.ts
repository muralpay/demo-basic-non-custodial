import { NonCustodialSDKWrapper } from '../index';

export interface SignPayoutParams {
  wrapper: NonCustodialSDKWrapper | null;
  payoutPayload: string;
  addLog: (message: string, type?: 'info' | 'error' | 'success' | 'warning') => void;
  setSignature: (signature: string) => void;
  markStepComplete: (stepIndex: number) => void;
}

export const signPayout = async (params: SignPayoutParams) => {
  const { wrapper, payoutPayload, addLog, setSignature, markStepComplete } = params;
  
  if (!wrapper || !payoutPayload) {
    addLog('❌ Please get the payout body first', 'error');
    return;
  }
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
  }
}; 