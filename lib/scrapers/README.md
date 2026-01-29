# Quantevo Web Scraper Module

A comprehensive, production-ready web scraping solution for the Quantevo trading application. Built with TypeScript, featuring retry logic, caching, rate limiting, and detailed logging.

## Quick Start

### Installation

The scraper module uses the following dependencies. Make sure they're installed:

```bash
npm install axios
```

### Basic Usage

```typescript
import { scrapeStockPrice } from '@/lib/scrapers/stockScraper';

const stock = await scrapeStockPrice('AAPL');
console.log(`${stock.symbol}: $${stock.price}`);
```

### API Endpoints

#### GET `/api/scrape/stock?symbol=AAPL`

Fetches stock price data for a single symbol.

**Response:**
```json
{
  "symbol": "AAPL",
  "price": 150.25,
  "change": 2.50,
  "changePercent": 1.69,
  "timestamp": "2026-01-28T10:30:00.000Z",
  "source": "financialmodelingprep"
}
```

#### POST `/api/scrape/stocks`

Fetches stock price data for multiple symbols in parallel.

**Request:**
```json
{
  "symbols": ["AAPL", "GOOGL", "MSFT"]
}
```

**Response:**
```json
{
  "data": [
    { "symbol": "AAPL", "price": 150.25, ... },
    { "symbol": "GOOGL", "price": 2850.00, ... },
    { "symbol": "MSFT", "price": 375.50, ... }
  ],
  "count": 3,
  "timestamp": "2026-01-28T10:30:00.000Z"
}
```

## Module Structure

```
lib/scrapers/
├── stockScraper.ts       # Core scraping functionality
├── withRetry.ts          # Retry logic with exponential backoff
├── scraperCache.ts       # In-memory cache for results
├── scraperLogger.ts      # Event logging and monitoring
├── config.ts             # Configuration management
└── EXAMPLES.ts           # Usage examples
```

## Core Features

### 1. Robust Stock Scraping

- Validates symbol format (1-5 alphanumeric characters)
- Fetches real-time stock data from financial APIs
- Handles data parsing and validation
- Sanitizes HTML content

```typescript
import { scrapeStockPrice } from '@/lib/scrapers/stockScraper';

const data = await scrapeStockPrice('AAPL');
```

### 2. Automatic Retry with Exponential Backoff

Handles transient failures gracefully with configurable retry strategies:

```typescript
import { withRetry, withRetryAndTimeout } from '@/lib/scrapers/withRetry';

const result = await withRetry(() => scrapeStockPrice('AAPL'), {
  maxRetries: 5,
  baseDelay: 1000,
  maxDelay: 30000,
  onRetry: (attempt, error) => console.log(`Attempt ${attempt}: ${error.message}`)
});
```

**Retry Options:**
- `maxRetries`: Maximum number of retry attempts (default: 3)
- `baseDelay`: Initial delay in milliseconds (default: 1000)
- `maxDelay`: Maximum delay cap (default: 30000)
- `backoffMultiplier`: Exponential multiplier (default: 2)
- `onRetry`: Callback function for retry events

### 3. Intelligent Caching

Cache scraping results to minimize API calls:

```typescript
import { stockPriceCache } from '@/lib/scrapers/scraperCache';
import { scrapeStockPrice } from '@/lib/scrapers/stockScraper';

async function getCachedPrice(symbol: string) {
  const cached = stockPriceCache.get(`stock-${symbol}`);
  if (cached) return cached;
  
  const data = await scrapeStockPrice(symbol);
  stockPriceCache.set(`stock-${symbol}`, data, 300); // Cache for 5 minutes
  return data;
}
```

**Cache Methods:**
- `get(key)`: Retrieve cached value (null if expired)
- `set(key, data, ttlSeconds)`: Store with optional TTL
- `has(key)`: Check if key exists and is valid
- `delete(key)`: Remove entry
- `clear()`: Clear all entries
- `cleanup()`: Remove expired entries

### 4. Comprehensive Logging

Track scraping operations with detailed event logging:

```typescript
import { scraperLogger } from '@/lib/scrapers/scraperLogger';

scraperLogger.logStart('my-operation');
scraperLogger.logSuccess('my-operation', duration);
scraperLogger.logError('my-operation', error);
scraperLogger.logRetry('my-operation', attempt, error);
scraperLogger.logCacheHit('my-operation');
scraperLogger.logCacheMiss('my-operation');

// Get statistics
const stats = scraperLogger.getStats();
console.log(`Success Rate: ${stats.successCount / stats.totalEvents * 100}%`);
```

**Logger Methods:**
- `logStart(source, metadata?)`: Log operation start
- `logSuccess(source, duration?, metadata?)`: Log successful completion
- `logError(source, error, metadata?)`: Log error
- `logRetry(source, attempt, error?, metadata?)`: Log retry attempt
- `logCacheHit(source, metadata?)`: Log cache hit
- `logCacheMiss(source, metadata?)`: Log cache miss
- `getStats()`: Get performance statistics
- `getEvents()`: Get all logged events
- `getEventsByType(type)`: Filter events by type
- `getEventsBySource(source)`: Filter events by source

### 5. Configuration Management

Centralized configuration for all scraping operations:

```typescript
import { getScraperConfig, setScraperConfig } from '@/lib/scrapers/config';

// Get current configuration
const config = getScraperConfig();

// Update configuration
setScraperConfig({
  rateLimitDelay: 1000,
  cacheEnabled: true,
  debugMode: true
});
```

**Configuration Options:**
- `rateLimitDelay`: Milliseconds between requests
- `maxConcurrentRequests`: Parallel request limit
- `requestTimeout`: Request timeout in ms
- `maxRetries`: Default retry attempts
- `cacheEnabled`: Enable caching
- `cacheTTL`: Cache duration in seconds
- `loggingEnabled`: Enable logging
- `debugMode`: Debug logging level
- `apiKeys`: API credentials

## Advanced Usage

### Parallel Stock Scraping

```typescript
import { scrapeMultipleStocks } from '@/lib/scrapers/stockScraper';

const stocks = await scrapeMultipleStocks(['AAPL', 'GOOGL', 'MSFT']);
```

### Combined Retry and Timeout

```typescript
import { withRetryAndTimeout } from '@/lib/scrapers/withRetry';

const data = await withRetryAndTimeout(
  () => scrapeStockPrice('AAPL'),
  { maxRetries: 3, baseDelay: 1000 },
  10000 // 10 second timeout
);
```

### React Component Integration

```typescript
'use client';

import { useEffect, useState } from 'react';
import { StockData } from '@/lib/scrapers/stockScraper';

export function StockCard({ symbol }: { symbol: string }) {
  const [stock, setStock] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const response = await fetch(`/api/scrape/stock?symbol=${symbol}`);
      const data = await response.json();
      setStock(data);
      setLoading(false);
    };

    fetch();
  }, [symbol]);

  if (loading) return <div>Loading...</div>;
  if (!stock) return <div>Error</div>;

  return (
    <div>
      <h3>{stock.symbol}</h3>
      <p>${stock.price.toFixed(2)}</p>
      <p style={{ color: stock.change >= 0 ? 'green' : 'red' }}>
        {stock.change >= 0 ? '+' : ''}{stock.change}
      </p>
    </div>
  );
}
```

## Error Handling

The scraper includes comprehensive error handling:

```typescript
import { scrapeStockPrice } from '@/lib/scrapers/stockScraper';
import { scraperLogger } from '@/lib/scrapers/scraperLogger';

try {
  const data = await scrapeStockPrice('INVALID');
} catch (error) {
  scraperLogger.logError('stock-scraper', error);
  // Handle error appropriately
}
```

## Performance Optimization

### Rate Limiting

```typescript
import { delay } from '@/lib/scrapers/withRetry';
import { scrapeStockPrice } from '@/lib/scrapers/stockScraper';

for (const symbol of symbols) {
  const data = await scrapeStockPrice(symbol);
  await delay(500); // 500ms between requests
}
```

### Caching Strategy

```typescript
import { stockPriceCache } from '@/lib/scrapers/scraperCache';

// Clean up expired entries periodically
setInterval(() => {
  const removed = stockPriceCache.cleanup();
  console.log(`Cleaned up ${removed} expired entries`);
}, 60000); // Every minute
```

## Environment Variables

Create a `.env.local` file with optional API keys:

```env
# Scraper API Keys (optional)
FINNHUB_API_KEY=your_api_key
ALPHA_VANTAGE_API_KEY=your_api_key
POLYGON_IO_API_KEY=your_api_key

# Scraper Settings
SCRAPER_LOG_ENABLED=true
NODE_ENV=development
```

## Legal & Ethical Considerations

- ✅ Always respect website `robots.txt`
- ✅ Follow website terms of service
- ✅ Use official APIs when available
- ✅ Implement appropriate rate limiting
- ✅ Cache results to minimize requests
- ✅ Use proper User-Agent headers
- ❌ Don't bypass authentication or paywalls
- ❌ Don't scrape excessive amounts of data
- ❌ Don't collect personal information
- ❌ Don't impersonate users

## Troubleshooting

### Request Timeouts

Increase the timeout duration:
```typescript
await withRetryAndTimeout(fn, options, 20000); // 20 seconds
```

### Cache Not Working

Ensure cache is enabled in configuration:
```typescript
setScraperConfig({ cacheEnabled: true, cacheTTL: 600 });
```

### Retry Loop

Adjust retry settings if experiencing excessive retries:
```typescript
withRetry(fn, { maxRetries: 2, baseDelay: 500 })
```

## Best Practices

1. **Always use retry logic** for network operations
2. **Implement caching** to reduce API calls
3. **Log events** for monitoring and debugging
4. **Validate input** before scraping
5. **Handle errors gracefully** with appropriate fallbacks
6. **Respect rate limits** with delays between requests
7. **Monitor performance** using logger statistics
8. **Use configuration** for environment-specific settings

## Integration Points

### MarketDataCard Component
Update with real-time scrapped data:
```typescript
const stockData = await scrapeStockPrice('AAPL');
// Use stockData in component
```

### Alerts System
Trigger alerts based on scrapped price thresholds:
```typescript
const stock = await scrapeStockPrice('AAPL');
if (stock.price > alertThreshold) {
  triggerAlert(stock);
}
```

### PortfolioTracker
Fetch current portfolio values:
```typescript
const stocks = await scrapeMultipleStocks(portfolioSymbols);
updatePortfolioValue(stocks);
```

## Contributing

When adding new scraper features:

1. Add core functionality to appropriate module
2. Include error handling and validation
3. Add logging statements using `scraperLogger`
4. Document with JSDoc comments
5. Include usage examples
6. Test with retry and timeout utilities

## Resources

- [Financial Modeling Prep](https://financialmodelingprep.com/)
- [Alpha Vantage](https://www.alphavantage.co/)
- [Finnhub](https://finnhub.io/)
- [Polygon.io](https://polygon.io/)
- [Web Scraping Ethics](./WEB_SCRAPING.md)

## License

This module is part of the Quantevo project.

---

**Last Updated**: January 28, 2026
**Version**: 1.0.0
