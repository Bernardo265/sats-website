/**
 * Security Validation Utilities
 * Comprehensive input validation and sanitization for database operations
 */

/**
 * Input validation schemas
 */
export const ValidationSchemas = {
  // User Profile Validation
  userProfile: {
    id: {
      required: true,
      type: 'string',
      pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      message: 'Invalid user ID format'
    },
    full_name: {
      required: true,
      type: 'string',
      minLength: 2,
      maxLength: 100,
      pattern: /^[a-zA-Z\s\-'\.]+$/,
      message: 'Full name must be 2-100 characters and contain only letters, spaces, hyphens, apostrophes, and periods'
    },
    phone: {
      required: false,
      type: 'string',
      pattern: /^\+?[1-9]\d{1,14}$/,
      message: 'Invalid phone number format'
    },
    preferred_currency: {
      required: false,
      type: 'string',
      enum: ['MWK', 'USD'],
      message: 'Currency must be MWK or USD'
    },
    timezone: {
      required: false,
      type: 'string',
      maxLength: 50,
      message: 'Invalid timezone'
    }
  },

  // Portfolio Validation
  portfolio: {
    user_id: {
      required: true,
      type: 'string',
      pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      message: 'Invalid user ID format'
    },
    mwk_balance: {
      required: false,
      type: 'number',
      min: 0,
      max: 999999999999.99,
      message: 'MWK balance must be between 0 and 999,999,999,999.99'
    },
    btc_balance: {
      required: false,
      type: 'number',
      min: 0,
      max: 99999999.99999999,
      message: 'BTC balance must be between 0 and 99,999,999.99999999'
    }
  },

  // Transaction Validation
  transaction: {
    user_id: {
      required: true,
      type: 'string',
      pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      message: 'Invalid user ID format'
    },
    type: {
      required: true,
      type: 'string',
      enum: ['buy', 'sell'],
      message: 'Transaction type must be buy or sell'
    },
    order_type: {
      required: true,
      type: 'string',
      enum: ['market', 'limit'],
      message: 'Order type must be market or limit'
    },
    btc_amount: {
      required: true,
      type: 'number',
      min: 0.00000001,
      max: 99999999.99999999,
      message: 'BTC amount must be between 0.00000001 and 99,999,999.99999999'
    },
    mwk_amount: {
      required: true,
      type: 'number',
      min: 1,
      max: 999999999999.99,
      message: 'MWK amount must be between 1 and 999,999,999,999.99'
    },
    price: {
      required: true,
      type: 'number',
      min: 0.01,
      max: 999999999999.99,
      message: 'Price must be between 0.01 and 999,999,999,999.99'
    }
  },

  // Order Validation
  order: {
    user_id: {
      required: true,
      type: 'string',
      pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      message: 'Invalid user ID format'
    },
    type: {
      required: true,
      type: 'string',
      enum: ['buy', 'sell'],
      message: 'Order type must be buy or sell'
    },
    order_type: {
      required: true,
      type: 'string',
      enum: ['limit', 'stop_loss', 'take_profit'],
      message: 'Order type must be limit, stop_loss, or take_profit'
    },
    amount: {
      required: true,
      type: 'number',
      min: 1,
      max: 999999999999.99,
      message: 'Amount must be between 1 and 999,999,999,999.99'
    },
    price: {
      required: true,
      type: 'number',
      min: 0.01,
      max: 999999999999.99,
      message: 'Price must be between 0.01 and 999,999,999,999.99'
    }
  }
};

/**
 * Validate input data against schema
 * @param {Object} data - Data to validate
 * @param {Object} schema - Validation schema
 * @returns {Object} Validation result
 */
export function validateInput(data, schema) {
  const errors = [];
  const sanitizedData = {};

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];

    // Check required fields
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field} is required`);
      continue;
    }

    // Skip validation for optional empty fields
    if (!rules.required && (value === undefined || value === null || value === '')) {
      continue;
    }

    // Type validation
    if (rules.type === 'string' && typeof value !== 'string') {
      errors.push(`${field} must be a string`);
      continue;
    }

    if (rules.type === 'number' && (typeof value !== 'number' || isNaN(value))) {
      errors.push(`${field} must be a valid number`);
      continue;
    }

    // String validations
    if (rules.type === 'string') {
      // Length validation
      if (rules.minLength && value.length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters`);
        continue;
      }

      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${field} must be no more than ${rules.maxLength} characters`);
        continue;
      }

      // Pattern validation
      if (rules.pattern && !rules.pattern.test(value)) {
        errors.push(rules.message || `${field} format is invalid`);
        continue;
      }

      // Enum validation
      if (rules.enum && !rules.enum.includes(value)) {
        errors.push(rules.message || `${field} must be one of: ${rules.enum.join(', ')}`);
        continue;
      }

      // Sanitize string (basic XSS prevention)
      sanitizedData[field] = sanitizeString(value);
    }

    // Number validations
    if (rules.type === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        errors.push(rules.message || `${field} must be at least ${rules.min}`);
        continue;
      }

      if (rules.max !== undefined && value > rules.max) {
        errors.push(rules.message || `${field} must be no more than ${rules.max}`);
        continue;
      }

      sanitizedData[field] = value;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData
  };
}

/**
 * Sanitize string input to prevent XSS
 * @param {string} input - Input string
 * @returns {string} Sanitized string
 */
export function sanitizeString(input) {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 1000); // Limit length
}

/**
 * Validate user profile data
 * @param {Object} profileData - Profile data to validate
 * @returns {Object} Validation result
 */
export function validateUserProfile(profileData) {
  return validateInput(profileData, ValidationSchemas.userProfile);
}

/**
 * Validate portfolio data
 * @param {Object} portfolioData - Portfolio data to validate
 * @returns {Object} Validation result
 */
export function validatePortfolio(portfolioData) {
  return validateInput(portfolioData, ValidationSchemas.portfolio);
}

/**
 * Validate transaction data
 * @param {Object} transactionData - Transaction data to validate
 * @returns {Object} Validation result
 */
export function validateTransaction(transactionData) {
  return validateInput(transactionData, ValidationSchemas.transaction);
}

/**
 * Validate order data
 * @param {Object} orderData - Order data to validate
 * @returns {Object} Validation result
 */
export function validateOrder(orderData) {
  return validateInput(orderData, ValidationSchemas.order);
}

/**
 * Rate limiting utility
 */
export class RateLimiter {
  constructor() {
    this.requests = new Map();
    this.limits = {
      default: { requests: 100, window: 60000 }, // 100 requests per minute
      auth: { requests: 5, window: 60000 }, // 5 auth requests per minute
      trading: { requests: 50, window: 60000 } // 50 trading requests per minute
    };
  }

  /**
   * Check if request is within rate limit
   * @param {string} identifier - User identifier (IP, user ID, etc.)
   * @param {string} type - Request type (default, auth, trading)
   * @returns {boolean} Whether request is allowed
   */
  isAllowed(identifier, type = 'default') {
    const limit = this.limits[type] || this.limits.default;
    const now = Date.now();
    const windowStart = now - limit.window;

    if (!this.requests.has(identifier)) {
      this.requests.set(identifier, []);
    }

    const userRequests = this.requests.get(identifier);
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(timestamp => timestamp > windowStart);
    
    if (validRequests.length >= limit.requests) {
      return false;
    }

    // Add current request
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    
    return true;
  }

  /**
   * Clear old entries to prevent memory leaks
   */
  cleanup() {
    const now = Date.now();
    const maxWindow = Math.max(...Object.values(this.limits).map(l => l.window));
    
    for (const [identifier, requests] of this.requests.entries()) {
      const validRequests = requests.filter(timestamp => timestamp > now - maxWindow);
      if (validRequests.length === 0) {
        this.requests.delete(identifier);
      } else {
        this.requests.set(identifier, validRequests);
      }
    }
  }
}

// Create global rate limiter instance
export const rateLimiter = new RateLimiter();

// Cleanup rate limiter every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => rateLimiter.cleanup(), 5 * 60 * 1000);
}
