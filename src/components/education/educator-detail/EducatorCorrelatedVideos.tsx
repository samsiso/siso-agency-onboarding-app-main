
import { Video } from '@/components/education/types';
import { VideoGrid } from '../video-library/VideoGrid';
import { useEducatorCorrelatedVideos } from '@/hooks/education/use-educator-correlated-videos';
import { Skeleton } from '@/components/ui/skeleton';
import { VideoOff } from 'lucide-react';

interface EducatorCorrelatedVideosProps {
  channelId: string;
}

export const EducatorCorrelatedVideos = ({ channelId }: EducatorCorrelatedVideosProps) => {
  const { data: videos, isLoading, error } = useEducatorCorrelatedVideos(channelId);

  if (error) {
    return (
      <div className="p-8 text-center text-siso-text/70 bg-siso-bg-alt/50 rounded-lg">
        <VideoOff className="w-12 h-12 mx-auto mb-4 text-siso-text/50" />
        <p className="text-lg font-semibold">Failed to load videos</p>
        <p className="text-sm">Please try again later</p>
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

  if (!videos?.length) {
    return (
      <div className="p-8 text-center text-siso-text/70 bg-siso-bg-alt/50 rounded-lg">
        <VideoOff className="w-12 h-12 mx-auto mb-4 text-siso-text/50" />
        <p className="text-lg font-semibold">No videos available</p>
        <p className="text-sm">This creator hasn't uploaded any videos yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-siso-text">More from this Creator</h3>
      <VideoGrid 
        videos={videos} 
        featuredVideos={[]}
        isLoading={isLoading} 
      />
    </div>
  );
};
