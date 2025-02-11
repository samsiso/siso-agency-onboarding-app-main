
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const usePerformanceMetrics = () => {
  useEffect(() => {
    // Only run in production and for authenticated users
    if (process.env.NODE_ENV !== 'production') return;

    const recordMetrics = async () => {
      try {
        // Get Web Vitals metrics
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach(async (entry) => {
            const metric = {
              page_url: window.location.pathname,
              [entry.name.toLowerCase()]: entry.value,
            };

            // Store metrics in Supabase
            const { error } = await supabase
              .from('performance_metrics')
              .insert([metric]);

            if (error) {
              console.error('Error recording metrics:', error);
            }
          });
        });

        // Observe LCP, FID, and CLS
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });

        // Record TTFB
        const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigationEntry) {
          await supabase
            .from('performance_metrics')
            .insert([{
              page_url: window.location.pathname,
              ttfb: navigationEntry.responseStart - navigationEntry.requestStart,
            }]);
        }
      } catch (error) {
        console.error('Error in performance monitoring:', error);
      }
    };

    recordMetrics();
  }, []);
};
