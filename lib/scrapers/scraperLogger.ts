/**
 * Scraper logging utility
 * Tracks scraping events, performance metrics, and errors
 */

export type ScrapeEventType = 'start' | 'success' | 'error' | 'retry' | 'cache-hit' | 'cache-miss';

export interface ScrapeEvent {
  type: ScrapeEventType;
  source: string;
  timestamp: Date;
  duration?: number;
  error?: string;
  metadata?: Record<string, any>;
}

/**
 * Logger instance for tracking scraping events
 */
class ScraperLogger {
  private events: ScrapeEvent[] = [];
  private enableConsoleLog: boolean;

  constructor(enableConsoleLog: boolean = true) {
    this.enableConsoleLog = enableConsoleLog;
  }

  /**
   * Logs a scrape event
   */
  log(event: ScrapeEvent): void {
    this.events.push(event);

    if (this.enableConsoleLog) {
      const timestamp = event.timestamp.toISOString();
      const logMessage = `[${timestamp}] ${event.type.toUpperCase()}: ${event.source}`;

      switch (event.type) {
        case 'start':
          console.info(`🔄 ${logMessage}`);
          break;
        case 'success':
          console.log(
            `✅ ${logMessage}` +
            (event.duration ? ` (${event.duration}ms)` : '')
          );
          break;
        case 'error':
          console.error(
            `❌ ${logMessage}` +
            (event.error ? `\n   Error: ${event.error}` : '')
          );
          break;
        case 'retry':
          console.warn(
            `⚠️  ${logMessage}` +
            (event.error ? `\n   Error: ${event.error}` : '')
          );
          break;
        case 'cache-hit':
          console.log(`💾 ${logMessage} (cached)`);
          break;
        case 'cache-miss':
          console.log(`📡 ${logMessage} (fetching)`);
          break;
      }

      if (event.metadata) {
        console.debug('   Metadata:', event.metadata);
      }
    }
  }

  /**
   * Logs a scraping start event
   */
  logStart(source: string, metadata?: Record<string, any>): void {
    this.log({
      type: 'start',
      source,
      timestamp: new Date(),
      metadata,
    });
  }

  /**
   * Logs a successful scrape event
   */
  logSuccess(
    source: string,
    duration?: number,
    metadata?: Record<string, any>
  ): void {
    this.log({
      type: 'success',
      source,
      timestamp: new Date(),
      duration,
      metadata,
    });
  }

  /**
   * Logs a scraping error event
   */
  logError(
    source: string,
    error: Error | string,
    metadata?: Record<string, any>
  ): void {
    this.log({
      type: 'error',
      source,
      timestamp: new Date(),
      error: error instanceof Error ? error.message : String(error),
      metadata,
    });
  }

  /**
   * Logs a retry event
   */
  logRetry(
    source: string,
    attempt: number,
    error?: Error | string,
    metadata?: Record<string, any>
  ): void {
    this.log({
      type: 'retry',
      source,
      timestamp: new Date(),
      error: error instanceof Error ? error.message : error ? String(error) : undefined,
      metadata: { ...metadata, attempt },
    });
  }

  /**
   * Logs a cache hit event
   */
  logCacheHit(source: string, metadata?: Record<string, any>): void {
    this.log({
      type: 'cache-hit',
      source,
      timestamp: new Date(),
      metadata,
    });
  }

  /**
   * Logs a cache miss event
   */
  logCacheMiss(source: string, metadata?: Record<string, any>): void {
    this.log({
      type: 'cache-miss',
      source,
      timestamp: new Date(),
      metadata,
    });
  }

  /**
   * Gets all logged events
   */
  getEvents(): ScrapeEvent[] {
    return [...this.events];
  }

  /**
   * Gets events filtered by type
   */
  getEventsByType(type: ScrapeEventType): ScrapeEvent[] {
    return this.events.filter(e => e.type === type);
  }

  /**
   * Gets events for a specific source
   */
  getEventsBySource(source: string): ScrapeEvent[] {
    return this.events.filter(e => e.source === source);
  }

  /**
   * Gets statistics for scraping operations
   */
  getStats(): {
    totalEvents: number;
    successCount: number;
    errorCount: number;
    retryCount: number;
    averageDuration: number;
    sources: string[];
  } {
    const successEvents = this.events.filter(e => e.type === 'success');
    const durations = successEvents
      .filter(e => e.duration !== undefined)
      .map(e => e.duration!);

    return {
      totalEvents: this.events.length,
      successCount: successEvents.length,
      errorCount: this.events.filter(e => e.type === 'error').length,
      retryCount: this.events.filter(e => e.type === 'retry').length,
      averageDuration: durations.length > 0 
        ? durations.reduce((a, b) => a + b, 0) / durations.length 
        : 0,
      sources: [...new Set(this.events.map(e => e.source))],
    };
  }

  /**
   * Clears all logged events
   */
  clear(): void {
    this.events = [];
  }

  /**
   * Exports events as JSON
   */
  export(): string {
    return JSON.stringify(this.events, null, 2);
  }
}

// Create a singleton logger instance
export const scraperLogger = new ScraperLogger(
  process.env.SCRAPER_LOG_ENABLED !== 'false'
);
