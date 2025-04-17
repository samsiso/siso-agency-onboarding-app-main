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
  const [isScrolled, setIsScrolled] = useState(false);
  
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollTop, scrollWidth, clientWidth } = scrollContainerRef.current;
      setLeftShadowVisible(scrollLeft > 10);
      setRightShadowVisible(scrollLeft < scrollWidth - clientWidth - 10);
      setIsScrolled(scrollTop > 0);
    }
  };
  
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);
  
  const pinnedWidth = pinnedColumns.reduce((sum, col) => sum + (col.width || 150), 0);
  
  return (
    <div className="relative rounded-md border overflow-hidden border-border/30 bg-background/30 shadow-sm backdrop-blur-sm">
      {leftShadowVisible && (
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background/90 to-transparent z-10 pointer-events-none" />
      )}
      
      {rightShadowVisible && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background/90 to-transparent z-10 pointer-events-none" />
      )}
      
      <div 
        ref={scrollContainerRef}
        className={cn("overflow-auto hide-scrollbar relative", className)}
        style={{ maxWidth: '100%', maxHeight: 'calc(100vh - 300px)' }}
      >
        <div style={{ position: 'relative', minWidth: '100%' }}>
          {pinnedColumns.length > 0 && (
            <div 
              className={cn(
                "absolute top-0 left-0 bottom-0 border-r border-border/30 shadow-[4px_0_8px_rgba(0,0,0,0.1)]",
                isScrolled && "top-[var(--header-height)]"
              )}
              style={{ width: `${pinnedWidth}px` }}
            />
          )}
          
          {isScrolled && (
            <div 
              className="sticky top-0 left-0 right-0 z-30 bg-background/95 border-b border-border/30 shadow-sm backdrop-blur-md"
              style={{ height: 'var(--header-height)' }}
            />
          )}
          
          {children}
        </div>
      </div>
    </div>
  );
}
