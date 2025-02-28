
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMemo } from 'react';
import { usePagination } from '@/hooks/use-pagination';

interface NewsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const NewsPagination = ({
  currentPage,
  totalPages,
  onPageChange
}: NewsPaginationProps) => {
  // Use our custom hook for pagination logic
  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage,
    totalPages,
    paginationItemsToDisplay: 5,
  });

  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center space-x-1">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="hidden sm:flex"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="ml-1">Previous</span>
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="sm:hidden"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* First Page */}
      {showLeftEllipsis && (
        <>
          <Button
            variant={currentPage === 1 ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(1)}
          >
            1
          </Button>
          <span className="flex items-center justify-center">
            <MoreHorizontal className="h-4 w-4" />
          </span>
        </>
      )}

      {/* Pagination Pages */}
      {pages.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      {/* Last Page */}
      {showRightEllipsis && (
        <>
          <span className="flex items-center justify-center">
            <MoreHorizontal className="h-4 w-4" />
          </span>
          <Button
            variant={currentPage === totalPages ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="hidden sm:flex"
      >
        <span className="mr-1">Next</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="sm:hidden"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
};

export default NewsPagination;
