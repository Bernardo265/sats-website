/**
 * Security Tests
 * Comprehensive security testing for input validation, rate limiting, and security measures
 */

import { 
  validateUserProfile, 
  validatePortfolio, 
  validateTransaction, 
  validateOrder,
  sanitizeString,
  rateLimiter,
  ValidationSchemas
} from '../utils/securityValidation';
import securityAudit from '../utils/securityAudit';

describe('Security Tests', () => {
  beforeEach(() => {
    // Clear rate limiter before each test
    rateLimiter.requests.clear();
  });

  describe('Input Validation', () => {
    describe('User Profile Validation', () => {
      test('should validate correct user profile', () => {
        const validProfile = {
          id: '12345678-1234-1234-1234-123456789012',
          full_name: 'John Doe',
          phone: '+265123456789',
          preferred_currency: 'MWK',
          timezone: 'Africa/Blantyre'
        };

        const result = validateUserProfile(validProfile);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      test('should reject invalid user ID format', () => {
        const invalidProfile = {
          id: 'invalid-id',
          full_name: 'John Doe'
        };

        const result = validateUserProfile(invalidProfile);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Invalid user ID format');
      });

      test('should reject XSS attempts in full name', () => {
        const maliciousProfile = {
          id: '12345678-1234-1234-1234-123456789012',
          full_name: '<script>alert("xss")</script>'
        };

        const result = validateUserProfile(maliciousProfile);
        expect(result.isValid).toBe(false);
        expect(result.errors.some(error => error.includes('Full name'))).toBe(true);
      });

      test('should reject invalid currency', () => {
        const invalidProfile = {
          id: '12345678-1234-1234-1234-123456789012',
          full_name: 'John Doe',
          preferred_currency: 'INVALID'
        };

        const result = validateUserProfile(invalidProfile);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Currency must be MWK or USD');
      });
    });

    describe('Portfolio Validation', () => {
      test('should validate correct portfolio', () => {
        const validPortfolio = {
          user_id: '12345678-1234-1234-1234-123456789012',
          mwk_balance: 100000,
          btc_balance: 0.001
        };

        const result = validatePortfolio(validPortfolio);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      test('should reject negative balances', () => {
        const invalidPortfolio = {
          user_id: '12345678-1234-1234-1234-123456789012',
          mwk_balance: -1000,
          btc_balance: -0.001
        };

        const result = validatePortfolio(invalidPortfolio);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });

      test('should reject excessive balances', () => {
        const invalidPortfolio = {
          user_id: '12345678-1234-1234-1234-123456789012',
          mwk_balance: 9999999999999, // Too large
          btc_balance: 999999999 // Too large
        };

        const result = validatePortfolio(invalidPortfolio);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });

    describe('Transaction Validation', () => {
      test('should validate correct transaction', () => {
        const validTransaction = {
          user_id: '12345678-1234-1234-1234-123456789012',
          type: 'buy',
          order_type: 'market',
          btc_amount: 0.001,
          mwk_amount: 5000,
          price: 5000000
        };

        const result = validateTransaction(validTransaction);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      test('should reject invalid transaction type', () => {
        const invalidTransaction = {
          user_id: '12345678-1234-1234-1234-123456789012',
          type: 'invalid',
          order_type: 'market',
          btc_amount: 0.001,
          mwk_amount: 5000,
          price: 5000000
        };

        const result = validateTransaction(invalidTransaction);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Transaction type must be buy or sell');
      });

      test('should reject zero or negative amounts', () => {
        const invalidTransaction = {
          user_id: '12345678-1234-1234-1234-123456789012',
          type: 'buy',
          order_type: 'market',
          btc_amount: 0,
          mwk_amount: 0,
          price: 0
        };

        const result = validateTransaction(invalidTransaction);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });

    describe('Order Validation', () => {
      test('should validate correct order', () => {
        const validOrder = {
          user_id: '12345678-1234-1234-1234-123456789012',
          type: 'buy',
          order_type: 'limit',
          amount: 10000,
          price: 4800000
        };

        const result = validateOrder(validOrder);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      test('should reject invalid order type', () => {
        const invalidOrder = {
          user_id: '12345678-1234-1234-1234-123456789012',
          type: 'buy',
          order_type: 'invalid',
          amount: 10000,
          price: 4800000
        };

        const result = validateOrder(invalidOrder);
        expect(result.isValid).toBe(false);
        expect(result.errors.some(error => error.includes('Order type must be'))).toBe(true);
      });
    });
  });

  describe('String Sanitization', () => {
    test('should remove HTML tags', () => {
      const maliciousInput = '<script>alert("xss")</script>Hello World';
      const sanitized = sanitizeString(maliciousInput);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('</script>');
    });

    test('should remove javascript: protocol', () => {
      const maliciousInput = 'javascript:alert("xss")';
      const sanitized = sanitizeString(maliciousInput);
      expect(sanitized).not.toContain('javascript:');
    });

    test('should remove event handlers', () => {
      const maliciousInput = 'onclick=alert("xss")';
      const sanitized = sanitizeString(maliciousInput);
      expect(sanitized).not.toContain('onclick=');
    });

    test('should trim whitespace', () => {
      const input = '  Hello World  ';
      const sanitized = sanitizeString(input);
      expect(sanitized).toBe('Hello World');
    });

    test('should limit string length', () => {
      const longInput = 'a'.repeat(2000);
      const sanitized = sanitizeString(longInput);
      expect(sanitized.length).toBeLessThanOrEqual(1000);
    });
  });

  describe('Rate Limiting', () => {
    test('should allow requests within limit', () => {
      const userId = 'test-user-1';
      
      // Should allow first few requests
      expect(rateLimiter.isAllowed(userId, 'default')).toBe(true);
      expect(rateLimiter.isAllowed(userId, 'default')).toBe(true);
      expect(rateLimiter.isAllowed(userId, 'default')).toBe(true);
    });

    test('should block requests exceeding limit', () => {
      const userId = 'test-user-2';
      
      // Make requests up to the limit
      for (let i = 0; i < 100; i++) {
        rateLimiter.isAllowed(userId, 'default');
      }
      
      // Next request should be blocked
      expect(rateLimiter.isAllowed(userId, 'default')).toBe(false);
    });

    test('should have different limits for different types', () => {
      const userId = 'test-user-3';
      
      // Auth requests should have lower limit
      for (let i = 0; i < 5; i++) {
        rateLimiter.isAllowed(userId, 'auth');
      }
      
      // Next auth request should be blocked
      expect(rateLimiter.isAllowed(userId, 'auth')).toBe(false);
      
      // But default requests should still be allowed
      expect(rateLimiter.isAllowed(userId, 'default')).toBe(true);
    });

    test('should clean up old entries', () => {
      const userId = 'test-user-4';
      
      // Add some requests
      rateLimiter.isAllowed(userId, 'default');
      
      // Manually trigger cleanup
      rateLimiter.cleanup();
      
      // Should still work (cleanup doesn't remove recent entries)
      expect(rateLimiter.isAllowed(userId, 'default')).toBe(true);
    });
  });

  describe('Security Audit', () => {
    test('should run security audit without errors', async () => {
      const result = await securityAudit.runSecurityAudit();
      
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('overall');
      expect(result).toHaveProperty('checks');
      expect(result).toHaveProperty('vulnerabilities');
      expect(result).toHaveProperty('recommendations');
      
      expect(Array.isArray(result.vulnerabilities)).toBe(true);
      expect(Array.isArray(result.recommendations)).toBe(true);
    });

    test('should log security events', () => {
      securityAudit.logSecurityEvent('test_event', { test: true });
      
      const events = securityAudit.getSecurityEvents();
      expect(events.length).toBeGreaterThan(0);
      
      const lastEvent = events[events.length - 1];
      expect(lastEvent.type).toBe('test_event');
      expect(lastEvent.details.test).toBe(true);
    });

    test('should clear security events', () => {
      securityAudit.logSecurityEvent('test_event', { test: true });
      expect(securityAudit.getSecurityEvents().length).toBeGreaterThan(0);
      
      securityAudit.clearSecurityEvents();
      expect(securityAudit.getSecurityEvents().length).toBe(0);
    });
  });

  describe('Validation Schemas', () => {
    test('should have all required validation schemas', () => {
      expect(ValidationSchemas).toHaveProperty('userProfile');
      expect(ValidationSchemas).toHaveProperty('portfolio');
      expect(ValidationSchemas).toHaveProperty('transaction');
      expect(ValidationSchemas).toHaveProperty('order');
    });

    test('should have proper schema structure', () => {
      const schema = ValidationSchemas.userProfile;
      
      expect(schema.id).toHaveProperty('required');
      expect(schema.id).toHaveProperty('type');
      expect(schema.id).toHaveProperty('pattern');
      expect(schema.id).toHaveProperty('message');
    });
  });
});
