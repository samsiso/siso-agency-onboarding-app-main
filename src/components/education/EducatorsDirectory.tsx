import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CommunityMember } from '../community/types';
import { CommunityMemberDetails } from '../community/CommunityMemberDetails';
import { DirectoryFilters } from './directory/DirectoryFilters';
import { DirectoryHeader } from './directory/DirectoryHeader';
import { DirectoryList } from './directory/DirectoryList';
import { DirectoryPagination } from './directory/DirectoryPagination';
import { FeaturedEducators } from './FeaturedEducators';
import { usePagination } from '@/hooks/use-pagination';

interface EducatorsDirectoryProps {
  members?: CommunityMember[];
  isLoading: boolean;
  searchQuery: string;
}

const ITEMS_PER_PAGE = 20;

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

  // [Analysis] Separate non-featured educators for main list
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-48 bg-siso-bg-alt rounded-lg"></div>
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
      {members && (
        <FeaturedEducators 
          educators={members}
          onEducatorSelect={setSelectedMember}
        />
      )}

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <DirectoryFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <DirectoryHeader />
      </div>

      <AnimatePresence mode="wait">
        <DirectoryList
          members={currentMembers}
          viewMode="grid"
          onMemberSelect={setSelectedMember}
        />
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