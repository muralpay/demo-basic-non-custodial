import { MuralApiClient } from '../index';

export interface CheckTosStatusParams {
  orgId: string;
  addLog: (message: string, type?: 'info' | 'error' | 'success' | 'warning') => void;
  markStepComplete: (stepIndex: number) => void;
}

export const checkTosStatus = async (params: CheckTosStatusParams) => {
  const { orgId, addLog, markStepComplete } = params;
  
  if (!orgId) {
    addLog('❌ Please create an organization first', 'error');
    return;
  }
  addLog('🔄 Step 3: Checking Terms of Service acceptance status...');
  try {
    const apiClient = new MuralApiClient();
    const orgDetails = await apiClient.getOrganization(orgId);
    const tosStatus = orgDetails.tosStatus;
    if (tosStatus === 'ACCEPTED') {
      addLog(`✅ Terms of Service have been accepted!`, 'success');
      markStepComplete(2);
      addLog(`➡️ Next: Initialize the SDK`, 'info');
    } else if (tosStatus === 'NEEDS_REVIEW') {
      addLog(`⚠️ Terms of Service are pending review. Please wait for approval.`, 'warning');
    } else {
      addLog(`❌ Terms of Service have not been accepted yet. Status: ${tosStatus}`, 'error');
      addLog(`🔗 Please open the TOS link and complete the acceptance process.`, 'warning');
    }
  } catch (error) {
    addLog(`❌ Failed to check TOS status: ${error instanceof Error ? error.message : String(error)}`, 'error');
  }
}; 