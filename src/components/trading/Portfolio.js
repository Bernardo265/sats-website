import React from 'react';
import { useTrading } from '../../contexts/TradingContext';
import { formatCurrency } from '../../hooks/useBitcoinPrice';

const Portfolio = () => {
  const { portfolio, currentPrice, resetPortfolio } = useTrading();

  const getProfitLossColor = () => {
    if (portfolio.profitLoss > 0) return 'text-green-400';
    if (portfolio.profitLoss < 0) return 'text-red-400';
    return 'text-white';
  };

  const getProfitLossIcon = () => {
    if (portfolio.profitLoss > 0) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
        </svg>
      );
    }
    if (portfolio.profitLoss < 0) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
        </svg>
      );
    }
    return null;
  };

  const btcValueInMwk = portfolio.btcBalance * (currentPrice || 0);

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Portfolio Overview</h2>
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-1">
            <span className="text-orange-500 text-sm font-medium">VIRTUAL</span>
          </div>
        </div>

        {/* Total Portfolio Value */}
        <div className="bg-white/5 rounded-lg p-6 mb-6">
          <div className="text-center">
            <h3 className="text-white/60 text-sm uppercase tracking-wide mb-2">Total Portfolio Value</h3>
            <p className="text-4xl font-bold text-white mb-2">
              {formatCurrency(portfolio.totalValue, 'MWK')}
            </p>
            <div className={`flex items-center justify-center space-x-2 ${getProfitLossColor()}`}>
              {getProfitLossIcon()}
              <span className="text-lg font-semibold">
                {portfolio.profitLoss >= 0 ? '+' : ''}
                {formatCurrency(portfolio.profitLoss, 'MWK')}
              </span>
              <span className="text-sm">
                ({portfolio.profitLossPercentage >= 0 ? '+' : ''}
                {portfolio.profitLossPercentage.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Asset Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* MWK Balance */}
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">MK</span>
              </div>
              <div>
                <h3 className="text-white font-semibold">Malawian Kwacha</h3>
                <p className="text-white/60 text-sm">Available Balance</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(portfolio.mwkBalance, 'MWK')}
            </p>
            <p className="text-white/60 text-sm mt-1">
              {((portfolio.mwkBalance / portfolio.totalValue) * 100).toFixed(1)}% of portfolio
            </p>
          </div>

          {/* Bitcoin Balance */}
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">₿</span>
              </div>
              <div>
                <h3 className="text-white font-semibold">Bitcoin</h3>
                <p className="text-white/60 text-sm">BTC Holdings</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-white">
              {portfolio.btcBalance.toFixed(8)} BTC
            </p>
            <p className="text-white/60 text-sm mt-1">
              {formatCurrency(btcValueInMwk, 'MWK')} • {((btcValueInMwk / portfolio.totalValue) * 100).toFixed(1)}% of portfolio
            </p>
          </div>
        </div>
      </div>

      {/* Portfolio Allocation Chart */}
      <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">Asset Allocation</h3>
        
        {/* Simple Progress Bar Chart */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium">MWK Balance</span>
              <span className="text-white/60">
                {((portfolio.mwkBalance / portfolio.totalValue) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3">
              <div 
                className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(portfolio.mwkBalance / portfolio.totalValue) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white font-medium">Bitcoin Holdings</span>
              <span className="text-white/60">
                {((btcValueInMwk / portfolio.totalValue) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3">
              <div 
                className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(btcValueInMwk / portfolio.totalValue) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Statistics */}
      <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">Portfolio Statistics</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <h4 className="text-white/60 text-sm uppercase tracking-wide mb-1">Initial Value</h4>
            <p className="text-white font-semibold">{formatCurrency(100000, 'MWK')}</p>
          </div>
          
          <div className="text-center">
            <h4 className="text-white/60 text-sm uppercase tracking-wide mb-1">Current Value</h4>
            <p className="text-white font-semibold">{formatCurrency(portfolio.totalValue, 'MWK')}</p>
          </div>
          
          <div className="text-center">
            <h4 className="text-white/60 text-sm uppercase tracking-wide mb-1">Total Return</h4>
            <p className={`font-semibold ${getProfitLossColor()}`}>
              {formatCurrency(portfolio.profitLoss, 'MWK')}
            </p>
          </div>
          
          <div className="text-center">
            <h4 className="text-white/60 text-sm uppercase tracking-wide mb-1">Return %</h4>
            <p className={`font-semibold ${getProfitLossColor()}`}>
              {portfolio.profitLossPercentage >= 0 ? '+' : ''}
              {portfolio.profitLossPercentage.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      {/* Reset Portfolio */}
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
        <div className="flex items-start space-x-3">
          <svg className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div className="flex-1">
            <h4 className="text-red-400 font-semibold mb-2">Reset Portfolio</h4>
            <p className="text-white/80 text-sm mb-4">
              Reset your virtual portfolio back to the initial MK 100,000 balance. 
              This will clear all trading history and start fresh.
            </p>
            <button
              onClick={resetPortfolio}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Reset Portfolio
            </button>
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
            <h4 className="text-blue-400 font-semibold mb-2">Learning Opportunity</h4>
            <p className="text-white/80 text-sm">
              Use this virtual portfolio to understand how Bitcoin price movements affect your holdings. 
              Practice different trading strategies and learn about portfolio diversification before real trading begins.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
