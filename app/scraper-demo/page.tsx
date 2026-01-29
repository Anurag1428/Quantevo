'use client';

import { useState } from 'react';
import { LiveMarketData } from '@/components/LiveMarketData';
import { LivePortfolioTracker } from '@/components/LivePortfolioTracker';

/**
 * Example page showing scraper integration
 * You can copy this to create your own pages
 */

export default function ScraperDemoPage() {
  const [activeTab, setActiveTab] = useState<'market' | 'portfolio'>('market');

  const watchlistSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN'];

  const portfolioHoldings = [
    { symbol: 'AAPL', quantity: 10, purchasePrice: 150 },
    { symbol: 'MSFT', quantity: 5, purchasePrice: 300 },
    { symbol: 'GOOGL', quantity: 3, purchasePrice: 2500 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Scraper Integration Demo</h1>
          <p className="text-gray-400">
            Live market data and portfolio tracking using the Quantevo scraper
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('market')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'market'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Live Market Data
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'portfolio'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Portfolio Tracker
          </button>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'market' && (
            <div className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-400 mb-1">💡 About this demo</h3>
                <p className="text-sm text-gray-300">
                  This component fetches live stock prices from financial APIs and displays them with auto-refresh.
                  The component handles loading states, errors, and provides a manual refresh button.
                </p>
              </div>
              <LiveMarketData 
                symbols={watchlistSymbols}
                refreshInterval={300000} // 5 minutes
              />
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="space-y-4">
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-purple-400 mb-1">💡 About this demo</h3>
                <p className="text-sm text-gray-300">
                  This component combines portfolio holdings with live pricing data to calculate real-time gain/loss.
                  It shows your total invested amount, current value, and detailed position analytics.
                </p>
              </div>
              <LivePortfolioTracker 
                holdings={portfolioHoldings}
                refreshInterval={300000} // 5 minutes
              />
            </div>
          )}
        </div>

        {/* Code Examples */}
        <div className="mt-12 bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">📝 Code Example</h3>
          
          {activeTab === 'market' ? (
            <CodeBlock
              language="tsx"
              code={`import { LiveMarketData } from '@/components/LiveMarketData';

export default function Page() {
  return (
    <LiveMarketData 
      symbols={['AAPL', 'MSFT', 'GOOGL', 'AMZN']}
      refreshInterval={300000} // 5 minutes
    />
  );
}`}
            />
          ) : (
            <CodeBlock
              language="tsx"
              code={`import { LivePortfolioTracker } from '@/components/LivePortfolioTracker';

interface PortfolioHolding {
  symbol: string;
  quantity: number;
  purchasePrice: number;
}

const holdings: PortfolioHolding[] = [
  { symbol: 'AAPL', quantity: 10, purchasePrice: 150 },
  { symbol: 'MSFT', quantity: 5, purchasePrice: 300 },
];

export default function Page() {
  return (
    <LivePortfolioTracker 
      holdings={holdings}
      refreshInterval={300000}
    />
  );
}`}
            />
          )}
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/SCRAPER_INTEGRATION.md"
            className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 transition"
          >
            <h4 className="font-semibold mb-1">📚 Integration Guide</h4>
            <p className="text-sm text-gray-400">Learn how to use the scraper in your components</p>
          </a>
          <a
            href="/lib/scrapers/README.md"
            className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 transition"
          >
            <h4 className="font-semibold mb-1">🔧 Scraper API</h4>
            <p className="text-sm text-gray-400">Complete API documentation and examples</p>
          </a>
          <a
            href="/api/scrape/stock?symbol=AAPL"
            target="_blank"
            className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 transition"
          >
            <h4 className="font-semibold mb-1">⚡ API Endpoints</h4>
            <p className="text-sm text-gray-400">Test the scraper API directly</p>
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * Code block component for displaying code examples
 */
function CodeBlock({ language, code }: { language: string; code: string }) {
  return (
    <div className="bg-gray-900 rounded p-4 overflow-x-auto">
      <pre className="text-sm text-gray-300">
        <code>{code}</code>
      </pre>
      <button
        onClick={() => {
          navigator.clipboard.writeText(code);
          alert('Code copied to clipboard!');
        }}
        className="mt-2 text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded transition"
      >
        Copy Code
      </button>
    </div>
  );
}
