'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Truck, Shield, Zap } from 'lucide-react';
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
      <main className="min-h-screen relative overflow-hidden">
        <div className="animated-bg"></div>
        <div className="particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
        <div className="content-wrapper min-h-screen py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
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
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="animated-bg"></div>
      <div className="particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      {/* Content */}
      <div className="content-wrapper min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header with Connect Button */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 fade-in">
            <div className="flex-1 mb-6 md:mb-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg glow">
                  <Truck className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Driver Performance
                </h1>
              </div>
              <p className="text-lg text-gray-700 ml-14 flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-500" />
                <span>Logistics encryption system with Fully Homomorphic Encryption</span>
              </p>
              <div className="ml-14 mt-3 flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span>Privacy-Preserving</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Secure</span>
                </div>
              </div>
            </div>
            <div className="ml-0 md:ml-4">
              <div className="hover-scale">
                <ConnectButton />
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="fade-in-delay-1">
                <SystemInfo contractAddress={contractAddress} userAddress={address} />
              </div>
              <div className="fade-in-delay-2">
                <SubmitOrderCount contractAddress={contractAddress} userAddress={address} />
              </div>
            </div>
            <div className="fade-in-delay-3">
              <ActionButtons contractAddress={contractAddress} userAddress={address} />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center fade-in-delay-3">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-200">
              <p className="text-sm text-gray-600">
                Built with <span className="font-semibold text-indigo-600">Next.js</span>,{' '}
                <span className="font-semibold text-purple-600">FHEVM</span>, and{' '}
                <span className="font-semibold text-pink-600">Web3</span> technologies
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
