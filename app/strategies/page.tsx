'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import StrategyCard from '@/components/StrategyCard';
import { getPublicStrategies, subscribeToStrategy } from '@/lib/actions/strategies';
import { Search, Plus, Filter } from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const StrategiesPage = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [filteredStrategies, setFilteredStrategies] = useState<Strategy[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [sortBy, setSortBy] = useState<'reputation' | 'subscribers' | 'recent'>('reputation');
  const [isLoading, setIsLoading] = useState(true);
  const [subscribedStrategies, setSubscribedStrategies] = useState<Set<string>>(new Set());
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    const fetchStrategies = async () => {
      setIsLoading(true);
      const result = await getPublicStrategies({
        riskLevel: riskFilter !== 'all' ? riskFilter : undefined,
        sortBy,
      });

      if (result.success && result.data) {
        setStrategies(result.data);
        setFilteredStrategies(result.data);
      } else {
        toast.error('Failed to load strategies');
      }
      setIsLoading(false);
    };

    fetchStrategies();
  }, [riskFilter, sortBy]);

  // Filter by search query
  useEffect(() => {
    const filtered = strategies.filter(
      (s) =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredStrategies(filtered);
  }, [searchQuery, strategies]);

  const handleSubscribe = async (strategyId: string) => {
    if (subscribedStrategies.has(strategyId)) return;

    setIsSubscribing(true);
    const result = await subscribeToStrategy('user-demo', strategyId); // Replace with actual user ID

    if (result.success) {
      setSubscribedStrategies((prev) => new Set([...prev, strategyId]));
      toast.success('Successfully subscribed to strategy');

      // Update strategies with new subscriber count
      setStrategies((prev) =>
        prev.map((s) => (s.id === strategyId ? { ...s, subscribers: s.subscribers + 1 } : s))
      );
    } else {
      toast.error(result.error || 'Failed to subscribe');
    }
    setIsSubscribing(false);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="sticky top-16 bg-gray-900 border-b border-gray-700 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Strategy Marketplace</h1>
              <p className="text-gray-400">Discover, subscribe, and learn from proven trading strategies</p>
            </div>
            <Link href="/strategies/create">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Publish Strategy
              </Button>
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
              <Input
                placeholder="Search strategies by title, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
              />
            </div>

            {/* Risk Filter */}
            <Select value={riskFilter} onValueChange={(val: any) => setRiskFilter(val)}>
              <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="all" className="text-white focus:bg-gray-700">
                  All Levels
                </SelectItem>
                <SelectItem value="low" className="text-white focus:bg-gray-700">
                  Low Risk
                </SelectItem>
                <SelectItem value="medium" className="text-white focus:bg-gray-700">
                  Medium Risk
                </SelectItem>
                <SelectItem value="high" className="text-white focus:bg-gray-700">
                  High Risk
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
              <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="reputation" className="text-white focus:bg-gray-700">
                  Reputation
                </SelectItem>
                <SelectItem value="subscribers" className="text-white focus:bg-gray-700">
                  Subscribers
                </SelectItem>
                <SelectItem value="recent" className="text-white focus:bg-gray-700">
                  Recently Added
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-400">
              <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              Loading strategies...
            </div>
          </div>
        ) : filteredStrategies.length === 0 ? (
          <div className="text-center py-16">
            <Filter className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No strategies found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setRiskFilter('all');
              }}
              variant="outline"
              className="border-gray-600 text-gray-300"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <>
            <p className="text-gray-400 mb-6">
              Showing {filteredStrategies.length} of {strategies.length} strategies
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStrategies.map((strategy) => (
                <StrategyCard
                  key={strategy.id}
                  strategy={strategy}
                  onSubscribe={handleSubscribe}
                  isSubscribed={subscribedStrategies.has(strategy.id)}
                  isLoading={isSubscribing}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StrategiesPage;
