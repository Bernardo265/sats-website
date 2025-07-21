import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for fetching real-time Bitcoin prices
 * @param {number} refreshInterval - Refresh interval in milliseconds (default: 60000 = 1 minute)
 * @returns {Object} Bitcoin price data and loading states
 */
export const useBitcoinPrice = (refreshInterval = 60000) => {
  const [priceData, setPriceData] = useState({
    btc_usd: null,
    btc_mwk: null,
    usd_mwk_rate: null,
    price_change_24h: null,
    price_change_percentage_24h: null,
    high_24h: null,
    low_24h: null,
    last_updated: null,
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);
  
  const intervalRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Malawian Kwacha exchange rate (approximate - in production, this should come from a forex API)
  const MWK_USD_RATE = 1730; // 1 USD = ~1730 MWK (as of 2024)

  /**
   * Fetch Bitcoin price data from CoinGecko API
   */
  const fetchBitcoinPrice = useCallback(async () => {
    try {
      // Cancel previous request if still pending
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      
      setError(null);
      
      // Fetch Bitcoin price data from CoinGecko (free tier, no API key required)
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_last_updated_at=true',
        {
          signal: abortControllerRef.current.signal,
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.bitcoin) {
        throw new Error('Invalid API response format');
      }

      const btcUsdPrice = data.bitcoin.usd;
      const priceChange24h = data.bitcoin.usd_24h_change || 0;
      const lastUpdated = data.bitcoin.last_updated_at;

      // Calculate MWK price (in production, fetch real MWK exchange rate)
      const btcMwkPrice = btcUsdPrice * MWK_USD_RATE;

      // Calculate 24h high/low estimates (since CoinGecko simple API doesn't include these)
      const high24h = btcUsdPrice + Math.abs(priceChange24h);
      const low24h = btcUsdPrice - Math.abs(priceChange24h);

      const newPriceData = {
        btc_usd: btcUsdPrice,
        btc_mwk: btcMwkPrice,
        usd_mwk_rate: MWK_USD_RATE,
        price_change_24h: priceChange24h,
        price_change_percentage_24h: (priceChange24h / (btcUsdPrice - priceChange24h)) * 100,
        high_24h: high24h,
        low_24h: low24h,
        last_updated: new Date(lastUpdated * 1000).toISOString(),
      };

      setPriceData(newPriceData);
      setLastFetchTime(new Date().toISOString());
      setLoading(false);
      
    } catch (err) {
      if (err.name === 'AbortError') {
        return; // Request was cancelled, don't update error state
      }
      
      console.error('Error fetching Bitcoin price:', err);
      setError(err.message || 'Failed to fetch Bitcoin price');
      setLoading(false);
    }
  }, [MWK_USD_RATE]);

  /**
   * Start automatic price updates
   */
  const startAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      fetchBitcoinPrice();
    }, refreshInterval);
  }, [fetchBitcoinPrice, refreshInterval]);

  /**
   * Stop automatic price updates
   */
  const stopAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  /**
   * Manual refresh function
   */
  const refreshPrice = useCallback(() => {
    setLoading(true);
    fetchBitcoinPrice();
  }, [fetchBitcoinPrice]);

  // Initialize and cleanup
  useEffect(() => {
    // Initial fetch
    fetchBitcoinPrice();
    
    // Start auto-refresh
    startAutoRefresh();
    
    // Cleanup on unmount
    return () => {
      stopAutoRefresh();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchBitcoinPrice, startAutoRefresh, stopAutoRefresh]);

  // Handle visibility change (pause updates when tab is not visible)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAutoRefresh();
      } else {
        startAutoRefresh();
        // Refresh immediately when tab becomes visible
        fetchBitcoinPrice();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [startAutoRefresh, stopAutoRefresh, fetchBitcoinPrice]);

  return {
    priceData,
    loading,
    error,
    lastFetchTime,
    refreshPrice,
    isStale: lastFetchTime && (Date.now() - new Date(lastFetchTime).getTime()) > refreshInterval * 2,
  };
};

/**
 * Utility function to format currency values
 */
export const formatCurrency = (value, currency = 'USD', locale = 'en-US') => {
  if (value === null || value === undefined) return '--';
  
  const options = {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currency === 'USD' ? 2 : 0,
    maximumFractionDigits: currency === 'USD' ? 2 : 0,
  };
  
  if (currency === 'MWK') {
    // Format MWK without currency symbol, add it manually
    return `MK ${new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)}`;
  }
  
  return new Intl.NumberFormat(locale, options).format(value);
};

/**
 * Utility function to format percentage change
 */
export const formatPercentageChange = (value) => {
  if (value === null || value === undefined) return '--';
  
  const formatted = Math.abs(value).toFixed(2);
  const sign = value >= 0 ? '+' : '-';
  
  return `${sign}${formatted}%`;
};

/**
 * Utility function to get relative time
 */
export const getRelativeTime = (timestamp) => {
  if (!timestamp) return 'Never';
  
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now - time) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  
  return time.toLocaleDateString();
};
