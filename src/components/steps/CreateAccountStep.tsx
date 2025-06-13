import React from "react";
import { Step, Button, FormInput, InfoBox, ResultDisplay } from "../ui";

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
  onCreateAccount: () => void;
  onGetAccountDetails: () => void;
  isLoadingAccountDetails?: boolean;
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
  onCreateAccount,
  onGetAccountDetails,
  isLoadingAccountDetails = false,
}) => {
  const isActive = currentStep === stepNumber;

  const actions = (
    <>
      <Button
        onClick={onCreateAccount}
        disabled={!isActive}
        loading={isLoading}
        variant={isCompleted ? "success" : "primary"}
      >
        {isCompleted ? "✅ Account Created" : "Create Account"}
      </Button>
      {accountId && (
        <Button
          onClick={onGetAccountDetails}
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
