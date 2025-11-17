'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { BarChart3, TrendingUp, Users, Target, Download, RefreshCw } from 'lucide-react';

interface PerformanceAnalyticsProps {
  contractAddress: `0x${string}`;
}

interface PerformanceData {
  driver: string;
  ordersCompleted: number;
  performance: 'Good' | 'Not Met';
  timestamp: Date;
}

export default function PerformanceAnalytics({ contractAddress }: PerformanceAnalyticsProps) {
  const { address } = useAccount();
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [isLoading, setIsLoading] = useState(true);

  // Mock contract reads for analytics
  const { data: driverCount } = useReadContract({
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
      enabled: !!contractAddress,
    },
  });

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
      enabled: !!contractAddress,
    },
  });

  useEffect(() => {
    // Generate mock performance data
    const generateMockData = () => {
      const mockData: PerformanceData[] = [];
      const drivers = [
        '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
        '0x1234567890abcdef1234567890abcdef12345678',
        '0xabcdef1234567890abcdef1234567890abcdef12',
        '0xfedcba0987654321fedcba0987654321fedcba09'
      ];

      // Generate data for the selected time range
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;

      for (let i = 0; i < days; i++) {
        drivers.forEach(driver => {
          const orders = Math.floor(Math.random() * 20) + 5; // 5-25 orders
          const meetsTarget = orders >= (targetThreshold || 10);

          mockData.push({
            driver: driver.slice(0, 10) + '...',
            ordersCompleted: orders,
            performance: meetsTarget ? 'Good' : 'Not Met',
            timestamp: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000)
          });
        });
      }

      setPerformanceData(mockData);
      setIsLoading(false);
    };

    generateMockData();
  }, [timeRange, targetThreshold]);

  const calculateStats = () => {
    const totalEvaluations = performanceData.length;
    const goodPerformances = performanceData.filter(p => p.performance === 'Good').length;
    const successRate = totalEvaluations > 0 ? (goodPerformances / totalEvaluations) * 100 : 0;
    const avgOrders = performanceData.length > 0
      ? performanceData.reduce((sum, p) => sum + p.ordersCompleted, 0) / performanceData.length
      : 0;

    return {
      totalEvaluations,
      goodPerformances,
      successRate,
      avgOrders: Math.round(avgOrders * 10) / 10
    };
  };

  const stats = calculateStats();

  const exportData = () => {
    const csvContent = [
      ['Driver', 'Orders Completed', 'Performance', 'Date'].join(','),
      ...performanceData.map(p =>
        [p.driver, p.ordersCompleted, p.performance, p.timestamp.toISOString()].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-analytics-${timeRange}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const refreshData = () => {
    setIsLoading(true);
    // Simulate refresh
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Performance Analytics</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refreshData}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={exportData}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm font-medium text-gray-700">Time Range:</span>
        {(['7d', '30d', '90d'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-3 py-1 text-sm rounded ${
              timeRange === range
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Total Drivers</h3>
          </div>
          <p className="text-2xl font-bold text-blue-600">{driverCount?.toString() || '0'}</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-green-900">Success Rate</h3>
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.successRate.toFixed(1)}%</p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-purple-900">Target Threshold</h3>
          </div>
          <p className="text-2xl font-bold text-purple-600">{targetThreshold?.toString() || '0'}</p>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-orange-900">Avg Orders</h3>
          </div>
          <p className="text-2xl font-bold text-orange-600">{stats.avgOrders}</p>
        </div>
      </div>

      {/* Performance Trend Chart (Simplified) */}
      <div className="border border-gray-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold mb-4">Performance Trend</h3>
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="h-64 bg-gray-50 rounded flex items-end justify-center gap-2 p-4">
            {/* Simple bar chart representation */}
            {Array.from({ length: Math.min(20, performanceData.length / 4) }, (_, i) => {
              const dayData = performanceData.slice(i * 4, (i + 1) * 4);
              const avgPerformance = dayData.reduce((sum, p) => sum + (p.performance === 'Good' ? 1 : 0), 0) / dayData.length;
              const height = avgPerformance * 100;

              return (
                <div key={i} className="flex flex-col items-center">
                  <div
                    className="w-8 bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-gray-600 mt-2">Day {i + 1}</span>
                </div>
              );
            })}
          </div>
        )}
        <p className="text-xs text-gray-600 mt-2 text-center">
          Daily performance success rate over the selected time period
        </p>
      </div>

      {/* Recent Performance Table */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold mb-4">Recent Performance Data</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-2">Driver</th>
                <th className="text-left py-2 px-2">Orders</th>
                <th className="text-left py-2 px-2">Performance</th>
                <th className="text-left py-2 px-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {performanceData.slice(-10).reverse().map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-2 px-2 font-mono text-xs">{item.driver}</td>
                  <td className="py-2 px-2">{item.ordersCompleted}</td>
                  <td className="py-2 px-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      item.performance === 'Good'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.performance}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-xs text-gray-600">
                    {item.timestamp.toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
