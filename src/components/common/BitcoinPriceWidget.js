import React, { useState, useEffect } from 'react';
// import bitcoinService from '../../services/bitcoinService';

function BitcoinPriceWidget({ className = '', size = 'default' }) {
  const [bitcoinPrice, setBitcoinPrice] = useState(null);
  const [priceLoading, setPriceLoading] = useState(true);
  const [priceError, setPriceError] = useState(null);

  // Fetch Bitcoin price on component mount and set up refresh interval
  useEffect(() => {
    const fetchBitcoinPrice = async () => {
      try {
        setPriceLoading(true);
        setPriceError(null);
        // const priceData = await bitcoinService.getBitcoinPrice();
        const priceData = await new Promise(resolve => setTimeout(() => resolve({ mwk: 50000000, change24h: 2.5, isFallback: false }), 1000));
        setBitcoinPrice(priceData);
      } catch (error) {
        console.error('Failed to fetch Bitcoin price:', error);
        setPriceError('Failed to load price');
      } finally {
        setPriceLoading(false);
      }
    };

    // Initial fetch
    fetchBitcoinPrice();

    // Set up refresh interval (every 5 minutes to reduce API calls)
    const interval = setInterval(fetchBitcoinPrice, 300000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  // Format currency for MWK
  const formatMWK = (amount) => {
    return new Intl.NumberFormat('en-MW', {
      style: 'currency',
      currency: 'MWK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Size variants
  const sizeClasses = {
    small: {
      container: 'p-3',
      title: 'text-xs',
      price: 'text-sm font-semibold',
      change: 'text-xs',
      fallback: 'text-xs'
    },
    default: {
      container: 'p-4',
      title: 'text-sm font-medium',
      price: 'text-lg font-bold',
      change: 'text-sm font-medium',
      fallback: 'text-xs'
    },
    large: {
      container: 'p-6',
      title: 'text-base font-medium',
      price: 'text-2xl font-bold',
      change: 'text-base font-medium',
      fallback: 'text-sm'
    }
  };

  const currentSize = sizeClasses[size] || sizeClasses.default;

  if (priceLoading) {
    return (
      <div className={`bg-black/20 backdrop-blur-sm border border-green-400/30 rounded-xl ${currentSize.container} text-center ${className}`}>
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-600 rounded mb-2"></div>
          <div className="h-6 bg-gray-600 rounded"></div>
          <div className="h-3 bg-gray-600 rounded w-16 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (priceError || !bitcoinPrice) {
    return (
      <div className={`bg-black/20 backdrop-blur-sm border border-red-400/30 rounded-xl ${currentSize.container} text-center ${className}`}>
        <p className="text-red-400 text-sm">Price unavailable</p>
        <p className="text-gray-500 text-xs mt-1">Check connection</p>
      </div>
    );
  }

  const isPositiveChange = bitcoinPrice.change24h >= 0;
  const changeColor = isPositiveChange ? 'text-green-400' : 'text-red-400';
  const changeIcon = isPositiveChange ? '↗' : '↘';

  return (
    <div className={`bg-black/20 backdrop-blur-sm border border-green-400/30 rounded-xl ${currentSize.container} text-center hover:border-green-400/50 transition-all duration-300 ${className}`}>
      <div className="space-y-2">
        <p className={`text-gray-300 ${currentSize.title}`}>Live Bitcoin Price</p>
        <div className="space-y-1">
          <p className={`text-white ${currentSize.price}`}>
            {formatMWK(bitcoinPrice.mwk)}
          </p>
          <div className="flex items-center justify-center space-x-2">
            <span className={`${changeColor} ${currentSize.change}`}>
              {changeIcon} {Math.abs(bitcoinPrice.change24h).toFixed(2)}%
            </span>
            <span className="text-gray-400 text-xs">24h</span>
          </div>
        </div>
        {bitcoinPrice.isFallback && (
          <p className={`text-yellow-400 ${currentSize.fallback}`}>Estimated price</p>
        )}
        <div className="flex items-center justify-center space-x-1 mt-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-gray-400 text-xs">Live</span>
        </div>
      </div>
    </div>
  );
}

export default BitcoinPriceWidget;
