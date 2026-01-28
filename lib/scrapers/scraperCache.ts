/**
 * Scraper Cache
 * In-memory cache for scraping results with TTL
 */

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class ScraperCache<T> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private defaultTTL: number; // milliseconds

  constructor(defaultTTLSeconds: number = 300) {
    this.defaultTTL = defaultTTLSeconds * 1000;
  }

  /**
   * Gets a value from cache if it exists and hasn't expired
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if entry has expired
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Sets a value in cache with optional custom TTL
   */
  set(key: string, data: T, ttlSeconds?: number): void {
    const ttl = (ttlSeconds ?? (this.defaultTTL / 1000)) * 1000;
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Checks if a key exists in cache and is valid
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Deletes a key from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clears all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Gets cache size (number of entries)
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Gets all keys in cache
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Cleans up expired entries
   */
  cleanup(): number {
    const now = Date.now();
    let removed = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
        removed++;
      }
    }

    return removed;
  }

  /**
   * Gets cache statistics
   */
  stats(): {
    size: number;
    keys: string[];
    ages: number[];
  } {
    const now = Date.now();
    const ages: number[] = [];

    for (const entry of this.cache.values()) {
      ages.push(now - entry.timestamp);
    }

    return {
      size: this.cache.size,
      keys: this.keys(),
      ages,
    };
  }
}

// Create global cache instances for different data types
export const stockPriceCache = new ScraperCache<any>(300); // 5 minutes
export const newsCache = new ScraperCache<any>(600); // 10 minutes
