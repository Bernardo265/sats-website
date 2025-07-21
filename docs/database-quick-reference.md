# SafeSats Database Quick Reference

## 🚀 Quick Setup

```bash
# 1. Copy environment template
cp .env.example .env

# 2. Add your Supabase credentials to .env
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here

# 3. Initialize in your app
import dbConfig from './src/lib/dbConfig';
await dbConfig.initialize();
```

## 📚 Common Operations

### User Profile
```javascript
import { supabaseHelpers } from './src/lib/supabase';

// Get profile
const profile = await supabaseHelpers.getUserProfile(userId);

// Update profile
const updated = await supabaseHelpers.upsertUserProfile({
  id: userId,
  full_name: 'John Doe',
  phone: '+265123456789',
  preferred_currency: 'MWK'
});
```

### Portfolio
```javascript
// Get portfolio
const portfolio = await supabaseHelpers.getUserPortfolio(userId);

// Update portfolio
const updated = await supabaseHelpers.upsertPortfolio({
  user_id: userId,
  mwk_balance: 100000,
  btc_balance: 0.001,
  total_value: 105000
});
```

### Transactions
```javascript
// Create transaction
const transaction = await supabaseHelpers.createTransaction({
  user_id: userId,
  type: 'buy',
  order_type: 'market',
  btc_amount: 0.001,
  mwk_amount: 5000,
  price: 5000000
});

// Get user transactions
const transactions = await supabaseHelpers.getUserTransactions(userId);
```

### Orders
```javascript
// Create order
const order = await supabaseHelpers.createOrder({
  user_id: userId,
  type: 'buy',
  order_type: 'limit',
  amount: 10000,
  price: 4800000
});

// Get user orders
const orders = await supabaseHelpers.getUserOrders(userId);

// Update order
const updated = await supabaseHelpers.updateOrder(orderId, {
  status: 'cancelled'
});

// Delete order
await supabaseHelpers.deleteOrder(orderId);
```

## 🔒 Security

### Input Validation
```javascript
import { validateUserProfile } from './src/utils/securityValidation';

const validation = validateUserProfile(data);
if (!validation.isValid) {
  console.error('Validation errors:', validation.errors);
}
```

### Rate Limiting
```javascript
import { rateLimiter } from './src/utils/securityValidation';

// Check if request is allowed
const allowed = rateLimiter.isAllowed(userId, 'trading');
if (!allowed) {
  throw new Error('Rate limit exceeded');
}
```

## ⚡ Performance

### Caching
```javascript
import { queryOptimizer } from './src/utils/performanceOptimization';

// Cache result
queryOptimizer.cacheResult('profiles', { userId }, data, 300000);

// Get cached result
const cached = queryOptimizer.getCachedResult('profiles', { userId });

// Invalidate cache
queryOptimizer.invalidateTable('profiles');
```

### Performance Monitoring
```javascript
import { performanceMonitor } from './src/utils/performanceOptimization';

// Measure async operation
const result = await performanceMonitor.measureAsync(
  () => someOperation(),
  'operation-name'
);

// Get performance stats
const stats = queryOptimizer.getPerformanceStats();
```

## 🏥 Health Monitoring

### Health Checks
```javascript
import dbHealthCheck from './src/utils/dbHealthCheck';

// Quick status
const status = await dbHealthCheck.getQuickStatus();

// Full health check
const health = await dbHealthCheck.runHealthCheck();

// Start monitoring
dbHealthCheck.startMonitoring(30000); // 30 seconds
```

### Security Audit
```javascript
import securityAudit from './src/utils/securityAudit';

// Run security audit
const audit = await securityAudit.runSecurityAudit();

// Log security event
securityAudit.logSecurityEvent('user_action', { userId, action });
```

## 🧪 Testing

```bash
# Run specific test suites
npm test -- --testPathPattern=database.integration.test.js
npm test -- --testPathPattern=security.test.js
npm test -- --testPathPattern=performance.test.js
npm test -- --testPathPattern=integration.suite.test.js
```

## 🔧 Configuration

### Environment Variables
```env
# Required
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here

# Optional
REACT_APP_DB_CONNECTION_TIMEOUT=10000
REACT_APP_DB_MAX_RETRIES=3
REACT_APP_DB_RETRY_DELAY=1000
REACT_APP_REALTIME_ENABLED=true
REACT_APP_DEBUG_MODE=false
```

### Database Config
```javascript
import dbConfig from './src/lib/dbConfig';

// Get current config
const config = dbConfig.getConfig();

// Update config
dbConfig.updateConfig({
  connectionTimeout: 15000,
  maxRetries: 5
});

// Reset connection
await dbConfig.reset();
```

## 🚨 Error Handling

### Common Patterns
```javascript
try {
  const result = await supabaseHelpers.getUserProfile(userId);
  return result;
} catch (error) {
  if (error.message.includes('User ID is required')) {
    // Handle validation error
  } else if (error.message.includes('Rate limit exceeded')) {
    // Handle rate limiting
  } else {
    // Handle other errors
    console.error('Database error:', error);
  }
  
  // Return cached data as fallback
  return queryOptimizer.getCachedResult('profiles', { userId });
}
```

## 📊 Debugging

### Enable Debug Mode
```env
REACT_APP_DEBUG_MODE=true
```

### Debug Tools (Development)
```javascript
// Available in browser console when debug mode is enabled
window.dbConfig          // Database configuration
window.queryOptimizer    // Query optimization tools
window.performanceMonitor // Performance monitoring
window.dbHealthCheck     // Health check tools
window.securityAudit     // Security audit tools
```

### Logging
```javascript
// Database operations are automatically logged in debug mode
// Security events are logged to securityAudit.getSecurityEvents()
// Performance metrics are tracked in queryOptimizer.getPerformanceStats()
```

## 🔍 Troubleshooting

| Issue | Solution |
|-------|----------|
| Connection timeout | Increase `REACT_APP_DB_CONNECTION_TIMEOUT` |
| Rate limit exceeded | Check `rateLimiter.isAllowed()` before operations |
| Validation errors | Check input data against validation schemas |
| Cache issues | Use `queryOptimizer.invalidateTable()` |
| Performance issues | Enable monitoring and check stats |

## 📈 Performance Targets

| Operation | Target | Cached |
|-----------|--------|--------|
| Profile queries | < 100ms | < 10ms |
| Portfolio queries | < 150ms | < 10ms |
| Transaction creation | < 200ms | N/A |
| Order operations | < 150ms | N/A |
| Health checks | < 500ms | N/A |

## 🔐 Security Checklist

- ✅ Input validation on all operations
- ✅ Rate limiting implemented
- ✅ XSS protection enabled
- ✅ Row Level Security (RLS) policies
- ✅ Parameterized queries
- ✅ Error handling without data leakage
- ✅ Security audit logging
- ✅ Environment variable validation

## 📝 Validation Schemas

### User Profile
- `id`: UUID format required
- `full_name`: 2-100 chars, letters/spaces/hyphens only
- `phone`: Valid international format
- `preferred_currency`: 'MWK' or 'USD'

### Portfolio
- `user_id`: UUID format required
- `mwk_balance`: 0 to 999,999,999,999.99
- `btc_balance`: 0 to 99,999,999.99999999

### Transaction
- `type`: 'buy' or 'sell'
- `order_type`: 'market' or 'limit'
- `btc_amount`: 0.00000001 to 99,999,999.99999999
- `mwk_amount`: 1 to 999,999,999,999.99

### Order
- `type`: 'buy' or 'sell'
- `order_type`: 'limit', 'stop_loss', or 'take_profit'
- `amount`: 1 to 999,999,999,999.99
- `price`: 0.01 to 999,999,999,999.99
