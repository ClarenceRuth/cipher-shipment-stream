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
    <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-6 hover-scale border border-gray-100">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-indigo-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg glow">
            <Info className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">System Information</h2>
        </div>

        {hasErrors && (
          <button
            onClick={handleRetry}
            className="px-4 py-2 text-xs bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Retry ({retryCount})
          </button>
        )}
      </div>

      {hasErrors && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-xl p-4 mb-4 shadow-md slide-in">
          <h3 className="text-red-800 font-semibold text-sm mb-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 pulse"></div>
            Connection Issues Detected
          </h3>
          <div className="space-y-2 text-xs text-red-700 mb-3">
            {thresholdError && <p className="flex items-center gap-2">• <span>Failed to load target threshold: {thresholdError.message}</span></p>}
            {countError && <p className="flex items-center gap-2">• <span>Failed to load driver count: {countError.message}</span></p>}
            {pauseError && <p className="flex items-center gap-2">• <span>Failed to load pause status: {pauseError.message}</span></p>}
          </div>
          <p className="text-xs text-red-600 bg-white/50 rounded-lg p-2">
            Click retry to attempt reconnection. If issues persist, check network connection and contract address.
          </p>
        </div>
      )}

      <div className="space-y-0">
        <div className="flex justify-between items-center py-4 border-b border-gray-100 hover:bg-indigo-50/50 transition-colors rounded-lg px-2 -mx-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
            Target Threshold
          </label>
          <div className="text-right">
            {thresholdLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-indigo-300 border-t-indigo-600 rounded-full animate-spin"></div>
                <span className="text-sm text-gray-500">Loading...</span>
              </div>
            ) : targetThreshold !== undefined ? (
              <p className="text-sm font-semibold text-indigo-600">{targetThreshold.toString()} orders</p>
            ) : (
              <p className="text-sm text-red-500">Failed to load</p>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center py-4 border-b border-gray-100 hover:bg-purple-50/50 transition-colors rounded-lg px-2 -mx-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            Registered Drivers
          </label>
          <div className="text-right">
            {countLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
                <span className="text-sm text-gray-500">Loading...</span>
              </div>
            ) : driverCount !== undefined ? (
              <p className="text-sm font-semibold text-purple-600">{driverCount.toString()} drivers</p>
            ) : (
              <p className="text-sm text-red-500">Failed to load</p>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center py-4 border-b border-gray-100 hover:bg-green-50/50 transition-colors rounded-lg px-2 -mx-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            System Status
          </label>
          <div className="text-right">
            {pauseLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-green-300 border-t-green-600 rounded-full animate-spin"></div>
                <span className="text-sm text-gray-500">Checking...</span>
              </div>
            ) : isPaused !== undefined ? (
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isPaused ? 'bg-red-500 pulse' : 'bg-green-500 pulse'}`}></div>
                <p className={`text-sm font-semibold ${isPaused ? 'text-red-600' : 'text-green-600'}`}>
                  {isPaused ? 'Paused' : 'Active'}
                </p>
              </div>
            ) : (
              <p className="text-sm text-red-500">Failed to load</p>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors rounded-lg px-2 -mx-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
            Contract Address
          </label>
          <p className="text-sm text-gray-600 font-mono text-right max-w-48 truncate hover:text-indigo-600 transition-colors" title={contractAddress}>
            {contractAddress}
          </p>
        </div>

        {userAddress && (
          <div className="flex justify-between items-center py-4 hover:bg-blue-50 transition-colors rounded-lg px-2 -mx-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              Connected Address
            </label>
            <p className="text-sm text-gray-600 font-mono text-right max-w-48 truncate hover:text-blue-600 transition-colors" title={userAddress}>
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
