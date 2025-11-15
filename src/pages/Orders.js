import React from 'react';
import { Navigate } from 'react-router-dom';
import SEOHead from '../components/common/SEOHead';
import TransactionHistory from '../components/trading/TransactionHistory';
import BitcoinPriceWidget from '../components/common/BitcoinPriceWidget';
import { useAuth } from '../contexts/AuthContext';
import { TradingProvider } from '../contexts/TradingContext';
import { generateStructuredData } from '../utils/seo';

function OrdersPage() {
  const { user, isAuthenticated } = useAuth();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/start-trading" replace />;
  }

  // Redirect if email not verified
  if (!user?.emailVerified) {
    return <Navigate to="/dashboard" replace />;
  }

  const ordersPageData = {
    title: 'Trading Orders & History | Transaction History | SafeSats',
    description: 'View your virtual Bitcoin trading history, pending orders, and transaction details on SafeSats trading simulator.',
    keywords: 'bitcoin trading history, trading orders, transaction history, pending orders, trading records, safesats',
    url: '/orders',
    type: 'website'
  };

  return (
    <TradingProvider>
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
        <SEOHead
          pageData={ordersPageData}
          structuredData={generateStructuredData('webpage', ordersPageData)}
        />
        
        <div className="px-6 py-20">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Trading Orders & History
                </h1>
                <p className="text-white/70">
                  Review your virtual trading activity and manage pending orders
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
                    <span className="text-orange-500 font-medium text-sm">VIRTUAL TRADING</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              {/* Main Orders Content */}
              <div className="xl:col-span-3">
                <TransactionHistory />
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
                      className="block w-full bg-orange-500 hover:bg-orange-600 text-black py-3 px-4 rounded-lg transition-colors text-center font-semibold"
                    >
                      Place New Order
                    </a>
                    
                    <a
                      href="/portfolio"
                      className="block w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 px-4 rounded-lg transition-colors text-center"
                    >
                      View Portfolio
                    </a>
                  </div>
                </div>

                {/* Order Types Guide */}
                <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4">Order Types</h3>
                  <div className="space-y-4">
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="text-green-400 font-semibold text-sm">Market Orders</h4>
                      <p className="text-white/70 text-xs">
                        Execute immediately at current market price
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="text-purple-400 font-semibold text-sm">Limit Orders</h4>
                      <p className="text-white/70 text-xs">
                        Set your desired price and wait for execution
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trading Statistics */}
                <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4">Trading Tips</h3>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="text-blue-400 font-semibold text-sm">Review Regularly</h4>
                      <p className="text-white/70 text-xs">
                        Analyze your trading patterns to improve your strategy
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-yellow-500 pl-4">
                      <h4 className="text-yellow-400 font-semibold text-sm">Learn from Trades</h4>
                      <p className="text-white/70 text-xs">
                        Each trade is a learning opportunity for real trading
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-red-500 pl-4">
                      <h4 className="text-red-400 font-semibold text-sm">Manage Risk</h4>
                      <p className="text-white/70 text-xs">
                        Practice risk management strategies with virtual funds
                      </p>
                    </div>
                  </div>
                </div>

                {/* Educational Note */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                  <div className="flex items-start space-x-3">
                    <svg className="w-6 h-6 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="text-blue-400 font-semibold mb-2">Learning Experience</h4>
                      <p className="text-white/80 text-sm">
                        Your trading history is valuable data for understanding market behavior and 
                        developing successful trading strategies for when real trading begins.
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

export default OrdersPage;
