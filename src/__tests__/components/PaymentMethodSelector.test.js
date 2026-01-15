// Tests for PaymentMethodSelector Component
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PaymentMethodSelector from '../../components/payment/PaymentMethodSelector';
import { PaymentProvider } from '../../contexts/PaymentContext';
import { PAYMENT_METHODS, PAYMENT_METHOD_CONFIG } from '../../utils/paymentConstants';

// Mock the payment context
const mockPaymentContext = {
  availablePaymentMethods: [
    PAYMENT_METHOD_CONFIG[PAYMENT_METHODS.Paychangu]
    // PAYMENT_METHOD_CONFIG[PAYMENT_METHODS.AIRTEL_MONEY],
    // PAYMENT_METHOD_CONFIG[PAYMENT_METHODS.MUKURU]
  ],
  selectedPaymentMethod: null
};

jest.mock('../../contexts/PaymentContext', () => ({
  usePayment: () => mockPaymentContext,
  PaymentProvider: ({ children }) => <div>{children}</div>
}));

// Mock services
jest.mock('../../services/airtelMoneyService', () => ({
  default: {
    validatePaymentData: jest.fn(),
    generateTransactionReference: jest.fn()
  }
}));

jest.mock('../../services/transactionService', () => ({
  default: {
    createTransaction: jest.fn(),
    updateTransaction: jest.fn()
  }
}));

describe('PaymentMethodSelector', () => {
  const mockOnMethodSelect = jest.fn();

  beforeEach(() => {
    mockOnMethodSelect.mockClear();
  });

  test('renders payment method selection title', () => {
    render(
      <PaymentProvider>
        <PaymentMethodSelector onMethodSelect={mockOnMethodSelect} />
      </PaymentProvider>
    );

    expect(screen.getByText('Select Payment Method')).toBeInTheDocument();
    expect(screen.getByText('Choose your preferred payment method to complete the Bitcoin purchase')).toBeInTheDocument();
  });

  test('displays available payment methods', () => {
    render(
      <PaymentProvider>
        <PaymentMethodSelector onMethodSelect={mockOnMethodSelect} />
      </PaymentProvider>
    );

    expect(screen.getByText('Airtel Money')).toBeInTheDocument();
    expect(screen.getByText('Mukuru')).toBeInTheDocument();
  });

  test('shows payment method details', () => {
    render(
      <PaymentProvider>
        <PaymentMethodSelector onMethodSelect={mockOnMethodSelect} />
      </PaymentProvider>
    );

    // Check for Airtel Money details
    expect(screen.getByText('Pay securely with your Airtel Money wallet')).toBeInTheDocument();
    expect(screen.getByText('2.0%')).toBeInTheDocument(); // Fee
    expect(screen.getByText('5-10 minutes')).toBeInTheDocument(); // Processing time
  });

  test('calls onMethodSelect when active method is clicked', () => {
    render(
      <PaymentProvider>
        <PaymentMethodSelector onMethodSelect={mockOnMethodSelect} />
      </PaymentProvider>
    );

    const airtelMoneyOption = screen.getByText('Airtel Money').closest('div');
    fireEvent.click(airtelMoneyOption);

    expect(mockOnMethodSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        id: PAYMENT_METHODS.AIRTEL_MONEY,
        name: 'Airtel Money'
      })
    );
  });

  test('does not call onMethodSelect for inactive methods', () => {
    // Mock Mukuru as inactive
    const inactiveConfig = {
      ...PAYMENT_METHOD_CONFIG[PAYMENT_METHODS.MUKURU],
      isActive: false
    };

    mockPaymentContext.availablePaymentMethods = [
      PAYMENT_METHOD_CONFIG[PAYMENT_METHODS.AIRTEL_MONEY],
      inactiveConfig
    ];

    render(
      <PaymentProvider>
        <PaymentMethodSelector onMethodSelect={mockOnMethodSelect} />
      </PaymentProvider>
    );

    const mukuruOption = screen.getByText('Mukuru').closest('div');
    fireEvent.click(mukuruOption);

    expect(mockOnMethodSelect).not.toHaveBeenCalled();
  });

  test('shows special features for Airtel Money', () => {
    render(
      <PaymentProvider>
        <PaymentMethodSelector onMethodSelect={mockOnMethodSelect} />
      </PaymentProvider>
    );

    expect(screen.getByText('Instant mobile payments')).toBeInTheDocument();
    expect(screen.getByText('Pay directly from your Airtel Money wallet with USSD confirmation')).toBeInTheDocument();
  });

  test('shows coming soon indicator for inactive methods', () => {
    // Mock Mukuru as inactive
    const inactiveConfig = {
      ...PAYMENT_METHOD_CONFIG[PAYMENT_METHODS.MUKURU],
      isActive: false
    };

    mockPaymentContext.availablePaymentMethods = [
      PAYMENT_METHOD_CONFIG[PAYMENT_METHODS.AIRTEL_MONEY],
      inactiveConfig
    ];

    render(
      <PaymentProvider>
        <PaymentMethodSelector onMethodSelect={mockOnMethodSelect} />
      </PaymentProvider>
    );

    expect(screen.getByText('Coming Soon')).toBeInTheDocument();
    expect(screen.getByText('This payment method will be available soon')).toBeInTheDocument();
  });

  test('displays payment security information', () => {
    render(
      <PaymentProvider>
        <PaymentMethodSelector onMethodSelect={mockOnMethodSelect} />
      </PaymentProvider>
    );

    expect(screen.getByText('Payment Security')).toBeInTheDocument();
    expect(screen.getByText('All payments are encrypted and secure')).toBeInTheDocument();
    expect(screen.getByText('No payment details stored on our servers')).toBeInTheDocument();
    expect(screen.getByText('Instant Bitcoin delivery to your wallet')).toBeInTheDocument();
  });

  test('formats currency amounts correctly', () => {
    render(
      <PaymentProvider>
        <PaymentMethodSelector onMethodSelect={mockOnMethodSelect} />
      </PaymentProvider>
    );

    // Check for formatted minimum and maximum amounts
    // The exact format depends on the Intl.NumberFormat implementation
    expect(screen.getByText(/Min:/)).toBeInTheDocument();
    expect(screen.getByText(/Max:/)).toBeInTheDocument();
  });

  test('shows available status for active methods', () => {
    render(
      <PaymentProvider>
        <PaymentMethodSelector onMethodSelect={mockOnMethodSelect} />
      </PaymentProvider>
    );

    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  test('applies correct CSS classes for selection state', () => {
    mockPaymentContext.selectedPaymentMethod = PAYMENT_METHOD_CONFIG[PAYMENT_METHODS.AIRTEL_MONEY];

    render(
      <PaymentProvider>
        <PaymentMethodSelector onMethodSelect={mockOnMethodSelect} />
      </PaymentProvider>
    );

    const airtelMoneyOption = screen.getByText('Airtel Money').closest('div').parentElement;
    expect(airtelMoneyOption).toHaveClass('border-green-400');
  });

  test('handles image loading errors gracefully', () => {
    render(
      <PaymentProvider>
        <PaymentMethodSelector onMethodSelect={mockOnMethodSelect} />
      </PaymentProvider>
    );

    const images = screen.getAllByRole('img');
    images.forEach(img => {
      // Simulate image load error
      fireEvent.error(img);
    });

    // Component should still render without crashing
    expect(screen.getByText('Select Payment Method')).toBeInTheDocument();
  });
});
