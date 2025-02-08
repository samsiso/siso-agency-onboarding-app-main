
import { Video } from '@/components/education/types';
import { VideoGrid } from '../video-library/VideoGrid';
import { useEducatorCorrelatedVideos } from '@/hooks/education/use-educator-correlated-videos';
import { Skeleton } from '@/components/ui/skeleton';

interface EducatorCorrelatedVideosProps {
  channelId: string;
}

export const EducatorCorrelatedVideos = ({ channelId }: EducatorCorrelatedVideosProps) => {
  const { data: videos, isLoading, error } = useEducatorCorrelatedVideos(channelId);

  if (error) {
    return (
      <div className="p-4 text-center text-siso-text/70">
        <p>Failed to load correlated videos.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-siso-text">More from this Creator</h3>
      <VideoGrid 
        videos={videos || []} 
        featuredVideos={[]}
        isLoading={isLoading} 
      />
    </div>
  );
};
