'use client';

import { useReadContract } from 'wagmi';
import { Info } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SystemInfoProps {
  contractAddress: `0x${string}`;
  userAddress?: string;
}

export default function SystemInfo({ contractAddress, userAddress }: SystemInfoProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: targetThreshold } = useReadContract({
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

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-blue-200">
        <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
          <Info className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">System Information</h2>
      </div>

      <div className="space-y-0">
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <label className="text-sm font-medium text-gray-700">
            Target Threshold
          </label>
          <p className="text-sm text-gray-600 text-right">
            {targetThreshold ? `${targetThreshold.toString()} orders` : 'Loading...'}
          </p>
        </div>

        {userAddress && (
          <div className="flex justify-between items-center py-3">
            <label className="text-sm font-medium text-gray-700">
              Driver Address
            </label>
            <p className="text-sm text-gray-600 font-mono text-right">
              {userAddress}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
