
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CommunityMember } from '../community/types';
import { CommunityMemberDetails } from '../community/CommunityMemberDetails';
import { DirectoryFilters } from './directory/DirectoryFilters';
import { DirectoryHeader } from './directory/DirectoryHeader';
import { DirectoryPagination } from './directory/DirectoryPagination';
import { FeaturedEducators } from './FeaturedEducators';
import { usePagination } from '@/hooks/use-pagination';
import { EducatorCard } from './EducatorCard';

interface EducatorsDirectoryProps {
  members?: CommunityMember[];
  isLoading: boolean;
  searchQuery: string;
}

const ITEMS_PER_PAGE = 12;

export const EducatorsDirectory = ({ 
  members, 
  isLoading, 
  searchQuery: initialSearchQuery 
}: EducatorsDirectoryProps) => {
  const [selectedMember, setSelectedMember] = useState<CommunityMember | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

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

  const totalPages = Math.ceil((nonFeaturedMembers?.length || 0) / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentMembers = nonFeaturedMembers?.slice(startIndex, endIndex) || [];

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage,
    totalPages,
    paginationItemsToDisplay: 7,
  });

  if (isLoading) {
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
          {currentMembers.map((member) => (
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
                  channel_location: member.location,
                  slug: member.slug || '',
                  is_featured: member.is_featured
                }}
                onClick={() => setSelectedMember(member)}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {totalPages > 1 && (
        <DirectoryPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          pages={pages}
          showLeftEllipsis={showLeftEllipsis}
          showRightEllipsis={showRightEllipsis}
        />
      )}

      <CommunityMemberDetails
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </motion.div>
  );
};
