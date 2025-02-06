
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

interface LoadMoreProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export const LoadMore = ({ 
  hasNextPage, 
  isFetchingNextPage, 
  fetchNextPage 
}: LoadMoreProps) => {
  const { ref: loadMoreRef, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      console.log('[LoadMore] Infinite scroll triggered, loading more videos...');
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!hasNextPage) return null;

  return (
    <div
      ref={loadMoreRef}
      className="w-full h-20 flex items-center justify-center"
    >
      {isFetchingNextPage ? (
        <div className="w-6 h-6 border-2 border-siso-red border-t-transparent rounded-full animate-spin" />
      ) : (
        <span className="text-siso-text/60">Scroll to load more</span>
      )}
    </div>
  );
};
