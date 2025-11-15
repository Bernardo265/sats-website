/**
 * Database Health Check Utility
 * Comprehensive health monitoring for database connections and operations
 */

import { supabase, supabaseHelpers, testConnection, getConnectionStatus } from '../lib/supabase';
import dbConfig from '../lib/dbConfig';

/**
 * Database Health Check Class
 */
class DatabaseHealthCheck {
  constructor() {
    this.checks = [];
    this.lastCheckTime = null;
    this.checkInterval = 30000; // 30 seconds
    this.isMonitoring = false;
  }

  /**
   * Run comprehensive health check
   */
  async runHealthCheck() {
    console.log('🏥 Running database health check...');
    const startTime = Date.now();
    const results = {
      timestamp: new Date().toISOString(),
      overall: 'healthy',
      checks: {},
      performance: {},
      errors: []
    };

    try {
      // 1. Connection Test
      results.checks.connection = await this.checkConnection();
      
      // 2. Authentication Test
      results.checks.authentication = await this.checkAuthentication();
      
      // 3. Basic CRUD Operations
      results.checks.crud = await this.checkCrudOperations();
      
      // 4. Real-time Connection
      results.checks.realtime = await this.checkRealtimeConnection();
      
      // 5. Database Schema
      results.checks.schema = await this.checkDatabaseSchema();
      
      // 6. Performance Metrics
      results.performance = await this.checkPerformance();
      
      // Determine overall health
      const failedChecks = Object.values(results.checks).filter(check => !check.healthy);
      if (failedChecks.length > 0) {
        results.overall = failedChecks.length > 2 ? 'critical' : 'warning';
        results.errors = failedChecks.map(check => check.error).filter(Boolean);
      }

      const duration = Date.now() - startTime;
      results.performance.healthCheckDuration = duration;
      
      console.log(`✅ Health check completed in ${duration}ms - Status: ${results.overall}`);
      this.lastCheckTime = Date.now();
      
      return results;
    } catch (error) {
      console.error('❌ Health check failed:', error);
      results.overall = 'critical';
      results.errors.push(error.message);
      return results;
    }
  }

  /**
   * Check database connection
   */
  async checkConnection() {
    try {
      const result = await testConnection();
      const status = getConnectionStatus();
      
      return {
        healthy: result.success,
        status: status,
        error: result.error || null,
        details: 'Database connection test'
      };
    } catch (error) {
      return {
        healthy: false,
        error: error.message,
        details: 'Database connection test failed'
      };
    }
  }

  /**
   * Check authentication system
   */
  async checkAuthentication() {
    try {
      // Test getting current user (should not throw even if no user)
      const user = await supabaseHelpers.getCurrentUser();
      
      return {
        healthy: true,
        hasUser: !!user,
        details: 'Authentication system operational'
      };
    } catch (error) {
      return {
        healthy: false,
        error: error.message,
        details: 'Authentication system check failed'
      };
    }
  }

  /**
   * Check basic CRUD operations
   */
  async checkCrudOperations() {
    try {
      // Test read operation on a system table
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      if (error) throw error;
      
      return {
        healthy: true,
        details: 'Basic CRUD operations working',
        canRead: true
      };
    } catch (error) {
      return {
        healthy: false,
        error: error.message,
        details: 'CRUD operations check failed'
      };
    }
  }

  /**
   * Check real-time connection
   */
  async checkRealtimeConnection() {
    try {
      const realtimeStatus = supabase.realtime.isConnected();
      
      return {
        healthy: true,
        connected: realtimeStatus,
        details: 'Real-time connection status checked'
      };
    } catch (error) {
      return {
        healthy: false,
        error: error.message,
        details: 'Real-time connection check failed'
      };
    }
  }

  /**
   * Check database schema
   */
  async checkDatabaseSchema() {
    try {
      // Check if required tables exist by attempting to query them
      const tables = ['profiles', 'portfolios', 'transactions', 'orders', 'price_history'];
      const tableChecks = {};
      
      for (const table of tables) {
        try {
          const { error } = await supabase
            .from(table)
            .select('count')
            .limit(1);
          
          tableChecks[table] = !error;
        } catch (err) {
          tableChecks[table] = false;
        }
      }
      
      const allTablesExist = Object.values(tableChecks).every(exists => exists);
      
      return {
        healthy: allTablesExist,
        tables: tableChecks,
        details: 'Database schema validation'
      };
    } catch (error) {
      return {
        healthy: false,
        error: error.message,
        details: 'Database schema check failed'
      };
    }
  }

  /**
   * Check performance metrics
   */
  async checkPerformance() {
    const metrics = {
      connectionLatency: null,
      queryLatency: null,
      timestamp: Date.now()
    };

    try {
      // Test connection latency
      const connectionStart = Date.now();
      await testConnection();
      metrics.connectionLatency = Date.now() - connectionStart;

      // Test query latency
      const queryStart = Date.now();
      await supabase.from('profiles').select('count').limit(1);
      metrics.queryLatency = Date.now() - queryStart;

      return metrics;
    } catch (error) {
      console.error('Performance check error:', error);
      return metrics;
    }
  }

  /**
   * Start continuous monitoring
   */
  startMonitoring(interval = this.checkInterval) {
    if (this.isMonitoring) {
      console.log('Health monitoring already running');
      return;
    }

    this.checkInterval = interval;
    this.isMonitoring = true;
    
    console.log(`🔄 Starting database health monitoring (interval: ${interval}ms)`);
    
    this.monitoringInterval = setInterval(async () => {
      try {
        const results = await this.runHealthCheck();
        
        // Log warnings and errors
        if (results.overall !== 'healthy') {
          console.warn('⚠️ Database health issue detected:', results.overall);
          console.warn('Errors:', results.errors);
        }
        
        // Emit custom event for health status
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('dbHealthCheck', {
            detail: results
          }));
        }
      } catch (error) {
        console.error('Health monitoring error:', error);
      }
    }, interval);
  }

  /**
   * Stop continuous monitoring
   */
  stopMonitoring() {
    if (!this.isMonitoring) {
      console.log('Health monitoring not running');
      return;
    }

    clearInterval(this.monitoringInterval);
    this.isMonitoring = false;
    console.log('🛑 Database health monitoring stopped');
  }

  /**
   * Get monitoring status
   */
  getMonitoringStatus() {
    return {
      isMonitoring: this.isMonitoring,
      checkInterval: this.checkInterval,
      lastCheckTime: this.lastCheckTime,
      nextCheckIn: this.isMonitoring ? 
        this.checkInterval - (Date.now() - (this.lastCheckTime || 0)) : null
    };
  }

  /**
   * Quick health status
   */
  async getQuickStatus() {
    try {
      const connectionStatus = getConnectionStatus();
      const dbConfigStatus = dbConfig.getConfig();
      
      return {
        connected: connectionStatus.isConnected,
        initialized: dbConfigStatus.isInitialized,
        monitoring: this.isMonitoring,
        lastError: connectionStatus.lastError,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        connected: false,
        initialized: false,
        monitoring: this.isMonitoring,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

// Create singleton instance
const dbHealthCheck = new DatabaseHealthCheck();

export default dbHealthCheck;

// Export class for testing
export { DatabaseHealthCheck };

// Auto-start monitoring in development mode
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_DEBUG_MODE === 'true') {
  window.dbHealthCheck = dbHealthCheck;
  console.log('Database health check exposed to window for debugging');
}
