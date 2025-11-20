import React, { useState, useEffect } from 'react';

function BitcoinPriceWidget({ className = '', size = 'default' }) {
  const [bitcoinPrice, setBitcoinPrice] = useState(null);
  const [priceLoading, setPriceLoading] = useState(true);
  const [priceError, setPriceError] = useState(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
        if (!response.ok) {
          throw new Error('Failed to fetch price from CoinGecko');
        }
        const data = await response.json();
        if (data.bitcoin) {
          setBitcoinPrice({
            usd: data.bitcoin.usd,
            change24h: data.bitcoin.usd_24h_change,
          });
          setPriceError(null);
        } else {
          throw new Error('Invalid data format from CoinGecko');
        }
      } catch (error) {
        setPriceError(error.message);
      } finally {
        setPriceLoading(false);
      }
    };

    fetchPrice(); // Initial fetch
    const intervalId = setInterval(fetchPrice, 30000); // Fetch every 30 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  // Format currency with explicit $ symbol
  const formatUSD = (amount) => {
    if (amount === null || amount === undefined) return '$0.00';
    return `$${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  // Size variants
  const sizeClasses = {
    small: {
      container: 'p-3',
      title: 'text-xs',
      price: 'text-sm font-semibold',
      change: 'text-xs',
    },
    default: {
      container: 'p-4',
      title: 'text-sm font-medium',
      price: 'text-lg font-bold',
      change: 'text-sm font-medium',
    },
    large: {
      container: 'p-6',
      title: 'text-base font-medium',
      price: 'text-2xl font-bold',
      change: 'text-base font-medium',
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
        <p className="text-gray-500 text-xs mt-1">{priceError || 'Check connection'}</p>
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
            {formatUSD(bitcoinPrice.usd)}
          </p>
          <div className="flex items-center justify-center space-x-2">
            <span className={`${changeColor} ${currentSize.change}`}>
              {changeIcon} {bitcoinPrice.change24h ? Math.abs(bitcoinPrice.change24h).toFixed(2) : '0.00'}%
            </span>
            <span className="text-gray-400 text-xs">24h</span>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-1 mt-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-gray-400 text-xs">Live</span>
        </div>
      </div>
    </div>
  );
}

export default BitcoinPriceWidget;