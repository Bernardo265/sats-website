import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for animated number counting
 * @param {number} end - The final number to count to
 * @param {number} duration - Animation duration in milliseconds
 * @param {boolean} isVisible - Whether the element is visible (triggers animation)
 * @param {string} suffix - Optional suffix to add to the number (e.g., '+', '%', 'M+')
 * @returns {string} The current animated value as a string
 */
export const useAnimatedCounter = (end, duration = 2000, isVisible = false, suffix = '') => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const frameRef = useRef();

  useEffect(() => {
    // Only animate once when element becomes visible
    if (!isVisible || hasAnimated) return;

    setHasAnimated(true);
    
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      setCount(end);
      return;
    }

    const startTime = Date.now();
    const startValue = 0;
    
    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Use easeOutCubic for smooth deceleration
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (end - startValue) * easeOutCubic);
      
      setCount(currentValue);
      
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    
    frameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [end, duration, isVisible, hasAnimated]);

  // Format the number with suffix
  const formatNumber = (num) => {
    if (suffix.includes('K')) {
      return `${num}K${suffix.replace('K', '')}`;
    }
    if (suffix.includes('M')) {
      return `MK${num}M${suffix.replace('M', '').replace('MK', '')}`;
    }
    return `${num}${suffix}`;
  };

  return formatNumber(count);
};

/**
 * Custom hook for intersection observer to trigger animations
 * @param {Object} options - Intersection observer options
 * @returns {Array} [ref, isVisible] - Ref to attach to element and visibility state
 */
export const useIntersectionObserver = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasIntersected) {
          setIsVisible(true);
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px',
        ...options,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [hasIntersected, options]);

  return [ref, isVisible];
};
