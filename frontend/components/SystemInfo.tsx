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
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: targetThreshold, isLoading: thresholdLoading, error: thresholdError, refetch: refetchThreshold } = useReadContract({
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
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  });

  const { data: driverCount, isLoading: countLoading, error: countError, refetch: refetchCount } = useReadContract({
    address: contractAddress,
    abi: [
      {
        name: 'getRegisteredDriverCount',
        type: 'function',
        inputs: [],
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
      },
    ],
    functionName: 'getRegisteredDriverCount',
    query: {
      enabled: mounted && !!contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000',
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  });

  const { data: isPaused, isLoading: pauseLoading, error: pauseError, refetch: refetchPause } = useReadContract({
    address: contractAddress,
    abi: [
      {
        name: 'paused',
        type: 'function',
        inputs: [],
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'view',
      },
    ],
    functionName: 'paused',
    query: {
      enabled: mounted && !!contractAddress && contractAddress !== '0x0000000000000000000000000000000000000000',
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  });

  const handleRetry = async () => {
    setRetryCount(prev => prev + 1);
    await Promise.all([refetchThreshold(), refetchCount(), refetchPause()]);
  };

  const hasErrors = thresholdError || countError || pauseError;
  const isAnyLoading = thresholdLoading || countLoading || pauseLoading;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-blue-200">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center">
            <Info className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">System Information</h2>
        </div>

        {hasErrors && (
          <button
            onClick={handleRetry}
            className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry ({retryCount})
          </button>
        )}
      </div>

      {hasErrors && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <h3 className="text-red-800 font-medium text-sm mb-2">Connection Issues Detected</h3>
          <div className="space-y-1 text-xs text-red-700">
            {thresholdError && <p>• Failed to load target threshold: {thresholdError.message}</p>}
            {countError && <p>• Failed to load driver count: {countError.message}</p>}
            {pauseError && <p>• Failed to load pause status: {pauseError.message}</p>}
          </div>
          <p className="text-xs text-red-600 mt-2">
            Click retry to attempt reconnection. If issues persist, check network connection and contract address.
          </p>
        </div>
      )}

      <div className="space-y-0">
        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <label className="text-sm font-medium text-gray-700">
            Target Threshold
          </label>
          <div className="text-right">
            {thresholdLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                <span className="text-sm text-gray-500">Loading...</span>
              </div>
            ) : targetThreshold !== undefined ? (
              <p className="text-sm text-gray-600">{targetThreshold.toString()} orders</p>
            ) : (
              <p className="text-sm text-red-500">Failed to load</p>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <label className="text-sm font-medium text-gray-700">
            Registered Drivers
          </label>
          <div className="text-right">
            {countLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                <span className="text-sm text-gray-500">Loading...</span>
              </div>
            ) : driverCount !== undefined ? (
              <p className="text-sm text-gray-600">{driverCount.toString()} drivers</p>
            ) : (
              <p className="text-sm text-red-500">Failed to load</p>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <label className="text-sm font-medium text-gray-700">
            System Status
          </label>
          <div className="text-right">
            {pauseLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                <span className="text-sm text-gray-500">Checking...</span>
              </div>
            ) : isPaused !== undefined ? (
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-red-500' : 'bg-green-500'}`}></div>
                <p className={`text-sm ${isPaused ? 'text-red-600' : 'text-green-600'}`}>
                  {isPaused ? 'Paused' : 'Active'}
                </p>
              </div>
            ) : (
              <p className="text-sm text-red-500">Failed to load</p>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center py-3 border-b border-gray-100">
          <label className="text-sm font-medium text-gray-700">
            Contract Address
          </label>
          <p className="text-sm text-gray-600 font-mono text-right max-w-48 truncate" title={contractAddress}>
            {contractAddress}
          </p>
        </div>

        {userAddress && (
          <div className="flex justify-between items-center py-3">
            <label className="text-sm font-medium text-gray-700">
              Connected Address
            </label>
            <p className="text-sm text-gray-600 font-mono text-right max-w-48 truncate" title={userAddress}>
              {userAddress}
            </p>
          </div>
        )}
      </div>

      {isAnyLoading && (
        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>Refreshing system information...</p>
        </div>
      )}
    </div>
  );
}
