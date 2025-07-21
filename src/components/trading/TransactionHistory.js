import React, { useState } from 'react';
import { useTrading } from '../../contexts/TradingContext';
import { formatCurrency } from '../../hooks/useBitcoinPrice';

const TransactionHistory = () => {
  const { transactions, pendingOrders, cancelOrder } = useTrading();
  const [activeTab, setActiveTab] = useState('transactions');

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type) => {
    if (type === 'buy') {
      return (
        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </div>
      );
    }
  };

  const handleCancelOrder = async (orderId) => {
    await cancelOrder(orderId);
  };

  return (
    <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Trading History</h2>
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-1">
          <span className="text-orange-500 text-sm font-medium">SIMULATION</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex mb-6">
        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex-1 py-3 px-4 rounded-l-lg font-semibold transition-colors ${
            activeTab === 'transactions'
              ? 'bg-orange-500 text-black'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          Completed Trades ({transactions.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-3 px-4 rounded-r-lg font-semibold transition-colors ${
            activeTab === 'orders'
              ? 'bg-orange-500 text-black'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          Pending Orders ({pendingOrders.length})
        </button>
      </div>

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-white/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-white/60 text-lg font-medium mb-2">No Transactions Yet</h3>
              <p className="text-white/40 text-sm">
                Start trading to see your transaction history here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-white font-semibold capitalize">
                            {transaction.type} Bitcoin
                          </h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            transaction.orderType === 'market'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-purple-500/20 text-purple-400'
                          }`}>
                            {transaction.orderType}
                          </span>
                        </div>
                        <p className="text-white/60 text-sm">
                          {formatDate(transaction.timestamp)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="text-white font-semibold">
                            {transaction.btcAmount.toFixed(8)} BTC
                          </p>
                          <p className="text-white/60 text-sm">
                            @ {formatCurrency(transaction.price, 'MWK')}
                          </p>
                        </div>
                        <div>
                          <p className={`font-semibold ${
                            transaction.type === 'buy' ? 'text-red-400' : 'text-green-400'
                          }`}>
                            {transaction.type === 'buy' ? '-' : '+'}
                            {formatCurrency(transaction.mwkAmount, 'MWK')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pending Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {pendingOrders.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-white/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-white/60 text-lg font-medium mb-2">No Pending Orders</h3>
              <p className="text-white/40 text-sm">
                Place limit orders to see them here
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-white font-semibold capitalize">
                            {order.type} Limit Order
                          </h3>
                          <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs font-medium">
                            Pending
                          </span>
                        </div>
                        <p className="text-white/60 text-sm">
                          Placed {formatDate(order.timestamp)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-white font-semibold">
                          {formatCurrency(order.amount, 'MWK')}
                        </p>
                        <p className="text-white/60 text-sm">
                          @ {formatCurrency(order.price, 'MWK')}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Summary Statistics */}
      {transactions.length > 0 && (
        <div className="mt-8 pt-6 border-t border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">Trading Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <h4 className="text-white/60 text-sm uppercase tracking-wide mb-1">Total Trades</h4>
              <p className="text-white font-semibold">{transactions.length}</p>
            </div>
            
            <div className="text-center">
              <h4 className="text-white/60 text-sm uppercase tracking-wide mb-1">Buy Orders</h4>
              <p className="text-green-400 font-semibold">
                {transactions.filter(t => t.type === 'buy').length}
              </p>
            </div>
            
            <div className="text-center">
              <h4 className="text-white/60 text-sm uppercase tracking-wide mb-1">Sell Orders</h4>
              <p className="text-red-400 font-semibold">
                {transactions.filter(t => t.type === 'sell').length}
              </p>
            </div>
            
            <div className="text-center">
              <h4 className="text-white/60 text-sm uppercase tracking-wide mb-1">Pending Orders</h4>
              <p className="text-yellow-400 font-semibold">{pendingOrders.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Educational Note */}
      <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-blue-400 font-semibold text-sm mb-1">Track Your Learning</h4>
            <p className="text-white/80 text-xs">
              Review your trading history to understand your decision-making patterns. 
              This data will help you develop better trading strategies for when real trading begins.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
