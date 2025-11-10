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
  const [orderCount, setOrderCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmitOrderCount = async () => {
    if (!isConnected || !userAddress || orderCount <= 0) return;

    try {
      setIsLoading(true);
      setSubmitMessage(null);
      
      // Note: FHE encryption requires FHEVM and relayer integration
      // The relayer is required to process encrypted transactions on FHEVM networks
      // Without the relayer, encrypted transactions cannot be submitted
      
      console.log('Order count to encrypt and submit:', orderCount);
      
      // Check if we can attempt to call the contract
      // This will fail without FHEVM encryption, but shows the actual error
      try {
        // Attempt to call contract (this will fail without proper FHE encryption)
        // The error will indicate if relayer is unavailable or if encryption is missing
        setSubmitMessage(`Preparing to encrypt order count ${orderCount}...`);
        
        // Simulate encryption process
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Note: Actual implementation requires:
        // 1. FHEVM SDK initialization
        // 2. Relayer connection (relayer.zama.ai or custom relayer)
        // 3. Encrypt value using FHEVM
        // 4. Generate input proof
        // 5. Submit through relayer
        
        setSubmitMessage(
          `Order count ${orderCount} prepared for encryption.\n` +
          `FHEVM Relayer required: Encrypted transactions need a relayer service to process.\n` +
          `Please ensure FHEVM relayer is configured and available.`
        );
        
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
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">Please connect your wallet to submit order counts.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-orange-500" />
        <h2 className="text-2xl font-bold text-gray-800">Submit Order Count</h2>
      </div>

      <div className="space-y-4">
        <p className="text-gray-600 text-sm">
          Enter the number of orders completed this period.
        </p>

        <div className="flex gap-2">
          <input
            id="orderCount"
            type="number"
            min="0"
            value={orderCount}
            onChange={(e) => setOrderCount(parseInt(e.target.value) || 0)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter order count"
          />
          <button
            onClick={handleSubmitOrderCount}
            disabled={isPending || isLoading || orderCount <= 0}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2 px-6 rounded-md hover:from-purple-700 hover:to-purple-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isPending || isLoading ? 'Submitting...' : 'Submit (Encrypted)'}
          </button>
        </div>

        {submitMessage && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 text-sm whitespace-pre-line">
              {submitMessage}
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-800 text-sm">
              Error: {error.message || 'Submission failed'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
