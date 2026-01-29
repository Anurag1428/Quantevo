# Scraper Integration Guide

This guide shows how to use the new scraper components and hooks in your Quantevo application.

## Components

### 1. LiveMarketData Component

Displays live stock prices with auto-refresh.

```tsx
import { LiveMarketData } from '@/components/LiveMarketData';

export function MyDashboard() {
  return (
    <LiveMarketData 
      symbols={['AAPL', 'GOOGL', 'MSFT']}
      refreshInterval={300000} // 5 minutes
    />
  );
}
```

**Props:**
- `symbols: string[]` - Stock symbols to display
- `refreshInterval?: number` - Auto-refresh interval in ms (default: 300000)
- `onError?: (error: Error) => void` - Error callback

**Features:**
- ✅ Automatic data refresh
- ✅ Manual refresh button
- ✅ Error handling with visual feedback
- ✅ Loading states
- ✅ Color-coded gains/losses

---

### 2. LivePortfolioTracker Component

Live portfolio tracking with real-time pricing and gain/loss calculations.

```tsx
import { LivePortfolioTracker } from '@/components/LivePortfolioTracker';

interface PortfolioHolding {
  symbol: string;
  quantity: number;
  purchasePrice: number;
}

const holdings: PortfolioHolding[] = [
  { symbol: 'AAPL', quantity: 50, purchasePrice: 120 },
  { symbol: 'GOOGL', quantity: 20, purchasePrice: 2500 },
];

export function Portfolio() {
  return (
    <LivePortfolioTracker 
      holdings={holdings}
      refreshInterval={300000}
    />
  );
}
```

**Props:**
- `holdings: PortfolioHolding[]` - Your stock holdings
- `portfolioData?: Array<{date, value, gain}>` - Historical data (optional)
- `refreshInterval?: number` - Auto-refresh in ms (default: 300000)

**Features:**
- ✅ Real-time pricing
- ✅ Automatic gain/loss calculations
- ✅ Cost basis tracking
- ✅ Total portfolio summary
- ✅ Historical performance chart
- ✅ Detailed holdings table

---

## Hooks

### 1. useScraperStock Hook

Fetch stock data in any component.

```tsx
'use client';

import { useScraperStock } from '@/hooks/useScraper';

// Single stock
export function StockPrice({ symbol }: { symbol: string }) {
  const { data, loading, error, refetch } = useScraperStock({ symbol });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data || Array.isArray(data)) return null;

  return (
    <div>
      <h3>{data.symbol}</h3>
      <p>${data.price}</p>
      <button onClick={() => refetch()}>Refresh</button>
    </div>
  );
}

// Multiple stocks
export function StockPrices({ symbols }: { symbols: string[] }) {
  const { data, loading, error } = useScraperStock({ symbols });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data || !Array.isArray(data)) return null;

  return (
    <div>
      {data.map(stock => (
        <div key={stock.symbol}>
          <span>{stock.symbol}: ${stock.price}</span>
        </div>
      ))}
    </div>
  );
}
```

**Options:**
- `symbol?: string` - Single stock symbol
- `symbols?: string[]` - Multiple symbols
- `enabled?: boolean` - Enable/disable fetching (default: true)
- `refreshInterval?: number` - Auto-refresh in ms (default: 0 = no refresh)
- `onError?: (error: Error) => void` - Error callback

**Returns:**
- `data` - Stock data (null | StockData | StockData[])
- `loading` - Loading state
- `error` - Error message
- `refetch` - Manual refresh function
- `lastUpdated` - Timestamp of last update

---

### 2. useScraperStockWithCache Hook

Like useScraperStock but with client-side caching.

```tsx
'use client';

import { useScraperStockWithCache } from '@/hooks/useScraper';

export function CachedStock({ symbol }: { symbol: string }) {
  const { data, lastUpdated } = useScraperStockWithCache({
    symbol,
    cacheDuration: 300000, // Cache for 5 minutes
  });

  if (!data || Array.isArray(data)) return null;

  return (
    <div>
      <h3>{data.symbol}</h3>
      <p>${data.price}</p>
      <small>Cached: {lastUpdated?.toLocaleTimeString()}</small>
    </div>
  );
}
```

**Additional Options:**
- `cacheDuration?: number` - Cache duration in ms (default: 300000)

---

## Integration Examples

### Example 1: Update Dashboard with Live Prices

**File:** `app/(root)/dashboard/page.tsx`

```tsx
import { LiveMarketData } from '@/components/LiveMarketData';

export default function DashboardPage() {
  const watchlistSymbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA'];

  return (
    <div className="space-y-6">
      <h1>Dashboard</h1>
      <LiveMarketData symbols={watchlistSymbols} />
    </div>
  );
}
```

---

### Example 2: Portfolio Page with Live Tracking

**File:** `app/(root)/portfolio/page.tsx`

```tsx
'use client';

import { LivePortfolioTracker } from '@/components/LivePortfolioTracker';

export default function PortfolioPage() {
  const myHoldings = [
    { symbol: 'AAPL', quantity: 50, purchasePrice: 120 },
    { symbol: 'MSFT', quantity: 30, purchasePrice: 300 },
    { symbol: 'GOOGL', quantity: 10, purchasePrice: 2500 },
  ];

  return (
    <div>
      <LivePortfolioTracker holdings={myHoldings} />
    </div>
  );
}
```

---

### Example 3: Watchlist with Real-time Updates

**File:** `components/Watchlist.tsx`

```tsx
'use client';

import { useState } from 'react';
import { LiveMarketData } from '@/components/LiveMarketData';

export function Watchlist() {
  const [symbols, setSymbols] = useState<string[]>(['AAPL', 'GOOGL']);

  const addSymbol = (symbol: string) => {
    if (!symbols.includes(symbol)) {
      setSymbols([...symbols, symbol]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Add symbol..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const input = e.currentTarget.value.toUpperCase();
              addSymbol(input);
              e.currentTarget.value = '';
            }
          }}
        />
      </div>
      <LiveMarketData symbols={symbols} refreshInterval={60000} />
    </div>
  );
}
```

---

### Example 4: Custom Stock Card with Hook

**File:** `components/CustomStockCard.tsx`

```tsx
'use client';

import { useScraperStock } from '@/hooks/useScraper';

export function CustomStockCard({ symbol }: { symbol: string }) {
  const { data, loading, error, refetch, lastUpdated } = useScraperStock({
    symbol,
    refreshInterval: 300000, // Refresh every 5 minutes
  });

  if (loading) return <div className="animate-pulse">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!data || Array.isArray(data)) return null;

  const isUp = data.change >= 0;

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg">{data.symbol}</h3>
          <p className="text-gray-600">${data.price.toFixed(2)}</p>
        </div>
        <button
          onClick={() => refetch()}
          className="text-xs px-2 py-1 bg-blue-500 text-white rounded"
        >
          Refresh
        </button>
      </div>
      
      <div className={`mt-2 text-sm ${isUp ? 'text-green-600' : 'text-red-600'}`}>
        {isUp ? '▲' : '▼'} {data.change.toFixed(2)} ({data.changePercent.toFixed(2)}%)
      </div>

      <p className="text-xs text-gray-400 mt-2">
        {lastUpdated?.toLocaleTimeString()}
      </p>
    </div>
  );
}
```

---

### Example 5: Alert Trigger on Price Movement

**File:** `components/PriceAlert.tsx`

```tsx
'use client';

import { useEffect } from 'react';
import { useScraperStock } from '@/hooks/useScraper';

interface PriceAlertProps {
  symbol: string;
  targetPrice: number;
  onAlert?: () => void;
}

export function PriceAlert({ symbol, targetPrice, onAlert }: PriceAlertProps) {
  const { data } = useScraperStock({
    symbol,
    refreshInterval: 60000, // Check every minute
  });

  useEffect(() => {
    if (!data || Array.isArray(data)) return;

    if (data.price >= targetPrice) {
      onAlert?.();
      // Trigger notification
      console.log(`Alert! ${symbol} reached $${data.price}`);
    }
  }, [data, symbol, targetPrice, onAlert]);

  return null; // This component handles logic, no UI needed
}
```

---

## API Endpoints Used

### GET /api/scrape/stock?symbol=AAPL

Fetch single stock data.

**Response:**
```json
{
  "symbol": "AAPL",
  "price": 150.25,
  "change": 2.50,
  "changePercent": 1.69,
  "timestamp": "2026-01-29T10:30:00.000Z",
  "source": "financialmodelingprep"
}
```

### POST /api/scrape/stocks

Fetch multiple stocks.

**Request:**
```json
{ "symbols": ["AAPL", "GOOGL", "MSFT"] }
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
  "timestamp": "2026-01-29T10:30:00.000Z"
}
```

---

## Best Practices

1. **Use appropriate refresh intervals**
   ```tsx
   // Dashboard: 5 minutes
   <LiveMarketData symbols={symbols} refreshInterval={300000} />
   
   // Alert system: 1 minute
   useScraperStock({ symbol, refreshInterval: 60000 })
   
   // High-frequency tracking: 30 seconds
   useScraperStock({ symbol, refreshInterval: 30000 })
   ```

2. **Disable auto-refresh when not needed**
   ```tsx
   const { data, refetch } = useScraperStock({ 
     symbol, 
     refreshInterval: 0 // Manual only
   });
   ```

3. **Handle errors gracefully**
   ```tsx
   const { error } = useScraperStock({ 
     symbol,
     onError: (err) => {
       console.error('Failed to fetch:', err);
      // Show user-friendly message
    }
   });
   ```

4. **Use caching for frequently accessed symbols**
   ```tsx
   // Better for multiple components accessing same symbol
   useScraperStockWithCache({ symbol, cacheDuration: 300000 })
   ```

5. **Limit concurrent requests**
   - The scraper API limits to 50 symbols per request
   - Batch requests when possible

---

## Troubleshooting

### Data not updating?
- Check `refreshInterval` is set correctly
- Ensure component is still mounted
- Check browser console for errors

### Performance issues?
- Increase `refreshInterval` to reduce requests
- Use `useScraperStockWithCache` to avoid redundant fetches
- Limit number of concurrent symbols

### API errors?
- Check if symbol is valid (AAPL, GOOGL, etc.)
- Verify API endpoint is accessible
- Check browser network tab for response details

---

## Next Steps

1. **Integrate into existing pages** - Add components to dashboard, portfolio, watchlist
2. **Set up database storage** - Save historical data for charting
3. **Add more features** - Alerts, notifications, custom analysis
4. **Monitor performance** - Track API usage and cache hit rates

For more details, see [lib/scrapers/README.md](../lib/scrapers/README.md)
