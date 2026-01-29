import { useState, useEffect, useCallback } from 'react';

export interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: Date;
  source?: string;
}

export interface UseScraperStockProps {
  symbol?: string;
  symbols?: string[];
  enabled?: boolean;
  refreshInterval?: number; // milliseconds
  onError?: (error: Error) => void;
}

export interface UseScraperStockReturn {
  data: StockData | StockData[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

/**
 * Hook for scraping stock data
 * 
 * @example
 * // Single stock
 * const { data, loading, error } = useScraperStock({ symbol: 'AAPL' });
 * 
 * // Multiple stocks
 * const { data, loading, error } = useScraperStock({ symbols: ['AAPL', 'GOOGL'] });
 */
export function useScraperStock({
  symbol,
  symbols,
  enabled = true,
  refreshInterval = 0,
  onError,
}: UseScraperStockProps): UseScraperStockReturn {
  const [data, setData] = useState<StockData | StockData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled || (!symbol && !symbols)) return;

    try {
      setLoading(true);
      setError(null);

      if (symbol) {
        // Single stock
        const response = await fetch(`/api/scrape/stock?symbol=${symbol}`);
        if (!response.ok) throw new Error('Failed to fetch stock');
        const stock = await response.json();
        setData(stock);
      } else if (symbols && symbols.length > 0) {
        // Multiple stocks
        const response = await fetch('/api/scrape/stocks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symbols }),
        });
        if (!response.ok) throw new Error('Failed to fetch stocks');
        const result = await response.json();
        setData(result.data);
      }

      setLastUpdated(new Date());
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      if (onError) onError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [symbol, symbols, enabled, onError]);

  // Initial fetch
  useEffect(() => {
    if (!enabled || (!symbol && !symbols)) return;
    fetchData();
  }, [symbol, symbols, enabled, fetchData]);

  // Auto-refresh interval
  useEffect(() => {
    if (!enabled || refreshInterval <= 0) return;

    const interval = setInterval(() => {
      fetchData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [enabled, refreshInterval, fetchData]);

  return { data, loading, error, refetch: fetchData, lastUpdated };
}

/**
 * Hook for caching stock data locally
 * 
 * @example
 * const { data, loading } = useScraperStockWithCache({ 
 *   symbol: 'AAPL',
 *   cacheDuration: 300000 // 5 minutes
 * });
 */
export function useScraperStockWithCache({
  symbol,
  symbols,
  enabled = true,
  refreshInterval = 0,
  cacheDuration = 300000, // 5 minutes
  onError,
}: UseScraperStockProps & { cacheDuration?: number }): UseScraperStockReturn {
  const [cache, setCache] = useState<Map<string, { data: any; timestamp: number }>>(new Map());

  const cacheKey = symbol || symbols?.join(',') || '';

  const fetchDataWithCache = useCallback(async () => {
    if (!enabled || !cacheKey) return;

    const cached = cache.get(cacheKey);
    const now = Date.now();

    // Return cached data if still valid
    if (cached && now - cached.timestamp < cacheDuration) {
      return;
    }

    // Fetch fresh data
    try {
      if (symbol) {
        const response = await fetch(`/api/scrape/stock?symbol=${symbol}`);
        if (!response.ok) throw new Error('Failed to fetch stock');
        const stock = await response.json();
        
        const newCache = new Map(cache);
        newCache.set(cacheKey, { data: stock, timestamp: now });
        setCache(newCache);
      } else if (symbols && symbols.length > 0) {
        const response = await fetch('/api/scrape/stocks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ symbols }),
        });
        if (!response.ok) throw new Error('Failed to fetch stocks');
        const result = await response.json();
        
        const newCache = new Map(cache);
        newCache.set(cacheKey, { data: result.data, timestamp: now });
        setCache(newCache);
      }
    } catch (err) {
      if (onError) onError(err as Error);
    }
  }, [symbol, symbols, enabled, cacheKey, cache, cacheDuration, onError]);

  useEffect(() => {
    if (!enabled || !cacheKey) return;
    fetchDataWithCache();
  }, [cacheKey, enabled, fetchDataWithCache]);

  const cachedEntry = cache.get(cacheKey);
  const data = cachedEntry?.data || null;
  const loading = false;
  const error = null;
  const lastUpdated = cachedEntry ? new Date(cachedEntry.timestamp) : null;

  return { data, loading, error, refetch: fetchDataWithCache, lastUpdated };
}
