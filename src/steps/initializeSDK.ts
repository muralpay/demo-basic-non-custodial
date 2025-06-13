import { NonCustodialSDKWrapper } from '../index';

export interface InitializeSDKParams {
  addLog: (message: string, type?: 'info' | 'error' | 'success' | 'warning') => void;
  setWrapper: (wrapper: NonCustodialSDKWrapper | null) => void;
  markStepComplete: (stepIndex: number) => void;
  updateStatus: (message: string, type?: 'ready' | 'error' | 'warning') => void;
}

export const initializeSDK = async (params: InitializeSDKParams) => {
  const { addLog, setWrapper, markStepComplete, updateStatus } = params;
  
  addLog('🔄 Step 4: Initializing SDK...');
  try {
    const newWrapper = new NonCustodialSDKWrapper();
    const success = await newWrapper.initialize('auth-iframe-container-id');
    if (success) {
      setWrapper(newWrapper);
      addLog('✅ SDK initialized successfully!', 'success');
      markStepComplete(3);
      addLog(`➡️ Next: Get public key and initiate challenge`, 'info');
      updateStatus('SDK Initialized');
    } else {
      throw new Error('SDK initialization failed');
    }
  } catch (error) {
    addLog(`❌ Error: ${error instanceof Error ? error.message : String(error)}`, 'error');
    updateStatus('Error', 'error');
  }
}; 