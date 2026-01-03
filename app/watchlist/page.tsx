'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Trash2, Plus, TrendingUp, TrendingDown, Eye } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface WatchlistItem {
  symbol: string;
  name: string;
  addedAt: string;
}

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newSymbol, setNewSymbol] = useState('');
  const [newName, setNewName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('quantevo_watchlist');
    if (saved) {
      try {
        setWatchlist(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load watchlist', e);
      }
    }
    setIsLoading(false);
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('quantevo_watchlist', JSON.stringify(watchlist));
    }
  }, [watchlist, isLoading]);

  const addStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSymbol.trim() || !newName.trim()) {
      toast.error('Please enter both symbol and company name');
      return;
    }

    const duplicate = watchlist.some((item) => item.symbol.toUpperCase() === newSymbol.toUpperCase());
    if (duplicate) {
      toast.error(`${newSymbol} is already in your watchlist`);
      return;
    }

    const newItem: WatchlistItem = {
      symbol: newSymbol.toUpperCase(),
      name: newName.trim(),
      addedAt: new Date().toISOString(),
    };

    setWatchlist([newItem, ...watchlist]);
    setNewSymbol('');
    setNewName('');
    toast.success(`${newSymbol.toUpperCase()} added to watchlist`);
  };

  const removeStock = (symbol: string) => {
    setWatchlist(watchlist.filter((item) => item.symbol !== symbol));
    toast.success(`${symbol} removed from watchlist`);
  };

  const mockPrices: Record<string, { price: number; change: number }> = {
    AAPL: { price: 238.45, change: 2.34 },
    GOOGL: { price: 192.56, change: -1.23 },
    MSFT: { price: 445.23, change: 3.45 },
    TSLA: { price: 289.12, change: -2.11 },
    META: { price: 612.34, change: 4.56 },
    AMZN: { price: 201.89, change: 1.23 },
    NFLX: { price: 298.45, change: 5.67 },
    NVDA: { price: 875.23, change: 2.89 },
  };

  const getPrice = (symbol: string) => {
    return mockPrices[symbol] || { price: Math.random() * 500 + 50, change: (Math.random() - 0.5) * 10 };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400">Loading watchlist...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-16 z-40">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-white mb-2">My Watchlist</h1>
          <p className="text-gray-400">Track your favorite stocks and monitor market movements</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Add Stock Form */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Add Stock to Watchlist</h2>
          <form onSubmit={addStock} className="flex gap-4 flex-col md:flex-row">
            <Input
              placeholder="Stock Symbol (e.g., AAPL)"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-500 flex-1"
              maxLength={5}
              disabled={isAdding}
            />
            <Input
              placeholder="Company Name (e.g., Apple)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-500 flex-1"
              disabled={isAdding}
            />
            <Button
              type="submit"
              disabled={isAdding}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold whitespace-nowrap"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Stock
            </Button>
          </form>
        </div>

        {/* Watchlist Table */}
        {watchlist.length === 0 ? (
          <div className="text-center py-16">
            <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-300 mb-2">Your watchlist is empty</h3>
            <p className="text-gray-400 mb-6">Add stocks to start tracking your favorites</p>
          </div>
        ) : (
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700 bg-gray-900/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Symbol</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Company</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Price</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Change</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Added</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {watchlist.map((item) => {
                    const priceData = getPrice(item.symbol);
                    const isPositive = priceData.change >= 0;
                    const addedDate = new Date(item.addedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });

                    return (
                      <tr key={item.symbol} className="border-b border-gray-700 hover:bg-gray-900/50 transition">
                        {/* Symbol */}
                        <td className="px-6 py-4">
                          <span className="text-lg font-bold text-yellow-400">{item.symbol}</span>
                        </td>

                        {/* Company */}
                        <td className="px-6 py-4 text-gray-300">{item.name}</td>

                        {/* Price */}
                        <td className="px-6 py-4 text-right text-white font-semibold">${priceData.price.toFixed(2)}</td>

                        {/* Change */}
                        <td className="px-6 py-4 text-right">
                          <div className={cn('inline-flex items-center gap-1 font-semibold', isPositive ? 'text-green-400' : 'text-red-400')}>
                            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            {isPositive ? '+' : ''}
                            {priceData.change.toFixed(2)}%
                          </div>
                        </td>

                        {/* Added */}
                        <td className="px-6 py-4 text-right text-sm text-gray-400">{addedDate}</td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <Link href={`/stocks/${item.symbol}`}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-gray-600 text-gray-300 hover:border-yellow-500 hover:text-yellow-400"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeStock(item.symbol)}
                              className="border-red-600/50 text-red-400 hover:border-red-500 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Summary Stats */}
        {watchlist.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Total Watched</p>
              <p className="text-3xl font-bold text-white">{watchlist.length}</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Portfolio Value</p>
              <p className="text-3xl font-bold text-white">
                ${watchlist.reduce((sum, item) => sum + getPrice(item.symbol).price, 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-1">Avg. Change</p>
              <p
                className={cn('text-3xl font-bold', (watchlist.reduce((sum, item) => sum + getPrice(item.symbol).change, 0) / watchlist.length) >= 0 ? 'text-green-400' : 'text-red-400')}
              >
                {(watchlist.reduce((sum, item) => sum + getPrice(item.symbol).change, 0) / watchlist.length).toFixed(2)}%
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchlistPage;
