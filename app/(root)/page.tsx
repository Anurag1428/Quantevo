import TradingViewWidget from '@/components/TradingViewWidget'
import SmartSuggestions from '@/components/SmartSuggestions'
import PortfolioSimulator from '@/components/PortfolioSimulator'
import { HEATMAP_WIDGET_CONFIG, MARKET_DATA_WIDGET_CONFIG, MARKET_OVERVIEW_WIDGET_CONFIG, TOP_STORIES_WIDGET_CONFIG } from '@/lib/constants'

import React from 'react'

const Home = () => {

  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`
  return (
    <div className='min-h-screen bg-gray-900'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-white mb-2'>Investment Dashboard</h1>
          <p className='text-gray-400'>Track markets, discover stocks, and plan your portfolio</p>
        </div>

        {/* Top Section - Market Overview & Tools */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8'>
          <div className='lg:col-span-2 space-y-8'>
            <div className='md:col-span-1 xl:col-span-1'>
              <TradingViewWidget
                title='Market Overview'
                scriptUrl={`${scriptUrl}market-overview.js`}
                config={MARKET_OVERVIEW_WIDGET_CONFIG}
                className="custom-chart"
                height={400}
              />
            </div>
          </div>
          <div className='lg:col-span-1'>
            <SmartSuggestions 
              investmentGoal='Growth'
              riskTolerance='Medium'
              preferredIndustry='Technology'
            />
          </div>
        </div>

        {/* Middle Section - Tools */}
        <div className='mb-8'>
          <PortfolioSimulator />
        </div>

        {/* Bottom Section - Market Data */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <div>
            <TradingViewWidget
              title='Stock HeatMap'
              scriptUrl={`${scriptUrl}stock-heatmap.js`}
              config={HEATMAP_WIDGET_CONFIG}
              height={500}
            />
          </div>
          <div>
            <TradingViewWidget
              scriptUrl={`${scriptUrl}timeline.js`}
              config={TOP_STORIES_WIDGET_CONFIG}
              className="custom-chart"
              height={500}
            />
          </div>
        </div>

        <div className='mt-8'>
          <TradingViewWidget
            title='Market Quotes'
            scriptUrl={`${scriptUrl}market-quotes.js`}
            config={MARKET_DATA_WIDGET_CONFIG }
            height={500}
          />
        </div>
      </div>
    </div>
  )
}

export default Home