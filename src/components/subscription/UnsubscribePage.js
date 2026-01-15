import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import subscriptionService from '../../services/subscriptionService';

const UnsubscribePage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // loading, success, error, not_found
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const token = searchParams.get('token');

    if (!emailParam) {
      setStatus('error');
      setMessage('Invalid unsubscribe link. Email parameter is missing.');
      return;
    }

    setEmail(emailParam);
    handleUnsubscribe(emailParam, token);
  }, [searchParams]);

  const handleUnsubscribe = async (emailParam, token) => {
    try {
      await subscriptionService.unsubscribe(emailParam, token);
      setStatus('success');
      setMessage('You have been successfully unsubscribed from our newsletter.');
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Failed to unsubscribe. Please try again or contact support.');
    }
  };

  const handleResubscribe = async () => {
    try {
      setStatus('loading');
      await subscriptionService.subscribe(email, { source: 'resubscribe' });
      setStatus('success');
      setMessage('You have been successfully resubscribed to our newsletter!');
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Failed to resubscribe. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {status === 'loading' && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <h2 className="mt-4 text-lg font-medium text-gray-900">Processing...</h2>
              <p className="mt-2 text-sm text-gray-600">
                Please wait while we process your request.
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mt-4 text-lg font-medium text-gray-900">
                {message.includes('resubscribed') ? 'Resubscribed!' : 'Unsubscribed Successfully'}
              </h2>
              <p className="mt-2 text-sm text-gray-600">{message}</p>
              
              {!message.includes('resubscribed') && (
                <div className="mt-6">
                  <p className="text-sm text-gray-600 mb-4">
                    Changed your mind? You can resubscribe anytime.
                  </p>
                  <button
                    onClick={handleResubscribe}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Resubscribe
                  </button>
                </div>
              )}
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="mt-4 text-lg font-medium text-gray-900">Oops! Something went wrong</h2>
              <p className="mt-2 text-sm text-gray-600">{message}</p>
              
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-4">
                  If you continue to have issues, please contact our support team.
                </p>
                <a
                  href="mailto:support@example.com"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Contact Support
                </a>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <a
              href="/"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              ← Back to Homepage
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          This unsubscribe link is unique to your email address. 
          Please do not share it with others.
        </p>
      </div>
    </div>
  );
};

export default UnsubscribePage;