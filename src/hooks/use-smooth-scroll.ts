
import { useCallback, useEffect } from 'react';
import { debounce } from '@/lib/utils';

interface UseSmoothScrollOptions {
  onScroll?: (scrollLeft: number, scrollTop: number) => void;
  threshold?: number;
}

export function useSmoothScroll(ref: React.RefObject<HTMLElement>, options: UseSmoothScrollOptions = {}) {
  const { onScroll, threshold = 10 } = options;

  const handleScroll = useCallback(
    debounce((event: Event) => {
      const element = event.target as HTMLElement;
      const { scrollLeft, scrollTop } = element;
      onScroll?.(scrollLeft, scrollTop);
    }, threshold),
    [onScroll, threshold]
  );

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    element.style.willChange = 'transform';
    element.style.backfaceVisibility = 'hidden';
    element.style.perspective = '1000px';
    element.style.transform = 'translate3d(0,0,0)';

    element.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      element.removeEventListener('scroll', handleScroll);
    };
  }, [ref, handleScroll]);
}
