import React from 'react';
import { Navigate } from 'react-router-dom';
import SEOHead from '../components/common/SEOHead';
import Portfolio from '../components/trading/Portfolio';
import BitcoinPriceWidget from '../components/common/BitcoinPriceWidget';
import { useAuth } from '../contexts/AuthContext';
import { TradingProvider } from '../contexts/TradingContext';
import { generateStructuredData } from '../utils/seo';

function PortfolioPage() {
  const { user, isAuthenticated } = useAuth();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/start-trading" replace />;
  }

  // Redirect if email not verified
  if (!user?.emailVerified) {
    return <Navigate to="/dashboard" replace />;
  }

  const portfolioPageData = {
    title: 'Portfolio Overview | Virtual Trading Portfolio | SafeSats',
    description: 'View your virtual Bitcoin trading portfolio, track performance, and monitor asset allocation on SafeSats trading simulator.',
    keywords: 'bitcoin portfolio, virtual portfolio, trading performance, asset allocation, portfolio management, safesats',
    url: '/portfolio',
    type: 'website'
  };

  return (
    <TradingProvider>
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
        <SEOHead
          pageData={portfolioPageData}
          structuredData={generateStructuredData('webpage', portfolioPageData)}
        />
        
        <div className="px-6 py-20">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Portfolio Overview
                </h1>
                <p className="text-white/70">
                  Track your virtual trading performance and asset allocation
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
                <a
                  href="/trading"
                  className="bg-orange-500 hover:bg-orange-600 text-black px-6 py-3 rounded-lg font-semibold transition-colors text-center"
                >
                  Back to Trading
                </a>
                
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <span className="text-orange-500 font-medium text-sm">VIRTUAL PORTFOLIO</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              {/* Main Portfolio Content */}
              <div className="xl:col-span-3">
                <Portfolio />
              </div>

              {/* Sidebar */}
              <div className="xl:col-span-1 space-y-6">
                {/* Live Bitcoin Price */}
                <BitcoinPriceWidget 
                  showDetailed={true}
                  refreshInterval={30000}
                />

                {/* Quick Actions */}
                <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <a
                      href="/trading"
                      className="block w-full bg-green-500 hover:bg-green-600 text-black py-3 px-4 rounded-lg transition-colors text-center font-semibold"
                    >
                      Buy Bitcoin
                    </a>
                    
                    <a
                      href="/trading"
                      className="block w-full bg-red-500 hover:bg-red-600 text-black py-3 px-4 rounded-lg transition-colors text-center font-semibold"
                    >
                      Sell Bitcoin
                    </a>
                    
                    <a
                      href="/orders"
                      className="block w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 px-4 rounded-lg transition-colors text-center"
                    >
                      View Orders
                    </a>
                  </div>
                </div>

                {/* Portfolio Tips */}
                <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4">Portfolio Tips</h3>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="text-blue-400 font-semibold text-sm">Diversification</h4>
                      <p className="text-white/70 text-xs">
                        Consider keeping some MWK for buying opportunities during price dips
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="text-green-400 font-semibold text-sm">Long-term View</h4>
                      <p className="text-white/70 text-xs">
                        Bitcoin can be volatile short-term but has shown growth over longer periods
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="text-purple-400 font-semibold text-sm">Regular Review</h4>
                      <p className="text-white/70 text-xs">
                        Check your portfolio regularly but avoid making emotional decisions
                      </p>
                    </div>
                  </div>
                </div>

                {/* Performance Insights */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                  <div className="flex items-start space-x-3">
                    <svg className="w-6 h-6 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <div>
                      <h4 className="text-blue-400 font-semibold mb-2">Track Your Progress</h4>
                      <p className="text-white/80 text-sm">
                        Your portfolio performance helps you understand how different trading strategies work. 
                        Use this data to improve your approach for real trading.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TradingProvider>
  );
}

export default PortfolioPage;
