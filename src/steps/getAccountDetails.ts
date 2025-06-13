import { MuralApiClient } from '../index';

export interface GetAccountDetailsParams {
  orgId: string;
  accountId: string;
  addLog: (message: string, type?: 'info' | 'error' | 'success' | 'warning') => void;
  setAccountAddress: (address: string) => void;
}

export const getAccountDetails = async (params: GetAccountDetailsParams) => {
  const { orgId, accountId, addLog, setAccountAddress } = params;
  
  if (!orgId || !accountId) {
    addLog('❌ Please create account first', 'error');
    return;
  }
  
  addLog('🔄 Getting account details to retrieve wallet address...');
  try {
    const apiClient = new MuralApiClient();
    const result = await apiClient.getAccount(accountId, orgId);
    console.log('Account details response:', result);
    addLog(`🔍 Account details: ${JSON.stringify(result, null, 2)}`, 'info');
    
    // Extract wallet address from account details
    let walletAddress = null;
    
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
      addLog(`✅ Wallet address retrieved: ${walletAddress}`, 'success');
      addLog(`➡️ Next: Fund your account using Circle faucet`, 'info');
    } else {
      addLog(`⚠️ Wallet address still not available. Account may still be initializing.`, 'warning');
      addLog(`💡 Account status: ${result.status || 'Unknown'}`, 'info');
    }
    
  } catch (error) {
    addLog(`❌ Failed to get account details: ${error instanceof Error ? error.message : String(error)}`, 'error');
  }
}; 