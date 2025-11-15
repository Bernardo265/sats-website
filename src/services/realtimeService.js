import { supabase, TABLES, VIEWS } from '../lib/supabase';
import priceService from './priceService';

/**
 * Real-time Service for managing Supabase real-time subscriptions
 */
class RealtimeService {
  constructor() {
    this.subscriptions = new Map();
    this.subscribers = new Map();
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000; // Start with 1 second
  }

  /**
   * Initialize real-time connections
   * @param {string} userId - User ID for user-specific subscriptions
   */
  async initialize(userId) {
    try {
      console.log('Initializing real-time service...');
      
      if (userId) {
        await this.subscribeToUserData(userId);
      }
      
      await this.subscribeToPriceData();
      
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      console.log('Real-time service initialized successfully');
    } catch (error) {
      console.error('Error initializing real-time service:', error);
      this.handleConnectionError();
    }
  }

  /**
   * Subscribe to user-specific data changes
   * @param {string} userId - User ID
   */
  async subscribeToUserData(userId) {
    const subscriptionKey = `user_data_${userId}`;
    
    // Unsubscribe existing subscription if any
    if (this.subscriptions.has(subscriptionKey)) {
      await this.unsubscribe(subscriptionKey);
    }

    const subscription = supabase
      .channel(`user-data-${userId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: TABLES.PORTFOLIOS,
          filter: `user_id=eq.${userId}`
        }, 
        (payload) => this.handlePortfolioChange(payload)
      )
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: TABLES.TRANSACTIONS,
          filter: `user_id=eq.${userId}`
        }, 
        (payload) => this.handleTransactionChange(payload)
      )
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: TABLES.ORDERS,
          filter: `user_id=eq.${userId}`
        }, 
        (payload) => this.handleOrderChange(payload)
      )
      .subscribe((status) => {
        console.log(`User data subscription status: ${status}`);
        if (status === 'SUBSCRIBED') {
          this.notifySubscribers('connection', { status: 'connected', type: 'user_data' });
        } else if (status === 'CHANNEL_ERROR') {
          this.handleConnectionError();
        }
      });

    this.subscriptions.set(subscriptionKey, subscription);
  }

  /**
   * Subscribe to price data changes
   */
  async subscribeToPriceData() {
    const subscriptionKey = 'price_data';
    
    // Unsubscribe existing subscription if any
    if (this.subscriptions.has(subscriptionKey)) {
      await this.unsubscribe(subscriptionKey);
    }

    const subscription = supabase
      .channel('price-data')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: TABLES.PRICE_HISTORY,
          filter: `symbol=eq.BTC`
        }, 
        (payload) => this.handlePriceChange(payload)
      )
      .subscribe((status) => {
        console.log(`Price data subscription status: ${status}`);
        if (status === 'SUBSCRIBED') {
          this.notifySubscribers('connection', { status: 'connected', type: 'price_data' });
        } else if (status === 'CHANNEL_ERROR') {
          this.handleConnectionError();
        }
      });

    this.subscriptions.set(subscriptionKey, subscription);
  }

  /**
   * Handle portfolio changes
   * @param {Object} payload - Change payload
   */
  handlePortfolioChange(payload) {
    console.log('Portfolio change detected:', payload);
    
    this.notifySubscribers('portfolio', {
      eventType: payload.eventType,
      new: payload.new,
      old: payload.old,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Handle transaction changes
   * @param {Object} payload - Change payload
   */
  handleTransactionChange(payload) {
    console.log('Transaction change detected:', payload);
    
    this.notifySubscribers('transaction', {
      eventType: payload.eventType,
      new: payload.new,
      old: payload.old,
      timestamp: new Date().toISOString()
    });

    // If it's a new completed transaction, trigger portfolio recalculation
    if (payload.eventType === 'INSERT' && payload.new?.status === 'completed') {
      this.notifySubscribers('trade_executed', {
        transaction: payload.new,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Handle order changes
   * @param {Object} payload - Change payload
   */
  handleOrderChange(payload) {
    console.log('Order change detected:', payload);
    
    this.notifySubscribers('order', {
      eventType: payload.eventType,
      new: payload.new,
      old: payload.old,
      timestamp: new Date().toISOString()
    });

    // Handle order status changes
    if (payload.eventType === 'UPDATE') {
      const oldStatus = payload.old?.status;
      const newStatus = payload.new?.status;
      
      if (oldStatus === 'pending' && newStatus === 'completed') {
        this.notifySubscribers('order_executed', {
          order: payload.new,
          timestamp: new Date().toISOString()
        });
      } else if (oldStatus === 'pending' && newStatus === 'cancelled') {
        this.notifySubscribers('order_cancelled', {
          order: payload.new,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  /**
   * Handle price changes
   * @param {Object} payload - Change payload
   */
  handlePriceChange(payload) {
    console.log('Price change detected:', payload);
    
    if (payload.new) {
      // Update price service with new data
      priceService.lastPrice = {
        symbol: payload.new.symbol,
        btc_usd: payload.new.price_usd,
        btc_mwk: payload.new.price_mwk,
        usd_mwk_rate: payload.new.usd_mwk_rate,
        price_change_24h: payload.new.price_change_24h,
        price_change_percentage_24h: payload.new.price_change_percentage_24h,
        high_24h: payload.new.high_24h,
        low_24h: payload.new.low_24h,
        volume_24h: payload.new.volume_24h,
        market_cap: payload.new.market_cap,
        last_updated: payload.new.created_at,
        source: payload.new.source
      };

      this.notifySubscribers('price', {
        eventType: 'UPDATE',
        priceData: priceService.lastPrice,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Subscribe to specific event types
   * @param {string} eventType - Event type to subscribe to
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  subscribe(eventType, callback) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    
    this.subscribers.get(eventType).add(callback);
    
    // Return unsubscribe function
    return () => {
      const eventSubscribers = this.subscribers.get(eventType);
      if (eventSubscribers) {
        eventSubscribers.delete(callback);
        if (eventSubscribers.size === 0) {
          this.subscribers.delete(eventType);
        }
      }
    };
  }

  /**
   * Notify subscribers of events
   * @param {string} eventType - Event type
   * @param {Object} data - Event data
   */
  notifySubscribers(eventType, data) {
    const eventSubscribers = this.subscribers.get(eventType);
    if (eventSubscribers) {
      eventSubscribers.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${eventType} subscriber callback:`, error);
        }
      });
    }
  }

  /**
   * Handle connection errors and implement reconnection logic
   */
  async handleConnectionError() {
    this.isConnected = false;
    
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1); // Exponential backoff
      
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.reconnect();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
      this.notifySubscribers('connection', { 
        status: 'failed', 
        message: 'Max reconnection attempts reached' 
      });
    }
  }

  /**
   * Attempt to reconnect
   */
  async reconnect() {
    try {
      console.log('Attempting to reconnect...');
      
      // Close all existing subscriptions
      await this.cleanup();
      
      // Re-initialize (this will require the userId to be stored or passed again)
      // For now, we'll just notify that reconnection is needed
      this.notifySubscribers('connection', { 
        status: 'reconnection_needed',
        message: 'Please refresh the page to restore real-time updates'
      });
      
    } catch (error) {
      console.error('Reconnection failed:', error);
      this.handleConnectionError();
    }
  }

  /**
   * Unsubscribe from a specific subscription
   * @param {string} subscriptionKey - Subscription key
   */
  async unsubscribe(subscriptionKey) {
    const subscription = this.subscriptions.get(subscriptionKey);
    if (subscription) {
      await supabase.removeChannel(subscription);
      this.subscriptions.delete(subscriptionKey);
      console.log(`Unsubscribed from ${subscriptionKey}`);
    }
  }

  /**
   * Clean up all subscriptions
   */
  async cleanup() {
    console.log('Cleaning up real-time subscriptions...');
    
    for (const [key, subscription] of this.subscriptions) {
      try {
        await supabase.removeChannel(subscription);
      } catch (error) {
        console.error(`Error removing subscription ${key}:`, error);
      }
    }
    
    this.subscriptions.clear();
    this.subscribers.clear();
    this.isConnected = false;
    
    console.log('Real-time service cleanup completed');
  }

  /**
   * Get connection status
   * @returns {Object} Connection status
   */
  getStatus() {
    return {
      isConnected: this.isConnected,
      subscriptionCount: this.subscriptions.size,
      subscriberCount: Array.from(this.subscribers.values()).reduce((total, set) => total + set.size, 0),
      reconnectAttempts: this.reconnectAttempts
    };
  }
}

// Create singleton instance
const realtimeService = new RealtimeService();

export default realtimeService;
