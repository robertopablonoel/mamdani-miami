import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

// Generate or retrieve session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

// Detect device type
const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

// Extract browser name from user agent
const getBrowser = (): string => {
  const ua = navigator.userAgent;
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edge')) return 'Edge';
  return 'Other';
};

/**
 * Hook to track page analytics including visits, time on page, and scroll depth
 */
export const usePageAnalytics = () => {
  const location = useLocation();
  const analyticsIdRef = useRef<string | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const maxScrollDepthRef = useRef<number>(0);
  const scrollTrackedRef = useRef<boolean>(false);

  useEffect(() => {
    // Track page entry
    const trackPageEntry = async () => {
      try {
        const sessionId = getSessionId();
        const deviceType = getDeviceType();
        const browser = getBrowser();

        const { data, error } = await supabase
          .from('page_analytics')
          .insert({
            session_id: sessionId,
            page_path: location.pathname,
            page_title: document.title,
            referrer: document.referrer || null,
            user_agent: navigator.userAgent,
            device_type: deviceType,
            browser: browser,
          })
          .select('id')
          .single();

        if (!error && data) {
          analyticsIdRef.current = data.id;
          startTimeRef.current = Date.now();
          maxScrollDepthRef.current = 0;
          scrollTrackedRef.current = false;
        }
      } catch (error) {
        console.error('Analytics tracking error:', error);
      }
    };

    trackPageEntry();

    // Track scroll depth
    const handleScroll = () => {
      if (!scrollTrackedRef.current) {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        const scrollPercentage = Math.round((scrollTop / (documentHeight - windowHeight)) * 100);
        
        if (scrollPercentage > maxScrollDepthRef.current) {
          maxScrollDepthRef.current = Math.min(scrollPercentage, 100);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Track page exit
    return () => {
      window.removeEventListener('scroll', handleScroll);
      
      if (analyticsIdRef.current) {
        const timeOnPage = Math.round((Date.now() - startTimeRef.current) / 1000);
        scrollTrackedRef.current = true;
        
        // Update with exit time, time on page, and scroll depth
        supabase
          .from('page_analytics')
          .update({
            exited_at: new Date().toISOString(),
            time_on_page: timeOnPage,
            scroll_depth: maxScrollDepthRef.current,
          })
          .eq('id', analyticsIdRef.current)
          .then(() => {
            analyticsIdRef.current = null;
          });
      }
    };
  }, [location.pathname]);
};
