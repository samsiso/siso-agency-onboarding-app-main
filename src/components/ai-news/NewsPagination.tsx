
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
  // [Analysis] Prevent unnecessary rendering when there's only 1 page
  if (totalPages <= 1) return null;

  // [Analysis] Create array of page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    
    // [Analysis] Always show first page
    pages.push(1);
    
    // [Analysis] Add current page and surrounding pages
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (pages.indexOf(i) === -1) {
        pages.push(i);
      }
    }
    
    // [Analysis] Always show last page if there is more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    // [Analysis] Return sorted unique pages
    return [...new Set(pages)].sort((a, b) => a - b);
  };
  
  const pageNumbers = getPageNumbers();

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>

        {/* Page Numbers */}
        {pageNumbers.map((page, i) => {
          // [Analysis] Add ellipsis when there are gaps in the page numbers
          const showEllipsisBefore = i > 0 && pageNumbers[i] - pageNumbers[i-1] > 1;
          
          return (
            <div key={page} className="flex items-center">
              {showEllipsisBefore && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              
              <PaginationItem>
                <PaginationLink
                  isActive={page === currentPage}
                  onClick={() => onPageChange(page)}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            </div>
          );
        })}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext 
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default NewsPagination;
