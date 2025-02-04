import { useEffect, useRef } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
  onIntersect: IntersectionObserverCallback;
}

export function useIntersectionObserver({
  threshold = 0,
  root = null,
  rootMargin = '0px',
  onIntersect,
}: UseIntersectionObserverProps) {
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(onIntersect, {
      threshold,
      root,
      rootMargin,
    });

    const currentRef = observerRef.current;

    if (currentRef) {
      const elements = currentRef.querySelectorAll('.section-fade-in');
      elements.forEach((element) => observer.observe(element));
    }

    return () => {
      if (currentRef) {
        const elements = currentRef.querySelectorAll('.section-fade-in');
        elements.forEach((element) => observer.unobserve(element));
      }
    };
  }, [threshold, root, rootMargin, onIntersect]);

  return { observerRef };
}