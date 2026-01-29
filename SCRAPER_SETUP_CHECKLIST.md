# Scraper Setup Checklist

Follow these steps to get the scraper fully integrated into your application.

## ✅ Step 1: Verify Installation

- [ ] Check `axios` is installed in `package.json`
  ```bash
  npm install axios
  ```

- [ ] Verify files were created:
  - [ ] `lib/scrapers/stockScraper.ts`
  - [ ] `lib/scrapers/withRetry.ts`
  - [ ] `lib/scrapers/scraperLogger.ts`
  - [ ] `lib/scrapers/scraperCache.ts`
  - [ ] `lib/scrapers/config.ts`
  - [ ] `components/LiveMarketData.tsx`
  - [ ] `components/LivePortfolioTracker.tsx`
  - [ ] `hooks/useScraper.ts`
  - [ ] `app/api/scrape/stock/route.ts`
  - [ ] `app/api/scrape/stocks/route.ts`

## ✅ Step 2: Test API Endpoints

- [ ] Test single stock endpoint
  ```
  GET /api/scrape/stock?symbol=AAPL
  ```
  Expected: Stock data with price, change, etc.

- [ ] Test multiple stocks endpoint
  ```
  POST /api/scrape/stocks
  Body: { "symbols": ["AAPL", "GOOGL", "MSFT"] }
  ```
  Expected: Array of stock data

## ✅ Step 3: Test Demo Page

- [ ] Visit `/scraper-demo` page
- [ ] Verify "Live Market Data" tab works
  - [ ] Data loads
  - [ ] Refresh button works
  - [ ] Error handling works
- [ ] Verify "Portfolio Tracker" tab works
  - [ ] Portfolio data displays
  - [ ] Gain/loss calculations correct
  - [ ] Charts render

## ✅ Step 4: Integrate into Dashboard

**File:** `app/(root)/dashboard/page.tsx`

```tsx
import { LiveMarketData } from '@/components/LiveMarketData';

export default function DashboardPage() {
  return (
    <LiveMarketData 
      symbols={['AAPL', 'GOOGL', 'MSFT']}
      refreshInterval={300000}
    />
  );
}
```

- [ ] Add import statement
- [ ] Add component to page
- [ ] Verify component renders
- [ ] Verify data updates

## ✅ Step 5: Integrate into Portfolio

**File:** `app/(root)/portfolio/page.tsx`

```tsx
import { LivePortfolioTracker } from '@/components/LivePortfolioTracker';

const holdings = [
  { symbol: 'AAPL', quantity: 10, purchasePrice: 150 },
  { symbol: 'GOOGL', quantity: 5, purchasePrice: 2500 },
];

export default function PortfolioPage() {
  return <LivePortfolioTracker holdings={holdings} />;
}
```

- [ ] Add import statement
- [ ] Add sample holdings data
- [ ] Add component to page
- [ ] Verify component renders
- [ ] Verify portfolio calculations

## ✅ Step 6: Add Custom Components (Optional)

- [ ] Create custom component using `useScraperStock` hook
- [ ] Test single symbol fetching
- [ ] Test multiple symbols fetching
- [ ] Test error handling
- [ ] Test refresh functionality

Example:
```tsx
'use client';
import { useScraperStock } from '@/hooks/useScraper';

export function MyStockCard({ symbol }: { symbol: string }) {
  const { data, loading, error, refetch } = useScraperStock({ symbol });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data || Array.isArray(data)) return null;

  return (
    <div>
      <h3>{data.symbol}</h3>
      <p>${data.price.toFixed(2)}</p>
      <button onClick={() => refetch()}>Refresh</button>
    </div>
  );
}
```

## ✅ Step 7: Configuration (Optional)

- [ ] Create `.env.local` file (if using premium APIs)
- [ ] Add API keys:
  ```env
  FINNHUB_API_KEY=your_key
  ALPHA_VANTAGE_API_KEY=your_key
  SCRAPER_LOG_ENABLED=true
  ```
- [ ] Restart development server

## ✅ Step 8: Performance Optimization

- [ ] Review refresh intervals for your use case
- [ ] Consider using cache hook for frequently accessed symbols
- [ ] Monitor API usage in browser DevTools
- [ ] Test with multiple concurrent requests

## ✅ Step 9: Error Handling

- [ ] Test with invalid symbols
- [ ] Test with network errors
- [ ] Verify error messages are user-friendly
- [ ] Ensure error callbacks work

```tsx
<LiveMarketData 
  symbols={symbols}
  onError={(error) => {
    console.error('Failed to fetch:', error);
    // Show user notification
  }}
/>
```

## ✅ Step 10: Documentation

- [ ] Read SCRAPER_INTEGRATION.md
- [ ] Read lib/scrapers/README.md
- [ ] Review example code in EXAMPLES.ts
- [ ] Share documentation with team

## 📋 Testing Checklist

### Component Testing
- [ ] LiveMarketData with single symbol
- [ ] LiveMarketData with multiple symbols
- [ ] LiveMarketData with invalid symbol
- [ ] LivePortfolioTracker with holdings
- [ ] Error state handling
- [ ] Loading state handling

### Hook Testing
- [ ] useScraperStock with single symbol
- [ ] useScraperStock with multiple symbols
- [ ] useScraperStock with caching
- [ ] Manual refresh works
- [ ] Auto-refresh works

### API Testing
- [ ] GET /api/scrape/stock works
- [ ] POST /api/scrape/stocks works
- [ ] Error responses correct
- [ ] Rate limiting working

### Integration Testing
- [ ] Components load on pages
- [ ] Data updates correctly
- [ ] No memory leaks
- [ ] Performance acceptable

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] All tests passing
- [ ] Error handling complete
- [ ] API keys configured
- [ ] Performance tested under load
- [ ] Documentation updated
- [ ] Team trained on new components
- [ ] Monitoring/logging enabled
- [ ] Rollback plan prepared

## 📚 Documentation to Share

- [ ] Link to SCRAPER_INTEGRATION.md
- [ ] Link to lib/scrapers/README.md
- [ ] Share demo page URL: `/scraper-demo`
- [ ] Share example code snippets
- [ ] Document custom implementations

## 🔗 Quick Links

- **Demo Page**: `/scraper-demo`
- **Integration Guide**: [SCRAPER_INTEGRATION.md](./SCRAPER_INTEGRATION.md)
- **API Documentation**: [lib/scrapers/README.md](./lib/scrapers/README.md)
- **Web Scraping Info**: [WEB_SCRAPING.md](./WEB_SCRAPING.md)
- **Summary**: [SCRAPER_INTEGRATION_SUMMARY.md](./SCRAPER_INTEGRATION_SUMMARY.md)

## 💡 Tips & Tricks

1. **Use refresh intervals strategically**
   - 5 minutes for dashboards
   - 1 minute for alerts
   - 30 seconds for real-time tracking

2. **Monitor API calls**
   - Open DevTools Network tab
   - Check request frequency
   - Verify response times

3. **Use caching for performance**
   - Client-side caching with hooks
   - Reduce duplicate API calls
   - Improve perceived performance

4. **Implement error boundaries**
   - Wrap components in ErrorBoundary
   - Show graceful error messages
   - Log errors for debugging

5. **Test with real symbols**
   - AAPL, GOOGL, MSFT, AMZN, TSLA
   - Test with valid and invalid symbols
   - Verify data accuracy

## ⚠️ Common Issues & Solutions

**Issue**: Data not updating
- **Solution**: Check `refreshInterval` is > 0

**Issue**: API errors
- **Solution**: Verify symbol is valid (AAPL, not Apple)

**Issue**: Performance degradation
- **Solution**: Increase `refreshInterval`, use caching

**Issue**: Component not rendering
- **Solution**: Check imports, verify prop types

## 📞 Need Help?

Refer to:
1. SCRAPER_INTEGRATION.md - Integration examples
2. lib/scrapers/README.md - API documentation
3. EXAMPLES.ts - Code examples
4. Browser DevTools - Network and console logs

---

**Status**: ✅ Ready to Deploy
**Version**: 1.0.0
**Last Updated**: January 29, 2026
