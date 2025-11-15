import React, { useState } from 'react';

const TradingTutorial = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const tutorialSteps = [
    {
      title: "Welcome to Bitcoin Trading",
      content: (
        <div className="space-y-4">
          <p className="text-white/80">
            Welcome to the SafeSats trading simulator! This tutorial will guide you through 
            the basics of Bitcoin trading using our virtual trading environment.
          </p>
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
            <h4 className="text-orange-400 font-semibold mb-2">What You'll Learn:</h4>
            <ul className="text-white/80 text-sm space-y-1">
              <li>• How to read Bitcoin price charts</li>
              <li>• Difference between market and limit orders</li>
              <li>• How to manage your portfolio</li>
              <li>• Risk management strategies</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Understanding Bitcoin Prices",
      content: (
        <div className="space-y-4">
          <p className="text-white/80">
            Bitcoin prices are displayed in both MWK (Malawian Kwacha) and USD. 
            The price changes constantly based on global market demand and supply.
          </p>
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">Key Price Information:</h4>
            <ul className="text-white/80 text-sm space-y-2">
              <li><strong>Current Price:</strong> The latest trading price</li>
              <li><strong>24h Change:</strong> How much the price has moved in 24 hours</li>
              <li><strong>High/Low:</strong> The highest and lowest prices in 24 hours</li>
            </ul>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
            <p className="text-yellow-400 text-sm">
              <strong>Remember:</strong> Bitcoin prices are highly volatile and can change rapidly!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Market vs Limit Orders",
      content: (
        <div className="space-y-4">
          <p className="text-white/80">
            There are two main types of orders you can place:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <h4 className="text-green-400 font-semibold mb-2">Market Orders</h4>
              <ul className="text-white/80 text-sm space-y-1">
                <li>• Execute immediately</li>
                <li>• Use current market price</li>
                <li>• Guaranteed execution</li>
                <li>• Best for quick trades</li>
              </ul>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
              <h4 className="text-purple-400 font-semibold mb-2">Limit Orders</h4>
              <ul className="text-white/80 text-sm space-y-1">
                <li>• Set your own price</li>
                <li>• Execute when price is reached</li>
                <li>• May not execute immediately</li>
                <li>• Better price control</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Buying Bitcoin",
      content: (
        <div className="space-y-4">
          <p className="text-white/80">
            To buy Bitcoin, you'll use your MWK balance. Here's how:
          </p>
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-3">Steps to Buy Bitcoin:</h4>
            <ol className="text-white/80 text-sm space-y-2">
              <li><strong>1.</strong> Select the "Buy Bitcoin" tab</li>
              <li><strong>2.</strong> Choose order type (Market or Limit)</li>
              <li><strong>3.</strong> Enter the MWK amount you want to spend</li>
              <li><strong>4.</strong> For limit orders, set your desired price</li>
              <li><strong>5.</strong> Review the order summary</li>
              <li><strong>6.</strong> Click "Execute Buy Order"</li>
            </ol>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <p className="text-blue-400 text-sm">
              <strong>Tip:</strong> Start with small amounts to get comfortable with the process!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Selling Bitcoin",
      content: (
        <div className="space-y-4">
          <p className="text-white/80">
            To sell Bitcoin, you'll convert your BTC holdings back to MWK:
          </p>
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-3">Steps to Sell Bitcoin:</h4>
            <ol className="text-white/80 text-sm space-y-2">
              <li><strong>1.</strong> Select the "Sell Bitcoin" tab</li>
              <li><strong>2.</strong> Choose order type (Market or Limit)</li>
              <li><strong>3.</strong> Enter the BTC amount you want to sell</li>
              <li><strong>4.</strong> For limit orders, set your desired price</li>
              <li><strong>5.</strong> Review how much MWK you'll receive</li>
              <li><strong>6.</strong> Click "Execute Sell Order"</li>
            </ol>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-red-400 text-sm">
              <strong>Important:</strong> You can only sell Bitcoin that you own!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Portfolio Management",
      content: (
        <div className="space-y-4">
          <p className="text-white/80">
            Your portfolio shows your total holdings and performance:
          </p>
          <div className="bg-white/5 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-3">Portfolio Features:</h4>
            <ul className="text-white/80 text-sm space-y-2">
              <li><strong>Total Value:</strong> Combined worth of MWK + Bitcoin</li>
              <li><strong>Profit/Loss:</strong> How much you've gained or lost</li>
              <li><strong>Asset Allocation:</strong> Percentage breakdown of holdings</li>
              <li><strong>Performance:</strong> Return percentage since starting</li>
            </ul>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <p className="text-green-400 text-sm">
              <strong>Strategy:</strong> Consider diversifying between MWK and Bitcoin based on market conditions!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Risk Management",
      content: (
        <div className="space-y-4">
          <p className="text-white/80">
            Bitcoin trading involves risks. Here are important safety guidelines:
          </p>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <h4 className="text-red-400 font-semibold mb-3">Key Risks:</h4>
            <ul className="text-white/80 text-sm space-y-2">
              <li>• <strong>Volatility:</strong> Prices can change rapidly</li>
              <li>• <strong>Market Risk:</strong> Overall market conditions affect prices</li>
              <li>• <strong>Timing Risk:</strong> Buying/selling at wrong times</li>
              <li>• <strong>Emotional Trading:</strong> Making decisions based on fear/greed</li>
            </ul>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="text-blue-400 font-semibold mb-3">Risk Management Tips:</h4>
            <ul className="text-white/80 text-sm space-y-2">
              <li>• Only invest what you can afford to lose</li>
              <li>• Don't put all money in Bitcoin at once</li>
              <li>• Set stop-loss levels for your trades</li>
              <li>• Stay informed about market news</li>
              <li>• Don't panic during price drops</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Ready to Start Trading!",
      content: (
        <div className="space-y-4">
          <p className="text-white/80">
            Congratulations! You've completed the SafeSats trading tutorial. 
            You're now ready to start practicing with virtual funds.
          </p>
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
            <h4 className="text-orange-400 font-semibold mb-3">Remember:</h4>
            <ul className="text-white/80 text-sm space-y-2">
              <li>• This is practice trading with virtual money</li>
              <li>• Use this time to learn and experiment</li>
              <li>• Real trading will be available soon</li>
              <li>• Your simulation data helps you prepare</li>
            </ul>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <h4 className="text-green-400 font-semibold mb-2">Next Steps:</h4>
            <p className="text-white/80 text-sm">
              Start with small trades to get comfortable, then gradually increase your trading activity. 
              Monitor your portfolio regularly and learn from each trade you make.
            </p>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetTutorial = () => {
    setCurrentStep(0);
    setIsCompleted(false);
  };

  if (isCompleted) {
    return (
      <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Tutorial Complete!</h2>
        <p className="text-white/80 mb-6">
          You're now ready to start practicing Bitcoin trading with virtual funds.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={resetTutorial}
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Review Tutorial
          </button>
          <button
            onClick={() => window.location.href = '/trading'}
            className="bg-orange-500 hover:bg-orange-600 text-black px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Start Trading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Trading Tutorial</h2>
          <p className="text-white/60">
            Step {currentStep + 1} of {tutorialSteps.length}
          </p>
        </div>
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg px-3 py-1">
          <span className="text-orange-500 text-sm font-medium">LEARN</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="w-full bg-white/10 rounded-full h-2">
          <div 
            className="bg-orange-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Tutorial Content */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-white mb-4">
          {tutorialSteps[currentStep].title}
        </h3>
        <div className="text-white/80">
          {tutorialSteps[currentStep].content}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-white/30 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <div className="flex space-x-2">
          {tutorialSteps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index <= currentStep ? 'bg-orange-500' : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextStep}
          className="bg-orange-500 hover:bg-orange-600 text-black px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          {currentStep === tutorialSteps.length - 1 ? 'Complete' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default TradingTutorial;
