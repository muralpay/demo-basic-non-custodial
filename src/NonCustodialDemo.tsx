// If you encounter a "Cannot find module 'react'" error, run: npm install @types/react

import React, { useState, useEffect } from 'react';
import { NonCustodialSDK } from '@muralpay/browser-sdk';
import { NonCustodialSDKWrapper, MuralApiClient } from './index';

// Import UI components
import {
  ProgressTracker,
  LogContainer,
  Header
} from './components/ui';

// Import step components
import {
  CreateOrganizationStep,
  TosLinkStep,
  CheckTosStatusStep,
  InitializeSDKStep,
  InitiateChallengeStep,
  StartSessionStep,
  KycLinkStep,
  CheckKycStatusStep,
  CreateAccountStep,
  FundAccountStep,
  CreatePayoutStep,
  GetPayoutBodyStep,
  SignPayoutStep,
  ExecutePayoutStep
} from './components/steps';

const NonCustodialDemo: React.FC = () => {
  const [wrapper, setWrapper] = useState<NonCustodialSDKWrapper | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [status, setStatus] = useState<{ message: string; type: 'ready' | 'error' | 'warning' }>({ message: 'Ready to start non-custodial flow', type: 'ready' });
  
  // Organization creation fields
  const [orgType, setOrgType] = useState<'nonCustodialIndividual' | 'nonCustodialBusiness'>('nonCustodialIndividual');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [businessName, setBusinessName] = useState<string>('');
  const [businessEmail, setBusinessEmail] = useState<string>('');
  const [approvers, setApprovers] = useState<string>('');
  
  // Flow state
  const [orgId, setOrgId] = useState<string>('');
  const [approverId, setApproverId] = useState<string>('');
  const [approversList, setApproversList] = useState<Array<{id: string, name: string, email: string}>>([]);
  const [selectedApproverIndex, setSelectedApproverIndex] = useState<number>(0);
  const [authenticatorId, setAuthenticatorId] = useState<string>('');
  const [emailCode, setEmailCode] = useState<string>('');
  const [tosLink, setTosLink] = useState<string>('');
  const [tosLinkVisible, setTosLinkVisible] = useState<boolean>(false);
  const [tosStatus, setTosStatus] = useState<string>('');
  const [tosResponse, setTosResponse] = useState<any>(null);
  const [kycLink, setKycLink] = useState<string>('');
  const [kycLinkVisible, setKycLinkVisible] = useState<boolean>(false);
  const [kycStatus, setKycStatus] = useState<string>('');
  const [kycResponse, setKycResponse] = useState<any>(null);
  
  // Account fields
  const [accountId, setAccountId] = useState<string>('');
  const [accountName, setAccountName] = useState<string>('Demo Account');
  const [accountAddress, setAccountAddress] = useState<string>('');
  const [accountInitializing, setAccountInitializing] = useState<boolean>(false);
  const [isLoadingAccountDetails, setIsLoadingAccountDetails] = useState<boolean>(false);
  
  // Payout fields
  const [payoutId, setPayoutId] = useState<string>('');
  const [payoutPayload, setPayoutPayload] = useState<string>('');
  const [signature, setSignature] = useState<string>('');
  const [payoutStatus, setPayoutStatus] = useState<string>('');
  
  // Flow progress tracking
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(new Array(14).fill(false));
  const [loadingStates, setLoadingStates] = useState<boolean[]>(new Array(14).fill(false));

  // Step names for progress tracker
  const stepNames = [
    'Create Organization',
    'Get TOS Link', 
    'Accept TOS',
    'Initialize SDK',
    'Initiate Challenge',
    'Start Session',
    'Get KYC Link',
    'Check KYC Status',
    'Create Account',
    'Fund Account',
    'Create Payout',
    'Get Payout Body',
    'Sign Payout',
    'Execute Payout'
  ];

  const addLog = (message: string, type: 'info' | 'error' | 'success' | 'warning' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    setLog((prev: string[]) => [...prev, logEntry]);
  };

  const updateStatus = (message: string, type: 'ready' | 'error' | 'warning' = 'ready') => {
    setStatus({ message, type });
  };

  const setStepLoading = (stepIndex: number, loading: boolean) => {
    setLoadingStates(prev => {
      const newStates = [...prev];
      newStates[stepIndex] = loading;
      return newStates;
    });
  };

  const markStepComplete = (stepIndex: number) => {
    setCompletedSteps(prev => {
      const newSteps = [...prev];
      newSteps[stepIndex] = true;
      return newSteps;
    });
    setCurrentStep(stepIndex + 2);
    setStepLoading(stepIndex, false);
  };

  const onKycStatusChange = (status: string, response: any) => {
    setKycStatus(status);
    setKycResponse(response);
  };

  const onTosStatusChange = (status: string, response: any) => {
    setTosStatus(status);
    setTosResponse(response);
  };

  const clearLog = () => {
    setLog(['🧹 Log cleared.']);
  };

  const containerStyles = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    backgroundColor: '#f8fafc',
    minHeight: '100vh'
  };

  const successBannerStyles = {
    backgroundColor: '#dcfce7',
    color: '#166534',
    padding: '30px',
    borderRadius: '12px',
    textAlign: 'center' as const,
    margin: '30px 0',
    border: '2px solid #bbf7d0'
  };

  return (
    <div style={containerStyles}>
      <Header 
        title="🎨 Non-Custodial Browser SDK Demo"
        status={status}
      />
      
      <ProgressTracker
        steps={stepNames}
        currentStep={currentStep}
        completedSteps={completedSteps}
      />

      <LogContainer
        log={log}
        onClear={clearLog}
      />

      {/* Step 1: Organization Creation */}
      <CreateOrganizationStep
        orgType={orgType}
        setOrgType={setOrgType}
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        email={email}
        setEmail={setEmail}
        businessName={businessName}
        setBusinessName={setBusinessName}
        businessEmail={businessEmail}
        setBusinessEmail={setBusinessEmail}
        approvers={approvers}
        setApprovers={setApprovers}
        stepNumber={1}
        currentStep={currentStep}
        isCompleted={completedSteps[0]}
        isLoading={loadingStates[0]}
        orgId={orgId}
        approverId={approverId}
        approversList={approversList}
        selectedApproverIndex={selectedApproverIndex}
        addLog={addLog}
        markStepComplete={markStepComplete}
        setOrgId={setOrgId}
        setApproverId={setApproverId}
        setApproversList={setApproversList}
        setSelectedApproverIndex={setSelectedApproverIndex}
        setLoading={setStepLoading.bind(null, 0)}
      />

      {/* Step 2: TOS Link */}
      <TosLinkStep
        stepNumber={2}
        currentStep={currentStep}
        isCompleted={completedSteps[1]}
        isLoading={loadingStates[1]}
        tosLink={tosLink}
        tosLinkVisible={tosLinkVisible}
        orgId={orgId}
        addLog={addLog}
        markStepComplete={markStepComplete}
        setTosLink={setTosLink}
        setTosLinkVisible={setTosLinkVisible}
        setLoading={setStepLoading.bind(null, 1)}
      />

      {/* Step 3: Check TOS Status */}
      <CheckTosStatusStep
        stepNumber={3}
        currentStep={currentStep}
        isCompleted={completedSteps[2]}
        isLoading={loadingStates[2]}
        tosStatus={tosStatus}
        tosResponse={tosResponse}
        orgId={orgId}
        addLog={addLog}
        markStepComplete={markStepComplete}
        onTosStatusChange={onTosStatusChange}
        setLoading={setStepLoading.bind(null, 2)}
      />

      {/* Step 4: Initialize SDK */}
      <InitializeSDKStep
        stepNumber={4}
        currentStep={currentStep}
        isCompleted={completedSteps[3]}
        isLoading={loadingStates[3]}
        addLog={addLog}
        setWrapper={setWrapper}
        markStepComplete={markStepComplete}
        updateStatus={updateStatus}
        setLoading={setStepLoading.bind(null, 3)}
      />

      {/* Step 5: Initiate Challenge */}
      <InitiateChallengeStep
        stepNumber={5}
        currentStep={currentStep}
        isCompleted={completedSteps[4]}
        isLoading={loadingStates[4]}
        approversList={approversList}
        selectedApproverIndex={selectedApproverIndex}
        authenticatorId={authenticatorId}
        orgId={orgId}
        approverId={approversList.length > 0 ? approversList[selectedApproverIndex]?.id : approverId}
        wrapper={wrapper}
        addLog={addLog}
        setAuthenticatorId={setAuthenticatorId}
        markStepComplete={markStepComplete}
        setLoading={setStepLoading.bind(null, 4)}
      />

      {/* Step 6: Start Session */}
      <StartSessionStep
        stepNumber={6}
        currentStep={currentStep}
        isCompleted={completedSteps[5]}
        isLoading={loadingStates[5]}
        emailCode={emailCode}
        setEmailCode={setEmailCode}
        wrapper={wrapper}
        authenticatorId={authenticatorId}
        addLog={addLog}
        markStepComplete={markStepComplete}
        setLoading={setStepLoading.bind(null, 5)}
      />

      {/* Step 7: Get KYC Link */}
      <KycLinkStep
        stepNumber={7}
        currentStep={currentStep}
        isCompleted={completedSteps[6]}
        isLoading={loadingStates[6]}
        kycLink={kycLink}
        kycLinkVisible={kycLinkVisible}
        orgId={orgId}
        addLog={addLog}
        markStepComplete={markStepComplete}
        setKycLink={setKycLink}
        setKycLinkVisible={setKycLinkVisible}
        setLoading={setStepLoading.bind(null, 6)}
      />

      {/* Step 8: Check KYC Status */}
      <CheckKycStatusStep
        stepNumber={8}
        currentStep={currentStep}
        isCompleted={completedSteps[7]}
        isLoading={loadingStates[7]}
        kycStatus={kycStatus}
        kycResponse={kycResponse}
        orgId={orgId}
        addLog={addLog}
        markStepComplete={markStepComplete}
        onKycStatusChange={onKycStatusChange}
        setLoading={setStepLoading.bind(null, 7)}
      />

      {/* Step 9: Create Account */}
      <CreateAccountStep
        stepNumber={9}
        currentStep={currentStep}
        isCompleted={completedSteps[8]}
        isLoading={loadingStates[8]}
        accountName={accountName}
        setAccountName={setAccountName}
        accountId={accountId}
        accountAddress={accountAddress}
        accountInitializing={accountInitializing}
        orgId={orgId}
        addLog={addLog}
        markStepComplete={markStepComplete}
        setAccountId={setAccountId}
        setAccountAddress={setAccountAddress}
        setLoading={setStepLoading.bind(null, 8)}
        isLoadingAccountDetails={isLoadingAccountDetails}
        setLoadingAccountDetails={setIsLoadingAccountDetails}
      />

      {/* Step 10: Fund Account */}
      <FundAccountStep
        stepNumber={10}
        currentStep={currentStep}
        isCompleted={completedSteps[9]}
        isLoading={loadingStates[9]}
        accountAddress={accountAddress}
        addLog={addLog}
        markStepComplete={markStepComplete}
        setLoading={setStepLoading.bind(null, 9)}
      />

      {/* Step 11: Create Payout */}
      <CreatePayoutStep
        stepNumber={11}
        currentStep={currentStep}
        isCompleted={completedSteps[10]}
        isLoading={loadingStates[10]}
        payoutId={payoutId}
        orgId={orgId}
        accountId={accountId}
        addLog={addLog}
        setPayoutId={setPayoutId}
        markStepComplete={markStepComplete}
        setLoading={setStepLoading.bind(null, 10)}
      />

      {/* Step 12: Get Payout Body */}
      <GetPayoutBodyStep
        stepNumber={12}
        currentStep={currentStep}
        isCompleted={completedSteps[11]}
        isLoading={loadingStates[11]}
        payoutPayload={payoutPayload}
        orgId={orgId}
        payoutId={payoutId}
        addLog={addLog}
        setPayoutPayload={setPayoutPayload}
        markStepComplete={markStepComplete}
        setLoading={setStepLoading.bind(null, 11)}
      />

      {/* Step 13: Sign Payout */}
      <SignPayoutStep
        stepNumber={13}
        currentStep={currentStep}
        isCompleted={completedSteps[12]}
        isLoading={loadingStates[12]}
        signature={signature}
        wrapper={wrapper}
        payoutPayload={payoutPayload}
        addLog={addLog}
        setSignature={setSignature}
        markStepComplete={markStepComplete}
        setLoading={setStepLoading.bind(null, 12)}
      />

      {/* Step 14: Execute Payout */}
      <ExecutePayoutStep
        stepNumber={14}
        currentStep={currentStep}
        isCompleted={completedSteps[13]}
        isLoading={loadingStates[13]}
        payoutStatus={payoutStatus}
        orgId={orgId}
        payoutId={payoutId}
        signature={signature}
        addLog={addLog}
        setPayoutStatus={setPayoutStatus}
        markStepComplete={markStepComplete}
        setLoading={setStepLoading.bind(null, 13)}
      />

      {/* Success Message */}
      {completedSteps[13] && (
        <div style={successBannerStyles}>
          <h2 style={{fontSize: '2rem', margin: '0 0 10px 0'}}>🎉 Congratulations!</h2>
          <p style={{fontSize: '1.1rem', margin: 0}}>You have successfully completed the entire non-custodial payout flow!</p>
        </div>
      )}

      {/* Hidden iframe container for SDK */}
      <div id="auth-iframe-container-id" style={{ display: 'none' }}></div>
    </div>
  );
};

export default NonCustodialDemo; 