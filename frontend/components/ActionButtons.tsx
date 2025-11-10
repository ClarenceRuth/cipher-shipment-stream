'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';

interface ActionButtonsProps {
  contractAddress: `0x${string}`;
  userAddress?: string;
}

export default function ActionButtons({ contractAddress, userAddress }: ActionButtonsProps) {
  const { isConnected } = useAccount();
  const { writeContract, isPending: isEvaluating } = useWriteContract();
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptedResult, setDecryptedResult] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEvaluatePerformance = async () => {
    if (!isConnected || !userAddress) return;

    try {
      await writeContract({
        address: contractAddress,
        abi: [
          {
            name: 'evaluatePerformance',
            type: 'function',
            inputs: [{ name: 'driver', type: 'address' }],
            outputs: [{ name: '', type: 'ebool' }],
            stateMutability: 'nonpayable',
          },
        ],
        functionName: 'evaluatePerformance',
        args: [userAddress as `0x${string}`],
      });
    } catch (err) {
      console.error('Evaluation failed:', err);
    }
  };

  const handleDecryptResult = async () => {
    if (!isConnected || !userAddress) return;

    try {
      setIsDecrypting(true);
      // In a real FHE implementation, this would:
      // 1. Get the encrypted result from the contract
      // 2. Use FHEVM to decrypt it
      // 3. Display the decrypted result
      
      // Placeholder for actual decryption
      const result = await new Promise<string>((resolve) => {
        setTimeout(() => {
          resolve('Performance meets threshold');
        }, 1000);
      });
      
      setDecryptedResult(result);
    } catch (err) {
      console.error('Decryption failed:', err);
      setDecryptedResult('Decryption failed');
    } finally {
      setIsDecrypting(false);
    }
  };

  if (!mounted) {
    return null;
  }

  if (!isConnected) {
    return null;
  }

  return (
    <div className="space-y-4">
      {decryptedResult && (
        <div className="bg-blue-100 border border-blue-300 rounded-lg p-3 text-center">
          <p className="text-blue-800 font-medium">Decryption completed!</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={handleEvaluatePerformance}
          disabled={isEvaluating}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-lg shadow-lg"
        >
          {isEvaluating ? 'Evaluating...' : 'Evaluate Performance'}
        </button>

        <button
          onClick={handleDecryptResult}
          disabled={isDecrypting}
          className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-lg shadow-lg"
        >
          {isDecrypting ? 'Decrypting...' : 'Decrypt Result'}
        </button>
      </div>

      {decryptedResult && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-800">Performance Result</h2>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <p className="text-lg text-green-600 font-medium">
              ✓ Good
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
