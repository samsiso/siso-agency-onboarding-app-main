
import { useEffect, useRef, useState } from 'react';
import { useIsMobile } from './use-mobile';

interface ViewportLoadingOptions {
  threshold?: number;
  rootMargin?: string;
}

export const useViewportLoading = (options: ViewportLoadingOptions = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Mobile-optimized thresholds and margins
  const defaultThreshold = isMobile ? 0.05 : 0.1;
  const defaultRootMargin = isMobile ? '150px 0px' : '300px 0px';

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting && !isLoaded) {
          // Delay loading slightly on mobile to prevent jank
          const delay = isMobile ? 100 : 0;
          setTimeout(() => {
            setIsLoaded(true);
          }, delay);
        }
      },
      {
        threshold: options.threshold ?? defaultThreshold,
        rootMargin: options.rootMargin ?? defaultRootMargin,
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin, isLoaded, isMobile]);

  return { elementRef, isVisible, isLoaded };
};
