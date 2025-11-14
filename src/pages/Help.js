import React, { useState } from 'react';

function Help() {
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [openFAQ, setOpenFAQ] = useState(null);

  const categories = [
    { id: 'getting-started', name: 'Getting Started', icon: '🚀' },
    { id: 'buying', name: 'Buying Sats', icon: '🛒' },
    { id: 'selling', name: 'Selling Sats', icon: '💸' },
    { id: 'payments', name: 'Mobile Money', icon: '📱' },
    { id: 'lightning', name: 'Lightning Network', icon: '⚡' },
    { id: 'technical', name: 'Technical Support', icon: '🛠️' }
  ];

  const faqs = {
    'getting-started': [
      {
        question: 'What is SafeSats?',
        answer: 'SafeSats is a bitcoin exchange facilitator that enables you to buy and sell Bitcoin (satoshis) using Malawian Kwacha through mobile money. We connect your mobile money account directly to the Lightning Network without holding your Bitcoin.'
      },
      {
        question: 'Do I need to create an account?',
        answer: 'No! SafeSats does not require account creation. Each transaction is processed independently. You only need a mobile money account and a Lightning Network wallet to get started.'
      },
      {
        question: 'How does SafeSats work?',
        answer: 'SafeSats facilitates direct exchanges between your mobile money and Lightning Network wallet. When you buy, we coordinate payment through PayChangu and send sats to your Lightning invoice. When you sell, you pay a Lightning invoice and receive MWK to your mobile money account.'
      },
      {
        question: 'Is SafeSats safe?',
        answer: 'Yes! SafeSats never holds your Bitcoin. We only facilitate the exchange between mobile money and Lightning Network. Your funds go directly from your mobile money to your Lightning wallet (or vice versa), making it a non-custodial service.'
      }
    ],
    'buying': [
      {
        question: 'How do I buy satoshis?',
        answer: 'To buy sats: 1) Enter the amount in MWK or sats you want to buy, 2) Provide your Lightning Network invoice, 3) Enter your mobile money number, 4) Complete the mobile money payment, 5) Receive sats to your Lightning wallet within minutes.'
      },
      {
        question: 'What are the buying limits?',
        answer: 'You can buy between 4,000 MWK and 1,000,000 MWK worth of satoshis per transaction. This ensures smooth processing and prevents delays.'
      },
      {
        question: 'What is the buy rate?',
        answer: 'SafeSats offers a 5% discount on the base rate when buying sats. This means you pay less MWK to get more satoshis compared to selling rates. The current rate is displayed before you confirm your transaction.'
      },
      {
        question: 'How long does it take to receive my sats?',
        answer: 'Once your mobile money payment is confirmed, satoshis are automatically sent to your Lightning invoice within minutes. The entire process typically completes in under 10 minutes.'
      }
    ],
    'selling': [
      {
        question: 'How do I sell satoshis?',
        answer: 'To sell sats: 1) Enter the amount in sats or MWK you want to sell, 2) Provide your mobile money number, 3) We generate a Lightning invoice, 4) Pay the Lightning invoice from your wallet, 5) Receive MWK to your mobile money account.'
      },
      {
        question: 'What are the selling limits?',
        answer: 'You can sell between 1,000 and 10,000,000 satoshis per transaction. This range ensures optimal processing times and liquidity.'
      },
      {
        question: 'How long does it take to receive my MWK?',
        answer: 'After your Lightning payment is confirmed, the payout to your mobile money account is initiated immediately. You typically receive your MWK within minutes to a few hours, depending on mobile money provider processing times.'
      },
      {
        question: 'What mobile money number should I provide?',
        answer: 'Provide the mobile money number where you want to receive your MWK payout. Make sure it\'s a valid and active account with Airtel Money, TNM Mpamba, or another supported provider.'
      }
    ],
    'payments': [
      {
        question: 'What mobile money providers do you support?',
        answer: 'SafeSats supports all major Malawian mobile money providers including Airtel Money, TNM Mpamba, and other services integrated with PayChangu. All payments are processed securely through PayChangu.'
      },
      {
        question: 'Are there any mobile money fees?',
        answer: 'Mobile money transaction fees may apply according to your provider\'s standard rates. SafeSats\' exchange rates already include our service fees, so the rate you see is what you get.'
      },
      {
        question: 'Is my mobile money information secure?',
        answer: 'Yes! All mobile money transactions are processed through PayChangu, a secure payment processor. SafeSats never stores your mobile money credentials or sensitive payment information.'
      },
      {
        question: 'What if I enter the wrong mobile number?',
        answer: 'Always double-check your mobile money number before confirming transactions. Once a payout is processed, it cannot be reversed. SafeSats is not responsible for funds sent to incorrect numbers.'
      }
    ],
    'lightning': [
      {
        question: 'What is the Lightning Network?',
        answer: 'The Lightning Network is a second-layer solution for Bitcoin that enables instant, low-cost transactions. It\'s perfect for buying and selling smaller amounts of Bitcoin quickly and efficiently.'
      },
      {
        question: 'Do I need a Lightning wallet?',
        answer: 'Yes, you need a Lightning Network compatible wallet to use SafeSats. Popular options include Phoenix, Wallet of Satoshi, Breez, Blink, and Muun. Make sure your wallet can generate and pay Lightning invoices.'
      },
      {
        question: 'How do I generate a Lightning invoice?',
        answer: 'In your Lightning wallet, look for an option to "Receive" or "Request Payment." Enter the amount of sats you want to receive, and your wallet will generate an invoice (usually a long string starting with "lnbc"). Copy this invoice and paste it into SafeSats.'
      },
      {
        question: 'What if my Lightning invoice expires?',
        answer: 'Lightning invoices typically expire after 10-30 minutes. If your invoice expires before payment is completed, you\'ll need to generate a new invoice and restart the transaction.'
      },
      {
        question: 'Can I use a regular Bitcoin address?',
        answer: 'No, SafeSats only supports Lightning Network transactions. Regular on-chain Bitcoin addresses will not work. You must use a Lightning-compatible wallet and provide Lightning invoices.'
      }
    ],
    'technical': [
      {
        question: 'How do I track my transaction?',
        answer: 'After initiating a transaction, you\'ll receive a transaction ID. You can use this ID to check the status of your transaction in real-time. The system will show you each step: payment pending, payment confirmed, and completed.'
      },
      {
        question: 'What if my transaction fails?',
        answer: 'If a transaction fails, you\'ll be notified immediately. For buy transactions, your mobile money payment will be refunded. For sell transactions, your Lightning payment will not be captured. Contact support if you need assistance.'
      },
      {
        question: 'Is there a transaction history?',
        answer: 'Currently, SafeSats processes each transaction independently without accounts. We recommend keeping your transaction IDs and confirmation details for your records.'
      },
      {
        question: 'How do I contact support?',
        answer: 'You can reach us through email at support@safesats.com. Please include your transaction ID and details of your issue for faster assistance.'
      },
      {
        question: 'What are the exchange rates based on?',
        answer: 'Our rates are based on current Bitcoin market prices with transparent spreads. Buy rates include a 5% discount, giving you better value. All rates are locked when you initiate a transaction, protecting you from price fluctuations during processing.'
      }
    ]
  };

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="px-6 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
            Help <span className="text-green-400">Center</span>
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Learn how to buy and sell satoshis with mobile money, understand the Lightning Network, and get answers to common questions.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for help articles..."
              className="w-full px-6 py-4 pl-12 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300"
            />
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 sticky top-6">
              <h2 className="text-lg font-semibold text-white mb-4">Categories</h2>
              <nav className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center space-x-3 ${
                      activeCategory === category.id
                        ? 'bg-green-400/20 text-green-400 border border-green-400/30'
                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                    }`}
                  >
                    <span className="text-lg">{category.icon}</span>
                    <span className="font-medium">{category.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">
                {categories.find(cat => cat.id === activeCategory)?.name} FAQ
              </h2>
              
              <div className="space-y-4">
                {faqs[activeCategory]?.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-700/30 transition-colors"
                    >
                      <span className="text-white font-medium">{faq.question}</span>
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          openFAQ === index ? 'transform rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openFAQ === index && (
                      <div className="px-6 pb-4">
                        <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tips Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div className="text-3xl mb-3">💡</div>
            <h3 className="text-lg font-semibold text-white mb-2">First Time User?</h3>
            <p className="text-gray-300 text-sm">
              Start with a small transaction to familiarize yourself with the process. Make sure you have a Lightning wallet ready before buying sats.
            </p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-lg font-semibold text-white mb-2">Lightning Wallet</h3>
            <p className="text-gray-300 text-sm">
              Download a Lightning wallet like Phoenix, Wallet of Satoshi, or Blink before your first purchase. You'll need it to receive your satoshis.
            </p>
          </div>
          
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="text-lg font-semibold text-white mb-2">Security Tip</h3>
            <p className="text-gray-300 text-sm">
              Always double-check your Lightning invoice and mobile money number before confirming. Transactions cannot be reversed once processed.
            </p>
          </div>
        </div>

        {/* Contact Support Section */}
        <div className="mt-16 bg-gradient-to-br from-green-400/10 to-green-600/10 rounded-2xl p-8 border border-green-400/20 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Still Need Help?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help you with your transactions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-green-400 hover:bg-green-500 text-black px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Contact Support
            </a>
            <a
              href="mailto:support@safesats.com"
              className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 border border-gray-600"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Help;