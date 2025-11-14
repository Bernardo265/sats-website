// Tests for Transaction Service
import transactionService from '../../services/transactionService';
import { TRANSACTION_STATUS, TRANSACTION_TYPES, PAYMENT_METHODS } from '../../utils/paymentConstants';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('TransactionService', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
  });

  describe('createTransaction', () => {
    test('should create a new transaction', () => {
      localStorageMock.getItem.mockReturnValue('[]');

      const transactionData = {
        type: TRANSACTION_TYPES.BUY,
        paymentMethod: PAYMENT_METHODS.AIRTEL_MONEY,
        amount: 10000,
        bitcoinAmount: 0.001,
        phoneNumber: '+255678123456',
        reference: 'TEST_REF_123'
      };

      const transaction = transactionService.createTransaction(transactionData);

      expect(transaction).toMatchObject({
        type: TRANSACTION_TYPES.BUY,
        status: TRANSACTION_STATUS.PENDING,
        paymentMethod: PAYMENT_METHODS.AIRTEL_MONEY,
        amount: 10000,
        bitcoinAmount: 0.001,
        phoneNumber: '+265678123456',
        reference: 'TEST_REF_123'
      });

      expect(transaction.id).toBeDefined();
      expect(transaction.createdAt).toBeDefined();
      expect(transaction.updatedAt).toBeDefined();
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    test('should handle localStorage errors gracefully', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const transactionData = {
        type: TRANSACTION_TYPES.BUY,
        paymentMethod: PAYMENT_METHODS.AIRTEL_MONEY,
        amount: 10000,
        bitcoinAmount: 0.001
      };

      expect(() => transactionService.createTransaction(transactionData)).toThrow('Failed to create transaction');
    });
  });

  describe('updateTransaction', () => {
    test('should update existing transaction', () => {
      const existingTransaction = {
        id: 'TEST_TXN_123',
        status: TRANSACTION_STATUS.PENDING,
        amount: 10000,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify([existingTransaction]));

      const updates = {
        status: TRANSACTION_STATUS.COMPLETED,
        completedAt: '2023-01-01T01:00:00.000Z'
      };

      const updatedTransaction = transactionService.updateTransaction('TEST_TXN_123', updates);

      expect(updatedTransaction.status).toBe(TRANSACTION_STATUS.COMPLETED);
      expect(updatedTransaction.completedAt).toBe('2023-01-01T01:00:00.000Z');
      expect(updatedTransaction.updatedAt).not.toBe('2023-01-01T00:00:00.000Z');
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    test('should throw error for non-existent transaction', () => {
      localStorageMock.getItem.mockReturnValue('[]');

      expect(() => transactionService.updateTransaction('NON_EXISTENT', {}))
        .toThrow('Failed to update transaction');
    });
  });

  describe('getTransaction', () => {
    test('should retrieve transaction by ID', () => {
      const transaction = {
        id: 'TEST_TXN_123',
        status: TRANSACTION_STATUS.PENDING,
        amount: 10000
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify([transaction]));

      const result = transactionService.getTransaction('TEST_TXN_123');
      expect(result).toEqual(transaction);
    });

    test('should return null for non-existent transaction', () => {
      localStorageMock.getItem.mockReturnValue('[]');

      const result = transactionService.getTransaction('NON_EXISTENT');
      expect(result).toBeNull();
    });
  });

  describe('getTransactionsByStatus', () => {
    test('should filter transactions by status', () => {
      const transactions = [
        { id: '1', status: TRANSACTION_STATUS.PENDING },
        { id: '2', status: TRANSACTION_STATUS.COMPLETED },
        { id: '3', status: TRANSACTION_STATUS.PENDING },
        { id: '4', status: TRANSACTION_STATUS.FAILED }
      ];

      localStorageMock.getItem.mockReturnValue(JSON.stringify(transactions));

      const pendingTransactions = transactionService.getTransactionsByStatus(TRANSACTION_STATUS.PENDING);
      expect(pendingTransactions).toHaveLength(2);
      expect(pendingTransactions.every(t => t.status === TRANSACTION_STATUS.PENDING)).toBe(true);
    });
  });

  describe('completeTransaction', () => {
    test('should mark transaction as completed', () => {
      const transaction = {
        id: 'TEST_TXN_123',
        status: TRANSACTION_STATUS.PENDING,
        amount: 10000
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify([transaction]));

      const completedTransaction = transactionService.completeTransaction('TEST_TXN_123', {
        bitcoinTxHash: 'abc123'
      });

      expect(completedTransaction.status).toBe(TRANSACTION_STATUS.COMPLETED);
      expect(completedTransaction.completedAt).toBeDefined();
      expect(completedTransaction.bitcoinTxHash).toBe('abc123');
    });
  });

  describe('failTransaction', () => {
    test('should mark transaction as failed', () => {
      const transaction = {
        id: 'TEST_TXN_123',
        status: TRANSACTION_STATUS.PENDING,
        amount: 10000
      };

      localStorageMock.getItem.mockReturnValue(JSON.stringify([transaction]));

      const failedTransaction = transactionService.failTransaction('TEST_TXN_123', {
        error: 'Payment declined'
      });

      expect(failedTransaction.status).toBe(TRANSACTION_STATUS.FAILED);
      expect(failedTransaction.failedAt).toBeDefined();
      expect(failedTransaction.error).toBe('Payment declined');
    });
  });

  describe('generateTransactionId', () => {
    test('should generate unique transaction IDs', () => {
      const id1 = transactionService.generateTransactionId();
      const id2 = transactionService.generateTransactionId();

      expect(id1).toMatch(/^SAFESATS_\d+_[A-Z0-9]+$/);
      expect(id2).toMatch(/^SAFESATS_\d+_[A-Z0-9]+$/);
      expect(id1).not.toBe(id2);
    });
  });

  describe('getTransactionStats', () => {
    test('should calculate transaction statistics', () => {
      const transactions = [
        { 
          id: '1', 
          status: TRANSACTION_STATUS.COMPLETED, 
          amount: 10000, 
          bitcoinAmount: 0.001,
          paymentMethod: PAYMENT_METHODS.AIRTEL_MONEY
        },
        { 
          id: '2', 
          status: TRANSACTION_STATUS.COMPLETED, 
          amount: 20000, 
          bitcoinAmount: 0.002,
          paymentMethod: PAYMENT_METHODS.AIRTEL_MONEY
        },
        { 
          id: '3', 
          status: TRANSACTION_STATUS.PENDING, 
          amount: 15000, 
          bitcoinAmount: 0.0015,
          paymentMethod: PAYMENT_METHODS.MUKURU
        },
        { 
          id: '4', 
          status: TRANSACTION_STATUS.FAILED, 
          amount: 5000, 
          bitcoinAmount: 0.0005,
          paymentMethod: PAYMENT_METHODS.AIRTEL_MONEY
        }
      ];

      localStorageMock.getItem.mockReturnValue(JSON.stringify(transactions));

      const stats = transactionService.getTransactionStats();

      expect(stats.total).toBe(4);
      expect(stats.completed).toBe(2);
      expect(stats.pending).toBe(1);
      expect(stats.failed).toBe(1);
      expect(stats.totalVolume).toBe(30000);
      expect(stats.totalBitcoin).toBe(0.003);
      expect(stats.averageAmount).toBe(15000);
      expect(stats.paymentMethods[PAYMENT_METHODS.AIRTEL_MONEY]).toBe(3);
      expect(stats.paymentMethods[PAYMENT_METHODS.MUKURU]).toBe(1);
    });

    test('should handle empty transaction list', () => {
      localStorageMock.getItem.mockReturnValue('[]');

      const stats = transactionService.getTransactionStats();

      expect(stats.total).toBe(0);
      expect(stats.completed).toBe(0);
      expect(stats.totalVolume).toBe(0);
      expect(stats.averageAmount).toBe(0);
    });
  });

  describe('exportTransactions', () => {
    test('should export transactions as JSON', () => {
      const transactions = [
        { id: '1', status: TRANSACTION_STATUS.COMPLETED, amount: 10000 }
      ];

      localStorageMock.getItem.mockReturnValue(JSON.stringify(transactions));

      const exported = transactionService.exportTransactions('json');
      expect(JSON.parse(exported)).toEqual(transactions);
    });

    test('should export transactions as CSV', () => {
      const transactions = [
        { 
          id: 'TEST_1', 
          type: TRANSACTION_TYPES.BUY,
          status: TRANSACTION_STATUS.COMPLETED, 
          paymentMethod: PAYMENT_METHODS.AIRTEL_MONEY,
          amount: 10000,
          bitcoinAmount: 0.001,
          currency: 'MWK',
          phoneNumber: '+265888123456',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T01:00:00.000Z'
        }
      ];

      localStorageMock.getItem.mockReturnValue(JSON.stringify(transactions));

      const csv = transactionService.exportTransactions('csv');
      expect(csv).toContain('ID,Type,Status,Payment Method');
      expect(csv).toContain('TEST_1');
      expect(csv).toContain('airtel_money');
    });
  });

  describe('clearAllTransactions', () => {
    test('should clear all transactions', () => {
      const result = transactionService.clearAllTransactions();
      
      expect(result).toBe(true);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('safesats_transactions');
    });
  });
});
