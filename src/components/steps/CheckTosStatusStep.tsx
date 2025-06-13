import React from 'react';
import { Step, Button, InfoBox, ResultDisplay } from '../ui';
import { MuralApiClient } from '../../index';

export interface CheckTosStatusStepProps {
  stepNumber: number;
  currentStep: number;
  isCompleted: boolean;
  isLoading: boolean;
  tosStatus: string;
  tosResponse: any;
  orgId: string;
  addLog: (message: string, type?: 'info' | 'error' | 'success' | 'warning') => void;
  markStepComplete: (stepIndex: number) => void;
  onTosStatusChange: (status: string, response: any) => void;
  setLoading: (loading: boolean) => void;
}

export const CheckTosStatusStep: React.FC<CheckTosStatusStepProps> = ({
  stepNumber,
  currentStep,
  isCompleted,
  isLoading,
  tosStatus,
  tosResponse,
  orgId,
  addLog,
  markStepComplete,
  onTosStatusChange,
  setLoading
}) => {
  const isActive = currentStep === stepNumber;

  const handleCheckTosStatus = async () => {
    if (!orgId) {
      addLog('❌ Please create an organization first', 'error');
      return;
    }
    
    setLoading(true);
    addLog('🔄 Step 3: Checking Terms of Service acceptance status...');
    
    try {
      const apiClient = new MuralApiClient();
      const orgDetails = await apiClient.getOrganization(orgId);
      const tosStatusValue = orgDetails.tosStatus;
      
      onTosStatusChange(tosStatusValue, orgDetails);
      
      if (tosStatusValue === 'ACCEPTED') {
        addLog(`✅ Terms of Service have been accepted!`, 'success');
        markStepComplete(2);
        addLog(`➡️ Next: Initialize the SDK`, 'info');
      } else if (tosStatusValue === 'NEEDS_REVIEW') {
        addLog(`⚠️ Terms of Service are pending review. Please wait for approval.`, 'warning');
      } else {
        addLog(`❌ Terms of Service have not been accepted yet. Status: ${tosStatusValue}`, 'error');
        addLog(`🔗 Please open the TOS link and complete the acceptance process.`, 'warning');
      }
    } catch (error) {
      addLog(`❌ Failed to check TOS status: ${error instanceof Error ? error.message : String(error)}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const actions = (
    <Button
      onClick={handleCheckTosStatus}
      disabled={!isActive}
      loading={isLoading}
      variant={isCompleted ? 'success' : 'primary'}
    >
      {isCompleted ? '✅ TOS Accepted' : 'Check TOS Status'}
    </Button>
  );

  const getTosVariant = () => {
    if (tosStatus === 'ACCEPTED') return 'success';
    if (tosStatus === 'NEEDS_REVIEW') return 'warning';
    return 'error';
  };

  return (
    <Step
      title="Check Terms of Service Status"
      stepNumber={stepNumber}
      isActive={isActive}
      isCompleted={isCompleted}
      isLoading={isLoading}
      actions={actions}
    >
      {tosResponse && (
        <ResultDisplay>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>
              TOS Status Response:
            </label>
            <InfoBox variant={getTosVariant()}>
              <p style={{ marginBottom: '10px' }}>
                <strong>Status:</strong> {tosStatus || 'NOT_STARTED'}
              </p>
              {tosStatus === 'ACCEPTED' && (
                <p style={{ marginBottom: 0, fontSize: '14px' }}>
                  ✅ Terms of Service have been accepted successfully! You can now proceed to initialize the SDK.
                </p>
              )}
              {tosStatus === 'NEEDS_REVIEW' && (
                <p style={{ marginBottom: 0, fontSize: '14px' }}>
                  ⏳ Terms of Service are pending review. Please wait for approval.
                </p>
              )}
              {(!tosStatus || tosStatus === 'NOT_STARTED') && (
                <p style={{ marginBottom: 0, fontSize: '14px' }}>
                  ❌ Terms of Service have not been accepted yet. Please complete the TOS acceptance via the link in Step 2.
                </p>
              )}
            </InfoBox>
          </div>
        </ResultDisplay>
      )}
    </Step>
  );
}; 