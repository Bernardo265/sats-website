import React, { useState } from 'react';

function Help() {
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [openFAQ, setOpenFAQ] = useState(null);

  const categories = [
    { id: 'getting-started', name: 'Getting Started', icon: '🚀' },
    { id: 'account', name: 'Account & Security', icon: '🔐' },
    { id: 'trading', name: 'Trading & Transactions', icon: '💱' },
    { id: 'payments', name: 'Payment Methods', icon: '💳' },
    { id: 'fees', name: 'Fees & Limits', icon: '💰' },
    { id: 'technical', name: 'Technical Support', icon: '🛠️' }
  ];

  const faqs = {
    'getting-started': [
      {
        question: 'How do I create a SafeSats account?',
        answer: 'Creating an account is simple! Click the "Get Started" button, provide your email address, create a secure password, and verify your email. You\'ll then need to complete identity verification to start trading.'
      },
      {
        question: 'What documents do I need for verification?',
        answer: 'You\'ll need a government-issued photo ID (passport, driver\'s license, or national ID card) and proof of address (utility bill, bank statement, or lease agreement) dated within the last 3 months.'
      },
      {
        question: 'How long does verification take?',
        answer: 'Most verifications are completed within 24 hours. During peak times, it may take up to 3 business days. You\'ll receive an email notification once your account is verified.'
      }
    ],
    'account': [
      {
        question: 'How do I secure my account?',
        answer: 'Enable two-factor authentication (2FA), use a strong unique password, never share your login credentials, and always log out when using public computers. We also recommend using our mobile app for additional security.'
      },
      {
        question: 'What if I forget my password?',
        answer: 'Click "Forgot Password" on the login page, enter your email address, and follow the instructions in the reset email. Make sure to check your spam folder if you don\'t see the email within a few minutes.'
      },
      {
        question: 'Can I change my email address?',
        answer: 'Yes, you can update your email address in your account settings. You\'ll need to verify the new email address before the change takes effect.'
      }
    ],
    'trading': [
      {
        question: 'How do I buy Bitcoin?',
        answer: 'After your account is verified, go to the "Buy" section, enter the amount you want to purchase, select your payment method, review the transaction details, and confirm your purchase.'
      },
      {
        question: 'What are the trading limits?',
        answer: 'Trading limits depend on your verification level and payment method. Verified accounts can trade up to $50,000 per day. Higher limits are available for institutional accounts.'
      },
      {
        question: 'How long do transactions take?',
        answer: 'Bitcoin purchases are typically processed within 10-30 minutes. Bank transfers may take 1-3 business days, while card payments are usually instant.'
      }
    ],
    'payments': [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept bank transfers, debit/credit cards, Mukuru, Airtel Money, Mpamba, and other local payment methods depending on your region.'
      },
      {
        question: 'Are my payment details secure?',
        answer: 'Yes, all payment information is encrypted and processed through secure, PCI-compliant payment processors. We never store your full card details on our servers.'
      },
      {
        question: 'Can I use multiple payment methods?',
        answer: 'Yes, you can add multiple payment methods to your account and choose which one to use for each transaction.'
      }
    ],
    'fees': [
      {
        question: 'What fees do you charge?',
        answer: 'We charge a small transaction fee that varies by payment method: 1.5% for bank transfers, 3.5% for card payments, and 2% for mobile money transfers. There are no hidden fees.'
      },
      {
        question: 'Are there any withdrawal fees?',
        answer: 'Bitcoin withdrawals to external wallets incur a network fee that varies based on blockchain congestion. Internal transfers between SafeSats accounts are free.'
      },
      {
        question: 'Do you offer volume discounts?',
        answer: 'Yes, high-volume traders and institutional clients can qualify for reduced fees. Contact our support team to discuss custom pricing.'
      }
    ],
    'technical': [
      {
        question: 'Is there a mobile app?',
        answer: 'Yes, we have mobile apps for both iOS and Android. Download them from the App Store or Google Play Store for secure trading on the go.'
      },
      {
        question: 'What if the website is down?',
        answer: 'You can check our status page for real-time updates, use our mobile app, or contact support. We maintain 99.9% uptime and have redundant systems in place.'
      },
      {
        question: 'How do I contact support?',
        answer: 'You can reach us through live chat, email (support@safesats.com), or phone. Our support team is available 24/7 to assist you.'
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
            Find answers to common questions, learn how to use SafeSats, and get the support you need.
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

        {/* Contact Support Section */}
        <div className="mt-16 bg-gradient-to-br from-green-400/10 to-green-600/10 rounded-2xl p-8 border border-green-400/20 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Still Need Help?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help you 24/7.
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
