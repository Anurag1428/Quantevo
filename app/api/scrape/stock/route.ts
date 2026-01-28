import { scrapeStockPrice, scrapeMultipleStocks, validateSymbol } from '@/lib/scrapers/stockScraper';
import { withRetryAndTimeout } from '@/lib/scrapers/withRetry';
import { scraperLogger } from '@/lib/scrapers/scraperLogger';

/**
 * GET /api/scrape/stock
 * 
 * Scrapes stock price data for a given symbol
 * 
 * Query Parameters:
 * - symbol: Stock ticker symbol (required, e.g., 'AAPL')
 * 
 * Example: GET /api/scrape/stock?symbol=AAPL
 * 
 * Response:
 * {
 *   "symbol": "AAPL",
 *   "price": 150.25,
 *   "change": 2.50,
 *   "changePercent": 1.69,
 *   "timestamp": "2026-01-28T10:30:00.000Z",
 *   "source": "financialmodelingprep"
 * }
 */
export async function GET(request: Request) {
  const startTime = Date.now();
  
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    // Validate input
    if (!symbol) {
      scraperLogger.logError('stock-scraper', 'Missing required parameter: symbol');
      return Response.json(
        { error: 'Symbol parameter required' },
        { status: 400 }
      );
    }

    if (!validateSymbol(symbol)) {
      scraperLogger.logError('stock-scraper', `Invalid symbol format: ${symbol}`);
      return Response.json(
        { error: 'Invalid stock symbol format (1-5 alphanumeric characters)' },
        { status: 400 }
      );
    }

    const upperSymbol = symbol.toUpperCase();
    scraperLogger.logStart('stock-scraper', { symbol: upperSymbol });

    // Scrape with retry and timeout
    const data = await withRetryAndTimeout(
      () => scrapeStockPrice(upperSymbol),
      {
        maxRetries: 3,
        baseDelay: 1000,
        onRetry: (attempt, error) => {
          scraperLogger.logRetry('stock-scraper', attempt, error, { symbol: upperSymbol });
        },
      },
      10000 // 10 second timeout per attempt
    );

    const duration = Date.now() - startTime;
    scraperLogger.logSuccess('stock-scraper', duration, { symbol: upperSymbol });

    return Response.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    scraperLogger.logError('stock-scraper', errorMessage);

    return Response.json(
      {
        error: 'Failed to fetch stock data',
        message: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
        duration,
      },
      { status: 500 }
    );
  }
}
