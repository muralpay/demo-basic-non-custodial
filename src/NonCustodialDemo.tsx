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
  
  // Simplified - no payout form fields needed
  
  const [payoutId, setPayoutId] = useState<string>('');
  const [payoutPayload, setPayoutPayload] = useState<string>('');
  const [signature, setSignature] = useState<string>('');
  
  // Flow progress tracking - updated to include funding step
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(new Array(14).fill(false));
  
  // Loading states for each step
  const [loadingStates, setLoadingStates] = useState<boolean[]>(new Array(14).fill(false));

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
        addLog('⏳ Account created but still initializing. This typically takes around 1 minute...', 'warning');
      }
    } finally {
      setStepLoading(8, false);
      if (accountAddress) {
        setAccountInitializing(false);
      }
    }
  };

  const handleGetAccountDetails = async () => {
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

  const getStepStatus = (stepIndex: number) => {
    if (completedSteps[stepIndex]) return '✅';
    if (currentStep === stepIndex + 1) return '🔄';
    return '⏳';
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: '30px',
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    title: {
      fontSize: '2.5rem',
      color: '#1e293b',
      margin: '0 0 10px 0',
      fontWeight: '700'
    },
    status: {
      padding: '12px 20px',
      borderRadius: '8px',
      fontSize: '1rem',
      fontWeight: '500',
      margin: '10px 0'
    },
    statusReady: {
      backgroundColor: '#dcfce7',
      color: '#166534',
      border: '1px solid #bbf7d0'
    },
    statusError: {
      backgroundColor: '#fecaca',
      color: '#991b1b',
      border: '1px solid #fca5a5'
    },
    statusWarning: {
      backgroundColor: '#fef3c7',
      color: '#92400e',
      border: '1px solid #fde68a'
    },
    progressContainer: {
      backgroundColor: 'white',
      padding: '25px',
      borderRadius: '12px',
      marginBottom: '30px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    progressTitle: {
      fontSize: '1.5rem',
      color: '#1e293b',
      marginBottom: '20px',
      fontWeight: '600'
    },
    stepsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '12px'
    },
    step: {
      padding: '12px 16px',
      borderRadius: '8px',
      fontSize: '0.95rem',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      border: '2px solid transparent'
    },
    stepCompleted: {
      backgroundColor: '#dcfce7',
      color: '#166534',
      border: '2px solid #bbf7d0'
    },
    stepCurrent: {
      backgroundColor: '#dbeafe',
      color: '#1d4ed8',
      border: '2px solid #93c5fd',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
    },
    stepPending: {
      backgroundColor: '#f1f5f9',
      color: '#64748b',
      border: '2px solid #e2e8f0'
    },
    logContainer: {
      backgroundColor: 'white',
      borderRadius: '12px',
      marginBottom: '30px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    },
    logHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px',
      backgroundColor: '#f8fafc',
      borderBottom: '1px solid #e2e8f0'
    },
    logTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#1e293b',
      margin: 0
    },
    logContent: {
      maxHeight: '300px',
      overflowY: 'auto' as const,
      padding: '15px 20px',
      backgroundColor: '#1e293b',
      color: '#e2e8f0',
      fontFamily: 'Monaco, Consolas, "Lucida Console", monospace',
      fontSize: '0.875rem',
      lineHeight: '1.5'
    },
    logEntry: {
      margin: '2px 0',
      wordBreak: 'break-word' as const
    },
    section: {
      backgroundColor: 'white',
      padding: '25px',
      borderRadius: '12px',
      marginBottom: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    sectionTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '20px',
      borderBottom: '2px solid #e2e8f0',
      paddingBottom: '10px'
    },
    inputGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      fontSize: '0.95rem',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      fontSize: '1rem',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      transition: 'border-color 0.2s ease',
      outline: 'none',
      boxSizing: 'border-box' as const
    },
    inputFocus: {
      borderColor: '#3b82f6'
    },
    textarea: {
      width: '100%',
      padding: '12px 16px',
      fontSize: '1rem',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      minHeight: '100px',
      resize: 'vertical' as const,
      fontFamily: 'Monaco, Consolas, "Lucida Console", monospace',
      outline: 'none',
      boxSizing: 'border-box' as const
    },
    textareaSmall: {
      width: '100%',
      padding: '12px 16px',
      fontSize: '0.75rem',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      minHeight: '100px',
      resize: 'vertical' as const,
      fontFamily: 'Monaco, Consolas, "Lucida Console", monospace',
      outline: 'none',
      boxSizing: 'border-box' as const,
      lineHeight: '1.4'
    },
    radioGroup: {
      display: 'flex',
      gap: '20px',
      margin: '10px 0'
    },
    radioOption: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      padding: '12px 16px',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      transition: 'all 0.2s ease',
      minWidth: '120px'
    },
    radioOptionSelected: {
      backgroundColor: '#dbeafe',
      borderColor: '#3b82f6',
      color: '#1d4ed8'
    },
    radioInput: {
      marginRight: '8px',
      accentColor: '#3b82f6'
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      marginTop: '20px',
      flexWrap: 'wrap' as const
    },
    button: {
      padding: '12px 24px',
      fontSize: '1rem',
      fontWeight: '500',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      textDecoration: 'none'
    },
    buttonPrimary: {
      backgroundColor: '#3b82f6',
      color: 'white',
      '&:hover': { backgroundColor: '#2563eb' },
      '&:disabled': { backgroundColor: '#9ca3af', cursor: 'not-allowed' }
    },
    buttonSecondary: {
      backgroundColor: '#6b7280',
      color: 'white',
      '&:hover': { backgroundColor: '#4b5563' }
    },
    buttonSuccess: {
      backgroundColor: '#10b981',
      color: 'white'
    },
    buttonClear: {
      backgroundColor: '#ef4444',
      color: 'white',
      padding: '8px 16px',
      fontSize: '0.875rem'
    },
    resultDisplay: {
      backgroundColor: '#f8fafc',
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      marginTop: '15px'
    },
    infoBox: {
      padding: '16px',
      borderRadius: '8px',
      marginTop: '15px',
      fontSize: '0.95rem',
      lineHeight: '1.5'
    },
    infoBoxBlue: {
      backgroundColor: '#dbeafe',
      color: '#1e40af',
      border: '1px solid #93c5fd'
    },
    infoBoxYellow: {
      backgroundColor: '#fef3c7',
      color: '#92400e',
      border: '1px solid #fde68a'
    },
    infoBoxRed: {
      backgroundColor: '#fecaca',
      color: '#991b1b',
      border: '1px solid #fca5a5'
    },
    infoBoxGreen: {
      backgroundColor: '#dcfce7',
      color: '#166534',
      border: '1px solid #bbf7d0'
    },
    approverCard: {
      padding: '12px',
      backgroundColor: 'white',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    approverCardSelected: {
      backgroundColor: '#dbeafe',
      borderColor: '#3b82f6'
    },
    successBanner: {
      backgroundColor: '#dcfce7',
      color: '#166534',
      padding: '30px',
      borderRadius: '12px',
      textAlign: 'center' as const,
      margin: '30px 0',
      border: '2px solid #bbf7d0'
    },
    link: {
      color: '#3b82f6',
      textDecoration: 'none',
      fontWeight: '500',
      '&:hover': { textDecoration: 'underline' }
    },
    signatureDisplay: {
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
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🎨 Non-Custodial Browser SDK Demo</h1>
        <div style={{
          ...styles.status,
          ...(status.type === 'ready' ? styles.statusReady : 
             status.type === 'error' ? styles.statusError : styles.statusWarning)
        }}>
          Status: {status.message}
        </div>
      </div>
      
      <div style={styles.progressContainer}>
        <h3 style={styles.progressTitle}>📋 Complete Non-Custodial Flow Progress</h3>
        <div style={styles.stepsGrid}>
          {[
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
          ].map((stepName, index) => (
            <div
              key={index}
              style={{
                ...styles.step,
                ...(completedSteps[index] ? styles.stepCompleted :
                   currentStep === index + 1 ? styles.stepCurrent : styles.stepPending)
              }}
            >
              {getStepStatus(index)} Step {index + 1}: {stepName}
            </div>
          ))}
        </div>
      </div>

      <div style={styles.logContainer}>
        <div style={styles.logHeader}>
          <h3 style={styles.logTitle}>📊 Activity Log</h3>
          <button 
            onClick={clearLog}
            style={{...styles.button, ...styles.buttonClear}}
          >
            Clear Log
          </button>
        </div>
        <div style={styles.logContent}>
          {log.map((entry, index) => (
            <div key={index} style={styles.logEntry}>{entry}</div>
          ))}
        </div>
      </div>

      {/* Step 1: Organization Creation */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>🏢 Step 1: Create Non-Custodial Organization</h3>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Organization Type:</label>
          <div style={styles.radioGroup}>
            <label 
              style={{
                ...styles.radioOption,
                ...(orgType === 'nonCustodialIndividual' ? styles.radioOptionSelected : {})
              }}
            >
              <input 
                type="radio" 
                name="orgType" 
                value="nonCustodialIndividual" 
                checked={orgType === 'nonCustodialIndividual'} 
                onChange={() => setOrgType('nonCustodialIndividual')}
                style={styles.radioInput}
              />
              Individual
            </label>
            <label 
              style={{
                ...styles.radioOption,
                ...(orgType === 'nonCustodialBusiness' ? styles.radioOptionSelected : {})
              }}
            >
              <input 
                type="radio" 
                name="orgType" 
                value="nonCustodialBusiness" 
                checked={orgType === 'nonCustodialBusiness'} 
                onChange={() => setOrgType('nonCustodialBusiness')}
                style={styles.radioInput}
              />
              Business
            </label>
          </div>
        </div>
        
        {orgType === 'nonCustodialIndividual' ? (
          <div>
            <div style={styles.inputGroup}>
              <label htmlFor="firstName" style={styles.label}>First Name:</label>
              <input 
                type="text" 
                id="firstName" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
                placeholder="Enter first name"
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="lastName" style={styles.label}>Last Name:</label>
              <input 
                type="text" 
                id="lastName" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
                placeholder="Enter last name"
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="email" style={styles.label}>Email:</label>
              <input 
                type="email" 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter email"
                style={styles.input}
              />
            </div>
          </div>
        ) : (
          <div>
            <div style={styles.inputGroup}>
              <label htmlFor="businessName" style={styles.label}>Business Name:</label>
              <input 
                type="text" 
                id="businessName" 
                value={businessName} 
                onChange={(e) => setBusinessName(e.target.value)} 
                placeholder="Enter business name"
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="businessEmail" style={styles.label}>Business Email:</label>
              <input 
                type="email" 
                id="businessEmail" 
                value={businessEmail} 
                onChange={(e) => setBusinessEmail(e.target.value)} 
                placeholder="Enter business email"
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="approvers" style={styles.label}>Approvers (JSON array):</label>
              <textarea 
                id="approvers" 
                value={approvers} 
                onChange={(e) => setApprovers(e.target.value)} 
                placeholder='[{"name": "John Doe", "email": "john@example.com"}]'
                style={styles.textareaSmall}
              />
              <div style={{...styles.infoBox, ...styles.infoBoxBlue, marginTop: '10px'}}>
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
              </div>
            </div>
          </div>
        )}
        
        <div style={styles.buttonGroup}>
          <button 
            onClick={handleCreateOrg} 
            disabled={currentStep !== 1 || loadingStates[0]}
            style={{
              ...styles.button,
              ...(completedSteps[0] ? styles.buttonSuccess : styles.buttonPrimary),
              ...(loadingStates[0] || currentStep !== 1 ? { opacity: 0.6, cursor: 'not-allowed' } : {})
            }}
          >
            {loadingStates[0] ? '🔄 Creating...' : completedSteps[0] ? '✅ Organization Created' : 'Create Organization'}
          </button>
        </div>
        
        {orgId && (
          <div style={styles.resultDisplay}>
            <strong>Organization ID:</strong> {orgId}<br/>
            {approverId && <><strong>Approver ID:</strong> {approverId}</>}
            
            {/* Show approver selection for business organizations with multiple approvers */}
            {orgType === 'nonCustodialBusiness' && approversList.length > 1 && (
              <div style={{...styles.infoBox, ...styles.infoBoxBlue, marginTop: '15px'}}>
                <h4 style={{ marginTop: 0, marginBottom: '10px' }}>👥 Select Approver for Authentication</h4>
                <p style={{ marginBottom: '10px', fontSize: '14px' }}>
                  Choose which approver will be used for the authentication challenge:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {approversList.map((approver, index) => (
                    <label 
                      key={approver.id} 
                      style={{
                        ...styles.approverCard,
                        ...(selectedApproverIndex === index ? styles.approverCardSelected : {})
                      }}
                    >
                      <input
                        type="radio"
                        name="selectedApprover"
                        value={index}
                        checked={selectedApproverIndex === index}
                        onChange={() => setSelectedApproverIndex(index)}
                        style={{...styles.radioInput, marginRight: '10px'}}
                      />
                      <div>
                        <strong>{approver.name}</strong><br/>
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>{approver.email}</span><br/>
                        <span style={{ fontSize: '11px', color: '#9ca3af' }}>ID: {approver.id}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}
            
            {/* Show single approver info for individual orgs or business orgs with one approver */}
            {(orgType === 'nonCustodialIndividual' || approversList.length === 1) && approversList.length > 0 && (
              <div style={{...styles.infoBox, ...styles.infoBoxBlue, marginTop: '15px'}}>
                <strong>👤 Approver Details:</strong><br/>
                <span>{approversList[0].name} ({approversList[0].email})</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Step 2: TOS Link */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📄 Step 2: Get Terms of Service Link</h3>
        <div style={styles.buttonGroup}>
          <button 
            onClick={handleGetTosLink} 
            disabled={currentStep !== 2 || loadingStates[1]}
            style={{
              ...styles.button,
              ...(completedSteps[1] ? styles.buttonSuccess : styles.buttonPrimary),
              ...(loadingStates[1] || currentStep !== 2 ? { opacity: 0.6, cursor: 'not-allowed' } : {})
            }}
          >
            {loadingStates[1] ? '🔄 Loading...' : completedSteps[1] ? '✅ TOS Link Retrieved' : 'Get TOS Link'}
          </button>
        </div>
        
        {tosLinkVisible && (
          <div style={styles.resultDisplay}>
            <div style={styles.inputGroup}>
              <label htmlFor="tosLink" style={styles.label}>Terms of Service Link:</label>
              <input type="text" id="tosLink" value={tosLink} readOnly style={styles.input} />
            </div>
            <div style={{ marginTop: '10px' }}>
              <a 
                href={tosLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{...styles.button, ...styles.buttonSuccess, textDecoration: 'none'}}
              >
                🚀 Open TOS Link
              </a>
              <div style={{...styles.infoBox, ...styles.infoBoxRed, marginTop: '10px'}}>
                <strong>Important:</strong> You must click on the link and accept the Terms of Service before proceeding.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Step 3: Check TOS Status */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>✅ Step 3: Accept Terms of Service</h3>
        <p>After accepting the TOS via the link above, click to verify acceptance:</p>
        <div style={styles.buttonGroup}>
          <button 
            onClick={handleCheckTosStatus} 
            disabled={currentStep !== 3 || loadingStates[2]}
            style={{
              ...styles.button,
              ...(completedSteps[2] ? styles.buttonSuccess : styles.buttonPrimary),
              ...(loadingStates[2] || currentStep !== 3 ? { opacity: 0.6, cursor: 'not-allowed' } : {})
            }}
          >
            {loadingStates[2] ? '🔄 Checking...' : completedSteps[2] ? '✅ TOS Accepted' : 'Check TOS Status'}
          </button>
        </div>
      </div>

      {/* Step 4: Initialize SDK */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>🚀 Step 4: Initialize SDK</h3>
        <div style={styles.buttonGroup}>
          <button 
            onClick={handleInitializeSDK} 
            disabled={currentStep !== 4 || loadingStates[3]}
            style={{
              ...styles.button,
              ...(completedSteps[3] ? styles.buttonSuccess : styles.buttonPrimary),
              ...(loadingStates[3] || currentStep !== 4 ? { opacity: 0.6, cursor: 'not-allowed' } : {})
            }}
          >
            {loadingStates[3] ? '🔄 Initializing...' : completedSteps[3] ? '✅ SDK Initialized' : 'Initialize SDK'}
          </button>
        </div>
      </div>

      {/* Step 5: Initiate Challenge */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>🔐 Step 5: Initiate Authentication Challenge</h3>
        
        {/* Show selected approver info */}
        {approversList.length > 0 && (
          <div style={{...styles.infoBox, ...styles.infoBoxBlue, marginBottom: '15px'}}>
            <strong>👤 Selected Approver:</strong><br/>
            <span>{approversList[selectedApproverIndex]?.name} ({approversList[selectedApproverIndex]?.email})</span>
            {approversList.length > 1 && (
              <p style={{ marginTop: '5px', fontSize: '12px' }}>
                💡 You can change the approver selection in Step 1 if needed.
              </p>
            )}
          </div>
        )}
        
        <div style={styles.buttonGroup}>
          <button 
            onClick={handleInitiateChallenge} 
            disabled={currentStep !== 5 || loadingStates[4]}
            style={{
              ...styles.button,
              ...(completedSteps[4] ? styles.buttonSuccess : styles.buttonPrimary),
              ...(loadingStates[4] || currentStep !== 5 ? { opacity: 0.6, cursor: 'not-allowed' } : {})
            }}
          >
            {loadingStates[4] ? '🔄 Initiating...' : completedSteps[4] ? '✅ Challenge Initiated' : 'Initiate Challenge'}
          </button>
        </div>
        
        {authenticatorId && (
          <div style={styles.resultDisplay}>
            <strong>Authenticator ID:</strong> {authenticatorId}
          </div>
        )}
      </div>

      {/* Step 6: Start Session */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📧 Step 6: Enter Email Code & Start Session</h3>
        <p>Check your email for the verification code and enter it below:</p>
        <div style={styles.inputGroup}>
          <label htmlFor="emailCode" style={styles.label}>Email Verification Code:</label>
          <input 
            type="text" 
            id="emailCode" 
            value={emailCode} 
            onChange={(e) => setEmailCode(e.target.value)} 
            placeholder="Enter code from email" 
            disabled={currentStep !== 6}
            style={{
              ...styles.input,
              ...(currentStep !== 6 ? { opacity: 0.6 } : {})
            }}
          />
        </div>
        <div style={styles.buttonGroup}>
          <button 
            onClick={handleStartSession} 
            disabled={currentStep !== 6 || !emailCode || loadingStates[5]}
            style={{
              ...styles.button,
              ...(completedSteps[5] ? styles.buttonSuccess : styles.buttonPrimary),
              ...(loadingStates[5] || currentStep !== 6 || !emailCode ? { opacity: 0.6, cursor: 'not-allowed' } : {})
            }}
          >
            {loadingStates[5] ? '🔄 Starting...' : completedSteps[5] ? '✅ Session Started' : 'Start Session'}
          </button>
        </div>
      </div>

      {/* Step 7: Get KYC Link */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📄 Step 7: Get KYC Link</h3>
        <div style={styles.buttonGroup}>
          <button 
            onClick={handleGetKycLink} 
            disabled={currentStep !== 7 || loadingStates[6]}
            style={{
              ...styles.button,
              ...(completedSteps[6] ? styles.buttonSuccess : styles.buttonPrimary),
              ...(loadingStates[6] || currentStep !== 7 ? { opacity: 0.6, cursor: 'not-allowed' } : {})
            }}
          >
            {loadingStates[6] ? '🔄 Loading...' : completedSteps[6] ? '✅ KYC Link Retrieved' : 'Get KYC Link'}
          </button>
        </div>
        
        {kycLinkVisible && (
          <div style={styles.resultDisplay}>
            <div style={styles.inputGroup}>
              <label htmlFor="kycLink" style={styles.label}>KYC Link:</label>
              <input type="text" id="kycLink" value={kycLink} readOnly style={styles.input} />
            </div>
            <div style={{ marginTop: '10px' }}>
              <a 
                href={kycLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{...styles.button, ...styles.buttonSuccess, textDecoration: 'none'}}
              >
                🚀 Open KYC Link
              </a>
              <div style={{...styles.infoBox, ...styles.infoBoxBlue, marginTop: '10px'}}>
                <p style={{ marginBottom: '10px' }}>
                  <strong>🧪 Testing Environment Note:</strong> In testing environments, KYC validation is done automatically in the background. You dont need to click the link above. This typically takes around 10 minutes to complete.
                </p>
                <div style={{...styles.infoBox, ...styles.infoBoxRed, margin: 0}}>
                  <strong>Important:</strong> You must complete the KYC process before proceeding to account creation.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Step 8: Check KYC Status */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>✅ Step 8: Check KYC Verification Status</h3>
        <div style={styles.buttonGroup}>
          <button 
            onClick={handleCheckKycStatus} 
            disabled={currentStep !== 8 || loadingStates[7]}
            style={{
              ...styles.button,
              ...(completedSteps[7] ? styles.buttonSuccess : styles.buttonPrimary),
              ...(loadingStates[7] || currentStep !== 8 ? { opacity: 0.6, cursor: 'not-allowed' } : {})
            }}
          >
            {loadingStates[7] ? '🔄 Checking...' : completedSteps[7] ? '✅ KYC Verified' : 'Check KYC Status'}
          </button>
        </div>
        
        {kycResponse && (
          <div style={styles.resultDisplay}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>KYC Validation Response:</label>
              <div style={{...styles.infoBox, ...(kycStatus === 'approved' ? styles.infoBoxGreen : kycStatus === 'pending' || kycStatus === 'submitted' ? styles.infoBoxYellow : styles.infoBoxRed)}}>
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
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Step 9: Create Account */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>🏦 Step 9: Create Account</h3>
        
        <div style={{...styles.infoBox, ...styles.infoBoxBlue, marginBottom: '15px'}}>
          <p style={{ marginBottom: '5px', fontSize: '14px' }}>
            <strong>📋 Account Initialization:</strong>
          </p>
          <p style={{ marginBottom: 0, fontSize: '14px' }}>
            After creating an account, it needs to be initialized which typically takes around 1 minute. 
            The wallet address will be available once initialization is complete.
          </p>
        </div>
        
        <div style={styles.inputGroup}>
          <label htmlFor="accountName" style={styles.label}>Account Name:</label>
          <input 
            type="text" 
            id="accountName" 
            value={accountName} 
            onChange={(e) => setAccountName(e.target.value)} 
            placeholder="Demo Account" 
            disabled={currentStep !== 9}
            style={{
              ...styles.input,
              ...(currentStep !== 9 ? { opacity: 0.6 } : {})
            }}
          />
        </div>
        <div style={styles.buttonGroup}>
          <button 
            onClick={handleCreateAccount} 
            disabled={currentStep !== 9 || loadingStates[8]}
            style={{
              ...styles.button,
              ...(completedSteps[8] ? styles.buttonSuccess : styles.buttonPrimary),
              ...(loadingStates[8] || currentStep !== 9 ? { opacity: 0.6, cursor: 'not-allowed' } : {})
            }}
          >
            {loadingStates[8] ? '🔄 Creating...' : completedSteps[8] ? '✅ Account Created' : 'Create Account'}
          </button>
          {accountId && !accountAddress && !loadingStates[8] && (
            <button 
              onClick={handleGetAccountDetails}
              style={{...styles.button, ...styles.buttonSecondary}}
            >
              {accountInitializing ? '⏳ Check Initialization Status' : 'Get Account Details'}
            </button>
          )}
        </div>
        
        {accountId && (
          <div style={styles.resultDisplay}>
            <strong>Account ID:</strong> {accountId}
            {accountInitializing && !accountAddress && (
              <div style={{...styles.infoBox, ...styles.infoBoxYellow, marginTop: '10px'}}>
                <p style={{ marginBottom: 0, fontSize: '14px' }}>
                  ⏳ <strong>Account Initializing:</strong> The account is being set up and a wallet address is being generated. 
                  This process typically takes around 1 minute. You can click "Check Initialization Status" above to see if it's ready.
                </p>
              </div>
            )}
            {accountAddress && (
              <>
                <br/><strong>Account Address:</strong> {accountAddress}
                <div style={{...styles.infoBox, ...styles.infoBoxGreen, marginTop: '10px'}}>
                  <p style={{ marginBottom: 0, fontSize: '14px' }}>
                    ✅ <strong>Account Ready:</strong> Your account has been successfully initialized and is ready for funding!
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Step 10: Fund Account */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>💰 Step 10: Fund Your Account</h3>
        <p>Your account needs to be funded with USDC to execute payouts. Use Circle's testnet faucet to add funds.</p>
        
        {accountAddress ? (
          <div style={styles.resultDisplay}>
            <div style={styles.inputGroup}>
              <label htmlFor="accountAddressDisplay" style={styles.label}>Your Account Address:</label>
              <input type="text" id="accountAddressDisplay" value={accountAddress} readOnly style={styles.input} />
            </div>
            
            <div style={{...styles.infoBox, ...styles.infoBoxBlue, marginTop: '15px'}}>
              <h4 style={{ marginTop: 0 }}>📋 Funding Instructions:</h4>
              <ol style={{ marginBottom: '10px' }}>
                <li>Open the <a href="https://faucet.circle.com/" target="_blank" rel="noopener noreferrer" style={styles.link}>Circle Testnet Faucet</a></li>
                <li>Select <strong>USDC</strong> as the token</li>
                <li>Select <strong>Polygon PoS Amoy</strong> as the network</li>
                <li>Paste your account address: <code style={{ backgroundColor: '#fff', padding: '2px 4px', borderRadius: '3px' }}>{accountAddress}</code></li>
                <li>Click "Send 10 USDC" to fund your account</li>
                <li>Wait for the transaction to complete (usually takes 1-2 minutes)</li>
                <li>Return here and click "Continue to Payout" below</li>
              </ol>
              <p style={{ marginBottom: 0, fontSize: '14px', fontStyle: 'italic' }}>
                💡 The faucet provides 10 USDC which is more than enough for the demo payout of $2 USDC.
              </p>
            </div>
            
            <div style={{ marginTop: '15px' }}>
              <a 
                href="https://faucet.circle.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{...styles.button, ...styles.buttonSuccess, textDecoration: 'none'}}
              >
                🚀 Open Circle Faucet
              </a>
            </div>
          </div>
        ) : (
          <div style={{...styles.infoBox, ...styles.infoBoxYellow}}>
            Account address not available. Please create an account first.
          </div>
        )}
        
        <div style={{...styles.buttonGroup, marginTop: '15px'}}>
          <button 
            onClick={handleProceedToFunding} 
            disabled={currentStep !== 10 || !accountAddress || loadingStates[9]}
            style={{
              ...styles.button,
              ...(completedSteps[9] ? styles.buttonSuccess : styles.buttonPrimary),
              ...(loadingStates[9] || currentStep !== 10 || !accountAddress ? { opacity: 0.6, cursor: 'not-allowed' } : {})
            }}
          >
            {loadingStates[9] ? '🔄 Processing...' : completedSteps[9] ? '✅ Ready for Payout' : 'Continue to Payout'}
          </button>
        </div>
      </div>

      {/* Step 11: Create Payout */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>💰 Step 11: Create Payout Request</h3>
        <p>This will create a random test payout of $2 USDC to demonstrate the payout functionality. The payout will be sent to a fictional recipient (John Smith) with test banking details to showcase the complete flow.</p>
        <div style={{...styles.infoBox, ...styles.infoBoxBlue, marginTop: '10px'}}>
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
        <div style={styles.buttonGroup}>
          <button 
            onClick={handleCreatePayout} 
            disabled={currentStep !== 11 || loadingStates[10]}
            style={{
              ...styles.button,
              ...(completedSteps[10] ? styles.buttonSuccess : styles.buttonPrimary),
              ...(loadingStates[10] || currentStep !== 11 ? { opacity: 0.6, cursor: 'not-allowed' } : {})
            }}
          >
            {loadingStates[10] ? '🔄 Creating...' : completedSteps[10] ? '✅ Test Payout Created' : 'Create Test Payout ($2 USDC)'}
          </button>
        </div>
        
        {payoutId && (
          <div style={styles.resultDisplay}>
            <strong>Payout ID:</strong> {payoutId}
          </div>
        )}
      </div>

      {/* Step 12: Get Payout Body */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>📋 Step 12: Get Payout Body to Sign</h3>
        <div style={styles.buttonGroup}>
          <button 
            onClick={handleGetPayoutBody} 
            disabled={currentStep !== 12 || loadingStates[11]}
            style={{
              ...styles.button,
              ...(completedSteps[11] ? styles.buttonSuccess : styles.buttonPrimary),
              ...(loadingStates[11] || currentStep !== 12 ? { opacity: 0.6, cursor: 'not-allowed' } : {})
            }}
          >
            {loadingStates[11] ? '🔄 Loading...' : completedSteps[11] ? '✅ Payout Body Retrieved' : 'Get Payout Body'}
          </button>
        </div>
        
        {payoutPayload && (
          <div style={styles.inputGroup}>
            <label htmlFor="payoutPayload" style={styles.label}>Payout Payload (JSON):</label>
            <textarea
              id="payoutPayload"
              value={payoutPayload}
              readOnly
              style={{...styles.textareaSmall, minHeight: '150px'}}
            />
          </div>
        )}
      </div>

      {/* Step 13: Sign Payout */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>✍️ Step 13: Sign Payout</h3>
        <div style={styles.buttonGroup}>
          <button 
            onClick={handleSignPayout} 
            disabled={currentStep !== 13 || loadingStates[12]}
            style={{
              ...styles.button,
              ...(completedSteps[12] ? styles.buttonSuccess : styles.buttonPrimary),
              ...(loadingStates[12] || currentStep !== 13 ? { opacity: 0.6, cursor: 'not-allowed' } : {})
            }}
          >
            {loadingStates[12] ? '🔄 Signing...' : completedSteps[12] ? '✅ Payout Signed' : 'Sign Payout'}
          </button>
        </div>
        
        {signature && (
          <div style={styles.inputGroup}>
            <label style={styles.label}>Signature:</label>
            <div style={styles.signatureDisplay}>
              {signature}
            </div>
          </div>
        )}
      </div>

      {/* Step 14: Execute Payout */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>🚀 Step 14: Execute Payout</h3>
        <div style={styles.buttonGroup}>
          <button 
            onClick={handleExecutePayout} 
            disabled={currentStep !== 14 || loadingStates[13]}
            style={{
              ...styles.button,
              ...(completedSteps[13] ? styles.buttonSuccess : styles.buttonPrimary),
              ...(loadingStates[13] || currentStep !== 14 ? { opacity: 0.6, cursor: 'not-allowed' } : {})
            }}
          >
            {loadingStates[13] ? '🔄 Executing...' : completedSteps[13] ? '✅ Payout Executed' : 'Execute Payout'}
          </button>
        </div>
      </div>

      {/* Success Message */}
      {completedSteps[13] && (
        <div style={styles.successBanner}>
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