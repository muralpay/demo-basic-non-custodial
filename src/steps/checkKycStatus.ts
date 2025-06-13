import { MuralApiClient } from '../index';

export interface CheckKycStatusParams {
  orgId: string;
  addLog: (message: string, type?: 'info' | 'error' | 'success' | 'warning') => void;
  markStepComplete: (stepIndex: number) => void;
}

export const checkKycStatus = async (params: CheckKycStatusParams) => {
  const { orgId, addLog, markStepComplete } = params;
  
  if (!orgId) {
    addLog('❌ Please complete previous steps first', 'error');
    return;
  }
  addLog('🔄 Step 8: Checking KYC verification status...');
  try {
    const apiClient = new MuralApiClient();
    const orgDetails = await apiClient.getOrganization(orgId);
    const kycStatus = orgDetails.kycStatus?.type;
    if (kycStatus === 'approved') {
      addLog(`✅ KYC verification has been approved!`, 'success');
      markStepComplete(7);
      addLog(`➡️ Next: Create account`, 'info');
    } else if (kycStatus === 'pending') {
      addLog(`⚠️ KYC verification is pending review. Please wait for approval.`, 'warning');
    } else if (kycStatus === 'submitted') {
      addLog(`⚠️ KYC has been submitted and is being reviewed. Please wait for approval.`, 'warning');
    } else {
      addLog(`❌ KYC verification has not been completed yet. Status: ${kycStatus || 'NOT_STARTED'}`, 'error');
      addLog(`🔗 Please open the KYC link and complete the verification process.`, 'warning');
    }
  } catch (error) {
    addLog(`❌ Failed to check KYC status: ${error instanceof Error ? error.message : String(error)}`, 'error');
  }
}; 