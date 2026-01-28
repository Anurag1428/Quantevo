import axios from 'axios';
import cheerio from 'cheerio';

/**
 * Interface for stock data returned from scraper
 */
export interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: Date;
  source?: string;
}

/**
 * Validates stock symbol format
 * @param symbol - Stock ticker symbol
 * @returns True if valid format
 */
export function validateSymbol(symbol: string): boolean {
  return /^[A-Z]{1,5}$/.test(symbol.toUpperCase());
}

/**
 * Validates stock price data
 * @param data - Stock data to validate
 * @throws Error if data is invalid
 */
export function validateStockData(data: Partial<StockData>): void {
  if (!data.symbol || !data.price) {
    throw new Error('Invalid stock data: missing symbol or price');
  }
  if (isNaN(data.price)) {
    throw new Error('Invalid stock data: price is not a valid number');
  }
  if (typeof data.change !== 'number') {
    throw new Error('Invalid stock data: change must be a number');
  }
}

/**
 * Sanitizes text data from HTML
 * @param text - Raw text to sanitize
 * @returns Cleaned text
 */
export function sanitizeData(text: string): string {
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .trim();
}

/**
 * Fetches and scrapes stock data from financial sources
 * Uses a public financial API endpoint
 * 
 * @param symbol - Stock ticker symbol (e.g., 'AAPL', 'GOOGL')
 * @returns Promise with stock data
 * @throws Error if scraping fails
 * 
 * @example
 * const data = await scrapeStockPrice('AAPL');
 * console.log(`${data.symbol}: $${data.price}`);
 */
export async function scrapeStockPrice(symbol: string): Promise<StockData> {
  if (!validateSymbol(symbol)) {
    throw new Error(`Invalid stock symbol format: ${symbol}`);
  }

  try {
    const upperSymbol = symbol.toUpperCase();
    
    // Using a free financial API endpoint
    // In production, consider using Alpha Vantage, Finnhub, or similar
    const url = `https://financialmodelingprep.com/api/v3/quote/${upperSymbol}`;
    
    // Set appropriate headers to avoid being blocked
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (compatible; QuantevoBot/1.0)',
      'Accept': 'application/json',
      'Referer': 'https://quantevo.io/',
    };

    const response = await axios.get(url, {
      headers,
      timeout: 10000, // 10 second timeout
    });

    // Validate response
    if (!response.data || response.data.length === 0) {
      throw new Error(`No data found for symbol ${upperSymbol}`);
    }

    const stockInfo = response.data[0];
    const change = (stockInfo.change || 0);
    const price = parseFloat(stockInfo.price);
    const changePercent = (stockInfo.changesPercentage || 0);

    const data: StockData = {
      symbol: upperSymbol,
      price: parseFloat(price.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      timestamp: new Date(),
      source: 'financialmodelingprep',
    };

    // Validate the extracted data
    validateStockData(data);

    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Failed to scrape stock price for ${symbol}:`, errorMessage);
    throw error;
  }
}

/**
 * Scrapes multiple stock prices in parallel
 * 
 * @param symbols - Array of stock symbols
 * @returns Promise with array of stock data
 * 
 * @example
 * const stocks = await scrapeMultipleStocks(['AAPL', 'GOOGL', 'MSFT']);
 */
export async function scrapeMultipleStocks(symbols: string[]): Promise<StockData[]> {
  try {
    const results = await Promise.allSettled(
      symbols.map(symbol => scrapeStockPrice(symbol))
    );

    const successfulResults: StockData[] = [];
    const failedSymbols: string[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successfulResults.push(result.value);
      } else {
        failedSymbols.push(symbols[index]);
        console.error(`Failed to scrape ${symbols[index]}:`, result.reason);
      }
    });

    if (failedSymbols.length > 0) {
      console.warn(`Failed to scrape symbols: ${failedSymbols.join(', ')}`);
    }

    return successfulResults;
  } catch (error) {
    console.error('Failed to scrape multiple stocks:', error);
    throw error;
  }
}

/**
 * Scrapes news data from financial news sources
 * (Extended for future implementation)
 */
export interface NewsData {
  title: string;
  description: string;
  url: string;
  symbol: string;
  publishedDate: Date;
  source: string;
}

/**
 * Placeholder for news scraping functionality
 */
export async function scrapeFinancialNews(symbol: string): Promise<NewsData[]> {
  console.log(`News scraping for ${symbol} not yet implemented`);
  return [];
}
