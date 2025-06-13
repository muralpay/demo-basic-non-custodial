import React from 'react';
import { Step, Button, InfoBox, ResultDisplay } from '../ui';

export interface InitiateChallengeStepProps {
  stepNumber: number;
  currentStep: number;
  isCompleted: boolean;
  isLoading: boolean;
  approversList: Array<{id: string, name: string, email: string}>;
  selectedApproverIndex: number;
  authenticatorId: string;
  onInitiateChallenge: () => void;
}

export const InitiateChallengeStep: React.FC<InitiateChallengeStepProps> = ({
  stepNumber,
  currentStep,
  isCompleted,
  isLoading,
  approversList,
  selectedApproverIndex,
  authenticatorId,
  onInitiateChallenge
}) => {
  const isActive = currentStep === stepNumber;

  const actions = (
    <Button
      onClick={onInitiateChallenge}
      disabled={!isActive}
      loading={isLoading}
      variant={isCompleted ? 'success' : 'primary'}
    >
      {isCompleted ? '✅ Challenge Initiated' : 'Initiate Challenge'}
    </Button>
  );

  return (
    <Step
      title="Initiate Authentication Challenge"
      stepNumber={stepNumber}
      isActive={isActive}
      isCompleted={isCompleted}
      isLoading={isLoading}
      actions={actions}
    >
      {/* Show selected approver info */}
      {approversList.length > 0 && (
        <InfoBox variant="info">
          <strong>👤 Selected Approver:</strong><br/>
          <span>{approversList[selectedApproverIndex]?.name} ({approversList[selectedApproverIndex]?.email})</span>
          {approversList.length > 1 && (
            <p style={{ marginTop: '5px', fontSize: '12px' }}>
              💡 You can change the approver selection in Step 1 if needed.
            </p>
          )}
        </InfoBox>
      )}
      
      {authenticatorId && (
        <ResultDisplay>
          <strong>Authenticator ID:</strong> {authenticatorId}
        </ResultDisplay>
      )}
    </Step>
  );
}; 