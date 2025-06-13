import React from 'react';
import { Step, Button, InfoBox, ResultDisplay } from '../ui';

export interface CheckKycStatusStepProps {
  stepNumber: number;
  currentStep: number;
  isCompleted: boolean;
  isLoading: boolean;
  kycStatus: string;
  kycResponse: any;
  onCheckKycStatus: () => void;
}

export const CheckKycStatusStep: React.FC<CheckKycStatusStepProps> = ({
  stepNumber,
  currentStep,
  isCompleted,
  isLoading,
  kycStatus,
  kycResponse,
  onCheckKycStatus
}) => {
  const isActive = currentStep === stepNumber;

  const actions = (
    <Button
      onClick={onCheckKycStatus}
      disabled={!isActive}
      loading={isLoading}
      variant={isCompleted ? 'success' : 'primary'}
    >
      {isCompleted ? '✅ KYC Verified' : 'Check KYC Status'}
    </Button>
  );

  const getKycVariant = () => {
    if (kycStatus === 'approved') return 'success';
    if (kycStatus === 'pending' || kycStatus === 'submitted') return 'warning';
    return 'error';
  };

  return (
    <Step
      title="Check KYC Verification Status"
      stepNumber={stepNumber}
      isActive={isActive}
      isCompleted={isCompleted}
      isLoading={isLoading}
      actions={actions}
    >
      {kycResponse && (
        <ResultDisplay>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px' }}>
              KYC Validation Response:
            </label>
            <InfoBox variant={getKycVariant()}>
              <p style={{ marginBottom: '10px' }}>
                <strong>Status:</strong> {kycStatus?.toUpperCase() || 'NOT_STARTED'}
              </p>
              {kycResponse.kycStatus?.message && (
                <p style={{ marginBottom: '10px' }}>
                  <strong>Message:</strong> {kycResponse.kycStatus.message}
                </p>
              )}
              {kycStatus === 'approved' && (
                <p style={{ marginBottom: 0, fontSize: '14px' }}>
                  ✅ KYC verification has been completed successfully! You can now proceed to create an account.
                </p>
              )}
              {(kycStatus === 'pending' || kycStatus === 'submitted') && (
                <p style={{ marginBottom: 0, fontSize: '14px' }}>
                  ⏳ KYC verification is still being processed. In testing environments, this typically completes within 10 minutes.
                </p>
              )}
              {(!kycStatus || kycStatus === 'NOT_STARTED') && (
                <p style={{ marginBottom: 0, fontSize: '14px' }}>
                  ❌ KYC verification has not been started yet. Please complete the KYC process via the link in Step 7.
                </p>
              )}
            </InfoBox>
          </div>
        </ResultDisplay>
      )}
    </Step>
  );
}; 