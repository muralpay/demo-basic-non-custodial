import React from 'react';
import { Step, Button, FormInput, InfoBox, ResultDisplay } from '../ui';
import { MuralApiClient } from '../../index';

export interface KycLinkStepProps {
  stepNumber: number;
  currentStep: number;
  isCompleted: boolean;
  isLoading: boolean;
  kycLink: string;
  kycLinkVisible: boolean;
  orgId: string;
  addLog: (message: string, type?: 'info' | 'error' | 'success' | 'warning') => void;
  markStepComplete: (stepIndex: number) => void;
  setKycLink: (link: string) => void;
  setKycLinkVisible: (visible: boolean) => void;
  setLoading: (loading: boolean) => void;
}

export const KycLinkStep: React.FC<KycLinkStepProps> = ({
  stepNumber,
  currentStep,
  isCompleted,
  isLoading,
  kycLink,
  kycLinkVisible,
  orgId,
  addLog,
  markStepComplete,
  setKycLink,
  setKycLinkVisible,
  setLoading
}) => {
  const isActive = currentStep === stepNumber;

  const handleGetKycLink = async () => {
    if (!orgId) {
      addLog('❌ Please complete previous steps first', 'error');
      return;
    }
    
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const actions = (
    <Button
      onClick={handleGetKycLink}
      disabled={!isActive}
      loading={isLoading}
      variant={isCompleted ? 'success' : 'primary'}
    >
      {isCompleted ? '✅ KYC Link Retrieved' : 'Get KYC Link'}
    </Button>
  );

  return (
    <Step
      title="Get KYC Link"
      stepNumber={stepNumber}
      isActive={isActive}
      isCompleted={isCompleted}
      isLoading={isLoading}
      actions={actions}
    >
      {kycLinkVisible && (
        <ResultDisplay>
          <FormInput
            id="kycLink"
            label="KYC Link:"
            value={kycLink}
            onChange={() => {}}
            readOnly
          />
          <div style={{ marginTop: '10px' }}>
            <Button
              href={kycLink}
              target="_blank"
              rel="noopener noreferrer"
              variant="success"
            >
              🚀 Open KYC Link
            </Button>
            <InfoBox variant="info">
              <p style={{ marginBottom: '10px' }}>
                <strong>🧪 Testing Environment Note:</strong> In testing environments, KYC validation is done automatically in the background. You don't need to click the link above. This typically takes around 10 minutes to complete.
              </p>
              <InfoBox variant="error" style={{ margin: 0 }}>
                <strong>Important:</strong> You must complete the KYC process before proceeding to account creation.
              </InfoBox>
            </InfoBox>
          </div>
        </ResultDisplay>
      )}
    </Step>
  );
}; 