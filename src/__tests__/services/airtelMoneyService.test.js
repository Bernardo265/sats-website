// Tests for Airtel Money Service
import airtelMoneyService from '../../services/airtelMoneyService';
import { ERROR_CODES, TRANSACTION_STATUS } from '../../utils/paymentConstants';

// Mock fetch globally
global.fetch = jest.fn();

describe('AirtelMoneyService', () => {
  beforeEach(() => {
    fetch.mockClear();
    airtelMoneyService.accessToken = null;
    airtelMoneyService.tokenExpiry = null;
  });

  describe('formatPhoneNumber', () => {
    test('should format Malawian phone numbers correctly', () => {
      expect(airtelMoneyService.formatPhoneNumber('0888123456')).toBe('265888123456');
      expect(airtelMoneyService.formatPhoneNumber('+265888123456')).toBe('265888123456');
      expect(airtelMoneyService.formatPhoneNumber('265888123456')).toBe('265888123456');
      expect(airtelMoneyService.formatPhoneNumber('888123456')).toBe('265888123456');
    });

    test('should throw error for invalid phone numbers', () => {
      expect(() => airtelMoneyService.formatPhoneNumber('123')).toThrow(ERROR_CODES.INVALID_PHONE_NUMBER);
      expect(() => airtelMoneyService.formatPhoneNumber('abc')).toThrow(ERROR_CODES.INVALID_PHONE_NUMBER);
    });
  });

  describe('validatePaymentData', () => {
    test('should validate correct payment data', () => {
      const validData = {
        phoneNumber: '+255678123456',
        amount: 10000,
        reference: 'TEST_REF_123'
      };

      const result = airtelMoneyService.validatePaymentData(validData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    test('should return errors for invalid payment data', () => {
      const invalidData = {
        phoneNumber: 'invalid',
        amount: -100,
        reference: ''
      };

      const result = airtelMoneyService.validatePaymentData(invalidData);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('should require phone number', () => {
      const data = {
        amount: 10000,
        reference: 'TEST_REF_123'
      };

      const result = airtelMoneyService.validatePaymentData(data);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Phone number is required');
    });
  });

  describe('getAccessToken', () => {
    test('should fetch new token when none exists', async () => {
      const mockTokenResponse = {
        access_token: 'test_token_123',
        expires_in: 3600
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockTokenResponse
      });

      const token = await airtelMoneyService.getAccessToken();
      
      expect(token).toBe('test_token_123');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/oauth2/token'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/x-www-form-urlencoded'
          })
        })
      );
    });

    test('should return cached token if still valid', async () => {
      airtelMoneyService.accessToken = 'cached_token';
      airtelMoneyService.tokenExpiry = Date.now() + 1000000; // Future expiry

      const token = await airtelMoneyService.getAccessToken();
      
      expect(token).toBe('cached_token');
      expect(fetch).not.toHaveBeenCalled();
    });

    test('should handle authentication failure', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401
      });

      await expect(airtelMoneyService.getAccessToken()).rejects.toThrow(ERROR_CODES.UNAUTHORIZED);
    });
  });

  describe('mapTransactionStatus', () => {
    test('should map Airtel statuses to internal statuses', () => {
      expect(airtelMoneyService.mapTransactionStatus('TS')).toBe(TRANSACTION_STATUS.COMPLETED);
      expect(airtelMoneyService.mapTransactionStatus('TF')).toBe(TRANSACTION_STATUS.FAILED);
      expect(airtelMoneyService.mapTransactionStatus('TA')).toBe(TRANSACTION_STATUS.PENDING);
      expect(airtelMoneyService.mapTransactionStatus('TIP')).toBe(TRANSACTION_STATUS.PROCESSING);
      expect(airtelMoneyService.mapTransactionStatus('UNKNOWN')).toBe(TRANSACTION_STATUS.PENDING);
    });
  });

  describe('initiatePayment', () => {
    beforeEach(() => {
      // Mock successful authentication
      fetch.mockImplementation((url) => {
        if (url.includes('/auth/oauth2/token')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              access_token: 'test_token',
              expires_in: 3600
            })
          });
        }
        
        if (url.includes('/merchant/v1/payments/')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              data: {
                transaction: {
                  id: 'AIRTEL_TXN_123'
                }
              }
            })
          });
        }
        
        return Promise.reject(new Error('Unknown URL'));
      });
    });

    test('should initiate payment successfully', async () => {
      const paymentData = {
        phoneNumber: '+265888123456',
        amount: 50000,
        currency: 'MWK',
        reference: 'TEST_REF_123'
      };

      const result = await airtelMoneyService.initiatePayment(paymentData);
      
      expect(result.success).toBe(true);
      expect(result.transactionId).toBe('AIRTEL_TXN_123');
      expect(result.status).toBe(TRANSACTION_STATUS.PENDING);
    });

    test('should handle payment initiation failure', async () => {
      const paymentData = {
        phoneNumber: 'invalid_phone',
        amount: 10000,
        reference: 'TEST_REF_123'
      };

      const result = await airtelMoneyService.initiatePayment(paymentData);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('generateTransactionReference', () => {
    test('should generate unique references', () => {
      const ref1 = airtelMoneyService.generateTransactionReference();
      const ref2 = airtelMoneyService.generateTransactionReference();
      
      expect(ref1).toMatch(/^SAFESATS_\d+_[A-Z0-9]+$/);
      expect(ref2).toMatch(/^SAFESATS_\d+_[A-Z0-9]+$/);
      expect(ref1).not.toBe(ref2);
    });
  });

  describe('mapErrorCode', () => {
    test('should map error messages to appropriate error codes', () => {
      expect(airtelMoneyService.mapErrorCode('insufficient funds')).toBe(ERROR_CODES.INSUFFICIENT_FUNDS);
      expect(airtelMoneyService.mapErrorCode('invalid phone number')).toBe(ERROR_CODES.INVALID_PHONE_NUMBER);
      expect(airtelMoneyService.mapErrorCode('timeout occurred')).toBe(ERROR_CODES.TRANSACTION_TIMEOUT);
      expect(airtelMoneyService.mapErrorCode('network error')).toBe(ERROR_CODES.NETWORK_ERROR);
      expect(airtelMoneyService.mapErrorCode('unknown error')).toBe(ERROR_CODES.API_ERROR);
    });
  });
});
