# Admin Price Management System

## Overview

The Admin Price Management System allows authorized administrators to manually override Bitcoin price data in the SafeSats platform. This feature provides complete control over price display and trading calculations when needed.

## Features

### 🎯 Core Functionality
- **Manual Price Override**: Set custom Bitcoin prices in USD and MWK
- **Duration Control**: Specify how long the override should remain active
- **Auto-Update Control**: Temporarily disable automatic price fetching
- **Audit Trail**: Complete logging of all price changes and admin actions
- **Real-time Updates**: Immediate effect across the entire platform

### 🔐 Security & Authorization
- **Role-based Access**: Only users with proper admin privileges can access
- **Permission Granularity**: Separate permissions for viewing, managing, and overriding
- **Audit Logging**: All actions logged with user, timestamp, and reason
- **Session Tracking**: IP address and user agent logging for security

### 📊 Monitoring & Reporting
- **Override History**: View all past price overrides
- **Audit Log**: Detailed action history with filtering
- **Status Dashboard**: Real-time overview of current price status
- **Performance Impact**: Monitor effect on trading and user experience

## Database Schema

### Tables Created

#### `admin_price_overrides`
Stores active and historical price overrides.

```sql
- id: UUID (Primary Key)
- admin_user_id: UUID (Foreign Key to auth.users)
- symbol: TEXT (Default: 'BTC')
- price_usd: DECIMAL(15,2)
- price_mwk: DECIMAL(15,2)
- usd_mwk_rate: DECIMAL(10,4)
- reason: TEXT
- duration_minutes: INTEGER (NULL for indefinite)
- expires_at: TIMESTAMP WITH TIME ZONE
- is_active: BOOLEAN
- disable_auto_updates: BOOLEAN
- previous_price_usd: DECIMAL(15,2)
- previous_price_mwk: DECIMAL(15,2)
- created_at: TIMESTAMP WITH TIME ZONE
- updated_at: TIMESTAMP WITH TIME ZONE
- deactivated_at: TIMESTAMP WITH TIME ZONE
- deactivated_by: UUID (Foreign Key to auth.users)
```

#### `admin_price_audit_log`
Comprehensive audit trail for all price-related admin actions.

```sql
- id: UUID (Primary Key)
- admin_user_id: UUID (Foreign Key to auth.users)
- action: TEXT (create_override, update_override, deactivate_override, etc.)
- override_id: UUID (Foreign Key to admin_price_overrides)
- symbol: TEXT
- old_price_usd: DECIMAL(15,2)
- new_price_usd: DECIMAL(15,2)
- old_price_mwk: DECIMAL(15,2)
- new_price_mwk: DECIMAL(15,2)
- reason: TEXT
- metadata: JSONB
- ip_address: INET
- user_agent: TEXT
- created_at: TIMESTAMP WITH TIME ZONE
```

#### `admin_permissions`
Granular permission control for admin features.

```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to auth.users)
- role: TEXT (viewer, editor, admin, super_admin)
- permissions: JSONB
- can_manage_prices: BOOLEAN
- can_override_prices: BOOLEAN
- can_disable_auto_updates: BOOLEAN
- can_view_price_audit: BOOLEAN
- granted_by: UUID (Foreign Key to auth.users)
- granted_at: TIMESTAMP WITH TIME ZONE
- expires_at: TIMESTAMP WITH TIME ZONE
- is_active: BOOLEAN
- created_at: TIMESTAMP WITH TIME ZONE
- updated_at: TIMESTAMP WITH TIME ZONE
```

## API Functions

### Database Functions

#### `get_active_price_override(symbol)`
Returns the currently active price override for a given symbol.

#### `create_price_override(params)`
Creates a new price override with automatic deactivation of existing ones.

#### `deactivate_price_override(override_id, admin_user_id, reason)`
Deactivates an existing price override.

#### `check_admin_price_permission(user_id, permission)`
Checks if a user has a specific price management permission.

### Service Functions

#### `AdminPriceService`
- `checkPermission(userId, permission)`: Verify user permissions
- `getActiveOverride(symbol)`: Get current active override
- `createPriceOverride(params)`: Create new price override
- `deactivatePriceOverride(overrideId, adminUserId, reason)`: Deactivate override
- `getPriceOverrideHistory(limit, offset)`: Get override history
- `getPriceAuditLog(limit, offset, filters)`: Get audit log
- `getEffectivePrice(regularPrice)`: Get current effective price (override or regular)

## User Interface

### Admin Dashboard Integration

#### Navigation
- Added "Price Management" link to admin sidebar
- Accessible at `/admin/price-management`
- Requires `manage_prices` permission

#### Price Management Panel
1. **Current Price Status**
   - Market price display (USD/MWK)
   - Override status indicator
   - Last update timestamp
   - Data source information

2. **Active Override Display**
   - Override price values
   - Admin who created it
   - Reason for override
   - Expiration time (if set)
   - Auto-update status
   - Deactivation controls

3. **Create Override Form**
   - USD price input with auto-calculation of MWK
   - Reason text area (required, min 10 characters)
   - Duration selector (optional)
   - Auto-update disable toggle
   - Validation and error handling

4. **Override History Table**
   - Chronological list of all overrides
   - Admin, prices, reason, status, timestamps
   - Pagination and filtering

5. **Audit Log**
   - Detailed action history
   - Filtering by action, admin, date range
   - Export capabilities

## Permissions System

### Permission Levels

#### `manage_prices`
- View price management dashboard
- See current price status and history
- Required for basic access to the feature

#### `override_prices`
- Create new price overrides
- Deactivate existing overrides
- Modify price data

#### `disable_auto_updates`
- Disable automatic price fetching
- Control price update mechanisms

#### `view_price_audit`
- Access detailed audit logs
- View admin action history
- Export audit data

### Role Assignments

#### Admin Role
- All price management permissions
- Can create, modify, and deactivate overrides
- Full audit trail access

#### Super Admin Role
- All permissions (automatic via `Object.values(permissions)`)
- Complete system control

## Integration with Price Service

### Enhanced PriceService

The existing `PriceService` has been enhanced to:

1. **Check for Admin Overrides**
   - Before using market data, check for active overrides
   - Use override price if available and active

2. **Respect Auto-Update Settings**
   - Skip price fetching if auto-updates are disabled
   - Continue monitoring for override expiration

3. **Seamless Transition**
   - Automatic fallback to market prices when overrides expire
   - No interruption to price monitoring service

4. **Audit Integration**
   - Log when overrides are applied
   - Track price source (market vs override)

### Price Flow

```
1. PriceService.fetchAndStorePriceData()
2. Check adminPriceService.isAutoUpdatesDisabled()
3. If disabled, return last known price
4. If enabled, fetch market price
5. Call adminPriceService.getEffectivePrice(marketPrice)
6. Return override price if active, otherwise market price
7. Update subscribers with effective price
```

## Setup Instructions

### 1. Database Setup

Run the schema creation script:
```sql
-- Execute docs/admin-price-management-schema.sql
```

### 2. Grant Permissions

Set up admin permissions for existing admin users:
```sql
-- Execute scripts/setup-admin-permissions.sql
```

### 3. Environment Configuration

No additional environment variables required. The feature uses existing Supabase configuration.

### 4. User Role Assignment

Ensure admin users have the appropriate role:
```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'admin@safesats.com';
```

## Usage Guide

### Creating a Price Override

1. **Access Admin Panel**
   - Navigate to `/admin/price-management`
   - Ensure you have `override_prices` permission

2. **Create Override**
   - Click "Create Price Override"
   - Enter USD price (MWK auto-calculated)
   - Provide detailed reason (minimum 10 characters)
   - Set duration (optional, leave empty for indefinite)
   - Choose whether to disable auto-updates
   - Submit form

3. **Monitor Status**
   - Override becomes active immediately
   - All users see the new price
   - Trading calculations use override price

### Deactivating an Override

1. **View Active Override**
   - Check the "Override Status" panel
   - Verify override details

2. **Deactivate**
   - Click "Deactivate Override"
   - Confirm action
   - Provide reason for deactivation
   - Override becomes inactive immediately

### Monitoring and Auditing

1. **Override History**
   - View chronological list of all overrides
   - Filter by status, admin, date range
   - Export data for reporting

2. **Audit Log**
   - Detailed action tracking
   - Security monitoring
   - Compliance reporting

## Security Considerations

### Access Control
- Multi-layer permission system
- Role-based access control
- Session validation

### Audit Trail
- Complete action logging
- IP address tracking
- User agent recording
- Timestamp precision

### Data Validation
- Price range validation
- Reason requirement
- Duration limits
- Input sanitization

### Monitoring
- Real-time status tracking
- Automatic expiration handling
- Error logging and alerting

## Troubleshooting

### Common Issues

#### Permission Denied
- Verify user has `manage_prices` permission
- Check role assignment in profiles table
- Ensure admin_permissions record exists

#### Override Not Taking Effect
- Check if override is active and not expired
- Verify price service is running
- Check browser console for errors

#### Auto-Updates Not Disabled
- Verify `disable_auto_updates` flag is set
- Check price service logs
- Ensure override is active

### Debug Steps

1. **Check User Permissions**
```sql
SELECT * FROM admin_permissions WHERE user_id = 'user-id';
```

2. **Verify Active Override**
```sql
SELECT * FROM get_active_price_override('BTC');
```

3. **Check Audit Log**
```sql
SELECT * FROM admin_price_audit_log 
ORDER BY created_at DESC LIMIT 10;
```

## Best Practices

### When to Use Price Overrides

1. **Market Disruptions**
   - API outages or data feed issues
   - Extreme market volatility
   - Technical maintenance periods

2. **Testing and Development**
   - Feature testing with specific prices
   - User experience testing
   - Integration testing

3. **Regulatory Compliance**
   - Price freezes during investigations
   - Compliance with local regulations
   - Emergency market controls

### Override Guidelines

1. **Always Provide Clear Reasons**
   - Explain why the override is necessary
   - Include expected duration
   - Reference any incidents or tickets

2. **Use Appropriate Duration**
   - Set realistic expiration times
   - Don't leave indefinite overrides
   - Monitor and update as needed

3. **Communicate Changes**
   - Notify relevant stakeholders
   - Update users if necessary
   - Document in incident reports

4. **Monitor Impact**
   - Watch trading activity
   - Check user feedback
   - Monitor system performance

## Future Enhancements

### Planned Features

1. **Multi-Currency Support**
   - Override prices for multiple cryptocurrencies
   - Currency-specific permissions
   - Cross-rate calculations

2. **Scheduled Overrides**
   - Pre-planned price changes
   - Automated activation/deactivation
   - Calendar integration

3. **Price Alerts**
   - Notifications for override expiration
   - Market deviation alerts
   - System health monitoring

4. **Advanced Analytics**
   - Override impact analysis
   - Usage statistics
   - Performance metrics

5. **API Integration**
   - REST API for external systems
   - Webhook notifications
   - Third-party integrations

## Support

For technical support or questions about the Admin Price Management System:

1. Check the troubleshooting section above
2. Review audit logs for error details
3. Contact the development team with specific error messages
4. Include relevant user IDs and timestamps in support requests

---

**Note**: This feature requires admin privileges and should be used responsibly. All actions are logged and auditable for security and compliance purposes.
