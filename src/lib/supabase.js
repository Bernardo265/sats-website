import { createClient } from '@supabase/supabase-js';
import {
  validateUserProfile,
  validatePortfolio,
  validateTransaction,
  validateOrder,
  rateLimiter
} from '../utils/securityValidation';
import { queryOptimizer, performanceMonitor } from '../utils/performanceOptimization';

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';

// Validate configuration
if (!supabaseUrl || supabaseUrl === 'https://your-project.supabase.co') {
  console.warn('⚠️ Supabase URL not configured. Please set REACT_APP_SUPABASE_URL in your .env file');
}

if (!supabaseAnonKey || supabaseAnonKey === 'your-anon-key') {
  console.warn('⚠️ Supabase Anon Key not configured. Please set REACT_APP_SUPABASE_ANON_KEY in your .env file');
}

// Create Supabase client with enhanced configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: process.env.REACT_APP_DEBUG_MODE === 'true'
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'safesats-website',
      'Content-Type': 'application/json'
    },
    fetch: (url, options = {}) => {
      // Enhanced fetch with better error handling
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
        }
      }).catch(error => {
        console.error('Supabase fetch error:', error);
        throw new Error(`Failed to fetch: ${error.message}`);
      });
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Connection status tracking
let connectionStatus = {
  isConnected: false,
  lastError: null,
  retryCount: 0,
  maxRetries: parseInt(process.env.REACT_APP_DB_MAX_RETRIES) || 3
};

// Test database connection
export const testConnection = async () => {
  try {
    const { error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (error) throw error;

    connectionStatus.isConnected = true;
    connectionStatus.lastError = null;
    connectionStatus.retryCount = 0;

    console.log('✅ Database connection successful');
    return { success: true, status: connectionStatus };
  } catch (error) {
    connectionStatus.isConnected = false;
    connectionStatus.lastError = error.message;
    connectionStatus.retryCount++;

    console.error('❌ Database connection failed:', error.message);
    return { success: false, error: error.message, status: connectionStatus };
  }
};

// Get connection status
export const getConnectionStatus = () => connectionStatus;

// Database table names
export const TABLES = {
  PROFILES: 'profiles',
  PORTFOLIOS: 'portfolios',
  TRANSACTIONS: 'transactions',
  ORDERS: 'orders',
  PRICE_HISTORY: 'price_history',
  USER_SESSIONS: 'user_sessions'
};

// Database views
export const VIEWS = {
  USER_DASHBOARD: 'user_dashboard',
  USER_TRADING_HISTORY: 'user_trading_history',
  USER_ACTIVE_ORDERS: 'user_active_orders',
  BTC_PRICE_DATA: 'btc_price_data'
};

// Enhanced error handling utility
const handleDatabaseError = (error, operation) => {
  console.error(`Database error in ${operation}:`, error);

  // Update connection status on error
  if (error.code === 'PGRST301' || error.message.includes('connection')) {
    connectionStatus.isConnected = false;
    connectionStatus.lastError = error.message;
  }

  // Enhance error message for better user experience
  const enhancedError = new Error(error.message);
  enhancedError.code = error.code;
  enhancedError.details = error.details;
  enhancedError.hint = error.hint;
  enhancedError.operation = operation;

  throw enhancedError;
};

// Helper functions for common operations with enhanced error handling
export const supabaseHelpers = {
  // Get current user
  getCurrentUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      handleDatabaseError(error, 'getCurrentUser');
    }
  },

  // Get user profile
  getUserProfile: async (userId) => {
    try {
      if (!userId) throw new Error('User ID is required');

      // Check cache first
      const cacheKey = { userId };
      const cachedResult = queryOptimizer.getCachedResult(TABLES.PROFILES, cacheKey);
      if (cachedResult) {
        return cachedResult;
      }

      // Measure performance
      const startTime = performance.now();

      const { data, error } = await supabase
        .from(TABLES.PROFILES)
        .select('*')
        .eq('id', userId)
        .single();

      const duration = performance.now() - startTime;
      queryOptimizer.recordQueryPerformance('getUserProfile', duration);

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned

      // Cache the result if data exists
      if (data) {
        queryOptimizer.cacheResult(TABLES.PROFILES, cacheKey, data, 300000); // 5 minutes
      }

      return data;
    } catch (error) {
      handleDatabaseError(error, 'getUserProfile');
    }
  },

  // Create or update user profile
  upsertUserProfile: async (profile) => {
    try {
      if (!profile || !profile.id) throw new Error('Profile with ID is required');

      // Security validation
      const validation = validateUserProfile(profile);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Rate limiting
      if (!rateLimiter.isAllowed(profile.id, 'default')) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      // Measure performance
      const startTime = performance.now();

      const { data, error } = await supabase
        .from(TABLES.PROFILES)
        .upsert(validation.sanitizedData, { onConflict: 'id' })
        .select()
        .single();

      const duration = performance.now() - startTime;
      queryOptimizer.recordQueryPerformance('upsertUserProfile', duration);

      if (error) throw error;

      // Invalidate cache for this user
      queryOptimizer.invalidateTable(TABLES.PROFILES);

      return data;
    } catch (error) {
      handleDatabaseError(error, 'upsertUserProfile');
    }
  },

  // Get user portfolio
  getUserPortfolio: async (userId) => {
    try {
      if (!userId) throw new Error('User ID is required');

      // Check cache first
      const cacheKey = { userId };
      const cachedResult = queryOptimizer.getCachedResult(TABLES.PORTFOLIOS, cacheKey);
      if (cachedResult) {
        return cachedResult;
      }

      // Measure performance
      const startTime = performance.now();

      const { data, error } = await supabase
        .from(TABLES.PORTFOLIOS)
        .select('*')
        .eq('user_id', userId)
        .single();

      const duration = performance.now() - startTime;
      queryOptimizer.recordQueryPerformance('getUserPortfolio', duration);

      if (error && error.code !== 'PGRST116') throw error;

      // Cache the result if data exists
      if (data) {
        queryOptimizer.cacheResult(TABLES.PORTFOLIOS, cacheKey, data, 60000); // 1 minute (portfolios change frequently)
      }

      return data;
    } catch (error) {
      handleDatabaseError(error, 'getUserPortfolio');
    }
  },

  // Create or update portfolio
  upsertPortfolio: async (portfolio) => {
    try {
      if (!portfolio || !portfolio.user_id) throw new Error('Portfolio with user_id is required');

      // Security validation
      const validation = validatePortfolio(portfolio);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Rate limiting
      if (!rateLimiter.isAllowed(portfolio.user_id, 'default')) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      const { data, error } = await supabase
        .from(TABLES.PORTFOLIOS)
        .upsert(validation.sanitizedData, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleDatabaseError(error, 'upsertPortfolio');
    }
  },

  // Get user transactions
  getUserTransactions: async (userId, limit = 50) => {
    const { data, error } = await supabase
      .from(TABLES.TRANSACTIONS)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  },

  // Create transaction
  createTransaction: async (transaction) => {
    try {
      if (!transaction || !transaction.user_id) throw new Error('Transaction with user_id is required');

      // Security validation
      const validation = validateTransaction(transaction);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Rate limiting for trading operations
      if (!rateLimiter.isAllowed(transaction.user_id, 'trading')) {
        throw new Error('Trading rate limit exceeded. Please try again later.');
      }

      const { data, error } = await supabase
        .from(TABLES.TRANSACTIONS)
        .insert(validation.sanitizedData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleDatabaseError(error, 'createTransaction');
    }
  },

  // Get user orders
  getUserOrders: async (userId, status = null) => {
    let query = supabase
      .from(TABLES.ORDERS)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // Create order
  createOrder: async (order) => {
    try {
      if (!order || !order.user_id) throw new Error('Order with user_id is required');

      // Security validation
      const validation = validateOrder(order);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Rate limiting for trading operations
      if (!rateLimiter.isAllowed(order.user_id, 'trading')) {
        throw new Error('Trading rate limit exceeded. Please try again later.');
      }

      const { data, error } = await supabase
        .from(TABLES.ORDERS)
        .insert(validation.sanitizedData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleDatabaseError(error, 'createOrder');
    }
  },

  // Update order
  updateOrder: async (orderId, updates) => {
    const { data, error } = await supabase
      .from(TABLES.ORDERS)
      .update(updates)
      .eq('id', orderId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete order
  deleteOrder: async (orderId) => {
    const { error } = await supabase
      .from(TABLES.ORDERS)
      .delete()
      .eq('id', orderId);

    if (error) throw error;
  },

  // Enhanced dashboard data
  getUserDashboard: async () => {
    const { data, error } = await supabase
      .from(VIEWS.USER_DASHBOARD)
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Get trading history with pagination
  getTradingHistory: async (limit = 50, offset = 0) => {
    const { data, error } = await supabase
      .from(VIEWS.USER_TRADING_HISTORY)
      .select('*')
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data;
  },

  // Get active orders
  getActiveOrders: async () => {
    const { data, error } = await supabase
      .from(VIEWS.USER_ACTIVE_ORDERS)
      .select('*');

    if (error) throw error;
    return data;
  },

  // Store price data
  storePriceData: async (priceData) => {
    const { data, error } = await supabase.rpc('store_price_data', {
      p_symbol: priceData.symbol || 'BTC',
      p_price_usd: priceData.price_usd,
      p_price_mwk: priceData.price_mwk,
      p_usd_mwk_rate: priceData.usd_mwk_rate,
      p_volume_24h: priceData.volume_24h,
      p_market_cap: priceData.market_cap,
      p_price_change_24h: priceData.price_change_24h,
      p_price_change_percentage_24h: priceData.price_change_percentage_24h,
      p_high_24h: priceData.high_24h,
      p_low_24h: priceData.low_24h,
      p_source: priceData.source || 'coingecko'
    });

    if (error) throw error;
    return data;
  },

  // Get latest price data
  getLatestPriceData: async (symbol = 'BTC') => {
    const { data, error } = await supabase
      .from(VIEWS.BTC_PRICE_DATA)
      .select('*')
      .eq('symbol', symbol)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Process limit orders
  processLimitOrders: async (currentBtcPrice) => {
    const { data, error } = await supabase.rpc('process_limit_orders', {
      current_btc_price: currentBtcPrice
    });

    if (error) throw error;
    return data;
  },

  // Admin price management functions
  getActivePriceOverride: async (symbol = 'BTC') => {
    const { data, error } = await supabase.rpc('get_active_price_override', {
      p_symbol: symbol
    });

    if (error) throw error;
    return data && data.length > 0 ? data[0] : null;
  },

  createPriceOverride: async (params) => {
    const { data, error } = await supabase.rpc('create_price_override', {
      p_admin_user_id: params.adminUserId,
      p_symbol: params.symbol || 'BTC',
      p_price_usd: params.priceUsd,
      p_price_mwk: params.priceMwk,
      p_usd_mwk_rate: params.usdMwkRate,
      p_reason: params.reason,
      p_duration_minutes: params.durationMinutes,
      p_disable_auto_updates: params.disableAutoUpdates,
      p_previous_price_usd: params.previousPriceUsd,
      p_previous_price_mwk: params.previousPriceMwk
    });

    if (error) throw error;
    return data;
  },

  deactivatePriceOverride: async (overrideId, adminUserId, reason) => {
    const { data, error } = await supabase.rpc('deactivate_price_override', {
      p_override_id: overrideId,
      p_admin_user_id: adminUserId,
      p_reason: reason
    });

    if (error) throw error;
    return data;
  },

  checkAdminPricePermission: async (userId, permission) => {
    const { data, error } = await supabase.rpc('check_admin_price_permission', {
      p_user_id: userId,
      p_permission: permission
    });

    if (error) throw error;
    return data || false;
  },

  // Calculate portfolio value
  calculatePortfolioValue: async (userId, currentBtcPrice) => {
    const { data, error } = await supabase.rpc('calculate_portfolio_value', {
      p_user_id: userId,
      p_current_btc_price: currentBtcPrice
    });

    if (error) throw error;
    return data;
  },

  // Create user session
  createUserSession: async (sessionData) => {
    const { data, error } = await supabase
      .from(TABLES.USER_SESSIONS)
      .insert({
        user_id: sessionData.user_id,
        ip_address: sessionData.ip_address,
        user_agent: sessionData.user_agent,
        device_type: sessionData.device_type,
        location: sessionData.location
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // End user session
  endUserSession: async (sessionId) => {
    const { error } = await supabase
      .from(TABLES.USER_SESSIONS)
      .update({ session_end: new Date().toISOString() })
      .eq('id', sessionId);

    if (error) throw error;
  },

  // Update profile with enhanced data
  updateUserProfile: async (profileData) => {
    const { data, error } = await supabase
      .from(TABLES.PROFILES)
      .update({
        full_name: profileData.full_name,
        phone: profileData.phone,
        preferred_currency: profileData.preferred_currency,
        timezone: profileData.timezone,
        last_login_at: new Date().toISOString()
      })
      .eq('id', profileData.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// Real-time subscriptions
export const subscribeToUserData = (userId, callback) => {
  const subscription = supabase
    .channel('user-data')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: TABLES.PORTFOLIOS,
        filter: `user_id=eq.${userId}`
      }, 
      callback
    )
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: TABLES.TRANSACTIONS,
        filter: `user_id=eq.${userId}`
      }, 
      callback
    )
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: TABLES.ORDERS,
        filter: `user_id=eq.${userId}`
      }, 
      callback
    )
    .subscribe();

  return subscription;
};

// Unsubscribe from real-time updates
export const unsubscribeFromUserData = (subscription) => {
  if (subscription) {
    supabase.removeChannel(subscription);
  }
};
