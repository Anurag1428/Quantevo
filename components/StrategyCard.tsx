'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Users, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StrategyCardProps {
  strategy: Strategy;
  onSubscribe?: (strategyId: string) => void;
  isSubscribed?: boolean;
  isLoading?: boolean;
}

const StrategyCard: React.FC<StrategyCardProps> = ({
  strategy,
  onSubscribe,
  isSubscribed = false,
  isLoading = false,
}) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      case 'high':
        return 'bg-red-500/20 text-red-300 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const isPositiveReturn = strategy.performance.avgReturn >= 0;

  return (
    <div className="glass-card glass-hover rounded-lg p-6 flex flex-col h-full">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <Link href={`/strategies/${strategy.id}`}>
              <h3 className="text-lg font-semibold text-white hover:text-yellow-400 transition-colors cursor-pointer line-clamp-2">
                {strategy.title}
              </h3>
            </Link>
            <p className="text-sm text-gray-400 mt-1">by {strategy.author.name}</p>
          </div>
        </div>

        {/* Tags and Risk Level */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className={cn('border', getRiskColor(strategy.riskLevel))}>
            {strategy.riskLevel.charAt(0).toUpperCase() + strategy.riskLevel.slice(1)} Risk
          </Badge>
          {strategy.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-gray-700 text-gray-300">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-300 line-clamp-2">{strategy.description}</p>
      </div>

      {/* Performance Metrics */}
      <div className="bg-gray-900/50 rounded-lg p-4 mb-4 space-y-2">
        <div className="grid grid-cols-2 gap-3">
          {/* Win Rate */}
          <div>
            <p className="text-xs text-gray-400 uppercase">Win Rate</p>
            <p className="text-lg font-semibold text-white">{strategy.performance.winRate.toFixed(1)}%</p>
          </div>

          {/* Avg Return */}
          <div>
            <p className="text-xs text-gray-400 uppercase">Avg Return</p>
            <p className={cn('text-lg font-semibold flex items-center gap-1', isPositiveReturn ? 'text-green-400' : 'text-red-400')}>
              {isPositiveReturn ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              {Math.abs(strategy.performance.avgReturn).toFixed(2)}%
            </p>
          </div>

          {/* Sharpe Ratio */}
          <div>
            <p className="text-xs text-gray-400 uppercase">Sharpe Ratio</p>
            <p className="text-lg font-semibold text-white">{strategy.performance.sharpeRatio.toFixed(2)}</p>
          </div>

          {/* Max Drawdown */}
          <div>
            <p className="text-xs text-gray-400 uppercase">Max Drawdown</p>
            <p className="text-lg font-semibold text-red-400">-{strategy.performance.maxDrawdown.toFixed(1)}%</p>
          </div>

          {/* Total Trades */}
          <div>
            <p className="text-xs text-gray-400 uppercase">Total Trades</p>
            <p className="text-lg font-semibold text-white">{strategy.performance.totalTrades}</p>
          </div>

          {/* Profit Factor */}
          <div>
            <p className="text-xs text-gray-400 uppercase">Profit Factor</p>
            <p className="text-lg font-semibold text-white">{strategy.performance.profitFactor.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Reputation and Subscribers */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-semibold text-white">{strategy.reputation}/100</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400">{strategy.subscribers} subscribers</span>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex gap-2 mt-auto">
        <Link href={`/strategies/${strategy.id}`} className="flex-1">
          <Button variant="outline" className="w-full border-gray-600 hover:border-yellow-500 hover:text-yellow-400">
            <TrendingUp className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </Link>
        <Button
          onClick={() => onSubscribe?.(strategy.id)}
          disabled={isSubscribed || isLoading}
          className={cn(
            'flex-1',
            isSubscribed
              ? 'bg-gray-700 text-gray-400 hover:bg-gray-700'
              : 'bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold'
          )}
        >
          {isSubscribed ? '✓ Subscribed' : 'Subscribe'}
        </Button>
      </div>
    </div>
  );
};

export default StrategyCard;
