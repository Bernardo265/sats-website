import React from 'react';
import { useBitcoinPrice, formatCurrency, formatPercentageChange } from '../../hooks/useBitcoinPrice';

/**
 * Bitcoin Price Ticker Component
 * Compact price display for hero section integration
 */
const BitcoinPriceTicker = ({ className = '' }) => {
  const { priceData, loading, error } = useBitcoinPrice(60000); // 1-minute refresh

  const getPriceChangeColor = (change) => {
    if (change === null || change === undefined) return 'text-white/60';
    return change >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const getPriceChangeIcon = (change) => {
    if (change === null || change === undefined) return null;
    
    if (change >= 0) {
      return (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
        </svg>
      );
    } else {
      return (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
        </svg>
      );
    }
  };

  // Loading state
  if (loading && !priceData.btc_usd) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-orange-500/20 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-orange-500 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <div className="space-y-1">
            <div className="h-3 bg-white/20 rounded w-20 animate-pulse"></div>
            <div className="h-2 bg-white/10 rounded w-12 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !priceData.btc_usd) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center">
          <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span className="text-red-400 text-sm">Price unavailable</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {/* Bitcoin Icon and Price */}
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
          <span className="text-black font-bold text-xs">₿</span>
        </div>
        <div className="flex flex-col">
          <span className="text-white font-semibold text-sm leading-tight">
            {formatCurrency(priceData.btc_mwk, 'MWK')}
          </span>
          <span className="text-white/60 text-xs leading-tight">
            {formatCurrency(priceData.btc_usd, 'USD')}
          </span>
        </div>
      </div>

      {/* Price Change Indicator */}
      <div className={`flex items-center space-x-1 ${getPriceChangeColor(priceData.price_change_percentage_24h)}`}>
        {getPriceChangeIcon(priceData.price_change_percentage_24h)}
        <span className="text-sm font-medium">
          {formatPercentageChange(priceData.price_change_percentage_24h)}
        </span>
      </div>

      {/* Live Indicator */}
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-white/50 text-xs">LIVE</span>
      </div>
    </div>
  );
};

export default BitcoinPriceTicker;
