import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useBitcoinPrice } from '../hooks/useBitcoinPrice';
import { supabaseHelpers, subscribeToUserData, unsubscribeFromUserData } from '../lib/supabase';
import tradingService from '../services/tradingService';
import portfolioService from '../services/portfolioService';
import realtimeService from '../services/realtimeService';
import priceService from '../services/priceService';

const TradingContext = createContext();

export const useTrading = () => {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
};

export const TradingProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { priceData } = useBitcoinPrice(30000); // 30-second refresh for trading

  const [portfolio, setPortfolio] = useState({
    mwkBalance: 100000, // Starting with MK 100,000
    btcBalance: 0,
    totalValue: 100000,
    profitLoss: 0,
    profitLossPercentage: 0
  });

  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);

  // Initialize trading data and services
  useEffect(() => {
    let unsubscribeFunctions = [];

    const initializeTradingData = async () => {
      if (isAuthenticated && user?.emailVerified && user?.id) {
        try {
          setLoading(true);

          // Initialize price service
          if (!priceService.isRunning) {
            priceService.start(30000); // 30-second updates
          }

          // Initialize real-time service
          await realtimeService.initialize(user.id);

          // Subscribe to real-time events
          const unsubscribePortfolio = realtimeService.subscribe('portfolio', handlePortfolioUpdate);
          const unsubscribeTransaction = realtimeService.subscribe('transaction', handleTransactionUpdate);
          const unsubscribeOrder = realtimeService.subscribe('order', handleOrderUpdate);
          const unsubscribePrice = realtimeService.subscribe('price', handlePriceUpdate);
          const unsubscribeConnection = realtimeService.subscribe('connection', handleConnectionUpdate);

          unsubscribeFunctions.push(
            unsubscribePortfolio,
            unsubscribeTransaction,
            unsubscribeOrder,
            unsubscribePrice,
            unsubscribeConnection
          );

          // Load enhanced portfolio data
          const portfolioData = await portfolioService.getPortfolioData(user.id);
          if (portfolioData) {
            setPortfolio({
              mwkBalance: parseFloat(portfolioData.mwk_balance),
              btcBalance: parseFloat(portfolioData.btc_balance),
              totalValue: parseFloat(portfolioData.total_value),
              profitLoss: parseFloat(portfolioData.profit_loss),
              profitLossPercentage: parseFloat(portfolioData.profit_loss_percentage)
            });
            setPerformanceMetrics(portfolioData.performance);
          }

          // Load transactions
          const transactionsData = await supabaseHelpers.getTradingHistory(50);
          setTransactions(transactionsData || []);

          // Load active orders
          const ordersData = await supabaseHelpers.getActiveOrders();
          if (ordersData) {
            setOrders(ordersData);
            setPendingOrders(ordersData.filter(order => order.status === 'pending'));
          }

        } catch (error) {
          console.error('Error loading trading data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    initializeTradingData();

    return () => {
      // Cleanup subscriptions
      unsubscribeFunctions.forEach(unsubscribe => {
        try {
          unsubscribe();
        } catch (error) {
          console.error('Error unsubscribing:', error);
        }
      });
    };
  }, [isAuthenticated, user]);

  // Handle real-time portfolio updates
  const handlePortfolioUpdate = (data) => {
    console.log('Portfolio update:', data);
    if (data.new) {
      setPortfolio({
        mwkBalance: parseFloat(data.new.mwk_balance),
        btcBalance: parseFloat(data.new.btc_balance),
        totalValue: parseFloat(data.new.total_value),
        profitLoss: parseFloat(data.new.profit_loss),
        profitLossPercentage: parseFloat(data.new.profit_loss_percentage)
      });
    }
  };

  // Handle real-time transaction updates
  const handleTransactionUpdate = (data) => {
    console.log('Transaction update:', data);
    if (data.eventType === 'INSERT' && data.new) {
      setTransactions(prev => [data.new, ...prev]);
    }
  };

  // Handle real-time order updates
  const handleOrderUpdate = (data) => {
    console.log('Order update:', data);
    if (data.eventType === 'INSERT' && data.new) {
      setOrders(prev => [data.new, ...prev]);
      if (data.new.status === 'pending') {
        setPendingOrders(prev => [data.new, ...prev]);
      }
    } else if (data.eventType === 'UPDATE' && data.new) {
      setOrders(prev => prev.map(order =>
        order.id === data.new.id ? data.new : order
      ));
      setPendingOrders(prev =>
        data.new.status === 'pending'
          ? prev.map(order => order.id === data.new.id ? data.new : order)
          : prev.filter(order => order.id !== data.new.id)
      );
    } else if (data.eventType === 'DELETE' && data.old) {
      setOrders(prev => prev.filter(order => order.id !== data.old.id));
      setPendingOrders(prev => prev.filter(order => order.id !== data.old.id));
    }
  };

  // Handle real-time price updates
  const handlePriceUpdate = (data) => {
    console.log('Price update:', data);
    // Price updates are handled by the price service and useBitcoinPrice hook
  };

  // Handle connection status updates
  const handleConnectionUpdate = (data) => {
    console.log('Connection update:', data);
    setRealtimeConnected(data.status === 'connected');
  };

  // Save trading data to Supabase
  const saveTradingData = async (newPortfolio, newTransaction = null, newOrder = null) => {
    if (!user?.id) return;

    try {
      // Update portfolio
      if (newPortfolio) {
        await supabaseHelpers.upsertPortfolio({
          user_id: user.id,
          mwk_balance: newPortfolio.mwkBalance,
          btc_balance: newPortfolio.btcBalance,
          total_value: newPortfolio.totalValue,
          profit_loss: newPortfolio.profitLoss,
          profit_loss_percentage: newPortfolio.profitLossPercentage
        });
      }

      // Create transaction
      if (newTransaction) {
        await supabaseHelpers.createTransaction({
          user_id: user.id,
          type: newTransaction.type,
          order_type: newTransaction.orderType,
          btc_amount: newTransaction.btcAmount,
          mwk_amount: newTransaction.mwkAmount,
          price: newTransaction.price,
          status: newTransaction.status
        });
      }

      // Create order
      if (newOrder) {
        await supabaseHelpers.createOrder({
          user_id: user.id,
          type: newOrder.type,
          order_type: newOrder.orderType,
          amount: newOrder.amount,
          price: newOrder.price,
          status: newOrder.status
        });
      }
    } catch (error) {
      console.error('Error saving trading data:', error);
      throw error;
    }
  };

  // Calculate portfolio value and profit/loss
  const calculatePortfolioValue = (btcBalance, mwkBalance, currentBtcPrice) => {
    const btcValueInMwk = btcBalance * currentBtcPrice;
    const totalValue = mwkBalance + btcValueInMwk;
    const profitLoss = totalValue - 100000; // Initial balance was 100,000
    const profitLossPercentage = (profitLoss / 100000) * 100;

    return {
      totalValue,
      profitLoss,
      profitLossPercentage
    };
  };

  // Update portfolio when Bitcoin price changes
  useEffect(() => {
    if (priceData.btc_mwk && portfolio.btcBalance > 0) {
      const { totalValue, profitLoss, profitLossPercentage } = calculatePortfolioValue(
        portfolio.btcBalance,
        portfolio.mwkBalance,
        priceData.btc_mwk
      );

      const updatedPortfolio = {
        ...portfolio,
        totalValue,
        profitLoss,
        profitLossPercentage
      };

      setPortfolio(updatedPortfolio);
      saveTradingData(updatedPortfolio);
    }
  }, [priceData.btc_mwk]);

  // Execute market buy order
  const executeBuyOrder = async (amount, orderType = 'market', limitPrice = null) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    setLoading(true);

    try {
      const result = await tradingService.executeBuyOrder({
        userId: user.id,
        amount,
        orderType,
        limitPrice
      });

      if (result.success) {
        // Update local state will be handled by real-time updates
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Execute market sell order
  const executeSellOrder = async (btcAmount, orderType = 'market', limitPrice = null) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    setLoading(true);

    try {
      const result = await tradingService.executeSellOrder({
        userId: user.id,
        btcAmount,
        orderType,
        limitPrice
      });

      if (result.success) {
        // Update local state will be handled by real-time updates
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Place limit order
  const placeLimitOrder = async (type, amount, price) => {
    setLoading(true);

    try {
      const order = {
        type, // 'buy' or 'sell'
        orderType: 'limit',
        amount,
        price,
        status: 'pending'
      };

      // Validate order
      if (type === 'buy') {
        const totalCost = amount;
        if (totalCost > portfolio.mwkBalance) {
          throw new Error('Insufficient MWK balance for limit buy order');
        }
      } else {
        const btcAmount = amount / price;
        if (btcAmount > portfolio.btcBalance) {
          throw new Error('Insufficient Bitcoin balance for limit sell order');
        }
      }

      // Save to database
      await saveTradingData(null, null, order);

      // Update local state
      setPendingOrders(prev => [{ ...order, id: Date.now() }, ...prev]);

      return { success: true, order };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Cancel pending order
  const cancelOrder = async (orderId) => {
    try {
      await supabaseHelpers.deleteOrder(orderId);
      setPendingOrders(prev => prev.filter(order => order.id !== orderId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Reset portfolio (for demo purposes)
  const resetPortfolio = async () => {
    try {
      setLoading(true);

      const initialPortfolio = {
        mwkBalance: 100000,
        btcBalance: 0,
        totalValue: 100000,
        profitLoss: 0,
        profitLossPercentage: 0
      };

      // Save to database
      await saveTradingData(initialPortfolio);

      // Update local state
      setPortfolio(initialPortfolio);
      setTransactions([]);
      setPendingOrders([]);

      return { success: true };
    } catch (error) {
      console.error('Error resetting portfolio:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Get trading statistics
  const getTradingStats = async () => {
    if (!user?.id) return null;

    try {
      return await tradingService.getTradingStats(user.id);
    } catch (error) {
      console.error('Error getting trading stats:', error);
      return null;
    }
  };

  // Refresh portfolio data
  const refreshPortfolioData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const portfolioData = await portfolioService.getPortfolioData(user.id);
      if (portfolioData) {
        setPortfolio({
          mwkBalance: parseFloat(portfolioData.mwk_balance),
          btcBalance: parseFloat(portfolioData.btc_balance),
          totalValue: parseFloat(portfolioData.total_value),
          profitLoss: parseFloat(portfolioData.profit_loss),
          profitLossPercentage: parseFloat(portfolioData.profit_loss_percentage)
        });
        setPerformanceMetrics(portfolioData.performance);
      }
    } catch (error) {
      console.error('Error refreshing portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    portfolio,
    orders,
    transactions,
    pendingOrders,
    loading,
    realtimeConnected,
    performanceMetrics,
    currentPrice: priceData.btc_mwk,
    priceData,
    executeBuyOrder,
    executeSellOrder,
    placeLimitOrder,
    cancelOrder,
    resetPortfolio,
    getTradingStats,
    refreshPortfolioData,
    // Service instances for advanced usage
    tradingService,
    portfolioService,
    priceService,
    realtimeService
  };

  return (
    <TradingContext.Provider value={value}>
      {children}
    </TradingContext.Provider>
  );
};


