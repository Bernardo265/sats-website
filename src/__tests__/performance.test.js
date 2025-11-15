/**
 * Performance Tests
 * Tests for caching, query optimization, and performance monitoring
 */

import { 
  MemoryCache, 
  QueryOptimizer, 
  PerformanceMonitor,
  queryOptimizer,
  performanceMonitor
} from '../utils/performanceOptimization';

describe('Performance Tests', () => {
  describe('MemoryCache', () => {
    let cache;

    beforeEach(() => {
      cache = new MemoryCache();
    });

    afterEach(() => {
      cache.clear();
    });

    test('should store and retrieve values', () => {
      cache.set('test-key', 'test-value', 1000);
      expect(cache.get('test-key')).toBe('test-value');
    });

    test('should return null for non-existent keys', () => {
      expect(cache.get('non-existent')).toBeNull();
    });

    test('should expire entries after TTL', (done) => {
      cache.set('expire-key', 'expire-value', 100);
      
      setTimeout(() => {
        expect(cache.get('expire-key')).toBeNull();
        done();
      }, 150);
    });

    test('should delete entries', () => {
      cache.set('delete-key', 'delete-value', 1000);
      expect(cache.get('delete-key')).toBe('delete-value');
      
      cache.delete('delete-key');
      expect(cache.get('delete-key')).toBeNull();
    });

    test('should clear all entries', () => {
      cache.set('key1', 'value1', 1000);
      cache.set('key2', 'value2', 1000);
      
      expect(cache.get('key1')).toBe('value1');
      expect(cache.get('key2')).toBe('value2');
      
      cache.clear();
      
      expect(cache.get('key1')).toBeNull();
      expect(cache.get('key2')).toBeNull();
    });

    test('should provide cache statistics', () => {
      cache.set('stats-key1', 'value1', 1000);
      cache.set('stats-key2', 'value2', 1000);
      
      const stats = cache.getStats();
      expect(stats.size).toBe(2);
      expect(stats.entries).toContain('stats-key1');
      expect(stats.entries).toContain('stats-key2');
      expect(typeof stats.memoryUsage).toBe('number');
    });
  });

  describe('QueryOptimizer', () => {
    let optimizer;

    beforeEach(() => {
      optimizer = new QueryOptimizer();
    });

    afterEach(() => {
      optimizer.queryCache.clear();
      optimizer.clearStats();
    });

    test('should generate consistent cache keys', () => {
      const params1 = { userId: '123', type: 'profile' };
      const params2 = { type: 'profile', userId: '123' }; // Different order
      
      const key1 = optimizer.generateCacheKey('users', params1);
      const key2 = optimizer.generateCacheKey('users', params2);
      
      expect(key1).toBe(key2);
    });

    test('should cache and retrieve query results', () => {
      const table = 'users';
      const params = { userId: '123' };
      const result = { id: '123', name: 'John Doe' };
      
      optimizer.cacheResult(table, params, result, 1000);
      
      const cached = optimizer.getCachedResult(table, params);
      expect(cached).toEqual(result);
    });

    test('should invalidate table cache', () => {
      const table = 'users';
      const params1 = { userId: '123' };
      const params2 = { userId: '456' };
      const result1 = { id: '123', name: 'John' };
      const result2 = { id: '456', name: 'Jane' };
      
      optimizer.cacheResult(table, params1, result1, 1000);
      optimizer.cacheResult(table, params2, result2, 1000);
      optimizer.cacheResult('posts', { postId: '1' }, { title: 'Post' }, 1000);
      
      // Verify cache exists
      expect(optimizer.getCachedResult(table, params1)).toEqual(result1);
      expect(optimizer.getCachedResult(table, params2)).toEqual(result2);
      expect(optimizer.getCachedResult('posts', { postId: '1' })).toEqual({ title: 'Post' });
      
      // Invalidate users table
      optimizer.invalidateTable(table);
      
      // Users cache should be cleared
      expect(optimizer.getCachedResult(table, params1)).toBeNull();
      expect(optimizer.getCachedResult(table, params2)).toBeNull();
      
      // Posts cache should remain
      expect(optimizer.getCachedResult('posts', { postId: '1' })).toEqual({ title: 'Post' });
    });

    test('should record query performance', () => {
      optimizer.recordQueryPerformance('getUserProfile', 150);
      optimizer.recordQueryPerformance('getUserProfile', 200);
      optimizer.recordQueryPerformance('getUserProfile', 100);
      
      const stats = optimizer.getPerformanceStats();
      expect(stats.getUserProfile).toBeDefined();
      expect(stats.getUserProfile.count).toBe(3);
      expect(stats.getUserProfile.totalTime).toBe(450);
      expect(stats.getUserProfile.minTime).toBe(100);
      expect(stats.getUserProfile.maxTime).toBe(200);
      expect(stats.getUserProfile.avgTime).toBe(150);
    });

    test('should provide cache statistics', () => {
      optimizer.cacheResult('users', { userId: '123' }, { name: 'John' }, 1000);
      optimizer.cacheResult('posts', { postId: '1' }, { title: 'Post' }, 1000);
      
      const stats = optimizer.getCacheStats();
      expect(stats.size).toBe(2);
      expect(Array.isArray(stats.entries)).toBe(true);
      expect(typeof stats.memoryUsage).toBe('number');
    });
  });

  describe('PerformanceMonitor', () => {
    let monitor;

    beforeEach(() => {
      monitor = new PerformanceMonitor();
    });

    afterEach(() => {
      monitor.stopMonitoring();
      monitor.clearMetrics();
    });

    test('should start and stop monitoring', () => {
      expect(monitor.isMonitoring).toBe(false);
      
      monitor.startMonitoring(1000);
      expect(monitor.isMonitoring).toBe(true);
      
      monitor.stopMonitoring();
      expect(monitor.isMonitoring).toBe(false);
    });

    test('should collect metrics', () => {
      monitor.collectMetrics();
      
      const metrics = monitor.getMetrics();
      expect(metrics.length).toBe(1);
      
      const latest = monitor.getLatestMetrics();
      expect(latest).toBeDefined();
      expect(latest.timestamp).toBeDefined();
    });

    test('should measure async function performance', async () => {
      const testFunction = async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return 'test result';
      };

      const result = await monitor.measureAsync(testFunction, 'test-async');
      expect(result).toBe('test result');
    });

    test('should measure sync function performance', () => {
      const testFunction = () => {
        // Simulate some work
        let sum = 0;
        for (let i = 0; i < 1000; i++) {
          sum += i;
        }
        return sum;
      };

      const result = monitor.measure(testFunction, 'test-sync');
      expect(typeof result).toBe('number');
    });

    test('should handle function errors', async () => {
      const errorFunction = async () => {
        throw new Error('Test error');
      };

      await expect(monitor.measureAsync(errorFunction, 'test-error'))
        .rejects.toThrow('Test error');
    });

    test('should clear metrics', () => {
      monitor.collectMetrics();
      expect(monitor.getMetrics().length).toBe(1);
      
      monitor.clearMetrics();
      expect(monitor.getMetrics().length).toBe(0);
      expect(monitor.getLatestMetrics()).toBeNull();
    });
  });

  describe('Global Instances', () => {
    test('should have global query optimizer instance', () => {
      expect(queryOptimizer).toBeInstanceOf(QueryOptimizer);
    });

    test('should have global performance monitor instance', () => {
      expect(performanceMonitor).toBeInstanceOf(PerformanceMonitor);
    });

    test('should be able to use global instances', () => {
      // Test caching
      queryOptimizer.cacheResult('test-table', { id: '1' }, { data: 'test' }, 1000);
      const cached = queryOptimizer.getCachedResult('test-table', { id: '1' });
      expect(cached).toEqual({ data: 'test' });
      
      // Test performance recording
      queryOptimizer.recordQueryPerformance('test-operation', 100);
      const stats = queryOptimizer.getPerformanceStats();
      expect(stats['test-operation']).toBeDefined();
      
      // Cleanup
      queryOptimizer.queryCache.clear();
      queryOptimizer.clearStats();
    });
  });

  describe('Performance Benchmarks', () => {
    test('cache should be faster than repeated operations', () => {
      const cache = new MemoryCache();
      const testData = { large: 'data'.repeat(1000) };
      
      // First operation (no cache)
      const start1 = performance.now();
      cache.set('benchmark', testData, 10000);
      const firstResult = cache.get('benchmark');
      const duration1 = performance.now() - start1;
      
      // Second operation (from cache)
      const start2 = performance.now();
      const secondResult = cache.get('benchmark');
      const duration2 = performance.now() - start2;
      
      expect(firstResult).toEqual(testData);
      expect(secondResult).toEqual(testData);
      expect(duration2).toBeLessThan(duration1);
      
      cache.clear();
    });

    test('should handle large number of cache entries efficiently', () => {
      const cache = new MemoryCache();
      const startTime = performance.now();
      
      // Add 1000 entries
      for (let i = 0; i < 1000; i++) {
        cache.set(`key-${i}`, `value-${i}`, 10000);
      }
      
      // Retrieve all entries
      for (let i = 0; i < 1000; i++) {
        const value = cache.get(`key-${i}`);
        expect(value).toBe(`value-${i}`);
      }
      
      const duration = performance.now() - startTime;
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
      
      cache.clear();
    });
  });
});
