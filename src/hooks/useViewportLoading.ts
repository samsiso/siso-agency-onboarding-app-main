
import { useEffect, useRef, useState } from 'react';

export const useViewportLoading = (options = { threshold: 0.1 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting && !isLoaded) {
          setIsLoaded(true);
        }
      },
      {
        threshold: options.threshold,
        rootMargin: '300px 0px', // Increased from 100px to 300px for earlier loading
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [options.threshold, isLoaded]);

  return { elementRef, isVisible, isLoaded };
};
