
import { useMemo } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { usePagination } from '@/hooks/use-pagination';

interface NewsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const NewsPagination = ({ currentPage, totalPages, onPageChange }: NewsPaginationProps) => {
  // [Analysis] Use custom pagination hook to calculate which page numbers to show
  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage,
    totalPages,
    paginationItemsToDisplay: 5, // Show 5 page numbers in the middle
  });

  // [Analysis] Add motion effects for better UX
  return (
    <Pagination className="my-4">
      <PaginationContent>
        {/* Previous button */}
        <PaginationItem>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Go to previous page</span>
          </Button>
        </PaginationItem>

        {/* First page */}
        {showLeftEllipsis && (
          <>
            <PaginationItem>
              <PaginationLink
                onClick={() => onPageChange(1)}
                isActive={currentPage === 1}
              >
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}

        {/* Page numbers */}
        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => onPageChange(page)}
              isActive={page === currentPage}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Last page */}
        {showRightEllipsis && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                onClick={() => onPageChange(totalPages)}
                isActive={currentPage === totalPages}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        {/* Next button */}
        <PaginationItem>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Go to next page</span>
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default NewsPagination;
