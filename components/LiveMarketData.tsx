'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, AlertCircle } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface LiveStockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: Date;
  source?: string;
}

interface LiveMarketDataProps {
  symbols: string[];
  refreshInterval?: number; // milliseconds
  onError?: (error: Error) => void;
}

export const LiveMarketData = ({
  symbols,
  refreshInterval = 300000, // 5 minutes default
  onError,
}: LiveMarketDataProps) => {
  const [stocks, setStocks] = useState<Record<string, LiveStockData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStockData = async () => {
    if (!symbols || symbols.length === 0) return;

    try {
      setLoading(true);
      setError(null);

      if (symbols.length === 1) {
        // Single stock
        const response = await fetch(`/api/scrape/stock?symbol=${symbols[0]}`);
        if (!response.ok) throw new Error('Failed to fetch stock data');
        const data = await response.json();
        setStocks({ [data.symbol]: data });
      } else {
        // Multiple stocks
        const response = await fetch('/api/scrape/stocks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symbols }),
        });
        if (!response.ok) throw new Error('Failed to fetch stock data');
        const result = await response.json();
        const stockMap: Record<string, LiveStockData> = {};
        result.data.forEach((stock: LiveStockData) => {
          stockMap[stock.symbol] = stock;
        });
        setStocks(stockMap);
      }

      setLastUpdated(new Date());
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      if (onError) onError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchStockData();
  }, [symbols]);

  // Set up auto-refresh interval
  useEffect(() => {
    if (refreshInterval <= 0) return;

    const interval = setInterval(() => {
      fetchStockData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [symbols, refreshInterval]);

  if (loading && Object.keys(stocks).length === 0) {
    return (
      <div className="glass-card glass-hover rounded-lg p-6">
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading live market data...</span>
        </div>
      </div>
    );
  }

  if (error && Object.keys(stocks).length === 0) {
    return (
      <div className="glass-card glass-hover rounded-lg p-6">
        <div className="flex items-center gap-2 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Live Market Data</h2>
          {lastUpdated && (
            <p className="text-xs text-gray-400 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <button
          onClick={fetchStockData}
          disabled={loading}
          className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 disabled:opacity-50 transition"
          title="Refresh data"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Error message if some stocks failed to load */}
      {error && Object.keys(stocks).length > 0 && (
        <div className="glass-card glass-hover rounded-lg p-3 bg-red-500/10 border border-red-500/20">
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Stock Cards Grid */}
      {Object.keys(stocks).length > 0 ? (
        <div className={`grid gap-4 ${symbols.length === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
          {Object.values(stocks).map((stock) => (
            <StockCard key={stock.symbol} stock={stock} />
          ))}
        </div>
      ) : (
        <div className="glass-card glass-hover rounded-lg p-6 text-center text-gray-400">
          No stocks loaded
        </div>
      )}
    </div>
  );
};

/**
 * Individual stock card component
 */
function StockCard({ stock }: { stock: LiveStockData }) {
  const isPositive = stock.change >= 0;
  const icon = isPositive ? (
    <TrendingUp className="w-6 h-6 text-green-400" />
  ) : (
    <TrendingDown className="w-6 h-6 text-red-400" />
  );

  return (
    <div className="glass-card glass-hover rounded-lg p-5 hover:bg-white/5 transition">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-white">{stock.symbol}</h3>
          <p className="text-xs text-gray-500">{stock.source || 'Live'}</p>
        </div>
        {icon}
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white">
            ${stock.price.toFixed(2)}
          </span>
          <span
            className={`text-sm font-semibold ${
              isPositive ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {isPositive ? '+' : ''}{stock.change.toFixed(2)} (
            {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
          </span>
        </div>

        <div className="pt-2 border-t border-gray-700/50">
          <p className="text-xs text-gray-400">
            {new Date(stock.timestamp).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}
