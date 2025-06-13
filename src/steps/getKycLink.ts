import { MuralApiClient } from '../index';

export interface GetKycLinkParams {
  orgId: string;
  addLog: (message: string, type?: 'info' | 'error' | 'success' | 'warning') => void;
  setKycLink: (link: string) => void;
  setKycLinkVisible: (visible: boolean) => void;
  markStepComplete: (stepIndex: number) => void;
}

export const getKycLink = async (params: GetKycLinkParams) => {
  const { orgId, addLog, setKycLink, setKycLinkVisible, markStepComplete } = params;
  
  if (!orgId) {
    addLog('❌ Please complete previous steps first', 'error');
    return;
  }
  addLog('🔄 Step 7: Getting KYC link...');
  try {
    const apiClient = new MuralApiClient();
    const link = await apiClient.getOrganizationKycLink(orgId);
    addLog(`✅ KYC link retrieved successfully!`, 'success');
    setKycLink(link);
    setKycLinkVisible(true);
    markStepComplete(6);
    addLog(`🔗 Please open the KYC link and complete the verification process`, 'warning');
    addLog(`➡️ Next: Check KYC status, then create account`, 'info');
  } catch (error) {
    addLog(`❌ Failed to get KYC link: ${error instanceof Error ? error.message : String(error)}`, 'error');
  }
}; 