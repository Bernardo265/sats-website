/**
 * Database Configuration and Connection Management
 * Centralized configuration for database connections and settings
 */

import { supabase, testConnection, getConnectionStatus } from './supabase';

/**
 * Database configuration class
 */
class DatabaseConfig {
  constructor() {
    this.config = {
      connectionTimeout: parseInt(process.env.REACT_APP_DB_CONNECTION_TIMEOUT) || 10000,
      maxRetries: parseInt(process.env.REACT_APP_DB_MAX_RETRIES) || 3,
      retryDelay: parseInt(process.env.REACT_APP_DB_RETRY_DELAY) || 1000,
      enableRealtime: process.env.REACT_APP_REALTIME_ENABLED !== 'false',
      enableDebugMode: process.env.REACT_APP_DEBUG_MODE === 'true'
    };
    
    this.isInitialized = false;
    this.connectionPromise = null;
  }

  /**
   * Initialize database connection
   */
  async initialize() {
    if (this.isInitialized) {
      return { success: true, message: 'Database already initialized' };
    }

    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = this._performInitialization();
    return this.connectionPromise;
  }

  /**
   * Perform the actual initialization
   */
  async _performInitialization() {
    try {
      console.log('🔄 Initializing database connection...');
      
      // Test connection
      const connectionResult = await testConnection();
      
      if (!connectionResult.success) {
        throw new Error(`Database connection failed: ${connectionResult.error}`);
      }

      // Set up error handlers
      this._setupErrorHandlers();
      
      this.isInitialized = true;
      console.log('✅ Database initialized successfully');
      
      return { 
        success: true, 
        message: 'Database initialized successfully',
        config: this.config
      };
    } catch (error) {
      console.error('❌ Database initialization failed:', error);
      this.connectionPromise = null;
      
      return { 
        success: false, 
        error: error.message,
        config: this.config
      };
    }
  }

  /**
   * Set up global error handlers
   */
  _setupErrorHandlers() {
    // Handle auth state changes
    supabase.auth.onAuthStateChange((event, session) => {
      if (this.config.enableDebugMode) {
        console.log('Auth state changed:', event, session?.user?.id);
      }
    });

    // Handle realtime connection status
    if (this.config.enableRealtime) {
      supabase.realtime.onOpen(() => {
        if (this.config.enableDebugMode) {
          console.log('✅ Realtime connection opened');
        }
      });

      supabase.realtime.onClose(() => {
        if (this.config.enableDebugMode) {
          console.log('🔌 Realtime connection closed');
        }
      });

      supabase.realtime.onError((error) => {
        console.error('❌ Realtime connection error:', error);
      });
    }
  }

  /**
   * Retry connection with exponential backoff
   */
  async retryConnection(attempt = 1) {
    if (attempt > this.config.maxRetries) {
      throw new Error(`Max retry attempts (${this.config.maxRetries}) exceeded`);
    }

    const delay = this.config.retryDelay * Math.pow(2, attempt - 1);
    console.log(`🔄 Retrying connection (attempt ${attempt}/${this.config.maxRetries}) in ${delay}ms...`);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    try {
      const result = await testConnection();
      if (result.success) {
        return result;
      }
      throw new Error(result.error);
    } catch (error) {
      return this.retryConnection(attempt + 1);
    }
  }

  /**
   * Get current configuration
   */
  getConfig() {
    return {
      ...this.config,
      isInitialized: this.isInitialized,
      connectionStatus: getConnectionStatus()
    };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    console.log('📝 Database configuration updated:', this.config);
  }

  /**
   * Reset connection
   */
  async reset() {
    this.isInitialized = false;
    this.connectionPromise = null;
    console.log('🔄 Database connection reset');
    return this.initialize();
  }

  /**
   * Health check
   */
  async healthCheck() {
    try {
      const connectionResult = await testConnection();
      const status = getConnectionStatus();
      
      return {
        healthy: connectionResult.success,
        status: status,
        timestamp: new Date().toISOString(),
        config: this.config
      };
    } catch (error) {
      return {
        healthy: false,
        error: error.message,
        timestamp: new Date().toISOString(),
        config: this.config
      };
    }
  }

  /**
   * Get database statistics
   */
  async getStats() {
    try {
      // This would require additional database functions to be implemented
      // For now, return basic connection info
      return {
        connectionStatus: getConnectionStatus(),
        config: this.config,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting database stats:', error);
      return null;
    }
  }
}

// Create singleton instance
const dbConfig = new DatabaseConfig();

export default dbConfig;

// Export utilities
export {
  DatabaseConfig,
  dbConfig
};

// Auto-initialize in development mode
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_DEBUG_MODE === 'true') {
  window.dbConfig = dbConfig;
  console.log('Database config exposed to window for debugging');
}
