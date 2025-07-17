import { useEffect, useRef, useState } from 'react';
import { trackPageView, trackReadCompletion, getPostAnalytics } from '../utils/analytics';

// Hook for tracking page views and reading time
export const usePageTracking = (postSlug, postData = {}) => {
  const startTimeRef = useRef(null);
  const isActiveRef = useRef(true);
  const hasTrackedViewRef = useRef(false);

  useEffect(() => {
    // Track page view when component mounts
    if (postSlug && !hasTrackedViewRef.current) {
      trackPageView(postSlug, postData);
      hasTrackedViewRef.current = true;
      startTimeRef.current = Date.now();
    }

    // Track when user becomes active/inactive
    const handleVisibilityChange = () => {
      isActiveRef.current = !document.hidden;
    };

    const handleBeforeUnload = () => {
      if (startTimeRef.current && postSlug) {
        const readTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
        trackReadCompletion(postSlug, readTime);
      }
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Track reading time on unmount
      if (startTimeRef.current && postSlug) {
        const readTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
        trackReadCompletion(postSlug, readTime);
      }
    };
  }, [postSlug, postData]);

  // Return current reading time
  const getCurrentReadTime = () => {
    if (!startTimeRef.current) return 0;
    return Math.floor((Date.now() - startTimeRef.current) / 1000);
  };

  return { getCurrentReadTime };
};

// Hook for getting real-time analytics data
export const useAnalyticsData = (postSlug = null, refreshInterval = 5000) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = () => {
      try {
        if (postSlug) {
          const postAnalytics = getPostAnalytics(postSlug);
          setAnalytics(postAnalytics);
        } else {
          // Fetch overview analytics
          const { getAnalyticsOverview } = require('../utils/analytics');
          const overview = getAnalyticsOverview();
          setAnalytics(overview);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setLoading(false);
      }
    };

    // Initial fetch
    fetchAnalytics();

    // Set up interval for real-time updates
    const interval = setInterval(fetchAnalytics, refreshInterval);

    return () => clearInterval(interval);
  }, [postSlug, refreshInterval]);

  return { analytics, loading, refresh: () => setLoading(true) };
};

// Hook for scroll tracking (to measure engagement)
export const useScrollTracking = (postSlug) => {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [maxScrollReached, setMaxScrollReached] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrollTop = window.pageYOffset;
      
      const percentage = Math.round((scrollTop / documentHeight) * 100);
      setScrollPercentage(percentage);
      
      if (percentage > maxScrollReached) {
        setMaxScrollReached(percentage);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [maxScrollReached]);

  return { scrollPercentage, maxScrollReached };
};

// Hook for reading progress tracking
export const useReadingProgress = (contentRef, postSlug) => {
  const [readingProgress, setReadingProgress] = useState(0);
  const [isReading, setIsReading] = useState(false);

  useEffect(() => {
    if (!contentRef.current) return;

    const handleScroll = () => {
      const element = contentRef.current;
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top;
      const elementHeight = rect.height;
      const windowHeight = window.innerHeight;

      // Calculate how much of the content is visible
      const visibleHeight = Math.min(windowHeight - Math.max(elementTop, 0), elementHeight);
      const progress = Math.max(0, Math.min(100, (visibleHeight / elementHeight) * 100));
      
      setReadingProgress(progress);
      setIsReading(progress > 10 && progress < 90); // Consider "reading" when 10-90% visible
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, [contentRef]);

  return { readingProgress, isReading };
};
