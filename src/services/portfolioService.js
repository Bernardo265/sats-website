import { supabaseHelpers } from '../lib/supabase';
import priceService from './priceService';

/**
 * Portfolio Service for advanced portfolio management and analytics
 */
class PortfolioService {
  constructor() {
    this.performanceCache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Get comprehensive portfolio data
   * @param {string} userId - User ID
   * @returns {Object} Portfolio data with analytics
   */
  async getPortfolioData(userId) {
    try {
      const dashboard = await supabaseHelpers.getUserDashboard();
      const currentPrice = priceService.getCurrentPrice();

      if (!dashboard) {
        throw new Error('Portfolio not found');
      }

      // Calculate real-time values if price is available
      if (currentPrice) {
        const btcValueMwk = dashboard.btc_balance * currentPrice.price_mwk;
        const totalValue = dashboard.mwk_balance + btcValueMwk;
        const profitLoss = totalValue - dashboard.initial_balance;
        const profitLossPercentage = (profitLoss / dashboard.initial_balance) * 100;

        dashboard.current_btc_price = currentPrice.price_mwk;
        dashboard.btc_value_mwk = btcValueMwk;
        dashboard.total_value = totalValue;
        dashboard.profit_loss = profitLoss;
        dashboard.profit_loss_percentage = profitLossPercentage;
      }

      // Add allocation percentages
      const mwkAllocation = dashboard.total_value > 0 
        ? (dashboard.mwk_balance / dashboard.total_value) * 100 
        : 0;
      const btcAllocation = 100 - mwkAllocation;

      return {
        ...dashboard,
        allocation: {
          mwk_percentage: mwkAllocation,
          btc_percentage: btcAllocation
        },
        performance: await this.getPerformanceMetrics(userId)
      };
    } catch (error) {
      console.error('Error getting portfolio data:', error);
      throw error;
    }
  }

  /**
   * Get performance metrics
   * @param {string} userId - User ID
   * @returns {Object} Performance metrics
   */
  async getPerformanceMetrics(userId) {
    try {
      // Check cache first
      const cacheKey = `performance_${userId}`;
      const cached = this.performanceCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }

      const transactions = await supabaseHelpers.getTradingHistory(1000); // Get more history for analysis
      const dashboard = await supabaseHelpers.getUserDashboard();

      if (!transactions || transactions.length === 0) {
        return this.getDefaultMetrics();
      }

      // Calculate performance metrics
      const metrics = {
        totalTrades: transactions.length,
        winningTrades: 0,
        losingTrades: 0,
        totalVolume: 0,
        totalFees: 0,
        averageTradeSize: 0,
        largestGain: 0,
        largestLoss: 0,
        winRate: 0,
        profitFactor: 0,
        sharpeRatio: 0,
        maxDrawdown: 0,
        averageHoldingTime: 0,
        monthlyReturns: [],
        dailyReturns: []
      };

      let totalGains = 0;
      let totalLosses = 0;
      let buyTransactions = [];
      let sellTransactions = [];

      // Process transactions
      transactions.forEach(transaction => {
        metrics.totalVolume += transaction.mwk_amount;
        metrics.totalFees += transaction.fee || 0;

        if (transaction.type === 'buy') {
          buyTransactions.push(transaction);
        } else {
          sellTransactions.push(transaction);
          
          // Find corresponding buy transaction(s) to calculate P&L
          const avgBuyPrice = this.calculateAverageBuyPrice(buyTransactions, transaction.btc_amount);
          const pnl = (transaction.price - avgBuyPrice) * transaction.btc_amount;
          
          if (pnl > 0) {
            metrics.winningTrades++;
            totalGains += pnl;
            metrics.largestGain = Math.max(metrics.largestGain, pnl);
          } else {
            metrics.losingTrades++;
            totalLosses += Math.abs(pnl);
            metrics.largestLoss = Math.min(metrics.largestLoss, pnl);
          }
        }
      });

      // Calculate derived metrics
      metrics.averageTradeSize = metrics.totalVolume / metrics.totalTrades;
      metrics.winRate = metrics.totalTrades > 0 
        ? (metrics.winningTrades / metrics.totalTrades) * 100 
        : 0;
      metrics.profitFactor = totalLosses > 0 ? totalGains / totalLosses : 0;

      // Calculate time-based metrics
      metrics.monthlyReturns = this.calculateMonthlyReturns(transactions, dashboard.initial_balance);
      metrics.dailyReturns = this.calculateDailyReturns(transactions);
      metrics.sharpeRatio = this.calculateSharpeRatio(metrics.dailyReturns);
      metrics.maxDrawdown = this.calculateMaxDrawdown(transactions, dashboard.initial_balance);
      metrics.averageHoldingTime = this.calculateAverageHoldingTime(buyTransactions, sellTransactions);

      // Cache the results
      this.performanceCache.set(cacheKey, {
        data: metrics,
        timestamp: Date.now()
      });

      return metrics;
    } catch (error) {
      console.error('Error calculating performance metrics:', error);
      return this.getDefaultMetrics();
    }
  }

  /**
   * Calculate average buy price for a given amount
   * @param {Array} buyTransactions - Buy transactions
   * @param {number} sellAmount - Amount being sold
   * @returns {number} Average buy price
   */
  calculateAverageBuyPrice(buyTransactions, sellAmount) {
    if (buyTransactions.length === 0) return 0;

    let totalCost = 0;
    let totalAmount = 0;
    let remainingAmount = sellAmount;

    // FIFO approach
    for (const buy of buyTransactions) {
      if (remainingAmount <= 0) break;
      
      const amountToUse = Math.min(buy.btc_amount, remainingAmount);
      totalCost += amountToUse * buy.price;
      totalAmount += amountToUse;
      remainingAmount -= amountToUse;
    }

    return totalAmount > 0 ? totalCost / totalAmount : 0;
  }

  /**
   * Calculate monthly returns
   * @param {Array} transactions - Transaction history
   * @param {number} initialBalance - Initial portfolio balance
   * @returns {Array} Monthly returns
   */
  calculateMonthlyReturns(transactions, initialBalance) {
    const monthlyData = {};
    let currentBalance = initialBalance;

    transactions.forEach(transaction => {
      const date = new Date(transaction.execution_time);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          startBalance: currentBalance,
          endBalance: currentBalance,
          transactions: []
        };
      }

      monthlyData[monthKey].transactions.push(transaction);
      
      // Update balance based on transaction
      if (transaction.type === 'buy') {
        currentBalance -= transaction.mwk_amount;
      } else {
        currentBalance += transaction.mwk_amount;
      }
      
      monthlyData[monthKey].endBalance = currentBalance;
    });

    // Calculate returns for each month
    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      return: data.startBalance > 0 
        ? ((data.endBalance - data.startBalance) / data.startBalance) * 100 
        : 0,
      transactions: data.transactions.length
    }));
  }

  /**
   * Calculate daily returns
   * @param {Array} transactions - Transaction history
   * @returns {Array} Daily returns
   */
  calculateDailyReturns(transactions) {
    const dailyData = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.execution_time).toISOString().split('T')[0];
      
      if (!dailyData[date]) {
        dailyData[date] = { pnl: 0, volume: 0 };
      }
      
      // Simplified daily P&L calculation
      if (transaction.type === 'sell') {
        dailyData[date].pnl += transaction.mwk_amount * 0.01; // Simplified calculation
      }
      dailyData[date].volume += transaction.mwk_amount;
    });

    return Object.entries(dailyData).map(([date, data]) => ({
      date,
      return: data.pnl,
      volume: data.volume
    }));
  }

  /**
   * Calculate Sharpe ratio
   * @param {Array} dailyReturns - Daily returns
   * @returns {number} Sharpe ratio
   */
  calculateSharpeRatio(dailyReturns) {
    if (dailyReturns.length < 2) return 0;

    const returns = dailyReturns.map(d => d.return);
    const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);

    return stdDev > 0 ? avgReturn / stdDev : 0;
  }

  /**
   * Calculate maximum drawdown
   * @param {Array} transactions - Transaction history
   * @param {number} initialBalance - Initial balance
   * @returns {number} Maximum drawdown percentage
   */
  calculateMaxDrawdown(transactions, initialBalance) {
    let peak = initialBalance;
    let maxDrawdown = 0;
    let currentValue = initialBalance;

    transactions.forEach(transaction => {
      // Update current value (simplified)
      if (transaction.type === 'buy') {
        currentValue -= transaction.mwk_amount;
      } else {
        currentValue += transaction.mwk_amount;
      }

      if (currentValue > peak) {
        peak = currentValue;
      }

      const drawdown = ((peak - currentValue) / peak) * 100;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    });

    return maxDrawdown;
  }

  /**
   * Calculate average holding time
   * @param {Array} buyTransactions - Buy transactions
   * @param {Array} sellTransactions - Sell transactions
   * @returns {number} Average holding time in hours
   */
  calculateAverageHoldingTime(buyTransactions, sellTransactions) {
    if (buyTransactions.length === 0 || sellTransactions.length === 0) return 0;

    let totalHoldingTime = 0;
    let pairCount = 0;

    sellTransactions.forEach(sell => {
      const sellTime = new Date(sell.execution_time);
      
      // Find the most recent buy before this sell
      const relevantBuys = buyTransactions.filter(buy => 
        new Date(buy.execution_time) < sellTime
      );
      
      if (relevantBuys.length > 0) {
        const lastBuy = relevantBuys[relevantBuys.length - 1];
        const buyTime = new Date(lastBuy.execution_time);
        const holdingTime = (sellTime - buyTime) / (1000 * 60 * 60); // Convert to hours
        
        totalHoldingTime += holdingTime;
        pairCount++;
      }
    });

    return pairCount > 0 ? totalHoldingTime / pairCount : 0;
  }

  /**
   * Get default metrics for new portfolios
   * @returns {Object} Default metrics
   */
  getDefaultMetrics() {
    return {
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      totalVolume: 0,
      totalFees: 0,
      averageTradeSize: 0,
      largestGain: 0,
      largestLoss: 0,
      winRate: 0,
      profitFactor: 0,
      sharpeRatio: 0,
      maxDrawdown: 0,
      averageHoldingTime: 0,
      monthlyReturns: [],
      dailyReturns: []
    };
  }

  /**
   * Reset portfolio to initial state
   * @param {string} userId - User ID
   * @returns {Object} Reset result
   */
  async resetPortfolio(userId) {
    try {
      // Reset portfolio balances
      const resetPortfolio = {
        user_id: userId,
        mwk_balance: 100000.00,
        btc_balance: 0.00000000,
        total_value: 100000.00,
        profit_loss: 0.00,
        profit_loss_percentage: 0.0000,
        total_trades: 0,
        winning_trades: 0,
        losing_trades: 0,
        largest_gain: 0.00,
        largest_loss: 0.00
      };

      await supabaseHelpers.upsertPortfolio(resetPortfolio);

      // Clear performance cache
      this.performanceCache.delete(`performance_${userId}`);

      return {
        success: true,
        message: 'Portfolio reset successfully'
      };
    } catch (error) {
      console.error('Error resetting portfolio:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Clear performance cache
   */
  clearCache() {
    this.performanceCache.clear();
  }
}

// Create singleton instance
const portfolioService = new PortfolioService();

export default portfolioService;
