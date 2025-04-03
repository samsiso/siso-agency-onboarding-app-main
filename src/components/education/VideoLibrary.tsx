
import { Skeleton } from '@/components/ui/skeleton';

export const VideoLibrary = ({ isLoading, searchQuery, selectedEducator }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="aspect-video rounded-xl" />
        <Skeleton className="aspect-video rounded-xl" />
        <Skeleton className="aspect-video rounded-xl" />
      </div>
    );
  }

  return (
    <div className="text-center text-gray-400">
      <p>Video library is not available in this preview</p>
    </div>
  );
};
