/**
 * Scraper Configuration
 * Centralized configuration for all scraping operations
 */

export interface ScraperConfig {
  // Rate limiting
  rateLimitDelay: number; // milliseconds between requests
  maxConcurrentRequests: number;

  // Timeouts
  requestTimeout: number; // milliseconds
  maxRetries: number;

  // Cache settings
  cacheEnabled: boolean;
  cacheTTL: number; // seconds

  // Logging
  loggingEnabled: boolean;
  debugMode: boolean;

  // API settings
  apiKeys: {
    finnhub?: string;
    alphaVantage?: string;
    polygonIO?: string;
  };
}

// Default configuration
export const DEFAULT_SCRAPER_CONFIG: ScraperConfig = {
  // Rate limiting
  rateLimitDelay: 500, // 500ms between requests
  maxConcurrentRequests: 5,

  // Timeouts
  requestTimeout: 10000, // 10 seconds
  maxRetries: 3,

  // Cache settings
  cacheEnabled: true,
  cacheTTL: 300, // 5 minutes

  // Logging
  loggingEnabled: true,
  debugMode: process.env.NODE_ENV === 'development',

  // API settings
  apiKeys: {
    finnhub: process.env.FINNHUB_API_KEY,
    alphaVantage: process.env.ALPHA_VANTAGE_API_KEY,
    polygonIO: process.env.POLYGON_IO_API_KEY,
  },
};

// Configuration singleton
let config = DEFAULT_SCRAPER_CONFIG;

/**
 * Gets the current scraper configuration
 */
export function getScraperConfig(): ScraperConfig {
  return config;
}

/**
 * Updates scraper configuration
 */
export function setScraperConfig(newConfig: Partial<ScraperConfig>): void {
  config = { ...config, ...newConfig };
}

/**
 * Resets configuration to defaults
 */
export function resetScraperConfig(): void {
  config = DEFAULT_SCRAPER_CONFIG;
}
