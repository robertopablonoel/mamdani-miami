import { useEffect, useRef } from 'react';
import { trackScrollDepth } from '@/lib/analytics';

/**
 * Hook to track scroll depth for analytics
 * Fires events at 25%, 50%, 75%, and 100% scroll depth
 */
export const useScrollTracking = () => {
  const scrollDepths = useRef({
    25: false,
    50: false,
    75: false,
    100: false,
  });

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;

      // Track each milestone only once
      if (scrollPercentage >= 25 && !scrollDepths.current[25]) {
        scrollDepths.current[25] = true;
        trackScrollDepth(25);
      }
      if (scrollPercentage >= 50 && !scrollDepths.current[50]) {
        scrollDepths.current[50] = true;
        trackScrollDepth(50);
      }
      if (scrollPercentage >= 75 && !scrollDepths.current[75]) {
        scrollDepths.current[75] = true;
        trackScrollDepth(75);
      }
      if (scrollPercentage >= 100 && !scrollDepths.current[100]) {
        scrollDepths.current[100] = true;
        trackScrollDepth(100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
};
