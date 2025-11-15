import { supabase } from '../lib/supabase';

/**
 * Admin Price Service for managing manual price overrides
 */
class AdminPriceService {
  constructor() {
    this.activeOverride = null;
    this.checkInterval = null;
  }

  /**
   * Check if user has admin price permissions
   */
  async checkPermission(userId, permission) {
    try {
      const { data, error } = await supabase.rpc('check_admin_price_permission', {
        p_user_id: userId,
        p_permission: permission
      });

      if (error) throw error;
      return data || false;
    } catch (error) {
      console.error('Error checking admin price permission:', error);
      return false;
    }
  }

  /**
   * Get active price override
   */
  async getActiveOverride(symbol = 'BTC') {
    try {
      const { data, error } = await supabase.rpc('get_active_price_override', {
        p_symbol: symbol
      });

      if (error) throw error;
      
      this.activeOverride = data && data.length > 0 ? data[0] : null;
      return this.activeOverride;
    } catch (error) {
      console.error('Error getting active price override:', error);
      return null;
    }
  }

  /**
   * Create a new price override
   */
  async createPriceOverride(params) {
    try {
      const {
        adminUserId,
        symbol = 'BTC',
        priceUsd,
        priceMwk,
        usdMwkRate,
        reason,
        durationMinutes = null,
        disableAutoUpdates = false,
        previousPriceUsd = null,
        previousPriceMwk = null
      } = params;

      // Check permissions
      const canOverride = await this.checkPermission(adminUserId, 'override_prices');
      if (!canOverride) {
        throw new Error('Insufficient permissions to override prices');
      }

      const { data, error } = await supabase.rpc('create_price_override', {
        p_admin_user_id: adminUserId,
        p_symbol: symbol,
        p_price_usd: priceUsd,
        p_price_mwk: priceMwk,
        p_usd_mwk_rate: usdMwkRate,
        p_reason: reason,
        p_duration_minutes: durationMinutes,
        p_disable_auto_updates: disableAutoUpdates,
        p_previous_price_usd: previousPriceUsd,
        p_previous_price_mwk: previousPriceMwk
      });

      if (error) throw error;

      // Refresh active override
      await this.getActiveOverride(symbol);

      return { success: true, overrideId: data };
    } catch (error) {
      console.error('Error creating price override:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Deactivate a price override
   */
  async deactivatePriceOverride(overrideId, adminUserId, reason = 'Manual deactivation') {
    try {
      // Check permissions
      const canOverride = await this.checkPermission(adminUserId, 'override_prices');
      if (!canOverride) {
        throw new Error('Insufficient permissions to deactivate price overrides');
      }

      const { data, error } = await supabase.rpc('deactivate_price_override', {
        p_override_id: overrideId,
        p_admin_user_id: adminUserId,
        p_reason: reason
      });

      if (error) throw error;

      // Clear active override if it was deactivated
      if (this.activeOverride && this.activeOverride.id === overrideId) {
        this.activeOverride = null;
      }

      return { success: true, deactivated: data };
    } catch (error) {
      console.error('Error deactivating price override:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get price override history
   */
  async getPriceOverrideHistory(limit = 50, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('admin_price_management_view')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error getting price override history:', error);
      return { success: false, error: error.message, data: [] };
    }
  }

  /**
   * Get price audit log
   */
  async getPriceAuditLog(limit = 100, offset = 0, filters = {}) {
    try {
      let query = supabase
        .from('admin_price_audit_log')
        .select(`
          *,
          profiles!admin_user_id(full_name, email)
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      // Apply filters
      if (filters.action) {
        query = query.eq('action', filters.action);
      }
      if (filters.symbol) {
        query = query.eq('symbol', filters.symbol);
      }
      if (filters.adminUserId) {
        query = query.eq('admin_user_id', filters.adminUserId);
      }
      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error getting price audit log:', error);
      return { success: false, error: error.message, data: [] };
    }
  }

  /**
   * Get admin permissions for a user
   */
  async getAdminPermissions(userId) {
    try {
      const { data, error } = await supabase
        .from('admin_permissions')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error getting admin permissions:', error);
      return null;
    }
  }

  /**
   * Check if auto updates are disabled
   */
  isAutoUpdatesDisabled() {
    return this.activeOverride?.disable_auto_updates || false;
  }

  /**
   * Get current effective price (override or regular)
   */
  async getEffectivePrice(regularPrice) {
    const override = await this.getActiveOverride();
    
    if (override) {
      return {
        symbol: override.symbol || 'BTC',
        price_usd: override.price_usd,
        price_mwk: override.price_mwk,
        usd_mwk_rate: override.usd_mwk_rate,
        source: 'admin_override',
        override_reason: override.reason,
        override_admin: override.admin_name,
        override_expires_at: override.expires_at,
        last_updated: override.created_at,
        fetched_at: new Date().toISOString(),
        is_override: true
      };
    }

    return regularPrice;
  }

  /**
   * Start monitoring for expired overrides
   */
  startExpirationMonitoring(interval = 60000) { // Check every minute
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(async () => {
      try {
        const override = await this.getActiveOverride();
        
        if (override && override.expires_at) {
          const expiresAt = new Date(override.expires_at);
          const now = new Date();
          
          if (now >= expiresAt) {
            console.log('Price override expired, clearing active override');
            this.activeOverride = null;
          }
        }
      } catch (error) {
        console.error('Error checking override expiration:', error);
      }
    }, interval);
  }

  /**
   * Stop expiration monitoring
   */
  stopExpirationMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Calculate price difference between override and regular price
   */
  calculatePriceDifference(overridePrice, regularPrice) {
    if (!overridePrice || !regularPrice) return null;

    const usdDiff = overridePrice.price_usd - regularPrice.price_usd;
    const mwkDiff = overridePrice.price_mwk - regularPrice.price_mwk;
    const usdPercentDiff = (usdDiff / regularPrice.price_usd) * 100;
    const mwkPercentDiff = (mwkDiff / regularPrice.price_mwk) * 100;

    return {
      usd_difference: usdDiff,
      mwk_difference: mwkDiff,
      usd_percent_difference: usdPercentDiff,
      mwk_percent_difference: mwkPercentDiff
    };
  }

  /**
   * Validate price override parameters
   */
  validateOverrideParams(params) {
    const errors = [];

    if (!params.priceUsd || params.priceUsd <= 0) {
      errors.push('USD price must be greater than 0');
    }

    if (!params.priceMwk || params.priceMwk <= 0) {
      errors.push('MWK price must be greater than 0');
    }

    if (!params.usdMwkRate || params.usdMwkRate <= 0) {
      errors.push('USD/MWK rate must be greater than 0');
    }

    if (!params.reason || params.reason.trim().length < 10) {
      errors.push('Reason must be at least 10 characters long');
    }

    if (params.durationMinutes !== null && params.durationMinutes <= 0) {
      errors.push('Duration must be greater than 0 minutes');
    }

    // Check if prices are reasonable (not too far from expected ranges)
    if (params.priceUsd < 1000 || params.priceUsd > 1000000) {
      errors.push('USD price seems unrealistic (should be between $1,000 and $1,000,000)');
    }

    if (params.priceMwk < 1000000 || params.priceMwk > 2000000000) {
      errors.push('MWK price seems unrealistic');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Create singleton instance
const adminPriceService = new AdminPriceService();

export default adminPriceService;
