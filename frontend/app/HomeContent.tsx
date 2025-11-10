'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import SystemInfo from '../components/SystemInfo';
import SubmitOrderCount from '../components/SubmitOrderCount';
import ActionButtons from '../components/ActionButtons';

export default function HomeContent() {
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000';
  const { address, isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Driver Performance
              </h1>
              <p className="text-lg text-gray-600">
                Logistics encryption system with Fully Homomorphic Encryption
              </p>
            </div>
            <div className="ml-4">
              <ConnectButton />
            </div>
          </div>
          <div className="text-center text-gray-500">
            <p>Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Connect Button */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Driver Performance
            </h1>
            <p className="text-lg text-gray-600">
              Logistics encryption system with Fully Homomorphic Encryption
            </p>
          </div>
          <div className="ml-4">
            <ConnectButton />
          </div>
        </div>

        <div className="space-y-6">
          <SystemInfo contractAddress={contractAddress} userAddress={address} />
          <SubmitOrderCount contractAddress={contractAddress} userAddress={address} />
          <ActionButtons contractAddress={contractAddress} userAddress={address} />
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Built with Next.js, FHEVM, and Web3 technologies</p>
        </div>
      </div>
    </main>
  );
}
