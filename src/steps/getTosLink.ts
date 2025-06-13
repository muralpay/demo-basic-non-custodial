import { MuralApiClient } from '../index';

export interface GetTosLinkParams {
  orgId: string;
  addLog: (message: string, type?: 'info' | 'error' | 'success' | 'warning') => void;
  setTosLink: (link: string) => void;
  setTosLinkVisible: (visible: boolean) => void;
  markStepComplete: (stepIndex: number) => void;
}

export const getTosLink = async (params: GetTosLinkParams) => {
  const { orgId, addLog, setTosLink, setTosLinkVisible, markStepComplete } = params;
  
  if (!orgId) {
    addLog('❌ Please create an organization first', 'error');
    return;
  }
  addLog('🔄 Step 2: Getting Terms of Service link...');
  try {
    const apiClient = new MuralApiClient();
    const link = await apiClient.getOrganizationTosLink(orgId);
    addLog(`✅ TOS link retrieved successfully!`, 'success');
    setTosLink(link);
    setTosLinkVisible(true);
    markStepComplete(1);
    addLog(`🔗 Please open the TOS link and complete the acceptance process`, 'warning');
    addLog(`➡️ Next: Accept Terms of Service, then initialize SDK`, 'info');
  } catch (error) {
    addLog(`❌ Failed to get TOS link: ${error instanceof Error ? error.message : String(error)}`, 'error');
  }
}; 