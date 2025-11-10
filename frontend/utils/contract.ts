import { ethers } from 'ethers';
import DriverPerformanceABI from '../abi/DriverPerformanceABI.json';

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
export const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '11155111');

export const DRIVER_PERFORMANCE_ABI = DriverPerformanceABI;

export function getContract(address?: string, signerOrProvider?: any) {
  if (!address && !CONTRACT_ADDRESS) {
    throw new Error('Contract address not configured');
  }

  return new ethers.Contract(
    address || CONTRACT_ADDRESS,
    DRIVER_PERFORMANCE_ABI,
    signerOrProvider
  );
}

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function isValidAddress(address: string): boolean {
  return ethers.isAddress(address);
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  const prefix = address.substring(0, chars + 2); // +2 for '0x'
  const suffix = address.substring(address.length - chars);
  return `${prefix}...${suffix}`;
}

export function getExplorerUrl(txHash: string, chainId = CHAIN_ID): string {
  const explorers: { [key: number]: string } = {
    1: 'https://etherscan.io/tx/',
    11155111: 'https://sepolia.etherscan.io/tx/',
    31337: '', // Local network, no explorer
  };

  const baseUrl = explorers[chainId];
  return baseUrl ? `${baseUrl}${txHash}` : '';
}

export function getContractExplorerUrl(address: string, chainId = CHAIN_ID): string {
  const explorers: { [key: number]: string } = {
    1: 'https://etherscan.io/address/',
    11155111: 'https://sepolia.etherscan.io/address/',
    31337: '', // Local network, no explorer
  };

  const baseUrl = explorers[chainId];
  return baseUrl ? `${baseUrl}${address}` : '';
}

export async function waitForTransaction(
  txHash: string,
  provider: ethers.Provider,
  confirmations = 1
): Promise<ethers.TransactionReceipt | null> {
  try {
    return await provider.waitForTransaction(txHash, confirmations);
  } catch (error) {
    console.error('Error waiting for transaction:', error);
    return null;
  }
}

export function parseError(error: any): string {
  if (error?.reason) {
    return error.reason;
  }

  if (error?.data?.message) {
    return error.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  return 'An unknown error occurred';
}

export const CONTRACT_ERRORS = {
  InvalidAddress: 'Invalid address provided',
  DriverAlreadyRegistered: 'Driver is already registered',
  EmptyDriverList: 'Driver list cannot be empty',
  BatchSizeTooLarge: 'Batch size exceeds maximum limit',
  OffsetOutOfBounds: 'Pagination offset is out of bounds',
  UnauthorizedAccess: 'Unauthorized access',
  ContractPaused: 'Contract is currently paused',
  ContractNotPaused: 'Contract is not paused',
} as const;
