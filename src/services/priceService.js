import { supabase, supabaseHelpers } from '../lib/supabase';
import adminPriceService from './adminPriceService';

/**
 * Price Service for managing Bitcoin price data and real-time updates
 */
class PriceService {
  constructor() {
    this.isRunning = false;
    this.intervalId = null;
    this.subscribers = new Set();
    this.lastPrice = null;
    this.priceHistory = [];
    this.MWK_USD_RATE = 1730; // Default rate, should be fetched from API in production
    this.adminPriceService = adminPriceService;
  }

  /**
   * Start the price monitoring service
   * @param {number} interval - Update interval in milliseconds
   */
  async start(interval = 30000) {
    if (this.isRunning) {
      console.warn('Price service is already running');
      return { success: true, message: 'Already running' };
    }

    try {
      this.isRunning = true;
      console.log('Starting price monitoring service...');

      // Start admin override monitoring
      this.adminPriceService.startExpirationMonitoring();

      // Try to fetch initial price with timeout and fallback
      try {
        await this.fetchAndStorePriceDataWithFallback();
        console.log('✅ Initial price fetch successful');
      } catch (error) {
        console.warn('⚠️ Initial price fetch failed, will retry periodically:', error.message);
        // Load last known price from database as fallback
        await this.loadFallbackPrice();
      }

      // Set up periodic updates with error handling
      this.intervalId = setInterval(async () => {
        try {
          await this.fetchAndStorePriceDataWithFallback();
        } catch (error) {
          console.error('Price update failed:', error.message);
          // Continue running even if individual updates fail
        }
      }, interval);

      return { success: true, message: 'Price service started successfully' };
    } catch (error) {
      console.error('Failed to start price service:', error);
      this.isRunning = false;
      return { success: false, error: error.message };
    }
  }

  /**
   * Stop the price monitoring service
   */
  stop() {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    // Stop admin override monitoring
    this.adminPriceService.stopExpirationMonitoring();

    console.log('Price monitoring service stopped');
  }

  /**
   * Subscribe to price updates
   * @param {Function} callback - Callback function to receive price updates
   * @returns {Function} Unsubscribe function
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    
    // Send current price to new subscriber
    if (this.lastPrice) {
      callback(this.lastPrice);
    }

    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Notify all subscribers of price updates
   * @param {Object} priceData - Price data to broadcast
   */
  notifySubscribers(priceData) {
    this.subscribers.forEach(callback => {
      try {
        callback(priceData);
      } catch (error) {
        console.error('Error in price subscriber callback:', error);
      }
    });
  }

  /**
   * Fetch Bitcoin price from CoinGecko API with enhanced error handling
   */
  async fetchBitcoinPrice() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      console.log('🔄 Fetching Bitcoin price from CoinGecko...');

      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_last_updated_at=true&include_market_cap=true',
        {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'SafeSats-Website/1.0',
          },
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.bitcoin) {
        throw new Error('Invalid API response format - missing bitcoin data');
      }

      const btcData = data.bitcoin;
      const btcUsdPrice = btcData.usd;
      const priceChange24h = btcData.usd_24h_change || 0;
      const volume24h = btcData.usd_24h_vol || 0;
      const marketCap = btcData.usd_market_cap || 0;
      const lastUpdated = btcData.last_updated_at;

      // Calculate MWK price
      const btcMwkPrice = btcUsdPrice * this.MWK_USD_RATE;

      // Calculate 24h high/low estimates
      const high24h = btcUsdPrice + Math.abs(priceChange24h);
      const low24h = btcUsdPrice - Math.abs(priceChange24h);

      const priceData = {
        symbol: 'BTC',
        price_usd: btcUsdPrice,
        price_mwk: btcMwkPrice,
        usd_mwk_rate: this.MWK_USD_RATE,
        volume_24h: volume24h,
        market_cap: marketCap,
        price_change_24h: priceChange24h,
        price_change_percentage_24h: (priceChange24h / (btcUsdPrice - priceChange24h)) * 100,
        high_24h: high24h,
        low_24h: low24h,
        source: 'coingecko',
        last_updated: new Date(lastUpdated * 1000).toISOString(),
        fetched_at: new Date().toISOString()
      };

      console.log(`✅ Price fetched: $${btcUsdPrice.toLocaleString()} USD / MWK ${btcMwkPrice.toLocaleString()}`);
      return priceData;

    } catch (error) {
      clearTimeout(timeoutId);

      // Enhanced error categorization
      if (error.name === 'AbortError') {
        throw new Error('Price fetch timeout - CoinGecko API took too long to respond');
      } else if (error.message.includes('fetch')) {
        throw new Error('Network error - unable to connect to CoinGecko API');
      } else if (error.message.includes('CORS')) {
        throw new Error('CORS error - browser blocked the request to CoinGecko API');
      } else {
        throw new Error(`Price fetch failed: ${error.message}`);
      }
    }
  }

  /**
   * Fetch price data and store in database with fallback mechanisms
   */
  async fetchAndStorePriceData() {
    try {
      // Check if auto updates are disabled by admin override
      if (this.adminPriceService.isAutoUpdatesDisabled()) {
        console.log('⚠️ Auto price updates disabled by admin override');
        return this.lastPrice || this.getDefaultPriceData();
      }

      const priceData = await this.fetchBitcoinPrice();

      // Store in database (even if there's an override, we keep the regular price history)
      await supabaseHelpers.storePriceData(priceData);

      // Get effective price (admin override or regular price)
      const effectivePrice = await this.adminPriceService.getEffectivePrice(priceData);

      // Update local cache with effective price
      this.lastPrice = effectivePrice;
      this.priceHistory.push(effectivePrice);

      // Keep only last 100 price points in memory
      if (this.priceHistory.length > 100) {
        this.priceHistory = this.priceHistory.slice(-100);
      }

      // Notify subscribers with effective price
      this.notifySubscribers(effectivePrice);

      // Process any pending limit orders using effective price
      await this.processLimitOrders(effectivePrice.price_mwk);

      const priceSource = effectivePrice.is_override ? 'admin override' : 'market data';
      console.log(`✅ Price updated (${priceSource}): BTC = ${effectivePrice.price_mwk.toLocaleString()} MWK`);

      return effectivePrice;
    } catch (error) {
      console.error('❌ Error in fetchAndStorePriceData:', error.message);

      // Try fallback mechanisms
      try {
        const fallbackData = await this.getFallbackPrice();
        if (fallbackData) {
          console.log('📦 Using fallback price data');
          this.notifySubscribers(fallbackData);
          return fallbackData;
        }
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError.message);
      }

      // Don't throw error to prevent app crash
      console.warn('⚠️ Price service continuing with last known data');
      return this.lastPrice || this.getDefaultPriceData();
    }
  }

  /**
   * Process pending limit orders based on current price
   * @param {number} currentPrice - Current BTC price in MWK
   */
  async processLimitOrders(currentPrice) {
    try {
      const processedOrders = await supabaseHelpers.processLimitOrders(currentPrice);
      
      if (processedOrders && processedOrders.length > 0) {
        console.log(`Processed ${processedOrders.length} limit orders`);
        
        // Notify about order executions
        processedOrders.forEach(order => {
          this.notifySubscribers({
            type: 'order_executed',
            order: order,
            price: currentPrice
          });
        });
      }
    } catch (error) {
      console.error('Error processing limit orders:', error);
    }
  }

  /**
   * Get current price data
   * @returns {Object|null} Current price data
   */
  getCurrentPrice() {
    return this.lastPrice;
  }

  /**
   * Get price history
   * @param {number} limit - Number of recent prices to return
   * @returns {Array} Array of price data
   */
  getPriceHistory(limit = 50) {
    return this.priceHistory.slice(-limit);
  }

  /**
   * Get latest price from database
   */
  async getLatestPriceFromDB() {
    try {
      const priceData = await supabaseHelpers.getLatestPriceData();
      if (priceData) {
        this.lastPrice = priceData;
      }
      return priceData;
    } catch (error) {
      console.error('Error fetching latest price from database:', error);
      throw error;
    }
  }

  /**
   * Update MWK/USD exchange rate
   * @param {number} rate - New exchange rate
   */
  updateExchangeRate(rate) {
    this.MWK_USD_RATE = rate;
    console.log(`Updated MWK/USD rate to: ${rate}`);
  }

  /**
   * Get service status
   * @returns {Object} Service status information
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      subscriberCount: this.subscribers.size,
      lastPrice: this.lastPrice,
      priceHistoryCount: this.priceHistory.length,
      mwkUsdRate: this.MWK_USD_RATE
    };
  }

  /**
   * Get fallback price from database or cache
   */
  async getFallbackPrice() {
    try {
      // Try to get last known price from database
      const lastKnownPrice = await supabaseHelpers.getLatestPriceData();
      if (lastKnownPrice) {
        console.log('📦 Retrieved fallback price from database');
        return lastKnownPrice;
      }
    } catch (error) {
      console.error('Failed to get fallback price from database:', error);
    }

    // Use cached price if available
    if (this.lastPrice) {
      console.log('📦 Using cached price as fallback');
      return this.lastPrice;
    }

    // Return default price data as last resort
    return this.getDefaultPriceData();
  }

  /**
   * Load fallback price during initialization
   */
  async loadFallbackPrice() {
    try {
      const fallbackData = await this.getFallbackPrice();
      if (fallbackData) {
        this.lastPrice = fallbackData;
        this.notifySubscribers(fallbackData);
        console.log('📦 Loaded fallback price data for initialization');
      }
    } catch (error) {
      console.error('Failed to load fallback price:', error);
    }
  }

  /**
   * Get default price data when all else fails
   */
  getDefaultPriceData() {
    const defaultUsdPrice = 45000; // Reasonable default BTC price
    const defaultMwkPrice = defaultUsdPrice * this.MWK_USD_RATE;

    return {
      symbol: 'BTC',
      price_usd: defaultUsdPrice,
      price_mwk: defaultMwkPrice,
      usd_mwk_rate: this.MWK_USD_RATE,
      volume_24h: 0,
      market_cap: 0,
      price_change_24h: 0,
      price_change_percentage_24h: 0,
      high_24h: defaultUsdPrice,
      low_24h: defaultUsdPrice,
      source: 'default',
      last_updated: new Date().toISOString(),
      fetched_at: new Date().toISOString(),
      is_fallback: true
    };
  }

  /**
   * Check if service is healthy
   */
  isHealthy() {
    const now = new Date();
    const lastUpdateTime = this.lastPrice?.fetched_at ? new Date(this.lastPrice.fetched_at) : null;
    const timeSinceUpdate = lastUpdateTime ? now - lastUpdateTime : Infinity;

    return {
      isRunning: this.isRunning,
      hasData: !!this.lastPrice,
      lastUpdate: lastUpdateTime,
      timeSinceUpdate: timeSinceUpdate,
      isStale: timeSinceUpdate > 300000, // 5 minutes
      source: this.lastPrice?.source || 'none'
    };
  }
}

// Create singleton instance
const priceService = new PriceService();

export default priceService;
