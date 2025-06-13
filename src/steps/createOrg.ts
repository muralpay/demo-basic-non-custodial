import { MuralApiClient } from '../index';

export interface CreateOrgParams {
  orgType: 'nonCustodialIndividual' | 'nonCustodialBusiness';
  firstName: string;
  lastName: string;
  email: string;
  businessName: string;
  businessEmail: string;
  approvers: string;
  addLog: (message: string, type?: 'info' | 'error' | 'success' | 'warning') => void;
  setOrgId: (id: string) => void;
  setApproverId: (id: string) => void;
  setApproversList: (approvers: Array<{id: string, name: string, email: string}>) => void;
  markStepComplete: (stepIndex: number) => void;
}

export const createOrg = async (params: CreateOrgParams) => {
  const {
    orgType,
    firstName,
    lastName,
    email,
    businessName,
    businessEmail,
    approvers,
    addLog,
    setOrgId,
    setApproverId,
    setApproversList,
    markStepComplete
  } = params;

  let payload;
  if (orgType === 'nonCustodialIndividual') {
    if (!firstName || !lastName || !email) {
      addLog('❌ Please fill in all individual fields', 'error');
      return;
    }
    payload = { type: 'nonCustodialIndividual', firstName, lastName, email };
  } else {
    if (!businessName || !businessEmail) {
      addLog('❌ Please fill in business name and email', 'error');
      return;
    }
    let approversArray = [];
    try {
      if (approvers) {
        approversArray = JSON.parse(approvers);
      }
    } catch (error) {
      addLog('❌ Invalid JSON for approvers', 'error');
      return;
    }
    payload = { type: 'nonCustodialBusiness', businessName, email: businessEmail, approvers: approversArray };
  }
  
  addLog(`🔄 Step 1: Creating ${orgType} organization...`);
  try {
    const apiClient = new MuralApiClient();
    const result = await apiClient.createNonCustodialOrg(payload);
    addLog(`✅ Organization created successfully!`, 'success');
    addLog(`📋 Organization ID: ${result.id}`, 'success');
    setOrgId(result.id);
    
    // Handle approvers based on organization type
    if (orgType === 'nonCustodialIndividual') {
      // For individual orgs, there's typically one approver (the individual themselves)
      if (result.approver && result.approver.id) {
        setApproverId(result.approver.id);
        addLog(`📋 Approver ID: ${result.approver.id}`, 'success');
        
        // Set single approver in the list
        setApproversList([{
          id: result.approver.id,
          name: `${firstName} ${lastName}`,
          email: email
        }]);
      }
    } else {
      // For business orgs, handle multiple approvers
      if (result.approvers && Array.isArray(result.approvers)) {
        const approversList = result.approvers.map((approver: {id: string, name?: string, email?: string}, index: number) => ({
          id: approver.id,
          name: approver.name || `Approver ${index + 1}`,
          email: approver.email || 'No email'
        }));
        
        setApproversList(approversList);
        addLog(`📋 ${approversList.length} approvers available:`, 'success');
        approversList.forEach((approver, index) => {
          addLog(`   ${index + 1}. ${approver.name} (${approver.email}) - ID: ${approver.id}`, 'info');
        });
        
        // Set the first approver as default
        if (approversList.length > 0) {
          setApproverId(approversList[0].id);
        }
      } else if (result.approver && result.approver.id) {
        // Fallback for single approver in business org
        setApproverId(result.approver.id);
        addLog(`📋 Approver ID: ${result.approver.id}`, 'success');
        
        setApproversList([{
          id: result.approver.id,
          name: result.approver.name || 'Business Approver',
          email: result.approver.email || businessEmail
        }]);
      }
    }
    
    markStepComplete(0);
    addLog(`➡️ Next: Get Terms of Service link`, 'info');
  } catch (error) {
    addLog(`❌ Failed to create organization: ${error instanceof Error ? error.message : String(error)}`, 'error');
  }
}; 