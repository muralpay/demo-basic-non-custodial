import { MuralApiClient } from '../index';

export interface CreateAccountParams {
  orgId: string;
  accountName: string;
  addLog: (message: string, type?: 'info' | 'error' | 'success' | 'warning') => void;
  setAccountId: (id: string) => void;
  setAccountAddress: (address: string) => void;
  markStepComplete: (stepIndex: number) => void;
}

export const createAccount = async (params: CreateAccountParams) => {
  const { orgId, accountName, addLog, setAccountId, setAccountAddress, markStepComplete } = params;
  
  if (!orgId || !accountName) {
    addLog('❌ Please fill in account name', 'error');
    return;
  }
  
  addLog('🔄 Step 9: Creating account...');
  try {
    const apiClient = new MuralApiClient();
    const result = await apiClient.createAccount({
      name: accountName,
      description: 'Demo account for testing payouts'
    }, orgId);
    addLog(`✅ Account created successfully!`, 'success');
    addLog(`📋 Account ID: ${result.id}`, 'success');
    setAccountId(result.id);
    
    // Log the full response to debug the structure
    console.log('Full account creation response:', result);
    addLog(`🔍 Full response: ${JSON.stringify(result, null, 2)}`, 'info');
    
    // Extract account address from nested structure
    let walletAddress = null;
    
    // Try different possible paths for the wallet address
    if (result.accountDetails?.walletDetails?.walletAddress) {
      walletAddress = result.accountDetails.walletDetails.walletAddress;
    } else if (result.address) {
      walletAddress = result.address;
    } else if (result.walletAddress) {
      walletAddress = result.walletAddress;
    } else if (result.accountDetails?.address) {
      walletAddress = result.accountDetails.address;
    }
    
    if (walletAddress) {
      setAccountAddress(walletAddress);
      addLog(`📋 Account Address: ${walletAddress}`, 'success');
      markStepComplete(8);
      addLog(`➡️ Next: Fund your account using Circle faucet`, 'info');
    } else {
      addLog(`⚠️ Account created but wallet address not found in response`, 'warning');
      addLog(`💡 The account may still be initializing. You can check the account status or try getting account details.`, 'warning');
      // Still mark as complete since account was created successfully
      markStepComplete(8);
      addLog(`➡️ Next: Get account details to retrieve wallet address`, 'info');
    }
    
  } catch (error) {
    addLog(`❌ Failed to create account: ${error instanceof Error ? error.message : String(error)}`, 'error');
  }
}; 