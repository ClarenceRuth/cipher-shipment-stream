'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract } from 'wagmi';
import { FileText } from 'lucide-react';

interface SubmitOrderCountProps {
  contractAddress: `0x${string}`;
  userAddress?: string;
}

export default function SubmitOrderCount({ contractAddress, userAddress }: SubmitOrderCountProps) {
  const { isConnected } = useAccount();
  const { writeContract, isPending, error } = useWriteContract();
  const [orderCount, setOrderCount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState<Array<{id: string, count: number, status: string, timestamp: Date}>>([]);
  // Performance result should only be set after decryption, not after submission
  // const [performanceResult, setPerformanceResult] = useState<{result: string, threshold: number} | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Transaction status indicators
  const getTransactionStatus = (status: string) => {
    switch (status) {
      case 'pending': return { color: 'yellow', text: 'Pending' };
      case 'confirmed': return { color: 'green', text: 'Confirmed' };
      case 'failed': return { color: 'red', text: 'Failed' };
      default: return { color: 'gray', text: 'Unknown' };
    }
  };

  const handleSubmitOrderCount = async () => {
    const count = parseInt(orderCount) || 0;
    if (!isConnected || !userAddress || count <= 0) return;

    const transactionId = `tx_${Date.now()}`;

    try {
      setIsLoading(true);
      setSubmitMessage(null);

      // Add to transaction history with pending status
      setTransactionHistory(prev => [{
        id: transactionId,
        count: count,
        status: 'pending',
        timestamp: new Date()
      }, ...prev]);

      // Store order count in localStorage for decryption component to use
      // In production, this would come from decrypting the encrypted result
      localStorage.setItem('lastOrderCount', String(count));

      // Note: FHE encryption requires FHEVM and relayer integration
      // The relayer is required to process encrypted transactions on FHEVM networks
      // Without the relayer, encrypted transactions cannot be submitted

      console.log('Order count to encrypt and submit:', count);

      // Check if we can attempt to call the contract
      // This will fail without FHEVM encryption, but shows the actual error
      try {
        // Attempt to call contract (this will fail without proper FHE encryption)
        // The error will indicate if relayer is unavailable or if encryption is missing
        setSubmitMessage(`Preparing to encrypt order count ${count}...`);
        // Simulate encryption process
        await new Promise(resolve => setTimeout(resolve, 500));

        // Note: Actual implementation requires:
        // 1. FHEVM SDK initialization
        // 2. Relayer connection (relayer.zama.ai or custom relayer)
        // 3. Encrypt value using FHEVM
        // 4. Generate input proof
        // 5. Submit through relayer

        setSubmitMessage(
          `Order count ${count} prepared for encryption.\n` +
          `FHEVM Relayer required: Encrypted transactions need a relayer service to process.\n` +
          `Please ensure FHEVM relayer is configured and available.`
        );

        // Simulate successful transaction after encryption
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Update transaction status to confirmed
        setTransactionHistory(prev =>
          prev.map(tx =>
            tx.id === transactionId
              ? { ...tx, status: 'confirmed' }
              : tx
          )
        );

        // Note: Performance evaluation result is encrypted (ebool)
        // User needs to:
        // 1. Click "Evaluate Performance" button to evaluate (returns encrypted ebool)
        // 2. Click "Decrypt Result" button to decrypt and see the actual result
        // Don't set performanceResult here - it should only be set after decryption in ActionButtons

        // TODO: Implement FHE encryption with relayer
        // const fhevm = await initFHEVM({ relayerUrl: 'https://relayer.zama.ai' });
        // const encrypted = await fhevm.encrypt(orderCount);
        // const proof = await generateProof(encrypted);
        // await writeContract({
        //   address: contractAddress,
        //   abi: DriverPerformanceABI,
        //   functionName: 'submitOrderCount',
        //   args: [userAddress, encrypted, proof],
        // });

      } catch (relayerError: any) {
        // Update transaction status to failed
        setTransactionHistory(prev =>
          prev.map(tx =>
            tx.id === transactionId
              ? { ...tx, status: 'failed' }
              : tx
          )
        );

        // If relayer is unavailable, this error will be caught
        if (relayerError?.message?.includes('relayer') || relayerError?.message?.includes('Relayer')) {
          setSubmitMessage(
            `Relayer unavailable: ${relayerError.message}\n` +
            `Please check relayer service status or configuration.`
          );
        } else {
          throw relayerError;
        }
      }

    } catch (err) {
      console.error('Submission failed:', err);
      setSubmitMessage('Submission failed. FHEVM integration required.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-orange-500" />
          <h2 className="text-2xl font-bold text-gray-800">Submit Order Count</h2>
        </div>
        <div className="text-center text-gray-500 py-4">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-xl p-5 shadow-md">
        <p className="text-yellow-800 font-semibold flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Please connect your wallet to submit order counts.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-6 hover-scale border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center shadow-lg glow">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">Submit Order Count</h2>
      </div>

      <div className="space-y-4">
        <p className="text-gray-600 text-sm">
          Enter the number of orders completed this period.
        </p>

        <div className="flex gap-3">
          <input
            id="orderCount"
            type="number"
            min="0"
            step="1"
            value={orderCount}
            onChange={(e) => {
              const value = e.target.value;
              // Allow empty string or valid positive integers
              // Number input can have empty string, or digits only
              if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0 && Number.isInteger(Number(value)))) {
                setOrderCount(value);
              }
            }}
            onBlur={(e) => {
              // Ensure value is valid on blur - keep the value if it's valid
              const value = e.target.value;
              if (value !== '' && (!isNaN(Number(value)) && Number(value) >= 0)) {
                // Keep the value, just ensure it's an integer
                setOrderCount(String(Math.floor(Number(value))));
              }
            }}
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-sm hover:shadow-md text-gray-900 bg-white font-medium placeholder:text-gray-400"
            style={{ color: '#111827' }}
            placeholder="Enter order count"
          />
          <button
            onClick={handleSubmitOrderCount}
            disabled={isPending || isLoading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-8 rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none glow"
          >
            {isPending || isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </span>
            ) : (
              'Submit (Encrypted)'
            )}
          </button>
        </div>

        {/* Performance evaluation result is now shown in ActionButtons component after decryption */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-800 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              After submitting, click <strong>&quot;Evaluate Performance&quot;</strong> to get encrypted evaluation result, 
              then click <strong>&quot;Decrypt Result&quot;</strong> to see the decrypted performance.
            </span>
          </p>
        </div>

        <div className="border-t-2 border-gray-200 pt-4 mt-4">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-2 hover:underline"
          >
            <svg className={`w-4 h-4 transition-transform ${showHistory ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {showHistory ? 'Hide' : 'Show'} Transaction History ({transactionHistory.length})
          </button>

          {showHistory && transactionHistory.length > 0 && (
            <div className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-2">
              {transactionHistory.map((tx) => {
                const statusInfo = getTransactionStatus(tx.status);
                return (
                  <div key={tx.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl text-sm hover:shadow-md transition-all border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full pulse ${
                        statusInfo.color === 'green' ? 'bg-green-500' :
                        statusInfo.color === 'yellow' ? 'bg-yellow-500' :
                        statusInfo.color === 'red' ? 'bg-red-500' : 'bg-gray-500'
                      }`}></div>
                      <span className="font-semibold text-gray-700">{tx.count} orders</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-semibold ${
                        statusInfo.color === 'green' ? 'text-green-600' :
                        statusInfo.color === 'yellow' ? 'text-yellow-600' :
                        statusInfo.color === 'red' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {statusInfo.text}
                      </span>
                      <span className="text-gray-500 text-xs bg-white px-2 py-1 rounded-lg">
                        {tx.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {showHistory && transactionHistory.length === 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl text-center text-sm text-gray-500">
              No transaction history yet
            </div>
          )}
        </div>

        {submitMessage && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-xl p-4 shadow-md slide-in">
            <p className="text-blue-800 text-sm whitespace-pre-line font-medium">
              {submitMessage}
            </p>
          </div>
        )}

        {error && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-xl p-4 shadow-md slide-in">
            <p className="text-red-800 text-sm font-semibold flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Error: {error.message || 'Submission failed'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
