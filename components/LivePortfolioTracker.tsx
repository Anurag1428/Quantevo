'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Target, RefreshCw } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface PortfolioHolding {
  symbol: string;
  quantity: number;
  purchasePrice: number; // Cost per unit
}

interface EnrichedHolding {
  symbol: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  totalValue: number;
  totalCost: number;
  gain: number;
  gainPercent: number;
  changePercent: number;
}

interface LivePortfolioTrackerProps {
  holdings: PortfolioHolding[];
  portfolioData?: Array<{
    date: string;
    value: number;
    gain: number;
  }>;
  refreshInterval?: number;
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

export const LivePortfolioTracker = ({
  holdings,
  portfolioData = DEFAULT_DATA,
  refreshInterval = 300000, // 5 minutes
}: LivePortfolioTrackerProps) => {
  const [enrichedHoldings, setEnrichedHoldings] = useState<EnrichedHolding[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAndEnrichHoldings = async () => {
    if (!holdings || holdings.length === 0) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch current prices for all symbols
      const symbols = holdings.map(h => h.symbol);
      const response = await fetch('/api/scrape/stocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbols }),
      });

      if (!response.ok) throw new Error('Failed to fetch prices');
      const result = await response.json();

      // Create a price map
      const priceMap: Record<string, number> = {};
      result.data.forEach((stock: any) => {
        priceMap[stock.symbol] = stock.price;
      });

      // Enrich holdings with current prices
      const enriched = holdings.map(h => {
        const currentPrice = priceMap[h.symbol] || h.purchasePrice;
        const totalCost = h.quantity * h.purchasePrice;
        const totalValue = h.quantity * currentPrice;
        const gain = totalValue - totalCost;
        const gainPercent = (gain / totalCost) * 100;
        const changePercent = ((currentPrice - h.purchasePrice) / h.purchasePrice) * 100;

        return {
          symbol: h.symbol,
          quantity: h.quantity,
          purchasePrice: h.purchasePrice,
          currentPrice,
          totalValue,
          totalCost,
          gain,
          gainPercent,
          changePercent,
        };
      });

      setEnrichedHoldings(enriched);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch holdings data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchAndEnrichHoldings();
  }, [holdings]);

  // Auto-refresh interval
  useEffect(() => {
    if (refreshInterval <= 0) return;

    const interval = setInterval(() => {
      fetchAndEnrichHoldings();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [holdings, refreshInterval]);

  const totalValue = enrichedHoldings.reduce((sum, h) => sum + h.totalValue, 0);
  const totalCost = enrichedHoldings.reduce((sum, h) => sum + h.totalCost, 0);
  const totalGain = totalValue - totalCost;
  const gainPercentage = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;
  const portfolioGain = portfolioData[portfolioData.length - 1]?.gain || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Portfolio Tracker</h2>
          <p className="text-gray-400 mt-1">Live holdings with real-time pricing</p>
          {lastUpdated && (
            <p className="text-xs text-gray-500 mt-1">
              Updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <button
          onClick={fetchAndEnrichHoldings}
          disabled={loading}
          className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 disabled:opacity-50 transition"
          title="Refresh prices"
        >
          <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
        </button>
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
              <p className="text-sm text-gray-400">Total Invested</p>
              <p className="text-2xl font-bold text-white mt-1">{formatCurrency(totalCost)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="glass-card glass-hover rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Unrealized Gain</p>
              <p className={`text-2xl font-bold mt-1 ${totalGain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(totalGain)}
              </p>
              <p className={`text-xs mt-1 ${gainPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {gainPercentage >= 0 ? '+' : ''}{gainPercentage.toFixed(2)}%
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
              <p className="text-sm text-gray-400">Holdings</p>
              <p className="text-2xl font-bold text-white mt-1">{enrichedHoldings.length}</p>
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

      {/* Holdings Table with Live Data */}
      <div className="glass-card glass-hover rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Your Holdings {loading && <RefreshCw className="w-4 h-4 inline animate-spin ml-2" />}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-gray-300 font-semibold">Symbol</th>
                <th className="text-right py-3 px-4 text-gray-300 font-semibold">Quantity</th>
                <th className="text-right py-3 px-4 text-gray-300 font-semibold">Current Price</th>
                <th className="text-right py-3 px-4 text-gray-300 font-semibold">Total Value</th>
                <th className="text-right py-3 px-4 text-gray-300 font-semibold">Total Cost</th>
                <th className="text-right py-3 px-4 text-gray-300 font-semibold">Gain/Loss</th>
                <th className="text-right py-3 px-4 text-gray-300 font-semibold">Return %</th>
              </tr>
            </thead>
            <tbody>
              {enrichedHoldings.map((holding) => (
                <tr key={holding.symbol} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="py-3 px-4">
                    <span className="font-semibold text-white">{holding.symbol}</span>
                  </td>
                  <td className="text-right py-3 px-4 text-gray-300">
                    {holding.quantity.toFixed(4)}
                  </td>
                  <td className="text-right py-3 px-4 text-gray-300">
                    ${holding.currentPrice.toFixed(2)}
                  </td>
                  <td className="text-right py-3 px-4 text-white font-semibold">
                    {formatCurrency(holding.totalValue)}
                  </td>
                  <td className="text-right py-3 px-4 text-gray-400">
                    {formatCurrency(holding.totalCost)}
                  </td>
                  <td
                    className={`text-right py-3 px-4 font-semibold ${
                      holding.gain >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {holding.gain >= 0 ? '+' : ''}{formatCurrency(holding.gain)}
                  </td>
                  <td
                    className={`text-right py-3 px-4 font-semibold ${
                      holding.gainPercent >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {holding.gainPercent >= 0 ? '+' : ''}{holding.gainPercent.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
