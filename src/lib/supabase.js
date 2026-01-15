import { createClient } from '@supabase/supabase-js';
import { validateUserProfile, rateLimiter } from '../utils/securityValidation';
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
  PRICE_HISTORY: 'price_history',
  USER_SESSIONS: 'user_sessions'
};

// Database views
export const VIEWS = {
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

  // Store price data
  storePriceData: async (priceData) => {
    try {
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
    } catch (error) {
      handleDatabaseError(error, 'storePriceData');
    }
  },

  // Get latest price data
  getLatestPriceData: async (symbol = 'BTC') => {
    try {
      const { data, error } = await supabase
        .from(VIEWS.BTC_PRICE_DATA)
        .select('*')
        .eq('symbol', symbol)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return data;
    } catch (error) {
      handleDatabaseError(error, 'getLatestPriceData');
    }
  },

  // Get historical price data
  getHistoricalPriceData: async (symbol = 'BTC', limit = 100) => {
    try {
      const { data, error } = await supabase
        .from(TABLES.PRICE_HISTORY)
        .select('*')
        .eq('symbol', symbol)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      handleDatabaseError(error, 'getHistoricalPriceData');
    }
  },

  // Admin price management functions
  getActivePriceOverride: async (symbol = 'BTC') => {
    try {
      const { data, error } = await supabase.rpc('get_active_price_override', {
        p_symbol: symbol
      });

      if (error) throw error;

      return data && data.length > 0 ? data[0] : null;
    } catch (error) {
      handleDatabaseError(error, 'getActivePriceOverride');
    }
  },

  createPriceOverride: async (params) => {
    try {
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
    } catch (error) {
      handleDatabaseError(error, 'createPriceOverride');
    }
  },

  deactivatePriceOverride: async (overrideId, adminUserId, reason) => {
    try {
      const { data, error } = await supabase.rpc('deactivate_price_override', {
        p_override_id: overrideId,
        p_admin_user_id: adminUserId,
        p_reason: reason
      });

      if (error) throw error;

      return data;
    } catch (error) {
      handleDatabaseError(error, 'deactivatePriceOverride');
    }
  },

  checkAdminPricePermission: async (userId, permission) => {
    try {
      const { data, error } = await supabase.rpc('check_admin_price_permission', {
        p_user_id: userId,
        p_permission: permission
      });

      if (error) throw error;

      return data || false;
    } catch (error) {
      handleDatabaseError(error, 'checkAdminPricePermission');
    }
  },

  // Create user session
  createUserSession: async (sessionData) => {
    try {
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
    } catch (error) {
      handleDatabaseError(error, 'createUserSession');
    }
  },

  // End user session
  endUserSession: async (sessionId) => {
    try {
      const { error } = await supabase
        .from(TABLES.USER_SESSIONS)
        .update({ session_end: new Date().toISOString() })
        .eq('id', sessionId);

      if (error) throw error;
    } catch (error) {
      handleDatabaseError(error, 'endUserSession');
    }
  },

  // Update profile with enhanced data
  updateUserProfile: async (profileData) => {
    try {
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
    } catch (error) {
      handleDatabaseError(error, 'updateUserProfile');
    }
  }
};

// Real-time subscriptions
export const subscribeToUserData = (userId, callback) => {
  const subscription = supabase
    .channel('user-data')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: TABLES.PROFILES,
      filter: `id=eq.${userId}`
    }, callback)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: TABLES.PRICE_HISTORY
    }, callback)
    .subscribe();

  return subscription;
};

// Unsubscribe from real-time updates
export const unsubscribeFromUserData = (subscription) => {
  if (subscription) {
    supabase.removeChannel(subscription);
  }
};