import React from 'react';
import { Step, Button, FormInput, InfoBox, ResultDisplay } from '../ui';

export interface TosLinkStepProps {
  stepNumber: number;
  currentStep: number;
  isCompleted: boolean;
  isLoading: boolean;
  tosLink: string;
  tosLinkVisible: boolean;
  onGetTosLink: () => void;
}

export const TosLinkStep: React.FC<TosLinkStepProps> = ({
  stepNumber,
  currentStep,
  isCompleted,
  isLoading,
  tosLink,
  tosLinkVisible,
  onGetTosLink
}) => {
  const isActive = currentStep === stepNumber;

  const actions = (
    <Button
      onClick={onGetTosLink}
      disabled={!isActive}
      loading={isLoading}
      variant={isCompleted ? 'success' : 'primary'}
    >
      {isCompleted ? '✅ TOS Link Retrieved' : 'Get TOS Link'}
    </Button>
  );

  return (
    <Step
      title="Get Terms of Service Link"
      stepNumber={stepNumber}
      isActive={isActive}
      isCompleted={isCompleted}
      isLoading={isLoading}
      actions={actions}
    >
      {tosLinkVisible && (
        <ResultDisplay>
          <FormInput
            id="tosLink"
            label="Terms of Service Link:"
            value={tosLink}
            onChange={() => {}}
            readOnly
          />
          <div style={{ marginTop: '10px' }}>
            <Button
              href={tosLink}
              target="_blank"
              rel="noopener noreferrer"
              variant="success"
            >
              🚀 Open TOS Link
            </Button>
            <InfoBox variant="error">
              <strong>Important:</strong> You must click on the link and accept the Terms of Service before proceeding.
            </InfoBox>
          </div>
        </ResultDisplay>
      )}
    </Step>
  );
}; 