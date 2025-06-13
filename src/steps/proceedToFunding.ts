export interface ProceedToFundingParams {
  accountAddress: string;
  addLog: (message: string, type?: 'info' | 'error' | 'success' | 'warning') => void;
  markStepComplete: (stepIndex: number) => void;
}

export const proceedToFunding = async (params: ProceedToFundingParams) => {
  const { accountAddress, addLog, markStepComplete } = params;
  
  if (!accountAddress) {
    addLog('❌ Account address not available. Please create account first.', 'error');
    return;
  }
  addLog('ℹ️ Step 10: Please follow the funding instructions above', 'info');
  addLog('💰 Once you have funded your account with USDC, click "Continue to Payout"', 'warning');
  markStepComplete(9);
  addLog(`➡️ Next: Create a payout`, 'info');
}; 