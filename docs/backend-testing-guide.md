# SafeSats Backend Testing Guide

This guide provides comprehensive instructions for testing the enhanced backend system of the SafeSats Bitcoin trading simulation platform.

## Prerequisites

Before testing, ensure you have:

1. **Supabase Project Setup**: Follow the [Supabase Setup Guide](./supabase-setup.md)
2. **Environment Configuration**: Copy `.env.example` to `.env` and configure your Supabase credentials
3. **Database Schema**: Execute the enhanced `database-schema.sql` in your Supabase SQL editor
4. **Dependencies**: Run `npm install` to install all required packages

## Testing Checklist

### 1. Database Schema Testing

#### Test Enhanced Tables
```sql
-- Verify all tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Expected tables:
-- - profiles
-- - portfolios  
-- - transactions
-- - orders
-- - price_history
-- - user_sessions
```

#### Test Database Functions
```sql
-- Test price data storage
SELECT public.store_price_data(
  'BTC', 
  50000.00, 
  86500000.00, 
  1730.0000,
  1000000000.00,
  1000000000000.00,
  1000.00,
  2.5,
  51000.00,
  49000.00,
  'test'
);

-- Test portfolio value calculation
SELECT * FROM public.calculate_portfolio_value(
  'your-user-id-here',
  86500000.00
);

-- Test limit order processing
SELECT * FROM public.process_limit_orders(86500000.00);
```

#### Test Views
```sql
-- Test enhanced views (replace with actual user ID)
SELECT * FROM public.user_dashboard;
SELECT * FROM public.user_trading_history LIMIT 10;
SELECT * FROM public.user_active_orders;
SELECT * FROM public.btc_price_data LIMIT 5;
```

### 2. Authentication Testing

#### User Registration
1. Navigate to `/start-trading`
2. Fill out registration form with valid data
3. Verify email confirmation is sent
4. Check that profile and portfolio are automatically created
5. Verify initial portfolio balance is 100,000 MWK

#### User Login
1. Navigate to `/login`
2. Login with registered credentials
3. Verify redirect to dashboard
4. Check that user session is created in `user_sessions` table

### 3. Price Service Testing

#### Manual Price Service Test
```javascript
// In browser console or test file
import priceService from './src/services/priceService';

// Start price service
priceService.start(10000); // 10-second updates for testing

// Subscribe to price updates
const unsubscribe = priceService.subscribe((priceData) => {
  console.log('Price update:', priceData);
});

// Check service status
console.log('Service status:', priceService.getStatus());

// Stop service when done
priceService.stop();
unsubscribe();
```

#### Verify Price Data Storage
1. Start the application
2. Wait for price updates (check browser console)
3. Verify price data is stored in `price_history` table:
```sql
SELECT * FROM public.price_history 
ORDER BY created_at DESC 
LIMIT 5;
```

### 4. Trading Service Testing

#### Market Buy Order
1. Login to the application
2. Navigate to trading interface
3. Place a market buy order for 10,000 MWK
4. Verify:
   - Transaction is created in `transactions` table
   - Portfolio balances are updated
   - Real-time updates work correctly

#### Market Sell Order
1. Ensure you have BTC balance from previous buy
2. Place a market sell order for some BTC amount
3. Verify:
   - Sell transaction is recorded
   - Portfolio balances are updated correctly
   - Profit/loss is calculated

#### Limit Orders
1. Place a limit buy order below current price
2. Place a limit sell order above current price
3. Verify orders are stored in `orders` table with 'pending' status
4. Test order cancellation functionality

### 5. Real-time Integration Testing

#### Real-time Subscriptions
1. Open application in two browser tabs
2. Login with the same account in both tabs
3. Execute a trade in one tab
4. Verify the other tab updates automatically
5. Check browser console for real-time messages

#### Connection Handling
1. Disconnect internet connection
2. Verify reconnection attempts in console
3. Reconnect internet
4. Verify real-time functionality resumes

### 6. Portfolio Service Testing

#### Portfolio Analytics
1. Execute several buy/sell trades
2. Navigate to portfolio page
3. Verify performance metrics are calculated:
   - Win rate percentage
   - Total trades count
   - Profit/loss calculations
   - Asset allocation percentages

#### Portfolio Reset
1. Use the portfolio reset functionality
2. Verify:
   - Balances return to initial state (100,000 MWK, 0 BTC)
   - Transaction history is preserved
   - Performance metrics are recalculated

### 7. Error Handling Testing

#### Invalid Trade Scenarios
1. Try to buy with insufficient MWK balance
2. Try to sell more BTC than available
3. Try to place orders with invalid prices
4. Verify appropriate error messages are displayed

#### Network Error Scenarios
1. Disconnect internet during trade execution
2. Verify error handling and user feedback
3. Test retry mechanisms

### 8. Performance Testing

#### Load Testing
1. Execute multiple rapid trades
2. Monitor database performance
3. Check for any memory leaks in services
4. Verify real-time updates don't lag

#### Database Query Performance
```sql
-- Check query performance
EXPLAIN ANALYZE SELECT * FROM public.user_dashboard;
EXPLAIN ANALYZE SELECT * FROM public.user_trading_history LIMIT 50;
EXPLAIN ANALYZE SELECT * FROM public.btc_price_data LIMIT 100;
```

## Automated Testing

### Unit Tests
Create test files for each service:

```javascript
// Example: src/services/__tests__/tradingService.test.js
import tradingService from '../tradingService';

describe('TradingService', () => {
  test('validates trade parameters correctly', () => {
    const result = tradingService.validateTradeParams({
      amount: 5000,
      type: 'buy',
      orderType: 'market'
    });
    expect(result.isValid).toBe(true);
  });

  test('calculates fees correctly', () => {
    const fee = tradingService.calculateFee(10000);
    expect(fee).toBe(10); // 0.1% of 10000
  });
});
```

### Integration Tests
Test the complete flow from frontend to database:

```javascript
// Example integration test
describe('Trading Flow Integration', () => {
  test('complete buy order flow', async () => {
    // 1. Login user
    // 2. Execute buy order
    // 3. Verify database updates
    // 4. Check real-time notifications
  });
});
```

## Monitoring and Debugging

### Browser Console Monitoring
Monitor these console messages during testing:
- Price service updates
- Real-time connection status
- Trading service operations
- Error messages and stack traces

### Database Monitoring
Monitor these database metrics:
- Query execution times
- Connection pool usage
- Real-time subscription status
- Row counts in each table

### Supabase Dashboard Monitoring
Check the Supabase dashboard for:
- Authentication metrics
- Database performance
- Real-time connection status
- API usage statistics

## Common Issues and Solutions

### Issue: Real-time updates not working
**Solution**: 
1. Check Supabase project settings
2. Verify RLS policies are correct
3. Check browser console for WebSocket errors
4. Ensure user is properly authenticated

### Issue: Price data not updating
**Solution**:
1. Check CoinGecko API rate limits
2. Verify internet connection
3. Check price service configuration
4. Monitor browser console for API errors

### Issue: Trading operations failing
**Solution**:
1. Verify user authentication
2. Check portfolio balances
3. Validate trade parameters
4. Check database constraints

### Issue: Performance degradation
**Solution**:
1. Check database indexes
2. Monitor query execution plans
3. Verify connection pooling
4. Check for memory leaks in services

## Success Criteria

The backend system is working correctly when:

✅ All database tables and functions are created successfully
✅ User registration and authentication work properly
✅ Price data is fetched and stored automatically
✅ Trading operations execute correctly and update portfolios
✅ Real-time updates work across multiple browser tabs
✅ Portfolio analytics calculate correctly
✅ Error handling provides appropriate user feedback
✅ Performance remains responsive under normal load
✅ All RLS policies enforce proper data isolation

## Next Steps

After successful testing:

1. **Production Deployment**: Configure production environment variables
2. **Monitoring Setup**: Implement application monitoring and alerting
3. **Backup Strategy**: Set up automated database backups
4. **Security Audit**: Conduct security review of all components
5. **User Acceptance Testing**: Conduct testing with real users
6. **Documentation**: Update user documentation and API docs
