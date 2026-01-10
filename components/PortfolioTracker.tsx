'use client';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface PortfolioTrackerProps {
  portfolioData?: Array<{
    date: string;
    value: number;
    gain: number;
  }>;
  holdings?: Array<{
    symbol: string;
    quantity: number;
    value: number;
    change: number;
  }>;
}

const DEFAULT_DATA = [
  { date: 'Jan 1', value: 100000, gain: 0 },
  { date: 'Jan 5', value: 102500, gain: 2500 },
  { date: 'Jan 10', value: 98000, gain: -2000 },
  { date: 'Jan 15', value: 105000, gain: 5000 },
  { date: 'Jan 20', value: 110000, gain: 10000 },
  { date: 'Jan 25', value: 112500, gain: 12500 },
  { date: 'Jan 30', value: 115000, gain: 15000 },
];

const DEFAULT_HOLDINGS = [
  { symbol: 'AAPL', quantity: 50, value: 8250, change: 5.2 },
  { symbol: 'MSFT', quantity: 30, value: 9900, change: 3.1 },
  { symbol: 'GOOGL', quantity: 20, value: 2800, change: -1.5 },
  { symbol: 'TSLA', quantity: 25, value: 10000, change: 8.7 },
  { symbol: 'BTC', quantity: 0.5, value: 25000, change: 12.3 },
];

export const PortfolioTracker = ({
  portfolioData = DEFAULT_DATA,
  holdings = DEFAULT_HOLDINGS,
}: PortfolioTrackerProps) => {
  const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);
  const totalGain = portfolioData[portfolioData.length - 1]?.gain || 0;
  const gainPercentage = ((totalGain / (portfolioData[0]?.value || 100000)) * 100) || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Portfolio Tracker</h2>
        <p className="text-gray-400 mt-1">Monitor your investments performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card glass-hover rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Value</p>
              <p className="text-2xl font-bold text-white mt-1">{formatCurrency(totalValue)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="glass-card glass-hover rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Gain</p>
              <p className={`text-2xl font-bold mt-1 ${totalGain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(totalGain)}
              </p>
            </div>
            {totalGain >= 0 ? (
              <TrendingUp className="w-8 h-8 text-green-400" />
            ) : (
              <TrendingDown className="w-8 h-8 text-red-400" />
            )}
          </div>
        </div>

        <div className="glass-card glass-hover rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Gain %</p>
              <p className={`text-2xl font-bold mt-1 ${gainPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatPercentage(gainPercentage)}
              </p>
            </div>
            <Target className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <div className="glass-card glass-hover rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Holdings</p>
              <p className="text-2xl font-bold text-white mt-1">{holdings.length}</p>
            </div>
            <BarChart className="w-8 h-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Portfolio Value Chart */}
      <div className="glass-card glass-hover rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Portfolio Value Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={portfolioData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#FFF' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: '#3B82F6', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Holdings Table */}
      <div className="glass-card glass-hover rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Your Holdings</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-gray-300 font-semibold">Symbol</th>
                <th className="text-left py-3 px-4 text-gray-300 font-semibold">Quantity</th>
                <th className="text-left py-3 px-4 text-gray-300 font-semibold">Value</th>
                <th className="text-left py-3 px-4 text-gray-300 font-semibold">Change</th>
                <th className="text-left py-3 px-4 text-gray-300 font-semibold">% of Portfolio</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((holding) => (
                <tr key={holding.symbol} className="border-b border-white/10 hover:bg-white/10 transition-colors">
                  <td className="py-3 px-4 text-white font-semibold">{holding.symbol}</td>
                  <td className="py-3 px-4 text-gray-300">{holding.quantity.toFixed(2)}</td>
                  <td className="py-3 px-4 text-gray-300">{formatCurrency(holding.value)}</td>
                  <td className={`py-3 px-4 font-semibold ${holding.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {holding.change >= 0 ? '+' : ''}{holding.change.toFixed(2)}%
                  </td>
                  <td className="py-3 px-4 text-gray-300">{((holding.value / totalValue) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
