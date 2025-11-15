import React from 'react';
import SEOHead from '../components/common/SEOHead';
import BitcoinPriceWidget from '../components/common/BitcoinPriceWidget';
import { generateStructuredData } from '../utils/seo';

function BitcoinPrice() {
  const pricePageData = {
    title: 'Live Bitcoin Price | Real-time BTC Exchange Rates | SafeSats',
    description: 'Get real-time Bitcoin prices in Malawian Kwacha (MWK) and USD. Live BTC exchange rates, 24-hour price changes, and market data on SafeSats.',
    keywords: 'bitcoin price, BTC price, bitcoin exchange rate, MWK bitcoin price, USD bitcoin price, live bitcoin price, cryptocurrency rates',
    url: '/bitcoin-price',
    type: 'website',
    image: '/images/bitcoin-price-og.jpg'
  };

  const breadcrumbData = [
    { name: 'Home', url: '/' },
    { name: 'Bitcoin Price', url: '/bitcoin-price' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <SEOHead
        pageData={pricePageData}
        structuredData={generateStructuredData('webpage', pricePageData)}
      />
      <SEOHead
        structuredData={generateStructuredData('breadcrumb', breadcrumbData)}
      />
      
      <div className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center space-y-6 mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-2xl">₿</span>
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              Live Bitcoin Price<br />
              <span className="text-orange-500">Real-time Market Data</span>
            </h1>
            <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
              Stay updated with real-time Bitcoin prices in Malawian Kwacha and USD. 
              Get accurate exchange rates and market insights for informed trading decisions.
            </p>
          </div>

          {/* Main Price Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Primary Price Widget */}
            <BitcoinPriceWidget 
              showDetailed={true}
              className="lg:col-span-1"
            />
            
            {/* Secondary Price Widget with Different Refresh Rate */}
            <div className="space-y-6">
              <BitcoinPriceWidget 
                variant="compact"
                refreshInterval={30000} // 30 seconds for faster updates
                className="bg-orange-500/10 border-orange-500/30"
              />
              
              {/* Market Information */}
              <div className="bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h3 className="text-white font-semibold text-lg mb-4">Market Information</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Exchange Rate</span>
                    <span className="text-white font-medium">1 USD = 1,730 MWK</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Data Source</span>
                    <span className="text-white font-medium">CoinGecko API</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Update Frequency</span>
                    <span className="text-white font-medium">Every 60 seconds</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Market Status</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400 font-medium">Live</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Price History Information */}
          <div className="bg-black/50 backdrop-blur-sm rounded-xl p-8 border border-white/10 mb-12">
            <h3 className="text-white font-semibold text-xl mb-6">Understanding Bitcoin Prices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-orange-500 font-semibold">Price Factors</h4>
                <ul className="space-y-2 text-white/70">
                  <li className="flex items-start space-x-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>Global market demand and supply</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>Regulatory news and developments</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>Institutional adoption and investment</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>Market sentiment and trading volume</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-orange-500 font-semibold">Trading Tips</h4>
                <ul className="space-y-2 text-white/70">
                  <li className="flex items-start space-x-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>Monitor price trends over time</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>Consider dollar-cost averaging</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>Stay informed about market news</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span>Only invest what you can afford to lose</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div className="space-y-2">
                <h4 className="text-orange-500 font-semibold">Important Disclaimer</h4>
                <p className="text-white/80 text-sm leading-relaxed">
                  The prices displayed are for informational purposes only and may not reflect the exact trading prices on SafeSats. 
                  Bitcoin prices are highly volatile and can change rapidly. Past performance does not guarantee future results. 
                  Always conduct your own research and consider your financial situation before making any investment decisions.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Trade Bitcoin?</h3>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Join SafeSats today and start buying and selling Bitcoin with confidence. 
              Our platform offers competitive rates and secure transactions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="bg-orange-500 hover:bg-orange-600 text-black px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Start Trading Now
              </a>
              <a 
                href="/about" 
                className="border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black px-8 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                Learn More About SafeSats
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BitcoinPrice;
