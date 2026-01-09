'use client';

import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatPercentage } from '@/lib/utils';

interface PerformanceMetricProps {
  label: string;
  value: string | number;
  change: number;
  period: string;
  trend?: 'up' | 'down' | 'neutral';
}

export const PerformanceMetric = ({
  label,
  value,
  change,
  period,
  trend = 'neutral',
}: PerformanceMetricProps) => {
  const isPositive = change >= 0;
  const displayTrend = trend === 'neutral' ? (isPositive ? 'up' : 'down') : trend;

  const trendIcon =
    displayTrend === 'up' ? (
      <ArrowUpRight className="w-4 h-4 text-green-400" />
    ) : (
      <ArrowDownRight className="w-4 h-4 text-red-400" />
    );

  const changeColor = isPositive ? 'text-green-400' : 'text-red-400';

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
      <p className="text-sm text-gray-400 font-medium">{label}</p>
      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{period}</p>
        </div>
        <div className={`flex items-center gap-1 ${changeColor}`}>
          {trendIcon}
          <span className="text-sm font-semibold">{formatPercentage(change)}</span>
        </div>
      </div>
    </div>
  );
};
