import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
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
import { promptStretchesService } from '@/utils/prompt-stretches-service';

interface PageNavigationProps {
  projectName: string;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const PageNavigation: React.FC<PageNavigationProps> = ({
  projectName,
  currentPage,
  onPageChange
}) => {
  const [availablePages, setAvailablePages] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchPages = async () => {
      try {
        setLoading(true);
        const pages = await promptStretchesService.getPageNumbersByProject(projectName);
        setAvailablePages(pages.length > 0 ? pages : [1]); // Default to at least page 1
      } catch (error) {
        console.error('Error fetching page numbers:', error);
        setAvailablePages([1]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPages();
  }, [projectName]);
  
  const handlePageChange = (page: number) => {
    if (page !== currentPage && page > 0 && (page <= availablePages.length || availablePages.includes(page))) {
      onPageChange(page);
    }
  };
  
  // Determine which page items to show in pagination
  const getVisiblePageItems = () => {
    const maxVisiblePages = 5;
    const maxPage = Math.max(...availablePages, 1);
    
    // If we have 7 or fewer pages, show all
    if (maxPage <= 7) {
      return availablePages.map(page => (
        <PaginationItem key={page}>
          <PaginationLink
            isActive={page === currentPage}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      ));
    }
    
    // Otherwise, show a subset with ellipses
    const items = [];
    
    // Always show first page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink
          isActive={1 === currentPage}
          onClick={() => handlePageChange(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Calculate visible page range
    let startVisible = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
    let endVisible = Math.min(maxPage - 1, startVisible + maxVisiblePages - 1);
    
    // Adjust if we're near the end
    if (endVisible - startVisible < maxVisiblePages - 1) {
      startVisible = Math.max(2, endVisible - maxVisiblePages + 1);
    }
    
    // Add ellipsis if needed before visible pages
    if (startVisible > 2) {
      items.push(
        <PaginationItem key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Add visible pages
    for (let i = startVisible; i <= endVisible; i++) {
      if (availablePages.includes(i)) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={i === currentPage}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }
    
    // Add ellipsis if needed after visible pages
    if (endVisible < maxPage - 1) {
      items.push(
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Always show last page
    items.push(
      <PaginationItem key={maxPage}>
        <PaginationLink
          isActive={maxPage === currentPage}
          onClick={() => handlePageChange(maxPage)}
        >
          {maxPage}
        </PaginationLink>
      </PaginationItem>
    );
    
    return items;
  };
  
  const handlePrevious = () => {
    // Find the previous available page
    const prevPage = availablePages
      .filter(page => page < currentPage)
      .sort((a, b) => b - a)[0];
      
    if (prevPage) {
      handlePageChange(prevPage);
    }
  };
  
  const handleNext = () => {
    // Find the next available page
    const nextPage = availablePages
      .filter(page => page > currentPage)
      .sort((a, b) => a - b)[0];
      
    if (nextPage) {
      handlePageChange(nextPage);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center my-4">
        <div className="animate-pulse h-10 w-64 bg-muted rounded"></div>
      </div>
    );
  }
  
  // If no pages or only one page, don't show navigation
  if (availablePages.length <= 1) {
    return null;
  }
  
  return (
    <div className="flex flex-col items-center my-6">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="h-4 w-4" />
        <span className="text-sm font-medium">
          Page {currentPage} of {Math.max(...availablePages, 1)}
        </span>
      </div>
      
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={handlePrevious}
              aria-disabled={!availablePages.some(page => page < currentPage)}
              className={!availablePages.some(page => page < currentPage) ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
          
          {getVisiblePageItems()}
          
          <PaginationItem>
            <PaginationNext 
              onClick={handleNext}
              aria-disabled={!availablePages.some(page => page > currentPage)}
              className={!availablePages.some(page => page > currentPage) ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}; 