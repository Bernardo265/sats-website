import { supabaseHelpers } from '../lib/supabase';
import priceService from './priceService';

/**
 * Trading Service for handling complex trading operations
 */
class TradingService {
  constructor() {
    this.tradingFee = 0.001; // 0.1% trading fee
    this.minTradeAmount = 1000; // Minimum trade amount in MWK
    this.maxTradeAmount = 1000000; // Maximum trade amount in MWK
  }

  /**
   * Validate trading parameters
   * @param {Object} params - Trading parameters
   * @returns {Object} Validation result
   */
  validateTradeParams(params) {
    const errors = [];

    if (!params.amount || params.amount <= 0) {
      errors.push('Amount must be greater than 0');
    }

    if (params.amount < this.minTradeAmount) {
      errors.push(`Minimum trade amount is ${this.minTradeAmount.toLocaleString()} MWK`);
    }

    if (params.amount > this.maxTradeAmount) {
      errors.push(`Maximum trade amount is ${this.maxTradeAmount.toLocaleString()} MWK`);
    }

    if (params.orderType === 'limit' && (!params.price || params.price <= 0)) {
      errors.push('Limit price must be greater than 0');
    }

    if (!['buy', 'sell'].includes(params.type)) {
      errors.push('Trade type must be buy or sell');
    }

    if (!['market', 'limit'].includes(params.orderType)) {
      errors.push('Order type must be market or limit');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Calculate trading fees
   * @param {number} amount - Trade amount
   * @returns {number} Fee amount
   */
  calculateFee(amount) {
    return amount * this.tradingFee;
  }

  /**
   * Execute a market buy order
   * @param {Object} params - Trade parameters
   * @returns {Object} Trade result
   */
  async executeBuyOrder(params) {
    try {
      const { userId, amount, orderType = 'market', limitPrice = null } = params;

      // Validate parameters
      const validation = this.validateTradeParams({ ...params, type: 'buy' });
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Get current price
      const currentPrice = orderType === 'market' 
        ? priceService.getCurrentPrice()?.price_mwk 
        : limitPrice;

      if (!currentPrice) {
        throw new Error('Price data not available');
      }

      // Get user portfolio
      const portfolio = await supabaseHelpers.getUserPortfolio(userId);
      if (!portfolio) {
        throw new Error('Portfolio not found');
      }

      // Calculate trade details
      const fee = this.calculateFee(amount);
      const totalCost = amount + fee;
      const btcAmount = amount / currentPrice;

      // Check balance
      if (totalCost > portfolio.mwk_balance) {
        throw new Error('Insufficient MWK balance');
      }

      if (orderType === 'market') {
        // Execute market order immediately
        const transaction = {
          user_id: userId,
          type: 'buy',
          order_type: 'market',
          btc_amount: btcAmount,
          mwk_amount: amount,
          price: currentPrice,
          fee: fee,
          status: 'completed'
        };

        // Create transaction
        const createdTransaction = await supabaseHelpers.createTransaction(transaction);

        // Update portfolio
        const updatedPortfolio = {
          user_id: userId,
          mwk_balance: portfolio.mwk_balance - totalCost,
          btc_balance: portfolio.btc_balance + btcAmount
        };

        await supabaseHelpers.upsertPortfolio(updatedPortfolio);

        // Calculate new portfolio value
        await supabaseHelpers.calculatePortfolioValue(userId, currentPrice);

        return {
          success: true,
          transaction: createdTransaction,
          executionPrice: currentPrice,
          fee: fee,
          btcAmount: btcAmount
        };
      } else {
        // Create limit order
        const order = {
          user_id: userId,
          type: 'buy',
          order_type: 'limit',
          amount: amount,
          price: limitPrice,
          status: 'pending'
        };

        const createdOrder = await supabaseHelpers.createOrder(order);

        return {
          success: true,
          order: createdOrder,
          orderType: 'limit',
          pendingAmount: amount
        };
      }
    } catch (error) {
      console.error('Error executing buy order:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Execute a market sell order
   * @param {Object} params - Trade parameters
   * @returns {Object} Trade result
   */
  async executeSellOrder(params) {
    try {
      const { userId, btcAmount, orderType = 'market', limitPrice = null } = params;

      // Validate parameters
      const validation = this.validateTradeParams({ 
        ...params, 
        type: 'sell',
        amount: btcAmount * (limitPrice || priceService.getCurrentPrice()?.price_mwk || 0)
      });
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Get current price
      const currentPrice = orderType === 'market' 
        ? priceService.getCurrentPrice()?.price_mwk 
        : limitPrice;

      if (!currentPrice) {
        throw new Error('Price data not available');
      }

      // Get user portfolio
      const portfolio = await supabaseHelpers.getUserPortfolio(userId);
      if (!portfolio) {
        throw new Error('Portfolio not found');
      }

      // Check BTC balance
      if (btcAmount > portfolio.btc_balance) {
        throw new Error('Insufficient Bitcoin balance');
      }

      // Calculate trade details
      const mwkAmount = btcAmount * currentPrice;
      const fee = this.calculateFee(mwkAmount);
      const netAmount = mwkAmount - fee;

      if (orderType === 'market') {
        // Execute market order immediately
        const transaction = {
          user_id: userId,
          type: 'sell',
          order_type: 'market',
          btc_amount: btcAmount,
          mwk_amount: mwkAmount,
          price: currentPrice,
          fee: fee,
          status: 'completed'
        };

        // Create transaction
        const createdTransaction = await supabaseHelpers.createTransaction(transaction);

        // Update portfolio
        const updatedPortfolio = {
          user_id: userId,
          mwk_balance: portfolio.mwk_balance + netAmount,
          btc_balance: portfolio.btc_balance - btcAmount
        };

        await supabaseHelpers.upsertPortfolio(updatedPortfolio);

        // Calculate new portfolio value
        await supabaseHelpers.calculatePortfolioValue(userId, currentPrice);

        return {
          success: true,
          transaction: createdTransaction,
          executionPrice: currentPrice,
          fee: fee,
          netAmount: netAmount
        };
      } else {
        // Create limit order
        const order = {
          user_id: userId,
          type: 'sell',
          order_type: 'limit',
          amount: mwkAmount,
          price: limitPrice,
          status: 'pending'
        };

        const createdOrder = await supabaseHelpers.createOrder(order);

        return {
          success: true,
          order: createdOrder,
          orderType: 'limit',
          pendingBtcAmount: btcAmount
        };
      }
    } catch (error) {
      console.error('Error executing sell order:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Cancel a pending order
   * @param {string} orderId - Order ID to cancel
   * @param {string} userId - User ID
   * @returns {Object} Cancellation result
   */
  async cancelOrder(orderId, userId) {
    try {
      // Get order details
      const orders = await supabaseHelpers.getUserOrders(userId);
      const order = orders.find(o => o.id === orderId);

      if (!order) {
        throw new Error('Order not found');
      }

      if (order.status !== 'pending') {
        throw new Error('Only pending orders can be cancelled');
      }

      // Update order status
      await supabaseHelpers.updateOrder(orderId, { status: 'cancelled' });

      return {
        success: true,
        cancelledOrder: order
      };
    } catch (error) {
      console.error('Error cancelling order:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get trading statistics for a user
   * @param {string} userId - User ID
   * @returns {Object} Trading statistics
   */
  async getTradingStats(userId) {
    try {
      const dashboard = await supabaseHelpers.getUserDashboard();
      const transactions = await supabaseHelpers.getTradingHistory(100);

      const stats = {
        totalTrades: dashboard.total_trades || 0,
        winningTrades: dashboard.winning_trades || 0,
        losingTrades: dashboard.losing_trades || 0,
        winRate: dashboard.win_rate_percentage || 0,
        totalVolume: transactions.reduce((sum, t) => sum + t.mwk_amount, 0),
        averageTradeSize: transactions.length > 0 
          ? transactions.reduce((sum, t) => sum + t.mwk_amount, 0) / transactions.length 
          : 0,
        largestGain: dashboard.largest_gain || 0,
        largestLoss: dashboard.largest_loss || 0,
        profitLoss: dashboard.profit_loss || 0,
        profitLossPercentage: dashboard.profit_loss_percentage || 0
      };

      return stats;
    } catch (error) {
      console.error('Error getting trading stats:', error);
      throw error;
    }
  }

  /**
   * Get service configuration
   * @returns {Object} Service configuration
   */
  getConfig() {
    return {
      tradingFee: this.tradingFee,
      minTradeAmount: this.minTradeAmount,
      maxTradeAmount: this.maxTradeAmount
    };
  }

  /**
   * Update service configuration
   * @param {Object} config - New configuration
   */
  updateConfig(config) {
    if (config.tradingFee !== undefined) {
      this.tradingFee = config.tradingFee;
    }
    if (config.minTradeAmount !== undefined) {
      this.minTradeAmount = config.minTradeAmount;
    }
    if (config.maxTradeAmount !== undefined) {
      this.maxTradeAmount = config.maxTradeAmount;
    }
  }
}

// Create singleton instance
const tradingService = new TradingService();

export default tradingService;
