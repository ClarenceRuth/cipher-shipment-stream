'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { ChevronLeft, ChevronRight, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';

interface TransactionRecord {
  id: string;
  type: 'registration' | 'submission' | 'evaluation';
  driver: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: Date;
  hash?: string;
  details?: any;
}

interface TransactionHistoryProps {
  contractAddress: `0x${string}`;
}

const ITEMS_PER_PAGE = 10;

export default function TransactionHistory({ contractAddress }: TransactionHistoryProps) {
  const { address } = useAccount();
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Mock transaction data - in real implementation, this would come from blockchain events
  useEffect(() => {
    setMounted(true);

    // Simulate loading transaction history
    const loadTransactions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Mock data - replace with actual blockchain event fetching
        const mockTransactions: TransactionRecord[] = [
          {
            id: 'tx_001',
            type: 'registration',
            driver: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
            status: 'confirmed',
            timestamp: new Date('2025-11-11T10:15:00Z'),
            hash: '0x1234567890abcdef',
            details: { driverName: 'John Doe' }
          },
          {
            id: 'tx_002',
            type: 'submission',
            driver: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
            status: 'confirmed',
            timestamp: new Date('2025-11-11T11:30:00Z'),
            hash: '0xabcdef1234567890',
            details: { orderCount: 15, encrypted: true }
          },
          {
            id: 'tx_003',
            type: 'evaluation',
            driver: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
            status: 'confirmed',
            timestamp: new Date('2025-11-11T12:00:00Z'),
            hash: '0x987654321fedcba0',
            details: { result: 'Good', threshold: 10 }
          }
        ];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        setTransactions(mockTransactions);
      } catch (err) {
        setError('Failed to load transaction history');
        console.error('Error loading transactions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, [contractAddress]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'pending':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'failed':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'registration':
        return 'Driver Registration';
      case 'submission':
        return 'Order Submission';
      case 'evaluation':
        return 'Performance Evaluation';
      default:
        return type;
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (!mounted) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Transaction History</h2>
        <div className="text-sm text-gray-600">
          Total: {transactions.length} transactions
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading transaction history...</p>
          </div>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
          <p className="text-gray-600">Transaction history will appear here once you start using the system.</p>
        </div>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {currentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(tx.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900">
                          {getTypeLabel(tx.type)}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(tx.status)}`}>
                          {tx.status}
                        </span>
                      </div>

                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Driver: {`${tx.driver.slice(0, 6)}...${tx.driver.slice(-4)}`}</p>
                        {tx.hash && (
                          <p>Transaction: {`${tx.hash.slice(0, 10)}...${tx.hash.slice(-8)}`}</p>
                        )}
                        {tx.details && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                            {tx.type === 'registration' && tx.details.driverName && (
                              <p>Name: {tx.details.driverName}</p>
                            )}
                            {tx.type === 'submission' && (
                              <p>Order Count: {tx.details.orderCount} {tx.details.encrypted ? '(Encrypted)' : ''}</p>
                            )}
                            {tx.type === 'evaluation' && (
                              <p>Result: {tx.details.result} (Threshold: {tx.details.threshold})</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-xs text-gray-500">
                    {tx.timestamp.toLocaleDateString()} {tx.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t pt-4">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1}-{Math.min(endIndex, transactions.length)} of {transactions.length} transactions
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                    if (pageNum > totalPages) return null;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 text-sm border rounded-md ${
                          pageNum === currentPage
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
