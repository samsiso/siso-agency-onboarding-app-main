
import { Video } from '../education/types';
import { VideoGrid } from './video-library/VideoGrid';
import { Skeleton } from '../ui/skeleton';
import { useFeaturedVideos } from '@/hooks/education/use-featured-videos';

export const FeaturedVideosSection = () => {
  const { data: videos, isLoading } = useFeaturedVideos();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="aspect-video rounded-xl" />
          <Skeleton className="aspect-video rounded-xl" />
          <Skeleton className="aspect-video rounded-xl" />
        </div>
      </div>
    );
  }

  if (!videos?.length) {
    return null;
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-siso-text">Featured Videos</h2>
      <VideoGrid 
        videos={videos} 
        featuredVideos={[]}
        isLoading={isLoading}
      />
    </section>
  );
};
