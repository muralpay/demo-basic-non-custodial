import React from 'react';
import { Step, Button, FormInput, InfoBox, ResultDisplay } from '../ui';

export interface KycLinkStepProps {
  stepNumber: number;
  currentStep: number;
  isCompleted: boolean;
  isLoading: boolean;
  kycLink: string;
  kycLinkVisible: boolean;
  onGetKycLink: () => void;
}

export const KycLinkStep: React.FC<KycLinkStepProps> = ({
  stepNumber,
  currentStep,
  isCompleted,
  isLoading,
  kycLink,
  kycLinkVisible,
  onGetKycLink
}) => {
  const isActive = currentStep === stepNumber;

  const actions = (
    <Button
      onClick={onGetKycLink}
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