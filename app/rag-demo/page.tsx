'use client';

import React, { useState } from 'react';
import { RAGSearch } from '@/components/RAGSearch';
import { Strategy } from '@/types/global';
import { AlertInfo } from '@/lib/rag/ragClient';

// Mock data for demo
const MOCK_STRATEGIES: Strategy[] = [
  {
    id: 'strat-001',
    userId: 'user-demo-1',
    author: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    },
    title: 'Dividend Value Play',
    description: 'Conservative strategy focusing on dividend-paying stocks with strong fundamentals.',
    conditions: [],
    performance: {
      winRate: 72.5,
      avgReturn: 8.3,
      maxDrawdown: -12.5,
      profitFactor: 2.8,
      bestTrade: 15.2,
      worstTrade: -8.3,
      sharpeRatio: 1.45,
      backtestedFrom: new Date('2022-01-01'),
      backtestedTo: new Date('2024-12-31'),
    },
    isPublic: true,
    subscribers: 521,
    reputation: 94,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-11-20'),
    tags: ['dividend', 'value', 'conservative', 'long-term'],
    riskLevel: 'low',
  },
  {
    id: 'strat-002',
    userId: 'user-demo-2',
    author: {
      name: 'Tech Trader Pro',
      email: 'tech@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tech',
    },
    title: 'Momentum Tech Reversal',
    description: 'A trend-following strategy that identifies momentum reversals in tech stocks using RSI and moving average crosses.',
    conditions: [],
    performance: {
      winRate: 65.3,
      avgReturn: 15.7,
      maxDrawdown: -22.1,
      profitFactor: 3.2,
      bestTrade: 28.5,
      worstTrade: -9.1,
      sharpeRatio: 1.82,
      backtestedFrom: new Date('2022-01-01'),
      backtestedTo: new Date('2024-12-31'),
    },
    isPublic: true,
    subscribers: 342,
    reputation: 87,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-11-18'),
    tags: ['momentum', 'tech', 'rsi', 'medium-risk'],
    riskLevel: 'medium',
  },
  {
    id: 'strat-003',
    userId: 'user-demo-3',
    author: {
      name: 'Alex Kim',
      email: 'alex@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    },
    title: 'Crypto Volume Spike',
    description: 'High-risk strategy capitalizing on sudden volume spikes in major cryptocurrencies.',
    conditions: [],
    performance: {
      winRate: 48.2,
      avgReturn: 32.1,
      maxDrawdown: -45.3,
      profitFactor: 2.1,
      bestTrade: 89.3,
      worstTrade: -23.5,
      sharpeRatio: 0.95,
      backtestedFrom: new Date('2023-01-01'),
      backtestedTo: new Date('2024-12-31'),
    },
    isPublic: true,
    subscribers: 218,
    reputation: 71,
    createdAt: new Date('2024-04-20'),
    updatedAt: new Date('2024-11-15'),
    tags: ['crypto', 'volume', 'aggressive', 'high-risk'],
    riskLevel: 'high',
  },
];

const MOCK_ALERTS: AlertInfo[] = [
  {
    id: 'alert-1',
    type: 'price',
    symbol: 'AAPL',
    priority: 'high',
    message: 'Apple stock crossed above $180 resistance',
    createdAt: new Date(),
  },
  {
    id: 'alert-2',
    type: 'portfolio',
    priority: 'medium',
    message: 'Your portfolio gained 2.3% this week',
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    id: 'alert-3',
    type: 'strategy',
    symbol: 'TSLA',
    priority: 'critical',
    message: 'Momentum Tech Reversal triggered a new signal',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
];

const MOCK_PORTFOLIO = {
  totalValue: 125400,
  dayChange: 2.15,
  weekChange: 5.32,
  monthChange: -1.45,
};

export default function RAGDemoPage() {
  const [activeTab, setActiveTab] = useState<'search' | 'docs'>('search');

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-16 z-40">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white mb-2">RAG (Retrieval-Augmented Generation)</h1>
          <p className="text-gray-400">AI-powered search for your strategies and portfolio data</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('search')}
            className={cn(
              'pb-3 px-4 font-medium transition-colors',
              activeTab === 'search'
                ? 'text-yellow-500 border-b-2 border-yellow-500'
                : 'text-gray-400 hover:text-gray-300'
            )}
          >
            Interactive Search
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={cn(
              'pb-3 px-4 font-medium transition-colors',
              activeTab === 'docs'
                ? 'text-yellow-500 border-b-2 border-yellow-500'
                : 'text-gray-400 hover:text-gray-300'
            )}
          >
            Documentation
          </button>
        </div>

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="max-w-3xl mx-auto">
            <RAGSearch
              strategies={MOCK_STRATEGIES}
              portfolio={MOCK_PORTFOLIO}
              alerts={MOCK_ALERTS}
              placeholder="Ask about your strategies, portfolio, or trading insights..."
            />
          </div>
        )}

        {/* Documentation Tab */}
        {activeTab === 'docs' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <section className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">What is RAG?</h2>
              <p className="text-gray-300 mb-4">
                <strong>Retrieval-Augmented Generation (RAG)</strong> combines information retrieval with language generation
                to provide contextually relevant answers. In Quantevo, it works by:
              </p>
              <ol className="list-decimal list-inside text-gray-300 space-y-2 ml-2">
                <li><strong>Retrieval:</strong> Finding relevant strategies and portfolio data matching your query</li>
                <li><strong>Augmentation:</strong> Enriching the context with real metrics and performance data</li>
                <li><strong>Generation:</strong> Creating insightful, data-backed recommendations</li>
              </ol>
            </section>

            <section className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-900 rounded p-4 border border-gray-700">
                  <h3 className="text-yellow-500 font-semibold mb-2">📊 Strategy Search</h3>
                  <p className="text-gray-400 text-sm">
                    Find strategies by title, description, tags, or risk level. Get instant access to performance metrics.
                  </p>
                </div>
                <div className="bg-gray-900 rounded p-4 border border-gray-700">
                  <h3 className="text-yellow-500 font-semibold mb-2">💼 Portfolio Analysis</h3>
                  <p className="text-gray-400 text-sm">
                    Get insights into your portfolio performance across different time horizons.
                  </p>
                </div>
                <div className="bg-gray-900 rounded p-4 border border-gray-700">
                  <h3 className="text-yellow-500 font-semibold mb-2">⚡ Smart Recommendations</h3>
                  <p className="text-gray-400 text-sm">
                    Receive tailored strategy recommendations based on your risk preferences and query context.
                  </p>
                </div>
                <div className="bg-gray-900 rounded p-4 border border-gray-700">
                  <h3 className="text-yellow-500 font-semibold mb-2">🔍 Source Attribution</h3>
                  <p className="text-gray-400 text-sm">
                    See exactly which data sources powered each response with confidence scoring.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Example Queries</h2>
              <div className="space-y-3">
                <div className="bg-gray-900 rounded p-3 border-l-4 border-yellow-500">
                  <p className="text-yellow-500 font-mono text-sm mb-1">Q: "Recommend a strategy for me"</p>
                  <p className="text-gray-400 text-sm">
                    Returns the best-performing strategy matching your profile with key metrics.
                  </p>
                </div>
                <div className="bg-gray-900 rounded p-3 border-l-4 border-yellow-500">
                  <p className="text-yellow-500 font-mono text-sm mb-1">Q: "Show my portfolio performance"</p>
                  <p className="text-gray-400 text-sm">
                    Displays portfolio metrics across daily, weekly, and monthly timeframes.
                  </p>
                </div>
                <div className="bg-gray-900 rounded p-3 border-l-4 border-yellow-500">
                  <p className="text-yellow-500 font-mono text-sm mb-1">Q: "What are high-risk strategies?"</p>
                  <p className="text-gray-400 text-sm">
                    Filters and presents aggressive strategies with their performance data.
                  </p>
                </div>
                <div className="bg-gray-900 rounded p-3 border-l-4 border-yellow-500">
                  <p className="text-yellow-500 font-mono text-sm mb-1">Q: "Best momentum strategies"</p>
                  <p className="text-gray-400 text-sm">
                    Finds strategies tagged with momentum and sorts by win rate and return.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Implementation</h2>
              <div className="bg-gray-900 rounded p-4 border border-gray-700">
                <p className="text-gray-400 text-sm mb-3 font-mono">
                  Using the useRAG hook in your components:
                </p>
                <pre className="text-xs text-gray-300 overflow-x-auto">
{`import { useRAG } from '@/hooks/useRAG';

const { query, response, isLoading, submitQuery } = useRAG({
  strategies,
  portfolio,
  alerts,
});`}
                </pre>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
