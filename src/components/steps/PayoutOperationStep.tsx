import React from 'react';
import { Step, Button, FormInput, ResultDisplay } from '../ui';

export interface PayoutOperationStepProps {
  title: string;
  description?: string;
  stepNumber: number;
  currentStep: number;
  isCompleted: boolean;
  isLoading: boolean;
  buttonText: string;
  completedButtonText: string;
  onAction: () => void;
  resultId?: string;
  resultValue?: string;
  resultLabel?: string;
  payloadValue?: string;
  payloadLabel?: string;
  children?: React.ReactNode;
}

export const PayoutOperationStep: React.FC<PayoutOperationStepProps> = ({
  title,
  description,
  stepNumber,
  currentStep,
  isCompleted,
  isLoading,
  buttonText,
  completedButtonText,
  onAction,
  resultId,
  resultValue,
  resultLabel,
  payloadValue,
  payloadLabel,
  children
}) => {
  const isActive = currentStep === stepNumber;

  const actions = (
    <Button
      onClick={onAction}
      disabled={!isActive}
      loading={isLoading}
      variant={isCompleted ? 'success' : 'primary'}
    >
      {isCompleted ? completedButtonText : buttonText}
    </Button>
  );

  const signatureDisplayStyles = {
    backgroundColor: '#f8fafc',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '0.75rem',
    fontFamily: 'Monaco, Consolas, "Lucida Console", monospace',
    wordBreak: 'break-all' as const,
    lineHeight: '1.4',
    maxHeight: '200px',
    overflowY: 'auto' as const
  };

  const isSigningStep = title.includes('Sign');

  return (
    <Step
      title={title}
      description={description}
      stepNumber={stepNumber}
      isActive={isActive}
      isCompleted={isCompleted}
      isLoading={isLoading}
      actions={actions}
    >
      {children}
      
      {/* For non-signing steps, show regular result display */}
      {!isSigningStep && resultValue && (
        <ResultDisplay>
          <strong>{resultLabel || 'Result'}:</strong> {resultValue}
        </ResultDisplay>
      )}
      
      {payloadValue && (
        <FormInput
          id={`${stepNumber}-payload`}
          label={payloadLabel || 'Payload:'}
          type="textarea"
          value={payloadValue}
          onChange={() => {}}
          readOnly
          fontFamily="monospace"
          fontSize="small"
          rows={6}
        />
      )}
      
      {/* For signing steps, only show signature display */}
      {isSigningStep && resultValue && (
        <div style={{ marginTop: '15px' }}>
          <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
            Signature:
          </label>
          <div style={signatureDisplayStyles}>
            {resultValue}
          </div>
        </div>
      )}
    </Step>
  );
}; 