import React from 'react';
import { Step, Button, FormInput, RadioGroup, InfoBox, ResultDisplay } from '../ui';
import { createOrg } from '../../steps';

export interface CreateOrganizationStepProps {
  // Form state
  orgType: 'nonCustodialIndividual' | 'nonCustodialBusiness';
  setOrgType: (value: 'nonCustodialIndividual' | 'nonCustodialBusiness') => void;
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  businessName: string;
  setBusinessName: (value: string) => void;
  businessEmail: string;
  setBusinessEmail: (value: string) => void;
  approvers: string;
  setApprovers: (value: string) => void;
  
  // Step state
  stepNumber: number;
  currentStep: number;
  isCompleted: boolean;
  isLoading: boolean;
  
  // Results
  orgId: string;
  approverId: string;
  approversList: Array<{id: string, name: string, email: string}>;
  selectedApproverIndex: number;
  setSelectedApproverIndex: (index: number) => void;
  
  // Actions
  onCreateOrg: () => void;
}

export const CreateOrganizationStep: React.FC<CreateOrganizationStepProps> = ({
  orgType,
  setOrgType,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  businessName,
  setBusinessName,
  businessEmail,
  setBusinessEmail,
  approvers,
  setApprovers,
  stepNumber,
  currentStep,
  isCompleted,
  isLoading,
  orgId,
  approverId,
  approversList,
  selectedApproverIndex,
  setSelectedApproverIndex,
  onCreateOrg
}) => {
  const orgTypeOptions = [
    { value: 'nonCustodialIndividual', label: 'Individual' },
    { value: 'nonCustodialBusiness', label: 'Business' }
  ];

  const isActive = currentStep === stepNumber;
  const canSubmit = isActive && !isLoading;

  const approverCardStyles = {
    padding: '12px',
    backgroundColor: 'white',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const approverCardSelectedStyles = {
    backgroundColor: '#dbeafe',
    borderColor: '#3b82f6'
  };

  const radioInputStyles = {
    marginRight: '10px',
    accentColor: '#3b82f6'
  };

  const actions = (
    <Button
      onClick={onCreateOrg}
      disabled={!canSubmit}
      loading={isLoading}
      variant={isCompleted ? 'success' : 'primary'}
    >
      {isCompleted ? '✅ Organization Created' : 'Create Organization'}
    </Button>
  );

  return (
    <Step
      title="Create Non-Custodial Organization"
      stepNumber={stepNumber}
      isActive={isActive}
      isCompleted={isCompleted}
      isLoading={isLoading}
      actions={actions}
    >
      <RadioGroup
        label="Organization Type:"
        name="orgType"
        value={orgType}
        onChange={(value: string) => setOrgType(value as 'nonCustodialIndividual' | 'nonCustodialBusiness')}
        options={orgTypeOptions}
        disabled={!isActive}
      />

      {orgType === 'nonCustodialIndividual' ? (
        <>
          <FormInput
            id="firstName"
            label="First Name"
            value={firstName}
            onChange={setFirstName}
            placeholder="Enter first name"
            disabled={!isActive}
          />
          <FormInput
            id="lastName"
            label="Last Name"
            value={lastName}
            onChange={setLastName}
            placeholder="Enter last name"
            disabled={!isActive}
          />
          <FormInput
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="Enter email"
            disabled={!isActive}
          />
        </>
      ) : (
        <>
          <FormInput
            id="businessName"
            label="Business Name"
            value={businessName}
            onChange={setBusinessName}
            placeholder="Enter business name"
            disabled={!isActive}
          />
          <FormInput
            id="businessEmail"
            label="Business Email"
            type="email"
            value={businessEmail}
            onChange={setBusinessEmail}
            placeholder="Enter business email"
            disabled={!isActive}
          />
          <FormInput
            id="approvers"
            label="Approvers (JSON array)"
            type="textarea"
            value={approvers}
            onChange={setApprovers}
            placeholder='[{"name": "John Doe", "email": "john@example.com"}]'
            fontFamily="monospace"
            fontSize="small"
            disabled={!isActive}
          />
          <InfoBox variant="info">
            <p style={{ marginBottom: '10px', fontSize: '14px' }}>
              <strong>📋 Business Organization Approvers Example:</strong>
            </p>
            <div style={{ fontSize: '12px', fontFamily: 'Monaco, Consolas, "Lucida Console", monospace' }}>
              <div style={{ backgroundColor: '#f1f5f9', padding: '8px', borderRadius: '4px', marginBottom: '0' }}>
                {'['}<br/>
                &nbsp;&nbsp;{'{"name": "John Smith", "email": "john@company.com"},'}<br/>
                &nbsp;&nbsp;{'{"name": "Jane Doe", "email": "jane@company.com"}'}<br/>
                {']'}
              </div>
            </div>
          </InfoBox>
        </>
      )}

      {orgId && (
        <ResultDisplay>
          <strong>Organization ID:</strong> {orgId}<br/>
          {approverId && <><strong>Approver ID:</strong> {approverId}</>}
          
          {/* Show approver selection for business organizations with multiple approvers */}
          {orgType === 'nonCustodialBusiness' && approversList.length > 1 && (
            <InfoBox variant="info">
              <h4 style={{ marginTop: 0, marginBottom: '10px' }}>👥 Select Approver for Authentication</h4>
              <p style={{ marginBottom: '10px', fontSize: '14px' }}>
                Choose which approver will be used for the authentication challenge:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {approversList.map((approver, index) => (
                  <label 
                    key={approver.id} 
                    style={{
                      ...approverCardStyles,
                      ...(selectedApproverIndex === index ? approverCardSelectedStyles : {})
                    }}
                  >
                    <input
                      type="radio"
                      name="selectedApprover"
                      value={index}
                      checked={selectedApproverIndex === index}
                      onChange={() => setSelectedApproverIndex(index)}
                      style={radioInputStyles}
                    />
                    <div>
                      <strong>{approver.name}</strong><br/>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>{approver.email}</span><br/>
                      <span style={{ fontSize: '11px', color: '#9ca3af' }}>ID: {approver.id}</span>
                    </div>
                  </label>
                ))}
              </div>
            </InfoBox>
          )}
          
          {/* Show single approver info for individual orgs or business orgs with one approver */}
          {(orgType === 'nonCustodialIndividual' || approversList.length === 1) && approversList.length > 0 && (
            <InfoBox variant="info">
              <strong>👤 Approver Details:</strong><br/>
              <span>{approversList[0].name} ({approversList[0].email})</span>
            </InfoBox>
          )}
        </ResultDisplay>
      )}
    </Step>
  );
}; 