# SafeSats Database Integration Guide

## Overview

This guide provides comprehensive documentation for the SafeSats database integration system, built with Supabase and enhanced with security, performance optimization, and monitoring capabilities.

## Architecture

### Core Components

1. **Database Layer** (`src/lib/supabase.js`)
   - Supabase client configuration
   - Enhanced helper functions with validation
   - Error handling and connection management

2. **Security Layer** (`src/utils/securityValidation.js`)
   - Input validation and sanitization
   - Rate limiting
   - XSS protection

3. **Performance Layer** (`src/utils/performanceOptimization.js`)
   - Query caching
   - Performance monitoring
   - Memory management

4. **Health Monitoring** (`src/utils/dbHealthCheck.js`)
   - Connection health checks
   - System diagnostics
   - Real-time monitoring

## Quick Start

### 1. Environment Setup

Create a `.env` file with your Supabase credentials:

```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here

# Database Configuration
REACT_APP_DB_CONNECTION_TIMEOUT=10000
REACT_APP_DB_MAX_RETRIES=3
REACT_APP_DB_RETRY_DELAY=1000

# Performance Settings
REACT_APP_REALTIME_ENABLED=true
REACT_APP_DEBUG_MODE=false
```

### 2. Initialize Database

```javascript
import dbConfig from './src/lib/dbConfig';

// Initialize database connection
await dbConfig.initialize();
```

### 3. Basic Usage

```javascript
import { supabaseHelpers } from './src/lib/supabase';

// Get user profile
const profile = await supabaseHelpers.getUserProfile(userId);

// Update user profile
const updatedProfile = await supabaseHelpers.upsertUserProfile({
  id: userId,
  full_name: 'John Doe',
  phone: '+265123456789'
});
```

## Database Schema

### Core Tables

1. **profiles** - User profile information
2. **portfolios** - User portfolio balances
3. **transactions** - Trading transactions
4. **orders** - Pending orders
5. **price_history** - Historical price data
6. **user_sessions** - Session management

### Security Features

- **Row Level Security (RLS)** policies on all tables
- **User-specific data access** controls
- **Audit logging** for sensitive operations
- **Data encryption** at rest and in transit

## API Reference

### User Management

#### `getUserProfile(userId)`
Retrieves user profile with caching support.

```javascript
const profile = await supabaseHelpers.getUserProfile('user-id');
```

#### `upsertUserProfile(profile)`
Creates or updates user profile with validation.

```javascript
const profile = await supabaseHelpers.upsertUserProfile({
  id: 'user-id',
  full_name: 'John Doe',
  phone: '+265123456789',
  preferred_currency: 'MWK'
});
```

### Portfolio Management

#### `getUserPortfolio(userId)`
Retrieves user portfolio with caching.

#### `upsertPortfolio(portfolio)`
Updates portfolio balances with validation.

### Transaction Management

#### `createTransaction(transaction)`
Creates new transaction with security validation.

#### `getUserTransactions(userId, options)`
Retrieves user transaction history.

### Order Management

#### `createOrder(order)`
Creates new order with validation.

#### `getUserOrders(userId, options)`
Retrieves user orders.

#### `updateOrder(orderId, updates)`
Updates existing order.

#### `deleteOrder(orderId)`
Deletes order.

## Security Best Practices

### Input Validation

All inputs are validated using comprehensive schemas:

```javascript
import { validateUserProfile } from './src/utils/securityValidation';

const validation = validateUserProfile(profileData);
if (!validation.isValid) {
  throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
}
```

### Rate Limiting

Built-in rate limiting prevents abuse:

- **Default**: 100 requests per minute
- **Authentication**: 5 requests per minute
- **Trading**: 50 requests per minute

### XSS Protection

All string inputs are automatically sanitized:

```javascript
import { sanitizeString } from './src/utils/securityValidation';

const cleanInput = sanitizeString(userInput);
```

## Performance Optimization

### Caching Strategy

- **Profile data**: 5 minutes TTL
- **Portfolio data**: 1 minute TTL
- **Price data**: 30 seconds TTL

### Query Optimization

```javascript
import { queryOptimizer } from './src/utils/performanceOptimization';

// Cache query result
queryOptimizer.cacheResult('profiles', { userId }, data, 300000);

// Get cached result
const cached = queryOptimizer.getCachedResult('profiles', { userId });
```

### Performance Monitoring

```javascript
import { performanceMonitor } from './src/utils/performanceOptimization';

// Measure function performance
const result = await performanceMonitor.measureAsync(
  () => someAsyncOperation(),
  'operation-name'
);
```

## Health Monitoring

### Database Health Checks

```javascript
import dbHealthCheck from './src/utils/dbHealthCheck';

// Run comprehensive health check
const health = await dbHealthCheck.runHealthCheck();

// Get quick status
const status = await dbHealthCheck.getQuickStatus();
```

### Security Auditing

```javascript
import securityAudit from './src/utils/securityAudit';

// Run security audit
const audit = await securityAudit.runSecurityAudit();

// Log security event
securityAudit.logSecurityEvent('user_login', { userId, timestamp });
```

## Testing

### Running Tests

```bash
# Run all database tests
npm test -- --testPathPattern=database

# Run security tests
npm test -- --testPathPattern=security

# Run performance tests
npm test -- --testPathPattern=performance

# Run integration suite
npm test -- --testPathPattern=integration.suite
```

### Test Coverage

- **Database Integration**: Connection, CRUD operations, error handling
- **Security**: Input validation, rate limiting, XSS protection
- **Performance**: Caching, query optimization, monitoring
- **Integration**: End-to-end workflows, system resilience

## Troubleshooting

### Common Issues

1. **Connection Timeout**
   ```javascript
   // Increase timeout in .env
   REACT_APP_DB_CONNECTION_TIMEOUT=20000
   ```

2. **Rate Limit Exceeded**
   ```javascript
   // Check rate limiter status
   import { rateLimiter } from './src/utils/securityValidation';
   const allowed = rateLimiter.isAllowed(userId, 'default');
   ```

3. **Cache Issues**
   ```javascript
   // Clear cache for table
   queryOptimizer.invalidateTable('profiles');
   ```

### Debug Mode

Enable debug mode for detailed logging:

```env
REACT_APP_DEBUG_MODE=true
```

### Health Monitoring

Monitor system health in real-time:

```javascript
// Start continuous monitoring
dbHealthCheck.startMonitoring(30000); // 30 seconds

// Check monitoring status
const status = dbHealthCheck.getMonitoringStatus();
```

## Best Practices

### 1. Always Validate Input
```javascript
const validation = validateUserProfile(data);
if (!validation.isValid) {
  throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
}
```

### 2. Use Caching Appropriately
```javascript
// Cache frequently accessed, slowly changing data
queryOptimizer.cacheResult('profiles', params, data, 300000);

// Don't cache rapidly changing data
// (portfolios have shorter TTL)
```

### 3. Handle Errors Gracefully
```javascript
try {
  const result = await supabaseHelpers.getUserProfile(userId);
  return result;
} catch (error) {
  console.error('Failed to get user profile:', error);
  // Return cached data or default values
  return queryOptimizer.getCachedResult('profiles', { userId }) || null;
}
```

### 4. Monitor Performance
```javascript
// Use performance monitoring for critical operations
const result = await performanceMonitor.measureAsync(
  () => criticalOperation(),
  'critical-operation'
);
```

### 5. Regular Health Checks
```javascript
// Set up regular health monitoring
dbHealthCheck.startMonitoring(60000); // 1 minute intervals
```

## Migration Guide

### From Basic Supabase to Enhanced Integration

1. **Update imports**:
   ```javascript
   // Old
   import { supabase } from './supabase';
   
   // New
   import { supabaseHelpers } from './src/lib/supabase';
   ```

2. **Add validation**:
   ```javascript
   // Old
   await supabase.from('profiles').upsert(data);
   
   // New
   await supabaseHelpers.upsertUserProfile(data);
   ```

3. **Initialize system**:
   ```javascript
   import dbConfig from './src/lib/dbConfig';
   await dbConfig.initialize();
   ```

## Support

For issues and questions:

1. Check the troubleshooting section
2. Review test files for usage examples
3. Enable debug mode for detailed logging
4. Run health checks to identify issues

## Performance Metrics

### Expected Performance

- **Profile queries**: < 100ms (cached: < 10ms)
- **Portfolio queries**: < 150ms (cached: < 10ms)
- **Transaction creation**: < 200ms
- **Order operations**: < 150ms
- **Health checks**: < 500ms

### Monitoring

Monitor these key metrics:

```javascript
// Get performance statistics
const stats = queryOptimizer.getPerformanceStats();
console.log('Average query time:', stats.getUserProfile.avgTime);

// Get cache hit rate
const cacheStats = queryOptimizer.getCacheStats();
console.log('Cache size:', cacheStats.size);
```

## Contributing

When contributing to the database integration:

1. Add tests for new functionality
2. Update validation schemas as needed
3. Document new API methods
4. Follow security best practices
5. Update this guide with changes

## Changelog

### v1.0.0 (Current)
- ✅ Complete Supabase integration
- ✅ Security validation and rate limiting
- ✅ Performance optimization with caching
- ✅ Health monitoring and diagnostics
- ✅ Comprehensive test suite
- ✅ Documentation and best practices
