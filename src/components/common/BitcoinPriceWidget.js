import React from 'react';
import { useBitcoinPrice, formatCurrency, formatPercentageChange, getRelativeTime } from '../../hooks/useBitcoinPrice';

/**
 * Bitcoin Price Widget Component
 * Displays real-time Bitcoin prices with animations and error handling
 */
const BitcoinPriceWidget = ({ 
  showDetailed = false, 
  refreshInterval = 60000,
  className = '',
  variant = 'default' // 'default', 'compact', 'ticker'
}) => {
  const { priceData, loading, error, lastFetchTime, refreshPrice, isStale } = useBitcoinPrice(refreshInterval);

  const getPriceChangeColor = (change) => {
    if (change === null || change === undefined) return 'text-gray-400';
    return change >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const getPriceChangeIcon = (change) => {
    if (change === null || change === undefined) return null;
    
    if (change >= 0) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
        </svg>
      );
    } else {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
        </svg>
      );
    }
  };

  // Loading state
  if (loading && !priceData.btc_usd) {
    return (
      <div className={`bg-black/50 backdrop-blur-sm rounded-xl p-4 border border-white/10 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-500 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-white/20 rounded w-24"></div>
              <div className="h-3 bg-white/10 rounded w-16"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !priceData.btc_usd) {
    return (
      <div className={`bg-red-500/10 backdrop-blur-sm rounded-xl p-4 border border-red-500/20 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-red-400 text-sm font-medium">Price Unavailable</p>
              <p className="text-red-300/70 text-xs">Failed to fetch Bitcoin price</p>
            </div>
          </div>
          <button
            onClick={refreshPrice}
            className="text-red-400 hover:text-red-300 transition-colors"
            title="Retry"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // Compact variant for ticker
  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-4 ${className}`}>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-xs">₿</span>
          </div>
          <span className="text-white font-semibold">
            {formatCurrency(priceData.btc_mwk, 'MWK')}
          </span>
        </div>
        <div className={`flex items-center space-x-1 ${getPriceChangeColor(priceData.price_change_percentage_24h)}`}>
          {getPriceChangeIcon(priceData.price_change_percentage_24h)}
          <span className="text-sm font-medium">
            {formatPercentageChange(priceData.price_change_percentage_24h)}
          </span>
        </div>
      </div>
    );
  }

  // Ticker variant for scrolling display
  if (variant === 'ticker') {
    return (
      <div className={`flex items-center space-x-6 ${className}`}>
        <div className="flex items-center space-x-2">
          <span className="text-orange-500 font-bold">BTC/MWK</span>
          <span className="text-white font-semibold">
            {formatCurrency(priceData.btc_mwk, 'MWK')}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-orange-500 font-bold">BTC/USD</span>
          <span className="text-white font-semibold">
            {formatCurrency(priceData.btc_usd, 'USD')}
          </span>
        </div>
        <div className={`flex items-center space-x-1 ${getPriceChangeColor(priceData.price_change_percentage_24h)}`}>
          {getPriceChangeIcon(priceData.price_change_percentage_24h)}
          <span className="font-medium">
            {formatPercentageChange(priceData.price_change_percentage_24h)}
          </span>
        </div>
      </div>
    );
  }

  // Default variant - full widget
  return (
    <div className={`bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-white/10 transition-all duration-300 ${isStale ? 'border-yellow-500/30' : ''} ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-lg">₿</span>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Bitcoin Price</h3>
            <p className="text-white/60 text-sm">Live market data</p>
          </div>
        </div>
        
        <button
          onClick={refreshPrice}
          disabled={loading}
          className={`p-2 rounded-lg transition-all duration-200 ${
            loading 
              ? 'text-white/40 cursor-not-allowed' 
              : 'text-white/60 hover:text-white hover:bg-white/10'
          }`}
          title="Refresh price"
        >
          <svg 
            className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Main Price Display */}
      <div className="space-y-4">
        {/* Primary Price - MWK */}
        <div className="space-y-1">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white transition-all duration-500">
              {formatCurrency(priceData.btc_mwk, 'MWK')}
            </span>
            <span className="text-white/60 text-sm">MWK</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-semibold text-white/80">
              {formatCurrency(priceData.btc_usd, 'USD')}
            </span>
            <span className="text-white/50 text-sm">USD</span>
          </div>
        </div>

        {/* 24h Change */}
        <div className={`flex items-center space-x-2 ${getPriceChangeColor(priceData.price_change_percentage_24h)}`}>
          {getPriceChangeIcon(priceData.price_change_percentage_24h)}
          <span className="font-semibold">
            {formatPercentageChange(priceData.price_change_percentage_24h)}
          </span>
          <span className="text-sm">
            ({formatCurrency(priceData.price_change_24h, 'USD')})
          </span>
          <span className="text-white/50 text-sm">24h</span>
        </div>

        {/* Additional Details */}
        {showDetailed && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
            <div>
              <p className="text-white/50 text-xs uppercase tracking-wide">24h High</p>
              <p className="text-white font-medium">
                {formatCurrency(priceData.high_24h, 'USD')}
              </p>
            </div>
            <div>
              <p className="text-white/50 text-xs uppercase tracking-wide">24h Low</p>
              <p className="text-white font-medium">
                {formatCurrency(priceData.low_24h, 'USD')}
              </p>
            </div>
          </div>
        )}

        {/* Last Updated */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <span className="text-white/40 text-xs">
            Last updated: {getRelativeTime(lastFetchTime)}
          </span>
          {isStale && (
            <span className="text-yellow-500 text-xs flex items-center space-x-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Data may be stale</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BitcoinPriceWidget;
