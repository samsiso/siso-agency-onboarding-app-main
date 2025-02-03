import { motion, AnimatePresence } from 'framer-motion';
import { CommunityMember } from '../community/types';
import { CommunityMemberCard } from '../community/CommunityMemberCard';
import { CommunityMemberDetails } from '../community/CommunityMemberDetails';
import { useState } from 'react';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { usePagination } from '@/hooks/use-pagination';

interface EducatorsDirectoryProps {
  members?: CommunityMember[];
  isLoading: boolean;
  viewMode: 'grid' | 'list';
  searchQuery: string;
}

const ITEMS_PER_PAGE = 20; // Updated to show 20 items per page

export const EducatorsDirectory = ({ members, isLoading, viewMode, searchQuery }: EducatorsDirectoryProps) => {
  const [selectedMember, setSelectedMember] = useState<CommunityMember | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter members based on search query
  const filteredMembers = members?.filter(member => 
    searchQuery ? 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.specialization?.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()))
    : true
  );

  const totalPages = Math.ceil((filteredMembers?.length || 0) / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentMembers = filteredMembers?.slice(startIndex, endIndex) || [];

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
      <AnimatePresence mode="wait">
        <motion.div
          key={`educators-${viewMode}`}
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
          className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              : "flex flex-col gap-4"
          }
        >
          {isLoading ? (
            [...Array(20)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className={`${viewMode === 'grid' ? 'h-48' : 'h-24'} bg-siso-bg-alt rounded-lg`}></div>
              </div>
            ))
          ) : currentMembers?.map((member) => (
            <motion.div
              key={member.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              className={viewMode === 'list' ? 'w-full' : ''}
            >
              <CommunityMemberCard
                member={member}
                onClick={setSelectedMember}
                viewMode={viewMode}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

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

      <CommunityMemberDetails
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </motion.div>
  );
};