
import { useEffect, useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CommunityMember } from '../community/types';
import { CommunityMemberDetails } from '../community/CommunityMemberDetails';
import { DirectoryFilters } from './directory/DirectoryFilters';
import { DirectoryHeader } from './directory/DirectoryHeader';
import { FeaturedEducators } from './FeaturedEducators';
import { EducatorCard } from './EducatorCard';
import { useInView } from 'react-intersection-observer';

interface EducatorsDirectoryProps {
  members?: CommunityMember[];
  isLoading: boolean;
  searchQuery: string;
  hasNextPage?: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
}

export const EducatorsDirectory = ({ 
  members, 
  isLoading, 
  searchQuery: initialSearchQuery,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage
}: EducatorsDirectoryProps) => {
  const [selectedMember, setSelectedMember] = useState<CommunityMember | null>(null);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  // [Analysis] Setup intersection observer for infinite scroll
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    rootMargin: '100px',
  });

  // Fetch more data when the load more element comes into view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Filter members based on search query
  const filteredMembers = members?.filter(member => 
    searchQuery ? 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.specialization?.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()))
    : true
  );

  // [Analysis] Separate featured educators for special rendering
  const featuredMembers = filteredMembers?.filter(member => member.is_featured) || [];
  const nonFeaturedMembers = filteredMembers?.filter(member => !member.is_featured) || [];

  if (isLoading && !members?.length) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-[480px] bg-siso-bg-alt rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {featuredMembers.length > 0 && (
        <section>
          <FeaturedEducators 
            educators={featuredMembers.map(member => ({
              id: member.id,
              name: member.name,
              channel_avatar_url: member.profile_image_url,
              channel_banner_url: member.youtube_banner_url,
              number_of_subscribers: member.member_count,
              specialization: member.specialization || [],
              is_featured: member.is_featured
            }))}
            isLoading={isLoading}
          />
        </section>
      )}

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <DirectoryFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <DirectoryHeader />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {nonFeaturedMembers.map((member) => (
            <motion.div
              key={member.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
            >
              <EducatorCard
                educator={{
                  name: member.name,
                  description: member.description,
                  profile_image_url: member.profile_image_url,
                  channel_avatar_url: member.youtube_avatar_url,
                  channel_banner_url: member.youtube_banner_url,
                  number_of_subscribers: member.member_count,
                  channel_total_videos: member.contribution_count,
                  specialization: member.specialization,
                  channel_location: member.channel_location,
                  slug: member.slug || '',
                  is_featured: member.is_featured
                }}
                onClick={() => setSelectedMember(member)}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Infinite scroll trigger element */}
      {(hasNextPage || isFetchingNextPage) && (
        <div ref={loadMoreRef} className="py-8">
          <div className="flex justify-center">
            {isFetchingNextPage ? (
              <div className="animate-pulse space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-[480px] w-full bg-siso-bg-alt rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="h-20" /> // Spacer for scroll trigger
            )}
          </div>
        </div>
      )}

      <CommunityMemberDetails
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </motion.div>
  );
};
