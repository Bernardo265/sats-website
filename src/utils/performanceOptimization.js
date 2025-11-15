/**
 * Performance Optimization Utilities
 * Caching, query optimization, and performance monitoring for database operations
 */

/**
 * Simple in-memory cache with TTL support
 */
class MemoryCache {
  constructor() {
    this.cache = new Map();
    this.timers = new Map();
  }

  /**
   * Set cache entry with TTL
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in milliseconds
   */
  set(key, value, ttl = 300000) { // Default 5 minutes
    // Clear existing timer if any
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    // Set cache entry
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    });

    // Set expiration timer
    const timer = setTimeout(() => {
      this.delete(key);
    }, ttl);

    this.timers.set(key, timer);
  }

  /**
   * Get cache entry
   * @param {string} key - Cache key
   * @returns {any} Cached value or null
   */
  get(key) {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.delete(key);
      return null;
    }

    return entry.value;
  }

  /**
   * Delete cache entry
   * @param {string} key - Cache key
   */
  delete(key) {
    this.cache.delete(key);
    
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
  }

  /**
   * Clear all cache entries
   */
  clear() {
    // Clear all timers
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    
    this.cache.clear();
    this.timers.clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
      memoryUsage: this.estimateMemoryUsage()
    };
  }

  /**
   * Estimate memory usage (rough calculation)
   */
  estimateMemoryUsage() {
    let size = 0;
    for (const [key, entry] of this.cache.entries()) {
      size += key.length * 2; // Rough estimate for string
      size += JSON.stringify(entry.value).length * 2; // Rough estimate for value
    }
    return size;
  }
}

/**
 * Query optimization utilities
 */
export class QueryOptimizer {
  constructor() {
    this.queryCache = new MemoryCache();
    this.queryStats = new Map();
  }

  /**
   * Generate cache key for query
   * @param {string} table - Table name
   * @param {Object} params - Query parameters
   * @returns {string} Cache key
   */
  generateCacheKey(table, params) {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        result[key] = params[key];
        return result;
      }, {});
    
    return `${table}:${JSON.stringify(sortedParams)}`;
  }

  /**
   * Cache query result
   * @param {string} table - Table name
   * @param {Object} params - Query parameters
   * @param {any} result - Query result
   * @param {number} ttl - Cache TTL in milliseconds
   */
  cacheResult(table, params, result, ttl = 300000) {
    const key = this.generateCacheKey(table, params);
    this.queryCache.set(key, result, ttl);
  }

  /**
   * Get cached query result
   * @param {string} table - Table name
   * @param {Object} params - Query parameters
   * @returns {any} Cached result or null
   */
  getCachedResult(table, params) {
    const key = this.generateCacheKey(table, params);
    return this.queryCache.get(key);
  }

  /**
   * Invalidate cache for table
   * @param {string} table - Table name
   */
  invalidateTable(table) {
    const keysToDelete = [];
    
    for (const key of this.queryCache.cache.keys()) {
      if (key.startsWith(`${table}:`)) {
        keysToDelete.push(key);
      }
    }
    
    keysToDelete.forEach(key => this.queryCache.delete(key));
  }

  /**
   * Record query performance
   * @param {string} operation - Operation name
   * @param {number} duration - Duration in milliseconds
   */
  recordQueryPerformance(operation, duration) {
    if (!this.queryStats.has(operation)) {
      this.queryStats.set(operation, {
        count: 0,
        totalTime: 0,
        minTime: Infinity,
        maxTime: 0,
        avgTime: 0
      });
    }

    const stats = this.queryStats.get(operation);
    stats.count++;
    stats.totalTime += duration;
    stats.minTime = Math.min(stats.minTime, duration);
    stats.maxTime = Math.max(stats.maxTime, duration);
    stats.avgTime = stats.totalTime / stats.count;
  }

  /**
   * Get query performance statistics
   * @returns {Object} Performance statistics
   */
  getPerformanceStats() {
    const stats = {};
    
    for (const [operation, data] of this.queryStats.entries()) {
      stats[operation] = { ...data };
    }
    
    return stats;
  }

  /**
   * Clear performance statistics
   */
  clearStats() {
    this.queryStats.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return this.queryCache.getStats();
  }
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.isMonitoring = false;
    this.monitoringInterval = null;
  }

  /**
   * Start performance monitoring
   * @param {number} interval - Monitoring interval in milliseconds
   */
  startMonitoring(interval = 30000) {
    if (this.isMonitoring) {
      console.log('Performance monitoring already running');
      return;
    }

    this.isMonitoring = true;
    console.log(`📊 Starting performance monitoring (interval: ${interval}ms)`);

    this.monitoringInterval = setInterval(() => {
      this.collectMetrics();
    }, interval);
  }

  /**
   * Stop performance monitoring
   */
  stopMonitoring() {
    if (!this.isMonitoring) {
      console.log('Performance monitoring not running');
      return;
    }

    clearInterval(this.monitoringInterval);
    this.isMonitoring = false;
    console.log('📊 Performance monitoring stopped');
  }

  /**
   * Collect performance metrics
   */
  collectMetrics() {
    const timestamp = Date.now();
    
    // Memory usage (if available)
    let memoryUsage = null;
    if (typeof performance !== 'undefined' && performance.memory) {
      memoryUsage = {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      };
    }

    // Navigation timing (if available)
    let navigationTiming = null;
    if (typeof performance !== 'undefined' && performance.timing) {
      const timing = performance.timing;
      navigationTiming = {
        domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
        loadComplete: timing.loadEventEnd - timing.navigationStart,
        domInteractive: timing.domInteractive - timing.navigationStart
      };
    }

    const metrics = {
      timestamp,
      memoryUsage,
      navigationTiming,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
    };

    this.metrics.set(timestamp, metrics);

    // Keep only last 100 entries
    if (this.metrics.size > 100) {
      const oldestKey = Math.min(...this.metrics.keys());
      this.metrics.delete(oldestKey);
    }

    // Log performance warnings
    if (memoryUsage && memoryUsage.used > memoryUsage.limit * 0.8) {
      console.warn('⚠️ High memory usage detected:', memoryUsage);
    }
  }

  /**
   * Get performance metrics
   * @returns {Array} Performance metrics
   */
  getMetrics() {
    return Array.from(this.metrics.values());
  }

  /**
   * Get latest metrics
   * @returns {Object} Latest metrics
   */
  getLatestMetrics() {
    if (this.metrics.size === 0) {
      return null;
    }

    const latestKey = Math.max(...this.metrics.keys());
    return this.metrics.get(latestKey);
  }

  /**
   * Clear metrics
   */
  clearMetrics() {
    this.metrics.clear();
  }

  /**
   * Measure function execution time
   * @param {Function} fn - Function to measure
   * @param {string} name - Operation name
   * @returns {any} Function result
   */
  async measureAsync(fn, name) {
    const startTime = performance.now();
    
    try {
      const result = await fn();
      const duration = performance.now() - startTime;
      
      console.log(`⏱️ ${name} completed in ${duration.toFixed(2)}ms`);
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      console.error(`❌ ${name} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  }

  /**
   * Measure synchronous function execution time
   * @param {Function} fn - Function to measure
   * @param {string} name - Operation name
   * @returns {any} Function result
   */
  measure(fn, name) {
    const startTime = performance.now();
    
    try {
      const result = fn();
      const duration = performance.now() - startTime;
      
      console.log(`⏱️ ${name} completed in ${duration.toFixed(2)}ms`);
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      console.error(`❌ ${name} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  }
}

// Create global instances
export const queryOptimizer = new QueryOptimizer();
export const performanceMonitor = new PerformanceMonitor();

// Auto-start monitoring in development mode
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_DEBUG_MODE === 'true') {
  performanceMonitor.startMonitoring();
  window.queryOptimizer = queryOptimizer;
  window.performanceMonitor = performanceMonitor;
  console.log('Performance optimization tools exposed to window for debugging');
}

// Export cache class
export { MemoryCache };
