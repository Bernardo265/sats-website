import React, { useState } from 'react';

function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      setEmail('');
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative z-10 px-6 py-20 bg-gradient-to-br from-green-900/20 via-gray-900 to-green-900/20">
      <div className="max-w-4xl mx-auto text-center">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-green-400/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-green-400/5 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative z-10 space-y-8">
          {/* Section Header */}
          <div className="space-y-6">
            <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              Stay Updated with <span className="text-green-400">SafeSats</span>
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Get the latest Bitcoin news, market insights, and SafeSats updates delivered straight to your inbox. 
              Join over 10,000 subscribers who trust us for cryptocurrency insights.
            </p>
          </div>

          {/* Newsletter Form */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
            {submitStatus === 'success' && (
              <div className="bg-green-400/20 border border-green-400/50 rounded-lg p-4 mb-6">
                <p className="text-green-400">Thank you for subscribing! Check your email for confirmation.</p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-400/20 border border-red-400/50 rounded-lg p-4 mb-6">
                <p className="text-red-400">Sorry, there was an error. Please try again.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all duration-300"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-400 hover:bg-green-500 disabled:bg-gray-600 text-black disabled:text-gray-400 px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed hover:shadow-lg whitespace-nowrap"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
              </button>
            </form>
            
            {/* Privacy Notice */}
            <p className="text-gray-400 text-sm mt-4">
              We respect your privacy. Unsubscribe at any time. 
              <a href="/privacy" className="text-green-400 hover:text-green-300 transition-colors">Privacy Policy</a>
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-400/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-gray-300">Market Insights</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-400/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className="text-gray-300">Security Updates</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-400/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <span className="text-gray-300">Exclusive Tips</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NewsletterSection;
