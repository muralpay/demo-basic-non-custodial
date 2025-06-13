import React from "react";
import { Step, Button, FormInput, InfoBox, ResultDisplay } from "../ui";
import { MuralApiClient } from '../../index';

export interface CreateAccountStepProps {
  stepNumber: number;
  currentStep: number;
  isCompleted: boolean;
  isLoading: boolean;
  accountName: string;
  setAccountName: (value: string) => void;
  accountId: string;
  accountAddress: string;
  accountInitializing: boolean;
  orgId: string;
  addLog: (message: string, type?: 'info' | 'error' | 'success' | 'warning') => void;
  markStepComplete: (stepIndex: number) => void;
  setAccountId: (id: string) => void;
  setAccountAddress: (address: string) => void;
  setLoading: (loading: boolean) => void;
  isLoadingAccountDetails?: boolean;
  setLoadingAccountDetails?: (loading: boolean) => void;
}

export const CreateAccountStep: React.FC<CreateAccountStepProps> = ({
  stepNumber,
  currentStep,
  isCompleted,
  isLoading,
  accountName,
  setAccountName,
  accountId,
  accountAddress,
  accountInitializing,
  orgId,
  addLog,
  markStepComplete,
  setAccountId,
  setAccountAddress,
  setLoading,
  isLoadingAccountDetails = false,
  setLoadingAccountDetails,
}) => {
  const isActive = currentStep === stepNumber;

  const handleCreateAccount = async () => {
    if (!orgId || !accountName) {
      addLog('❌ Please fill in account name', 'error');
      return;
    }
    
    setLoading(true);
    addLog('🔄 Step 9: Creating account...');
    
    try {
      const apiClient = new MuralApiClient();
      const result = await apiClient.createAccount({
        name: accountName,
        description: 'Demo account for testing payouts'
      }, orgId);
      addLog(`✅ Account created successfully!`, 'success');
      addLog(`📋 Account ID: ${result.id}`, 'success');
      setAccountId(result.id);
      
      // Log the full response to debug the structure
      console.log('Full account creation response:', result);
      addLog(`🔍 Full response: ${JSON.stringify(result, null, 2)}`, 'info');
      
      // Extract account address from nested structure
      let walletAddress = null;
      
      // Try different possible paths for the wallet address
      if (result.accountDetails?.walletDetails?.walletAddress) {
        walletAddress = result.accountDetails.walletDetails.walletAddress;
      } else if (result.address) {
        walletAddress = result.address;
      } else if (result.walletAddress) {
        walletAddress = result.walletAddress;
      } else if (result.accountDetails?.address) {
        walletAddress = result.accountDetails.address;
      }
      
      if (walletAddress) {
        setAccountAddress(walletAddress);
        addLog(`📋 Account Address: ${walletAddress}`, 'success');
        markStepComplete(8);
        addLog(`➡️ Next: Fund your account using Circle faucet`, 'info');
      } else {
        addLog(`⚠️ Account created but wallet address not found in response`, 'warning');
        addLog(`💡 The account may still be initializing. You can check the account status or try getting account details.`, 'warning');
        // Still mark as complete since account was created successfully
        markStepComplete(8);
        addLog(`➡️ Next: Get account details to retrieve wallet address`, 'info');
      }
      
    } catch (error) {
      addLog(`❌ Failed to create account: ${error instanceof Error ? error.message : String(error)}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGetAccountDetails = async () => {
    if (!orgId || !accountId) {
      addLog('❌ Please create account first', 'error');
      return;
    }
    
    if (setLoadingAccountDetails) {
      setLoadingAccountDetails(true);
    }
    addLog('🔄 Getting account details to retrieve wallet address...');
    
    try {
      const apiClient = new MuralApiClient();
      const result = await apiClient.getAccount(accountId, orgId);
      console.log('Account details response:', result);
      addLog(`🔍 Account details: ${JSON.stringify(result, null, 2)}`, 'info');
      
      // Extract wallet address from account details
      let walletAddress = null;
      
      if (result.accountDetails?.walletDetails?.walletAddress) {
        walletAddress = result.accountDetails.walletDetails.walletAddress;
      } else if (result.address) {
        walletAddress = result.address;
      } else if (result.walletAddress) {
        walletAddress = result.walletAddress;
      } else if (result.accountDetails?.address) {
        walletAddress = result.accountDetails.address;
      }
      
      if (walletAddress) {
        setAccountAddress(walletAddress);
        addLog(`✅ Wallet address retrieved: ${walletAddress}`, 'success');
        addLog(`➡️ Next: Fund your account using Circle faucet`, 'info');
      } else {
        addLog(`⚠️ Wallet address still not available. Account may still be initializing.`, 'warning');
        addLog(`💡 Account status: ${result.status || 'Unknown'}`, 'info');
      }
      
    } catch (error) {
      addLog(`❌ Failed to get account details: ${error instanceof Error ? error.message : String(error)}`, 'error');
    } finally {
      if (setLoadingAccountDetails) {
        setLoadingAccountDetails(false);
      }
    }
  };

  const actions = (
    <>
      <Button
        onClick={handleCreateAccount}
        disabled={!isActive}
        loading={isLoading}
        variant={isCompleted ? "success" : "primary"}
      >
        {isCompleted ? "✅ Account Created" : "Create Account"}
      </Button>
      {accountId && (
        <Button
          onClick={handleGetAccountDetails}
          loading={isLoadingAccountDetails}
          variant="primary"
        >
          {accountInitializing
            ? "⏳ Check Initialization Status"
            : "Get Account Details"}
        </Button>
      )}
    </>
  );

  return (
    <Step
      title="Create Account"
      stepNumber={stepNumber}
      isActive={isActive}
      isCompleted={isCompleted}
      isLoading={isLoading}
      actions={actions}
    >
      <div style={{ marginBottom: "10px" }}>
        <InfoBox variant="info">
          <p
            style={{ marginBottom: "5px", marginTop: "10px", fontSize: "14px" }}
          >
            <strong>📋 Account Initialization:</strong>
          </p>
          <p style={{ marginBottom: 0, fontSize: "14px" }}>
            After creating an account, it needs to be initialized which
            typically takes around 3 minutes. The wallet address will be
            available once initialization is complete.
          </p>
        </InfoBox>
      </div>

      <FormInput
        id="accountName"
        label="Account Name:"
        value={accountName}
        onChange={setAccountName}
        placeholder="Demo Account"
        disabled={!isActive}
      />

      {accountId && (
        <ResultDisplay>
          <strong>Account ID:</strong> {accountId}
          {accountInitializing && !accountAddress && (
            <InfoBox variant="warning">
              <p style={{ marginBottom: 0, fontSize: "14px" }}>
                ⏳ <strong>Account Initializing:</strong> The account is being
                set up and a wallet address is being generated. This process
                typically takes around 3 minutes. You can click "Check
                Initialization Status" below to see if it's ready.
              </p>
            </InfoBox>
          )}
          {accountAddress && (
            <>
              <br />
              <strong>Account Address:</strong> {accountAddress}
              <InfoBox variant="success">
                <p style={{ marginBottom: 0, fontSize: "14px" }}>
                  ✅ <strong>Account Ready:</strong> Your account has been
                  successfully initialized and is ready for funding!
                </p>
              </InfoBox>
            </>
          )}
        </ResultDisplay>
      )}
    </Step>
  );
};
