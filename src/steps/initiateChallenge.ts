import { MuralApiClient, NonCustodialSDKWrapper } from '../index';

export interface InitiateChallengeParams {
  orgId: string;
  approverId: string;
  wrapper: NonCustodialSDKWrapper | null;
  addLog: (message: string, type?: 'info' | 'error' | 'success' | 'warning') => void;
  setAuthenticatorId: (id: string) => void;
  markStepComplete: (stepIndex: number) => void;
}

export const initiateChallenge = async (params: InitiateChallengeParams) => {
  const { orgId, approverId, wrapper, addLog, setAuthenticatorId, markStepComplete } = params;
  
  if (!orgId || !approverId || !wrapper) {
    addLog('❌ Please complete previous steps first', 'error');
    return;
  }
  
  const publicKey = wrapper.getPublicKey();
  if (!publicKey) {
    addLog('❌ Failed to get public key', 'error');
    return;
  }
  
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
  }
}; 