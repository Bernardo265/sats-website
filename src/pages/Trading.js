import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import SEOHead from '../components/common/SEOHead';
import TradingInterface from '../components/trading/TradingInterface';
import Portfolio from '../components/trading/Portfolio';
import TransactionHistory from '../components/trading/TransactionHistory';
import TradingTutorial from '../components/trading/TradingTutorial';
import BitcoinPriceWidget from '../components/common/BitcoinPriceWidget';
import { useAuth } from '../contexts/AuthContext';
import { TradingProvider } from '../contexts/TradingContext';
import { generateStructuredData } from '../utils/seo';

function Trading() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('trading');
  const [showTutorial, setShowTutorial] = useState(false);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/start-trading" replace />;
  }

  // Redirect if email not verified
  if (!user?.emailVerified) {
    return <Navigate to="/dashboard" replace />;
  }

  const tradingPageData = {
    title: 'Bitcoin Trading Simulator | Practice Trading | SafeSats',
    description: 'Practice Bitcoin trading with virtual funds on SafeSats trading simulator. Learn trading strategies and portfolio management before real trading begins.',
    keywords: 'bitcoin trading simulator, practice trading, virtual trading, bitcoin portfolio, trading tutorial, safesats',
    url: '/trading',
    type: 'website'
  };

  const tabs = [
    { id: 'trading', label: 'Trading', icon: '📈' },
    { id: 'portfolio', label: 'Portfolio', icon: '💼' },
    { id: 'history', label: 'History', icon: '📋' }
  ];

  return (
    <TradingProvider>
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
        <SEOHead
          pageData={tradingPageData}
          structuredData={generateStructuredData('webpage', tradingPageData)}
        />
        
        <div className="px-6 py-20">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Bitcoin Trading Simulator
                </h1>
                <p className="text-white/70">
                  Practice trading with virtual funds • Learn before you earn
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
                <button
                  onClick={() => setShowTutorial(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>Tutorial</span>
                </button>
                
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <span className="text-orange-500 font-medium text-sm">SIMULATION MODE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tutorial Modal */}
            {showTutorial && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="relative">
                    <button
                      onClick={() => setShowTutorial(false)}
                      className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <TradingTutorial />
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              {/* Main Content */}
              <div className="xl:col-span-3">
                {/* Navigation Tabs */}
                <div className="flex mb-8 bg-black/30 rounded-xl p-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                        activeTab === tab.id
                          ? 'bg-orange-500 text-black'
                          : 'text-white hover:bg-white/10'
                      }`}
                    >
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="space-y-8">
                  {activeTab === 'trading' && <TradingInterface />}
                  {activeTab === 'portfolio' && <Portfolio />}
                  {activeTab === 'history' && <TransactionHistory />}
                </div>
              </div>

              {/* Sidebar */}
              <div className="xl:col-span-1 space-y-6">
                {/* Live Bitcoin Price */}
                <BitcoinPriceWidget 
                  showDetailed={true}
                  refreshInterval={30000}
                />

                {/* Trading Tips */}
                <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4">Trading Tips</h3>
                  <div className="space-y-4">
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="text-green-400 font-semibold text-sm">Start Small</h4>
                      <p className="text-white/70 text-xs">
                        Begin with small amounts to get comfortable with the interface
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="text-blue-400 font-semibold text-sm">Watch the Market</h4>
                      <p className="text-white/70 text-xs">
                        Monitor price movements and trends before making decisions
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="text-purple-400 font-semibold text-sm">Use Limit Orders</h4>
                      <p className="text-white/70 text-xs">
                        Set your desired price with limit orders for better control
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-orange-500 pl-4">
                      <h4 className="text-orange-400 font-semibold text-sm">Learn from Mistakes</h4>
                      <p className="text-white/70 text-xs">
                        Review your trading history to improve your strategy
                      </p>
                    </div>
                  </div>
                </div>

                {/* Risk Warning */}
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
                  <div className="flex items-start space-x-3">
                    <svg className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                      <h4 className="text-red-400 font-semibold mb-2">Important Reminder</h4>
                      <p className="text-white/80 text-sm">
                        This is a simulation using virtual funds. Bitcoin trading involves significant risks. 
                        Only invest what you can afford to lose when real trading becomes available.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Coming Soon */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                  <div className="flex items-start space-x-3">
                    <svg className="w-6 h-6 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="text-blue-400 font-semibold mb-2">Real Trading Soon</h4>
                      <p className="text-white/80 text-sm">
                        Use this simulator to prepare for real Bitcoin trading. 
                        Your experience here will help you make better decisions when live trading launches.
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

export default Trading;
