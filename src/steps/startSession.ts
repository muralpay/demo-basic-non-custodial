import { NonCustodialSDKWrapper } from '../index';

export interface StartSessionParams {
  wrapper: NonCustodialSDKWrapper | null;
  emailCode: string;
  authenticatorId: string;
  addLog: (message: string, type?: 'info' | 'error' | 'success' | 'warning') => void;
  markStepComplete: (stepIndex: number) => void;
}

export const startSession = async (params: StartSessionParams) => {
  const { wrapper, emailCode, authenticatorId, addLog, markStepComplete } = params;
  
  if (!wrapper || !emailCode || !authenticatorId) {
    addLog('❌ Please enter the email verification code first', 'error');
    return;
  }
  
  addLog('🔄 Step 6: Starting session with verification code...');
  try {
    await wrapper.startSession({
      code: emailCode,
      authenticatorId: authenticatorId
    });
    addLog(`✅ Session started successfully!`, 'success');
    markStepComplete(5);
    addLog(`➡️ Next: Get KYC link`, 'info');
  } catch (error) {
    addLog(`❌ Failed to start session: ${error instanceof Error ? error.message : String(error)}`, 'error');
  }
}; 