/**
 * Service Initialization and Management
 * Centralized service management for the SafeSats backend system
 */

import priceService from './priceService';
import tradingService from './tradingService';
import portfolioService from './portfolioService';
import realtimeService from './realtimeService';

/**
 * Service Manager for coordinating all backend services
 */
class ServiceManager {
  constructor() {
    this.services = {
      price: priceService,
      trading: tradingService,
      portfolio: portfolioService,
      realtime: realtimeService
    };
    
    this.isInitialized = false;
    this.initializationPromise = null;
  }

  /**
   * Initialize all services
   * @param {Object} config - Configuration options
   * @param {string} userId - User ID for user-specific services
   */
  async initialize(config = {}, userId = null) {
    if (this.isInitialized) {
      console.log('Services already initialized');
      return;
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this._performInitialization(config, userId);
    return this.initializationPromise;
  }

  /**
   * Perform the actual initialization
   * @private
   */
  async _performInitialization(config, userId) {
    try {
      console.log('Initializing SafeSats backend services...');

      // Configure services based on environment variables and config
      this._configureServices(config);

      // Initialize price service with error handling
      if (config.enablePriceService !== false) {
        const priceInterval = config.priceUpdateInterval ||
          parseInt(process.env.REACT_APP_PRICE_UPDATE_INTERVAL) ||
          30000;

        console.log(`Starting price service with ${priceInterval}ms interval`);

        try {
          const priceResult = await this.services.price.start(priceInterval);
          if (priceResult.success) {
            console.log('✅ Price service started successfully');
          } else {
            console.warn('⚠️ Price service started with warnings:', priceResult.error);
          }
        } catch (error) {
          console.error('❌ Price service failed to start:', error.message);
          console.warn('⚠️ Continuing initialization without price service');
          // Don't throw error - allow app to continue without price service
        }
      }

      // Initialize real-time service if user is provided
      if (userId && config.enableRealtime !== false) {
        console.log('Initializing real-time service for user:', userId);
        await this.services.realtime.initialize(userId);
      }

      // Configure trading service
      if (config.tradingConfig) {
        this.services.trading.updateConfig(config.tradingConfig);
      }

      this.isInitialized = true;
      console.log('All services initialized successfully');

      // Set up global error handlers
      this._setupErrorHandlers();

      return {
        success: true,
        services: this.getServiceStatus()
      };

    } catch (error) {
      console.error('Error initializing services:', error);
      this.isInitialized = false;
      this.initializationPromise = null;
      throw error;
    }
  }

  /**
   * Configure services based on environment and config
   * @private
   */
  _configureServices(config) {
    // Configure trading service
    const tradingConfig = {
      tradingFee: config.tradingFee || 
        parseFloat(process.env.REACT_APP_DEFAULT_TRADING_FEE) || 
        0.001,
      minTradeAmount: config.minTradeAmount || 
        parseInt(process.env.REACT_APP_MIN_TRADE_AMOUNT) || 
        1000,
      maxTradeAmount: config.maxTradeAmount || 
        parseInt(process.env.REACT_APP_MAX_TRADE_AMOUNT) || 
        1000000
    };

    this.services.trading.updateConfig(tradingConfig);

    // Configure price service exchange rate
    const mwkUsdRate = config.mwkUsdRate || 
      parseFloat(process.env.REACT_APP_MWK_USD_RATE) || 
      1730;
    
    this.services.price.updateExchangeRate(mwkUsdRate);

    console.log('Services configured with:', {
      tradingConfig,
      mwkUsdRate
    });
  }

  /**
   * Set up global error handlers
   * @private
   */
  _setupErrorHandlers() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection in services:', event.reason);
      
      // Optionally report to error tracking service
      if (process.env.REACT_APP_ERROR_REPORTING_ENABLED === 'true') {
        // Report error to monitoring service
        this._reportError('unhandled_promise_rejection', event.reason);
      }
    });

    // Handle general errors
    window.addEventListener('error', (event) => {
      console.error('Global error in services:', event.error);
      
      if (process.env.REACT_APP_ERROR_REPORTING_ENABLED === 'true') {
        this._reportError('global_error', event.error);
      }
    });
  }

  /**
   * Report errors to monitoring service
   * @private
   */
  _reportError(type, error) {
    // Implement error reporting logic here
    console.log(`Reporting ${type}:`, error);
  }

  /**
   * Shutdown all services
   */
  async shutdown() {
    try {
      console.log('Shutting down services...');

      // Stop price service
      this.services.price.stop();

      // Cleanup real-time service
      await this.services.realtime.cleanup();

      // Clear portfolio cache
      this.services.portfolio.clearCache();

      this.isInitialized = false;
      this.initializationPromise = null;

      console.log('All services shut down successfully');
    } catch (error) {
      console.error('Error shutting down services:', error);
    }
  }

  /**
   * Restart services
   */
  async restart(config = {}, userId = null) {
    await this.shutdown();
    await this.initialize(config, userId);
  }

  /**
   * Get status of all services
   */
  getServiceStatus() {
    return {
      initialized: this.isInitialized,
      price: this.services.price.getStatus(),
      trading: this.services.trading.getConfig(),
      realtime: this.services.realtime.getStatus(),
      portfolio: {
        cacheSize: this.services.portfolio.performanceCache?.size || 0
      }
    };
  }

  /**
   * Get a specific service instance
   */
  getService(serviceName) {
    return this.services[serviceName];
  }

  /**
   * Check if services are healthy
   */
  async healthCheck() {
    const status = this.getServiceStatus();
    const issues = [];

    // Check price service
    if (!status.price.isRunning) {
      issues.push('Price service is not running');
    }

    // Check real-time service
    if (!status.realtime.isConnected) {
      issues.push('Real-time service is not connected');
    }

    // Check if there are too many reconnection attempts
    if (status.realtime.reconnectAttempts > 3) {
      issues.push('Real-time service has connection issues');
    }

    return {
      healthy: issues.length === 0,
      issues,
      status
    };
  }

  /**
   * Subscribe to service events
   */
  subscribe(serviceName, eventType, callback) {
    const service = this.services[serviceName];
    if (service && service.subscribe) {
      return service.subscribe(eventType, callback);
    }
    throw new Error(`Service ${serviceName} does not support subscriptions`);
  }

  /**
   * Get configuration for development/debugging
   */
  getDebugInfo() {
    return {
      isInitialized: this.isInitialized,
      services: Object.keys(this.services),
      status: this.getServiceStatus(),
      environment: {
        priceUpdateInterval: process.env.REACT_APP_PRICE_UPDATE_INTERVAL,
        mwkUsdRate: process.env.REACT_APP_MWK_USD_RATE,
        tradingFee: process.env.REACT_APP_DEFAULT_TRADING_FEE,
        realtimeEnabled: process.env.REACT_APP_REALTIME_ENABLED,
        debugMode: process.env.REACT_APP_DEBUG_MODE
      }
    };
  }
}

// Create singleton instance
const serviceManager = new ServiceManager();

// Export individual services and manager
export {
  priceService,
  tradingService,
  portfolioService,
  realtimeService,
  serviceManager
};

export default serviceManager;

// Auto-initialize in development mode if debug is enabled
if (process.env.REACT_APP_DEBUG_MODE === 'true') {
  window.serviceManager = serviceManager;
  window.services = {
    price: priceService,
    trading: tradingService,
    portfolio: portfolioService,
    realtime: realtimeService
  };
  
  console.log('Services exposed to window for debugging');
}
