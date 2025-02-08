
import React from 'react';
import { useEducatorVideos } from '@/hooks/education';
import { VideoGrid } from '../video-library/VideoGrid';
import { VideoPagination } from '../video-library/VideoPagination';
import { Skeleton } from '@/components/ui/skeleton';
import { usePagination } from '@/hooks/use-pagination';
import { VideoOff } from 'lucide-react';

interface EducatorVideoSectionProps {
  educatorId: string;
  featuredVideos?: any[];
  educatorName?: string;
}

export const EducatorVideoSection: React.FC<EducatorVideoSectionProps> = ({
  educatorId,
  featuredVideos = [],
  educatorName = ''
}) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const { data: videos, isLoading } = useEducatorVideos(educatorId, currentPage);

  // Calculate pagination values using the usePagination hook
  const totalPages = Math.ceil((videos?.length || 0) / 12);
  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage,
    totalPages,
    paginationItemsToDisplay: 5
  });

  console.log('Videos in EducatorVideoSection:', videos); // Debug log

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  // Display featured videos if available, otherwise show all videos
  const displayVideos = featuredVideos?.length > 0 ? featuredVideos : videos;

  if (!displayVideos?.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-siso-text/70">
        <VideoOff className="w-12 h-12 mb-4" />
        <h3 className="text-xl font-semibold">No Videos Available</h3>
        <p>There are currently no videos available for {educatorName || 'this educator'}.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {featuredVideos?.length > 0 && (
        <h3 className="text-2xl font-semibold">Featured Videos</h3>
      )}
      <VideoGrid 
        videos={displayVideos} 
        featuredVideos={featuredVideos}
        isLoading={isLoading} 
      />
      {!featuredVideos?.length && videos?.length > 0 && (
        <VideoPagination
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalPages={totalPages}
          pages={pages}
          showLeftEllipsis={showLeftEllipsis}
          showRightEllipsis={showRightEllipsis}
        />
      )}
    </div>
  );
};
