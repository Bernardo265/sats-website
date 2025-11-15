import React, { useState } from 'react';
import { useTrading } from '../../contexts/TradingContext';
import { formatCurrency } from '../../hooks/useBitcoinPrice';

const TradingInterface = () => {
  const { 
    portfolio, 
    currentPrice, 
    priceData, 
    executeBuyOrder, 
    executeSellOrder, 
    placeLimitOrder,
    loading 
  } = useTrading();

  const [activeTab, setActiveTab] = useState('buy');
  const [orderType, setOrderType] = useState('market');
  const [amount, setAmount] = useState('');
  const [limitPrice, setLimitPrice] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (orderType === 'limit' && (!limitPrice || parseFloat(limitPrice) <= 0)) {
      setError('Please enter a valid limit price');
      return;
    }

    try {
      let result;
      const amountValue = parseFloat(amount);
      const priceValue = orderType === 'limit' ? parseFloat(limitPrice) : currentPrice;

      if (activeTab === 'buy') {
        if (orderType === 'market') {
          result = await executeBuyOrder(amountValue);
        } else {
          result = await placeLimitOrder('buy', amountValue, priceValue);
        }
      } else {
        // For sell orders, amount is in BTC
        if (orderType === 'market') {
          result = await executeSellOrder(amountValue);
        } else {
          result = await placeLimitOrder('sell', amountValue * priceValue, priceValue);
        }
      }

      if (result.success) {
        setSuccess(
          orderType === 'market' 
            ? `${activeTab === 'buy' ? 'Buy' : 'Sell'} order executed successfully!`
            : `Limit ${activeTab} order placed successfully!`
        );
        setAmount('');
        setLimitPrice('');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while placing the order');
    }
  };

  const calculateBtcAmount = () => {
    if (!amount || !currentPrice) return 0;
    return activeTab === 'buy' ? parseFloat(amount) / currentPrice : parseFloat(amount);
  };

  const calculateMwkAmount = () => {
    if (!amount || !currentPrice) return 0;
    return activeTab === 'buy' ? parseFloat(amount) : parseFloat(amount) * currentPrice;
  };

  const getMaxAmount = () => {
    if (activeTab === 'buy') {
      return portfolio.mwkBalance;
    } else {
      return portfolio.btcBalance;
    }
  };

  const handleMaxClick = () => {
    const maxAmount = getMaxAmount();
    if (activeTab === 'buy') {
      setAmount(maxAmount.toString());
    } else {
      setAmount(maxAmount.toFixed(8));
    }
  };

  return (
    <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Trading Interface</h2>
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-1">
          <span className="text-orange-500 text-sm font-medium">SIMULATION</span>
        </div>
      </div>

      {/* Current Price Display */}
      <div className="bg-white/5 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-white/60 text-sm uppercase tracking-wide mb-1">BTC/MWK</h3>
            <p className="text-white text-xl font-bold">
              {formatCurrency(currentPrice, 'MWK')}
            </p>
          </div>
          <div>
            <h3 className="text-white/60 text-sm uppercase tracking-wide mb-1">24h Change</h3>
            <p className={`text-lg font-semibold ${
              priceData.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {priceData.price_change_percentage_24h >= 0 ? '+' : ''}
              {priceData.price_change_percentage_24h?.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      {/* Buy/Sell Tabs */}
      <div className="flex mb-6">
        <button
          onClick={() => setActiveTab('buy')}
          className={`flex-1 py-3 px-4 rounded-l-lg font-semibold transition-colors ${
            activeTab === 'buy'
              ? 'bg-green-500 text-black'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          Buy Bitcoin
        </button>
        <button
          onClick={() => setActiveTab('sell')}
          className={`flex-1 py-3 px-4 rounded-r-lg font-semibold transition-colors ${
            activeTab === 'sell'
              ? 'bg-red-500 text-black'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          Sell Bitcoin
        </button>
      </div>

      {/* Order Type Selection */}
      <div className="flex mb-6">
        <button
          onClick={() => setOrderType('market')}
          className={`flex-1 py-2 px-4 rounded-l-lg text-sm font-medium transition-colors ${
            orderType === 'market'
              ? 'bg-orange-500 text-black'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          Market Order
        </button>
        <button
          onClick={() => setOrderType('limit')}
          className={`flex-1 py-2 px-4 rounded-r-lg text-sm font-medium transition-colors ${
            orderType === 'limit'
              ? 'bg-orange-500 text-black'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          Limit Order
        </button>
      </div>

      {/* Order Form */}
      <form onSubmit={handleOrderSubmit} className="space-y-4">
        {/* Amount Input */}
        <div>
          <label className="block text-white font-medium mb-2">
            Amount {activeTab === 'buy' ? '(MWK)' : '(BTC)'}
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 pr-16 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
              placeholder={activeTab === 'buy' ? 'Enter MWK amount' : 'Enter BTC amount'}
              step={activeTab === 'buy' ? '1' : '0.00000001'}
              min="0"
            />
            <button
              type="button"
              onClick={handleMaxClick}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-black px-3 py-1 rounded text-sm font-medium transition-colors"
            >
              MAX
            </button>
          </div>
          <p className="text-white/60 text-sm mt-1">
            Available: {activeTab === 'buy' 
              ? formatCurrency(portfolio.mwkBalance, 'MWK')
              : `${portfolio.btcBalance.toFixed(8)} BTC`
            }
          </p>
        </div>

        {/* Limit Price Input */}
        {orderType === 'limit' && (
          <div>
            <label className="block text-white font-medium mb-2">
              Limit Price (MWK per BTC)
            </label>
            <input
              type="number"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
              placeholder="Enter limit price"
              step="1"
              min="0"
            />
          </div>
        )}

        {/* Order Summary */}
        {amount && (
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Order Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">
                  {activeTab === 'buy' ? 'You will receive:' : 'You will pay:'}
                </span>
                <span className="text-white">
                  {activeTab === 'buy' 
                    ? `${calculateBtcAmount().toFixed(8)} BTC`
                    : formatCurrency(calculateMwkAmount(), 'MWK')
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Price per BTC:</span>
                <span className="text-white">
                  {formatCurrency(orderType === 'limit' ? parseFloat(limitPrice) || 0 : currentPrice, 'MWK')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <p className="text-green-400 text-sm">{success}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !amount}
          className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center space-x-2 ${
            activeTab === 'buy'
              ? 'bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-black'
              : 'bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-black'
          }`}
        >
          {loading ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Processing...</span>
            </>
          ) : (
            <span>
              {orderType === 'market' ? 'Execute' : 'Place'} {activeTab === 'buy' ? 'Buy' : 'Sell'} Order
            </span>
          )}
        </button>
      </form>

      {/* Trading Warning */}
      <div className="mt-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h4 className="text-yellow-400 font-semibold text-sm mb-1">Practice Trading Only</h4>
            <p className="text-white/80 text-xs">
              This is a simulation using virtual funds. No real money or Bitcoin is involved. 
              Use this to learn trading concepts before real trading becomes available.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingInterface;
