'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface MarketDataProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: string;
  marketCap?: string;
}

export const MarketDataCard = ({
  symbol,
  name,
  price,
  change,
  changePercent,
  volume,
  marketCap,
}: MarketDataProps) => {
  const isPositive = change >= 0;
  const icon = isPositive ? (
    <TrendingUp className="w-5 h-5 text-green-400" />
  ) : (
    <TrendingDown className="w-5 h-5 text-red-400" />
  );

  return (
    <div className="glass-card glass-hover rounded-lg p-4 cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{symbol}</h3>
          <p className="text-sm text-gray-400">{name}</p>
        </div>
        {icon}
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white">{formatCurrency(price)}</span>
          <span
            className={`text-sm font-semibold ${
              isPositive ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {isPositive ? '+' : ''}{formatCurrency(change)} ({formatPercentage(changePercent)})
          </span>
        </div>

        <div className="pt-2 border-t border-gray-700 space-y-1 text-xs">
          {volume && (
            <div className="flex justify-between text-gray-400">
              <span>Volume:</span>
              <span className="text-gray-300">{volume}</span>
            </div>
          )}
          {marketCap && (
            <div className="flex justify-between text-gray-400">
              <span>Market Cap:</span>
              <span className="text-gray-300">{marketCap}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
