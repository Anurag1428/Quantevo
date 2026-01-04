'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { STOCK_SUGGESTIONS, INDUSTRY_STOCKS } from '@/lib/constants';
import { Plus, Sparkles, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface SmartSuggestionsProps {
  investmentGoal?: 'Growth' | 'Income' | 'Balanced' | 'Conservative';
  riskTolerance?: 'Low' | 'Medium' | 'High';
  preferredIndustry?: string;
  onAddToWatchlist?: (symbol: string) => void;
}

const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({
  investmentGoal = 'Balanced',
  riskTolerance = 'Medium',
  preferredIndustry = 'Technology',
  onAddToWatchlist,
}) => {
  const [activeTab, setActiveTab] = useState<'recommendations' | 'industry'>('recommendations');

  // Get suggestions based on user preferences
  const getSuggestions = () => {
    const suggestions = STOCK_SUGGESTIONS[investmentGoal as keyof typeof STOCK_SUGGESTIONS]?.[
      riskTolerance as keyof (typeof STOCK_SUGGESTIONS)[typeof investmentGoal]
    ] || [];
    return suggestions;
  };

  const getIndustrySuggestions = () => {
    return INDUSTRY_STOCKS[preferredIndustry as keyof typeof INDUSTRY_STOCKS] || INDUSTRY_STOCKS.Technology;
  };

  const suggestions = getSuggestions();
  const industrySuggestions = getIndustrySuggestions();

  const mockPrices: Record<string, { price: number; change: number }> = {
    MSFT: { price: 445.23, change: 2.1 },
    GOOGL: { price: 192.56, change: -1.2 },
    JPM: { price: 198.45, change: 1.5 },
    AAPL: { price: 238.45, change: 3.2 },
    AMZN: { price: 201.89, change: 2.8 },
    NVDA: { price: 875.23, change: 4.5 },
    META: { price: 612.34, change: 5.1 },
    TSLA: { price: 289.12, change: -2.3 },
    PLTR: { price: 45.67, change: 6.2 },
    COIN: { price: 156.78, change: 8.9 },
    JNJ: { price: 156.45, change: 0.8 },
    PG: { price: 167.89, change: 1.2 },
    KO: { price: 67.34, change: 0.5 },
    MCD: { price: 289.56, change: 1.9 },
  };

  const getPrice = (symbol: string) => {
    return mockPrices[symbol] || { price: Math.random() * 500 + 50, change: (Math.random() - 0.5) * 10 };
  };

  const displayedSuggestions = activeTab === 'recommendations' ? suggestions : industrySuggestions;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <h2 className="text-xl font-semibold text-white">Smart Suggestions</h2>
        </div>
        <div className="text-xs text-gray-400">Personalized for you</div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-700 pb-4">
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`pb-2 px-2 border-b-2 transition ${
            activeTab === 'recommendations'
              ? 'border-yellow-500 text-yellow-400 font-semibold'
              : 'border-transparent text-gray-400 hover:text-gray-300'
          }`}
        >
          For Your Profile
        </button>
        <button
          onClick={() => setActiveTab('industry')}
          className={`pb-2 px-2 border-b-2 transition ${
            activeTab === 'industry'
              ? 'border-yellow-500 text-yellow-400 font-semibold'
              : 'border-transparent text-gray-400 hover:text-gray-300'
          }`}
        >
          {preferredIndustry}
        </button>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-400 mb-4">
        {activeTab === 'recommendations'
          ? `Based on your ${investmentGoal} goal and ${riskTolerance.toLowerCase()} risk tolerance`
          : `Popular stocks in the ${preferredIndustry} sector`}
      </p>

      {/* Stock Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {displayedSuggestions.slice(0, 6).map((symbol) => {
          const priceData = getPrice(symbol);
          const isPositive = priceData.change >= 0;

          return (
            <div
              key={symbol}
              className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 hover:border-yellow-500/50 transition"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-bold text-yellow-400">{symbol}</h3>
                  <p className="text-xs text-gray-500">Mock Price Data</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    onAddToWatchlist?.(symbol);
                    toast.success(`${symbol} added to watchlist`);
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 h-8 w-8 p-0"
                  title="Add to watchlist"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold">${priceData.price.toFixed(2)}</span>
                  <span className={`text-sm font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? '+' : ''}
                    {priceData.change.toFixed(2)}%
                  </span>
                </div>
                <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(Math.abs(priceData.change) * 10, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-700 flex gap-3">
        <Link href="/watchlist" className="flex-1">
          <Button variant="outline" className="w-full border-gray-600 hover:border-yellow-500 hover:text-yellow-400">
            <TrendingUp className="w-4 h-4 mr-2" />
            View Watchlist
          </Button>
        </Link>
        <Link href="/search" className="flex-1">
          <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold">
            Explore More
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SmartSuggestions;
