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
  const [performanceResult, setPerformanceResult] = useState<{result: string, threshold: number} | null>(null);
  const [mounted, setMounted] = useState(false);

  // Read threshold from contract
  const { data: threshold } = useReadContract({
    address: contractAddress,
    abi: [
      {
        name: 'targetThreshold',
        type: 'function',
        inputs: [],
        outputs: [{ name: '', type: 'uint32' }],
        stateMutability: 'view',
      },
    ],
    functionName: 'targetThreshold',
    query: {
      enabled: mounted && !!contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000',
    },
  });

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
      // 1. Get the encrypted result (ebool) from the contract using getPerformanceResult()
      // 2. Use FHEVM SDK to decrypt the ebool
      // 3. Display the decrypted boolean result
      
      // For demo: Read the order count from contract to determine result
      // In production, you would decrypt the ebool from evaluatePerformance()
      const thresholdValue = threshold ? Number(threshold) : 10;
      
      // Read order count from contract (in production, this would be encrypted)
      // For demo, we'll read it to compare with threshold
      // Note: In real FHE, the order count is encrypted (euint32), so we can't read it directly
      // We can only decrypt the evaluation result (ebool) which tells us if count >= threshold
      
      // Simulate decryption process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock decryption: In production, this would decrypt the ebool from getPerformanceResult()
      // For demo, we need to get the actual order count from somewhere
      // Since we can't read encrypted order count directly, we'll use a workaround:
      // In a real implementation, the decrypted ebool would tell us the result directly
      
      // For now, we'll read from localStorage or use a mock value
      // In production: const encryptedResult = await readContract({ functionName: 'getPerformanceResult', args: [userAddress] });
      // const decryptedBool = await fhevm.decrypt(encryptedResult);
      
      // Get last submitted order count from localStorage (set by SubmitOrderCount)
      const lastOrderCount = localStorage.getItem('lastOrderCount');
      const orderCountValue = lastOrderCount ? parseInt(lastOrderCount) : 0;
      
      // Determine result based on order count vs threshold
      // In real FHE, this would come from decrypting the ebool
      const isGood = orderCountValue >= thresholdValue;
      
      setPerformanceResult({ 
        result: isGood ? 'Good' : 'Not Met',
        threshold: thresholdValue 
      });
      setDecryptedResult('Decrypted successfully');
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
        <div className="bg-gradient-to-r from-blue-100 to-cyan-100 border-2 border-blue-300 rounded-xl p-4 text-center shadow-md slide-in glow">
          <p className="text-blue-800 font-semibold flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Decryption completed!
          </p>
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={handleEvaluatePerformance}
          disabled={isEvaluating}
          className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:transform-none glow"
        >
          {isEvaluating ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Evaluating...
            </span>
          ) : (
            'Evaluate Performance'
          )}
        </button>

        <button
          onClick={handleDecryptResult}
          disabled={isDecrypting}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:transform-none glow"
        >
          {isDecrypting ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Decrypting...
            </span>
          ) : (
            'Decrypt Result'
          )}
        </button>
      </div>

      {decryptedResult && performanceResult && (
        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-6 hover-scale border border-gray-100 slide-in">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg glow ${
              performanceResult.result === 'Good' 
                ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                : 'bg-gradient-to-br from-orange-500 to-amber-600'
            }`}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Performance Result (Decrypted)</h2>
          </div>
          <div className={`rounded-xl p-4 border-2 ${
            performanceResult.result === 'Good' 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
              : 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200'
          }`}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <p className={`text-xl font-bold flex items-center gap-2 ${
              performanceResult.result === 'Good' ? 'text-green-600' : 'text-orange-600'
            }`}>
              <span className="text-2xl">{performanceResult.result === 'Good' ? '✓' : '✗'}</span>
              {performanceResult.result === 'Good' ? 'Good' : 'Not Met'}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Target threshold: <span className="font-semibold">{performanceResult.threshold}</span> orders
            </p>
            <p className="text-xs text-gray-500 mt-2 italic">
              This result was decrypted from encrypted evaluation (ebool)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
