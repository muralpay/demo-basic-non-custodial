// If you encounter a "Cannot find module 'react'" error, run: npm install @types/react

import React, { useState, useEffect } from 'react';
import { NonCustodialSDK } from '@muralpay/browser-sdk';
import { NonCustodialSDKWrapper, MuralApiClient } from './index';
import {
  createOrg,
  getTosLink,
  checkTosStatus,
  initializeSDK,
  initiateChallenge,
  startSession,
  getKycLink,
  checkKycStatus,
  createAccount,
  getAccountDetails,
  proceedToFunding,
  createPayout,
  getPayoutBody,
  signPayout,
  executePayout
} from './steps';

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
  SimpleActionStep,
  InitiateChallengeStep,
  StartSessionStep,
  KycLinkStep,
  CheckKycStatusStep,
  CreateAccountStep,
  FundAccountStep,
  PayoutOperationStep
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
  
  // Simplified - no payout form fields needed
  
  const [payoutId, setPayoutId] = useState<string>('');
  const [payoutPayload, setPayoutPayload] = useState<string>('');
  const [signature, setSignature] = useState<string>('');
  
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

  // Step wrapper functions that call the imported step functions
  const handleCreateOrg = async () => {
    setStepLoading(0, true);
    try {
      await createOrg({
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
      });
    } finally {
      setStepLoading(0, false);
    }
  };

  const handleGetTosLink = async () => {
    setStepLoading(1, true);
    try {
      await getTosLink({
        orgId,
        addLog,
        setTosLink,
        setTosLinkVisible,
        markStepComplete
      });
    } finally {
      setStepLoading(1, false);
    }
  };

  const handleCheckTosStatus = async () => {
    setStepLoading(2, true);
    try {
      await checkTosStatus({
        orgId,
        addLog,
        markStepComplete
      });
    } finally {
      setStepLoading(2, false);
    }
  };

  const handleInitializeSDK = async () => {
    setStepLoading(3, true);
    try {
      await initializeSDK({
        addLog,
        setWrapper,
        markStepComplete,
        updateStatus
      });
    } finally {
      setStepLoading(3, false);
    }
  };

  const handleInitiateChallenge = async () => {
    setStepLoading(4, true);
    try {
      const selectedApproverId = approversList.length > 0 ? approversList[selectedApproverIndex].id : approverId;
      await initiateChallenge({
        orgId,
        approverId: selectedApproverId,
        wrapper,
        addLog,
        setAuthenticatorId,
        markStepComplete
      });
    } finally {
      setStepLoading(4, false);
    }
  };

  const handleStartSession = async () => {
    setStepLoading(5, true);
    try {
      await startSession({
        wrapper,
        emailCode,
        authenticatorId,
        addLog,
        markStepComplete
      });
    } finally {
      setStepLoading(5, false);
    }
  };

  const handleGetKycLink = async () => {
    setStepLoading(6, true);
    try {
      await getKycLink({
        orgId,
        addLog,
        setKycLink,
        setKycLinkVisible,
        markStepComplete
      });
    } finally {
      setStepLoading(6, false);
    }
  };

  const handleCheckKycStatus = async () => {
    setStepLoading(7, true);
    try {
      const apiClient = new MuralApiClient();
      const orgDetails = await apiClient.getOrganization(orgId);
      
      // Store the full response for display
      setKycResponse(orgDetails);
      setKycStatus(orgDetails.kycStatus?.type || 'NOT_STARTED');
      
      await checkKycStatus({
        orgId,
        addLog,
        markStepComplete
      });
    } finally {
      setStepLoading(7, false);
    }
  };

  const handleCreateAccount = async () => {
    setStepLoading(8, true);
    setAccountInitializing(true);
    try {
      await createAccount({
        orgId,
        accountName,
        addLog,
        setAccountId,
        setAccountAddress,
        markStepComplete
      });
      
      // Check if we got an address, if not, account is still initializing
      if (!accountAddress) {
        addLog('⏳ Account created but still initializing. This typically takes around 3 minutes...', 'warning');
      }
    } finally {
      setStepLoading(8, false);
      if (accountAddress) {
        setAccountInitializing(false);
      }
    }
  };

  const handleGetAccountDetails = async () => {
    setIsLoadingAccountDetails(true);
    try {
      await getAccountDetails({
        orgId,
        accountId,
        addLog,
        setAccountAddress
      });
      
      // Check if we now have an address, if so, account is no longer initializing
      if (accountAddress) {
        setAccountInitializing(false);
      }
    } catch (error) {
      // Handle error if needed
    } finally {
      setIsLoadingAccountDetails(false);
    }
  };

  const handleProceedToFunding = async () => {
    setStepLoading(9, true);
    try {
      await proceedToFunding({
        accountAddress,
        addLog,
        markStepComplete
      });
    } finally {
      setStepLoading(9, false);
    }
  };

  const handleCreatePayout = async () => {
    setStepLoading(10, true);
    try {
      await createPayout({
        orgId,
        accountId,
        addLog,
        setPayoutId,
        markStepComplete
      });
    } finally {
      setStepLoading(10, false);
    }
  };

  const handleGetPayoutBody = async () => {
    setStepLoading(11, true);
    try {
      await getPayoutBody({
        orgId,
        payoutId,
        addLog,
        setPayoutPayload,
        markStepComplete
      });
    } finally {
      setStepLoading(11, false);
    }
  };

  const handleSignPayout = async () => {
    setStepLoading(12, true);
    try {
      await signPayout({
        wrapper,
        payoutPayload,
        addLog,
        setSignature,
        markStepComplete
      });
    } finally {
      setStepLoading(12, false);
    }
  };

  const handleExecutePayout = async () => {
    setStepLoading(13, true);
    try {
      await executePayout({
        orgId,
        payoutId,
        signature,
        addLog,
        markStepComplete
      });
    } finally {
      setStepLoading(13, false);
    }
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
        setSelectedApproverIndex={setSelectedApproverIndex}
        onCreateOrg={handleCreateOrg}
      />

      {/* Step 2: TOS Link */}
      <TosLinkStep
        stepNumber={2}
        currentStep={currentStep}
        isCompleted={completedSteps[1]}
        isLoading={loadingStates[1]}
        tosLink={tosLink}
        tosLinkVisible={tosLinkVisible}
        onGetTosLink={handleGetTosLink}
      />

      {/* Step 3: Check TOS Status */}
      <SimpleActionStep
        title="Accept Terms of Service"
        description="After accepting the TOS via the link above, click to verify acceptance:"
        stepNumber={3}
        currentStep={currentStep}
        isCompleted={completedSteps[2]}
        isLoading={loadingStates[2]}
        buttonText="Check TOS Status"
        completedButtonText="✅ TOS Accepted"
        onAction={handleCheckTosStatus}
      />

      {/* Step 4: Initialize SDK */}
      <SimpleActionStep
        title="Initialize SDK"
        stepNumber={4}
        currentStep={currentStep}
        isCompleted={completedSteps[3]}
        isLoading={loadingStates[3]}
        buttonText="Initialize SDK"
        completedButtonText="✅ SDK Initialized"
        onAction={handleInitializeSDK}
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
        onInitiateChallenge={handleInitiateChallenge}
      />

      {/* Step 6: Start Session */}
      <StartSessionStep
        stepNumber={6}
        currentStep={currentStep}
        isCompleted={completedSteps[5]}
        isLoading={loadingStates[5]}
        emailCode={emailCode}
        setEmailCode={setEmailCode}
        onStartSession={handleStartSession}
      />

      {/* Step 7: Get KYC Link */}
      <KycLinkStep
        stepNumber={7}
        currentStep={currentStep}
        isCompleted={completedSteps[6]}
        isLoading={loadingStates[6]}
        kycLink={kycLink}
        kycLinkVisible={kycLinkVisible}
        onGetKycLink={handleGetKycLink}
      />

      {/* Step 8: Check KYC Status */}
      <CheckKycStatusStep
        stepNumber={8}
        currentStep={currentStep}
        isCompleted={completedSteps[7]}
        isLoading={loadingStates[7]}
        kycStatus={kycStatus}
        kycResponse={kycResponse}
        onCheckKycStatus={handleCheckKycStatus}
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
        onCreateAccount={handleCreateAccount}
        onGetAccountDetails={handleGetAccountDetails}
        isLoadingAccountDetails={isLoadingAccountDetails}
      />

      {/* Step 10: Fund Account */}
      <FundAccountStep
        stepNumber={10}
        currentStep={currentStep}
        isCompleted={completedSteps[9]}
        isLoading={loadingStates[9]}
        accountAddress={accountAddress}
        onProceedToFunding={handleProceedToFunding}
      />

      {/* Step 11: Create Payout */}
      <PayoutOperationStep
        title="Create Payout Request"
        description="This will create a random test payout of $2 USDC to demonstrate the payout functionality. The payout will be sent to a fictional recipient (John Smith) with test banking details to showcase the complete flow."
        stepNumber={11}
        currentStep={currentStep}
        isCompleted={completedSteps[10]}
        isLoading={loadingStates[10]}
        buttonText="Create Test Payout ($2 USDC)"
        completedButtonText="✅ Test Payout Created"
        onAction={handleCreatePayout}
        resultValue={payoutId}
        resultLabel="Payout ID"
      >
        <div style={{
          padding: '16px',
          borderRadius: '8px',
          marginTop: '15px',
          fontSize: '0.95rem',
          lineHeight: '1.5',
          backgroundColor: '#dbeafe',
          color: '#1e40af',
          border: '1px solid #93c5fd'
        }}>
          <p style={{ marginBottom: '5px', fontSize: '14px' }}>
            <strong>Test Payout Details:</strong>
          </p>
          <ul style={{ marginBottom: 0, fontSize: '14px' }}>
            <li>Amount: $2 USDC</li>
            <li>Recipient: John Smith (fictional)</li>
            <li>Bank: Chase Bank (test routing number)</li>
            <li>Purpose: Functionality testing</li>
          </ul>
        </div>
      </PayoutOperationStep>

      {/* Step 12: Get Payout Body */}
      <PayoutOperationStep
        title="Get Payout Body to Sign"
        stepNumber={12}
        currentStep={currentStep}
        isCompleted={completedSteps[11]}
        isLoading={loadingStates[11]}
        buttonText="Get Payout Body"
        completedButtonText="✅ Payout Body Retrieved"
        onAction={handleGetPayoutBody}
        payloadValue={payoutPayload}
        payloadLabel="Payout Payload (JSON):"
      />

      {/* Step 13: Sign Payout */}
      <PayoutOperationStep
        title="Sign Payout"
        stepNumber={13}
        currentStep={currentStep}
        isCompleted={completedSteps[12]}
        isLoading={loadingStates[12]}
        buttonText="Sign Payout"
        completedButtonText="✅ Payout Signed"
        onAction={handleSignPayout}
        resultValue={signature}
      />

      {/* Step 14: Execute Payout */}
      <SimpleActionStep
        title="Execute Payout"
        stepNumber={14}
        currentStep={currentStep}
        isCompleted={completedSteps[13]}
        isLoading={loadingStates[13]}
        buttonText="Execute Payout"
        completedButtonText="✅ Payout Executed"
        onAction={handleExecutePayout}
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