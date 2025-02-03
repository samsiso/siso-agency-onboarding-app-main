import { motion } from 'framer-motion';
import { ToolVideoGrid } from '../tools/ToolVideoGrid';
import { useState } from 'react';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { usePagination } from '@/hooks/use-pagination';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface VideoLibraryProps {
  isLoading?: boolean;
  selectedEducator?: string;
  viewMode: 'grid' | 'list';
  searchQuery: string;
}

const ITEMS_PER_PAGE = 12;

export const VideoLibrary = ({ isLoading: externalLoading, selectedEducator }: VideoLibraryProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: videos, isLoading: videosLoading } = useQuery({
    queryKey: ['video-library', currentPage, selectedEducator],
    queryFn: async () => {
      let query = supabase
        .from('youtube_videos')
        .select(`
          *,
          channel:youtube_channels(*)
        `)
        .order('order', { ascending: true });

      if (selectedEducator) {
        query = query.eq('channel.name', selectedEducator);
      }

      const { data: videos, error } = await query;
      
      if (error) throw error;
      if (!videos) return [];

      // Transform the data to match the expected format
      return videos.map(video => ({
        id: video.id,
        title: video.title || '',
        url: `https://youtube.com/watch?v=${video.id}`,
        duration: video.duration || '0:00',
        thumbnail_url: video.thumbnailUrl || '',
        educator: {
          name: video.channel?.name || 'Unknown Creator',
          avatar_url: video.channel?.profile_image_url || ''
        },
        metrics: {
          views: video.viewCount || 0,
          likes: 0, // Not available in simplified schema
          sentiment_score: 0.8,
          difficulty: "Intermediate" as const,
          impact_score: 8.5
        },
        topics: [], // Not available in simplified schema
        ai_analysis: {
          key_takeaways: ['Coming soon...'],
          implementation_steps: ['Coming soon...']
        }
      }));
    },
  });

  const isLoading = externalLoading || videosLoading;

  // Get featured videos (first 3 videos)
  const featuredVideos = videos?.slice(0, 3) || [];

  const totalVideos = videos?.length || 0;
  const totalPages = Math.ceil(totalVideos / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentVideos = videos?.slice(startIndex, endIndex) || [];

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage,
    totalPages,
    paginationItemsToDisplay: 7,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <ToolVideoGrid
        videos={currentVideos}
        featuredVideos={featuredVideos}
        isLoading={isLoading}
      />

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ←
              </Button>
            </PaginationItem>

            {showLeftEllipsis && (
              <>
                <PaginationItem>
                  <PaginationLink onClick={() => setCurrentPage(1)}>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              </>
            )}

            {pages.map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            {showRightEllipsis && (
              <>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink onClick={() => setCurrentPage(totalPages)}>
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                →
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </motion.div>
  );
};