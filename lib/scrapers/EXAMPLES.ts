/**
 * Usage Examples for Quantevo Web Scraping
 * 
 * This file demonstrates how to use the scraping functionality
 * in various parts of the application.
 */

// ============================================================================
// EXAMPLE 1: Scraping a single stock price
// ============================================================================

/*
import { scrapeStockPrice } from '@/lib/scrapers/stockScraper';
import { withRetryAndTimeout } from '@/lib/scrapers/withRetry';
import { scraperLogger } from '@/lib/scrapers/scraperLogger';

async function getStockPrice(symbol: string) {
  try {
    scraperLogger.logStart('stock-lookup', { symbol });
    
    const data = await withRetryAndTimeout(
      () => scrapeStockPrice(symbol),
      { maxRetries: 3, baseDelay: 1000 },
      10000
    );
    
    scraperLogger.logSuccess('stock-lookup', undefined, { symbol });
    return data;
  } catch (error) {
    scraperLogger.logError('stock-lookup', error);
    throw error;
  }
}

// Usage
const appleStock = await getStockPrice('AAPL');
console.log(`AAPL: $${appleStock.price}`);
*/

// ============================================================================
// EXAMPLE 2: Scraping multiple stocks in parallel
// ============================================================================

/*
import { scrapeMultipleStocks } from '@/lib/scrapers/stockScraper';
import { withRetryAndTimeout } from '@/lib/scrapers/withRetry';

async function getPortfolioData(symbols: string[]) {
  const stocks = await withRetryAndTimeout(
    () => scrapeMultipleStocks(symbols),
    { maxRetries: 2, baseDelay: 1000 },
    15000
  );
  
  return stocks;
}

// Usage
const myStocks = await getPortfolioData(['AAPL', 'GOOGL', 'MSFT', 'AMZN']);
const totalValue = myStocks.reduce((sum, stock) => sum + stock.price, 0);
*/

// ============================================================================
// EXAMPLE 3: Using cache to avoid repeated scraping
// ============================================================================

/*
import { stockPriceCache } from '@/lib/scrapers/scraperCache';
import { scrapeStockPrice } from '@/lib/scrapers/stockScraper';
import { scraperLogger } from '@/lib/scrapers/scraperLogger';

async function getStockPriceWithCache(symbol: string) {
  const cacheKey = `stock-${symbol}`;
  
  // Check cache first
  const cached = stockPriceCache.get(cacheKey);
  if (cached) {
    scraperLogger.logCacheHit('stock-lookup', { symbol });
    return cached;
  }
  
  scraperLogger.logCacheMiss('stock-lookup', { symbol });
  
  // If not cached, scrape and cache
  const data = await scrapeStockPrice(symbol);
  stockPriceCache.set(cacheKey, data, 300); // Cache for 5 minutes
  
  return data;
}

// Usage
const stock1 = await getStockPriceWithCache('AAPL'); // Scrapes
const stock2 = await getStockPriceWithCache('AAPL'); // From cache
*/

// ============================================================================
// EXAMPLE 4: Using the API endpoint directly
// ============================================================================

/*
// Single stock
const response = await fetch('/api/scrape/stock?symbol=AAPL');
const data = await response.json();
console.log(`AAPL: $${data.price}`);

// Multiple stocks
const response = await fetch('/api/scrape/stocks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ symbols: ['AAPL', 'GOOGL', 'MSFT'] })
});
const stocks = await response.json();
*/

// ============================================================================
// EXAMPLE 5: Integration with React component
// ============================================================================

/*
'use client';

import { useState, useEffect } from 'react';
import { StockData } from '@/lib/scrapers/stockScraper';

export function StockPriceWidget({ symbol }: { symbol: string }) {
  const [stock, setStock] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/scrape/stock?symbol=${symbol}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch stock price');
        }
        
        const data = await response.json();
        setStock(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setStock(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchPrice, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [symbol]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!stock) return <div>No data</div>;

  return (
    <div>
      <h3>{stock.symbol}</h3>
      <p>Price: ${stock.price}</p>
      <p>Change: {stock.changePercent > 0 ? '+' : ''}{stock.changePercent}%</p>
    </div>
  );
}

// Usage in parent component
export function Dashboard() {
  return (
    <div>
      <StockPriceWidget symbol="AAPL" />
      <StockPriceWidget symbol="GOOGL" />
    </div>
  );
}
*/

// ============================================================================
// EXAMPLE 6: Monitoring scraper performance
// ============================================================================

/*
import { scraperLogger } from '@/lib/scrapers/scraperLogger';

async function monitorScrapingPerformance() {
  // Get statistics
  const stats = scraperLogger.getStats();
  
  console.log('Scraper Statistics:');
  console.log(`Total Events: ${stats.totalEvents}`);
  console.log(`Successful: ${stats.successCount}`);
  console.log(`Failed: ${stats.errorCount}`);
  console.log(`Retries: ${stats.retryCount}`);
  console.log(`Average Duration: ${stats.averageDuration.toFixed(2)}ms`);
  
  // Get errors
  const errors = scraperLogger.getEventsByType('error');
  console.log(`\nErrors: ${errors.length}`);
  errors.forEach(e => console.log(`  - ${e.source}: ${e.error}`));
}

// Usage
await monitorScrapingPerformance();
*/

// ============================================================================
// EXAMPLE 7: Setting up automatic rate limiting
// ============================================================================

/*
import { delay } from '@/lib/scrapers/withRetry';
import { scrapeStockPrice } from '@/lib/scrapers/stockScraper';
import { getScraperConfig } from '@/lib/scrapers/config';

async function scrapeWithRateLimit(symbols: string[]) {
  const config = getScraperConfig();
  const results = [];
  
  for (const symbol of symbols) {
    const data = await scrapeStockPrice(symbol);
    results.push(data);
    
    // Add delay to respect rate limits
    if (symbol !== symbols[symbols.length - 1]) {
      await delay(config.rateLimitDelay);
    }
  }
  
  return results;
}

// Usage
const stocks = await scrapeWithRateLimit(['AAPL', 'GOOGL', 'MSFT']);
*/

export const EXAMPLES_DOCUMENTED = true;
