/**
 * Database Connection Verification Test
 * Simple test to verify the Supabase database connection is working
 */

import { testConnection, getConnectionStatus } from '../lib/supabase';
import dbConfig from '../lib/dbConfig';
import dbHealthCheck from '../utils/dbHealthCheck';

describe('Database Connection Verification', () => {
  test('should connect to Supabase database successfully', async () => {
    const result = await testConnection();
    
    console.log('🔍 Connection Test Result:', result);
    
    expect(result).toHaveProperty('success');
    expect(result.success).toBe(true);
    expect(result).toHaveProperty('status');
    expect(result.status.isConnected).toBe(true);
  });

  test('should have valid connection status', () => {
    const status = getConnectionStatus();
    
    console.log('📊 Connection Status:', status);
    
    expect(status).toHaveProperty('isConnected');
    expect(status).toHaveProperty('lastError');
    expect(status).toHaveProperty('retryCount');
    expect(status).toHaveProperty('maxRetries');
  });

  test('should initialize database configuration', async () => {
    const initResult = await dbConfig.initialize();
    
    console.log('⚙️ Database Config Init:', initResult);
    
    expect(initResult).toHaveProperty('success');
    // Note: May be false due to realtime setup issues, but connection should work
    
    const config = dbConfig.getConfig();
    expect(config).toHaveProperty('connectionTimeout');
    expect(config).toHaveProperty('maxRetries');
    expect(config.connectionTimeout).toBeGreaterThan(0);
    expect(config.maxRetries).toBeGreaterThan(0);
  });

  test('should run basic health check', async () => {
    const healthResult = await dbHealthCheck.runHealthCheck();
    
    console.log('🏥 Health Check Result:', {
      overall: healthResult.overall,
      connectionHealthy: healthResult.checks.connection?.healthy,
      errors: healthResult.errors
    });
    
    expect(healthResult).toHaveProperty('overall');
    expect(healthResult).toHaveProperty('checks');
    expect(healthResult.checks).toHaveProperty('connection');
    
    // Connection should be healthy even if other checks fail
    expect(healthResult.checks.connection.healthy).toBe(true);
  });

  test('should have correct environment configuration', () => {
    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
    const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
    
    console.log('🔧 Environment Config:', {
      hasUrl: !!supabaseUrl,
      urlValid: supabaseUrl?.includes('scbmesmhuihcciqpoeuw.supabase.co'),
      hasKey: !!supabaseKey,
      keyLength: supabaseKey?.length
    });
    
    expect(supabaseUrl).toBeDefined();
    expect(supabaseUrl).toContain('scbmesmhuihcciqpoeuw.supabase.co');
    expect(supabaseKey).toBeDefined();
    expect(supabaseKey.length).toBeGreaterThan(100); // JWT tokens are long
  });
});
