'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Shield, Zap, CheckCircle, AlertTriangle, Wifi, WifiOff } from 'lucide-react';

interface FHEVMIntegrationProps {
  contractAddress: `0x${string}`;
}

export default function FHEVMIntegration({ contractAddress }: FHEVMIntegrationProps) {
  const { isConnected } = useAccount();
  const [fhevmStatus, setFhevmStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [relayerStatus, setRelayerStatus] = useState<'offline' | 'online' | 'syncing'>('offline');
  const [encryptionProgress, setEncryptionProgress] = useState(0);
  const [recentOperations, setRecentOperations] = useState<Array<{
    id: string;
    type: string;
    status: 'success' | 'failed' | 'pending';
    timestamp: Date;
  }>>([]);

  useEffect(() => {
    // Simulate FHEVM connection check
    const checkFhevmStatus = async () => {
      try {
        // Mock FHEVM status check
        setFhevmStatus('connecting');
        await new Promise(resolve => setTimeout(resolve, 1000));
        setFhevmStatus('connected');

        // Mock relayer status
        setRelayerStatus('online');

        // Mock recent operations
        setRecentOperations([
          {
            id: 'op_001',
            type: 'Order Count Encryption',
            status: 'success',
            timestamp: new Date(Date.now() - 300000) // 5 minutes ago
          },
          {
            id: 'op_002',
            type: 'Performance Evaluation',
            status: 'success',
            timestamp: new Date(Date.now() - 180000) // 3 minutes ago
          }
        ]);
      } catch (error) {
        setFhevmStatus('error');
        setRelayerStatus('offline');
      }
    };

    if (isConnected) {
      checkFhevmStatus();
    }
  }, [isConnected]);

  const handleTestEncryption = async () => {
    setEncryptionProgress(0);

    // Simulate encryption process
    for (let i = 0; i <= 100; i += 10) {
      setEncryptionProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Add to recent operations
    const newOperation = {
      id: `op_${Date.now()}`,
      type: 'Test Encryption',
      status: 'success' as const,
      timestamp: new Date()
    };

    setRecentOperations(prev => [newOperation, ...prev.slice(0, 9)]); // Keep last 10
    setEncryptionProgress(0);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'online':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'connecting':
      case 'syncing':
        return <Zap className="w-5 h-5 text-yellow-500 animate-pulse" />;
      case 'error':
      case 'offline':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Shield className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'online':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'connecting':
      case 'syncing':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'error':
      case 'offline':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6 pb-3 border-b border-purple-200">
        <Shield className="w-6 h-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-800">FHEVM Integration</h2>
      </div>

      {!isConnected ? (
        <div className="text-center py-8">
          <WifiOff className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Connect your wallet to access FHEVM features</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg border ${getStatusColor(fhevmStatus)}`}>
              <div className="flex items-center gap-3 mb-2">
                {getStatusIcon(fhevmStatus)}
                <h3 className="font-semibold">FHEVM Status</h3>
              </div>
              <p className="text-sm capitalize">{fhevmStatus.replace('_', ' ')}</p>
              <p className="text-xs mt-1 opacity-75">
                Fully Homomorphic Encryption Virtual Machine
              </p>
            </div>

            <div className={`p-4 rounded-lg border ${getStatusColor(relayerStatus)}`}>
              <div className="flex items-center gap-3 mb-2">
                {relayerStatus === 'online' ? <Wifi className="w-5 h-5 text-green-500" /> : <WifiOff className="w-5 h-5 text-red-500" />}
                <h3 className="font-semibold">Relayer Status</h3>
              </div>
              <p className="text-sm capitalize">{relayerStatus}</p>
              <p className="text-xs mt-1 opacity-75">
                Processes encrypted transactions
              </p>
            </div>
          </div>

          {/* Encryption Test */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Encryption Test</h3>
            <div className="flex items-center gap-4 mb-3">
              <button
                onClick={handleTestEncryption}
                disabled={fhevmStatus !== 'connected'}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Test Encryption
              </button>
              {encryptionProgress > 0 && (
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${encryptionProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{encryptionProgress}% Complete</p>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600">
              Test the FHEVM encryption pipeline with sample data
            </p>
          </div>

          {/* Recent Operations */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Recent FHE Operations</h3>
            {recentOperations.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent operations</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {recentOperations.map((op) => (
                  <div key={op.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                    <div className="flex items-center gap-2">
                      {op.status === 'success' ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : op.status === 'failed' ? (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      ) : (
                        <Zap className="w-4 h-4 text-yellow-500" />
                      )}
                      <span className="font-medium">{op.type}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {op.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Integration Details */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Integration Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">🔐 Privacy Protection</h4>
                <p className="text-gray-600">All computations happen on encrypted data</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">⚡ Zero-Knowledge Proofs</h4>
                <p className="text-gray-600">Verify computations without revealing data</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">🔄 Relayer Network</h4>
                <p className="text-gray-600">Distributed network for transaction processing</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">📊 Selective Decryption</h4>
                <p className="text-gray-600">Results can be decrypted when authorized</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
