import { scrapeMultipleStocks, validateSymbol } from '@/lib/scrapers/stockScraper';
import { withRetryAndTimeout } from '@/lib/scrapers/withRetry';
import { scraperLogger } from '@/lib/scrapers/scraperLogger';

/**
 * POST /api/scrape/stocks
 * 
 * Scrapes stock price data for multiple symbols in parallel
 * 
 * Request Body:
 * {
 *   "symbols": ["AAPL", "GOOGL", "MSFT"]
 * }
 * 
 * Response:
 * [
 *   {
 *     "symbol": "AAPL",
 *     "price": 150.25,
 *     "change": 2.50,
 *     "changePercent": 1.69,
 *     "timestamp": "2026-01-28T10:30:00.000Z"
 *   },
 *   ...
 * ]
 */
export async function POST(request: Request) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const { symbols } = body;

    // Validate input
    if (!Array.isArray(symbols) || symbols.length === 0) {
      scraperLogger.logError('stocks-scraper', 'Invalid symbols array');
      return Response.json(
        { error: 'Symbols must be a non-empty array' },
        { status: 400 }
      );
    }

    if (symbols.length > 50) {
      scraperLogger.logError('stocks-scraper', 'Too many symbols requested');
      return Response.json(
        { error: 'Maximum 50 symbols per request' },
        { status: 400 }
      );
    }

    // Validate each symbol
    const validSymbols = symbols.map((s: string) => s.toUpperCase()).filter((s: string) => validateSymbol(s));
    
    if (validSymbols.length === 0) {
      scraperLogger.logError('stocks-scraper', 'No valid symbols provided');
      return Response.json(
        { error: 'No valid stock symbols provided' },
        { status: 400 }
      );
    }

    scraperLogger.logStart('stocks-scraper', { count: validSymbols.length, symbols: validSymbols });

    // Scrape with retry and timeout
    const data = await withRetryAndTimeout(
      () => scrapeMultipleStocks(validSymbols),
      {
        maxRetries: 2,
        baseDelay: 1000,
        onRetry: (attempt, error) => {
          scraperLogger.logRetry('stocks-scraper', attempt, error);
        },
      },
      15000 // 15 second timeout per attempt
    );

    const duration = Date.now() - startTime;
    scraperLogger.logSuccess('stocks-scraper', duration, {
      count: data.length,
      requested: validSymbols.length,
    });

    return Response.json(
      {
        data,
        count: data.length,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=300',
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    scraperLogger.logError('stocks-scraper', errorMessage);

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
