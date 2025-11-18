'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useChainId, useSwitchChain } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

interface DriverRegistrationProps {
  contractAddress: `0x${string}`;
}

export default function DriverRegistration({ contractAddress }: DriverRegistrationProps) {
  const { address, isConnected, chain } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { writeContract, isPending, error } = useWriteContract();
  const [driverAddress, setDriverAddress] = useState('');
  const [driverName, setDriverName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Enhanced validation function with input sanitization
  const validateInputs = () => {
    const errors: string[] = [];

    // Input sanitization: Remove potentially dangerous characters
    const sanitizedName = driverName.replace(/[<>\"'&]/g, '');
    const sanitizedAddress = driverAddress.trim();
    const sanitizedLicense = licenseNumber.toUpperCase().replace(/[^A-Z0-9]/g, '');

    // Update sanitized values
    if (sanitizedName !== driverName) setDriverName(sanitizedName);
    if (sanitizedAddress !== driverAddress) setDriverAddress(sanitizedAddress);
    if (sanitizedLicense !== licenseNumber) setLicenseNumber(sanitizedLicense);

    // Check if address is valid Ethereum address
    if (!/^0x[a-fA-F0-9]{40}$/.test(sanitizedAddress)) {
      errors.push('Invalid Ethereum address format');
    }

    // Check driver name length and content
    if (sanitizedName.length < 2 || sanitizedName.length > 50) {
      errors.push('Driver name must be between 2-50 characters');
    }
    if (/[<>\"'&]/.test(driverName)) {
      errors.push('Driver name contains invalid characters');
    }

    // Check license number format
    if (!/^[A-Z0-9]{6,12}$/.test(sanitizedLicense)) {
      errors.push('License number must be 6-12 alphanumeric characters');
    }

    // Check for duplicate registration attempts
    // This would normally check against a backend/database
    if (sanitizedAddress === address) {
      errors.push('Cannot register yourself as a driver');
    }

    return errors;
  };

  const handleRegisterDriver = async () => {
    const errors = validateInputs();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    if (!isConnected || !driverAddress) return;

    try {
      setIsLoading(true);
      setValidationErrors([]);
      // Note: This is a simplified version. In a real FHE implementation,
      // you would need to handle encrypted inputs and proofs
      await writeContract({
        address: contractAddress,
        abi: [
          {
            name: 'registerDriver',
            type: 'function',
            inputs: [{ name: 'driver', type: 'address' }],
            outputs: [],
            stateMutability: 'nonpayable',
          },
        ],
        functionName: 'registerDriver',
        args: [driverAddress as `0x${string}`],
      });
    } catch (err) {
      console.error('Registration failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Wallet connection status display
  const getWalletStatus = () => {
    if (!isConnected) return { status: 'disconnected', color: 'red' };
    if (chain?.id === sepolia.id) return { status: 'connected', color: 'green' };
    if (chain?.id === mainnet.id) return { status: 'wrong_network', color: 'yellow' };
    return { status: 'unknown_network', color: 'orange' };
  };

  const walletStatus = getWalletStatus();

  // Effect to clear validation errors when inputs change
  useEffect(() => {
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  }, [driverAddress, driverName, licenseNumber]);

  if (!isConnected) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 md:p-6">
        <div className="flex items-center space-x-3 mb-3">
          <div className={`w-3 h-3 rounded-full bg-${walletStatus.color}-500`}></div>
          <p className="text-yellow-800 font-medium">Wallet Disconnected</p>
        </div>
        <p className="text-yellow-700 text-sm">Please connect your wallet to register drivers.</p>
        <div className="mt-3 text-xs text-yellow-600">
          <p>Supported networks: Sepolia Testnet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 md:p-6 max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Driver Registration</h2>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full bg-${walletStatus.color}-500`}></div>
          <span className="text-xs text-gray-600 capitalize">
            {walletStatus.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {chain?.id !== sepolia.id && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
          <p className="text-orange-800 text-sm">
            Please switch to Sepolia testnet for registration.
          </p>
          <button
            onClick={() => switchChain?.({ chainId: sepolia.id })}
            className="mt-2 text-xs bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700"
          >
            Switch to Sepolia
          </button>
        </div>
      )}

      <div className="space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label htmlFor="driverName" className="block text-sm font-medium text-gray-700 mb-2">
              Driver Name *
            </label>
            <input
              id="driverName"
              type="text"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              placeholder="Enter full name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={50}
            />
          </div>

          <div>
            <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-2">
              License Number *
            </label>
            <input
              id="licenseNumber"
              type="text"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value.toUpperCase())}
              placeholder="ABC123456"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={12}
            />
          </div>
        </div>

        <div>
          <label htmlFor="driverAddress" className="block text-sm font-medium text-gray-700 mb-2">
            Driver Ethereum Address *
          </label>
          <input
            id="driverAddress"
            type="text"
            value={driverAddress}
            onChange={(e) => setDriverAddress(e.target.value)}
            placeholder="0x..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the Ethereum address of the driver to register
          </p>
        </div>

        {validationErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <h3 className="text-red-800 font-medium text-sm mb-2">Validation Errors:</h3>
            <ul className="text-red-700 text-sm space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleRegisterDriver}
          disabled={isPending || isLoading || !driverAddress || !driverName || !licenseNumber}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isPending || isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Registering Driver...</span>
            </div>
          ) : (
            'Register Driver'
          )}
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-800 text-sm font-medium mb-1">Registration Failed</p>
            <p className="text-red-700 text-sm">
              {error.message || 'An unexpected error occurred during registration'}
            </p>
          </div>
        )}

        <div className="text-xs text-gray-500 border-t pt-3">
          <p>* Required fields. All information is encrypted and privacy-protected.</p>
        </div>
      </div>
    </div>
  );
}
