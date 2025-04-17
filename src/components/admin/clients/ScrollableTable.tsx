
import React, { useRef, useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ClientColumnPreference } from '@/types/client.types';
import { cn } from '@/lib/utils';
import '../../../components/ui/hide-scrollbar.css';

interface ScrollableTableProps {
  children: React.ReactNode;
  pinnedColumns: ClientColumnPreference[];
  className?: string;
}

export function ScrollableTable({ children, pinnedColumns, className }: ScrollableTableProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [leftShadowVisible, setLeftShadowVisible] = useState(false);
  const [rightShadowVisible, setRightShadowVisible] = useState(true);
  
  // Handle scroll shadow logic
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setLeftShadowVisible(scrollLeft > 10);
      setRightShadowVisible(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };
  
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      // Initialize shadow state
      handleScroll();
      
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);
  
  // Calculate the width of pinned columns (if any)
  const pinnedWidth = pinnedColumns.reduce((sum, col) => sum + (col.width || 150), 0);
  
  return (
    <div className="relative rounded-md border overflow-hidden border-border/50 bg-card/30 shadow-sm">
      {/* Left shadow when scrolled */}
      {leftShadowVisible && (
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background/90 to-transparent z-10 pointer-events-none" />
      )}
      
      {/* Right shadow indicator for more content */}
      {rightShadowVisible && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background/90 to-transparent z-10 pointer-events-none" />
      )}
      
      {/* Table with horizontal scrolling */}
      <div 
        ref={scrollContainerRef}
        className={cn("overflow-x-auto hide-scrollbar", className)}
        style={{ maxWidth: '100%' }}
      >
        <div style={{ position: 'relative', minWidth: '100%' }}>
          {/* Fixed/Pinned columns container */}
          {pinnedColumns.length > 0 && (
            <div 
              className="absolute top-0 left-0 bottom-0 bg-background/90 backdrop-blur-sm z-20 border-r border-border/70 shadow-[4px_0_8px_rgba(0,0,0,0.05)]" 
              style={{ width: `${pinnedWidth}px` }}
            >
              {/* This will be filled by the children */}
            </div>
          )}
          
          {children}
        </div>
      </div>
    </div>
  );
}
