import React, { useRef, useState, useEffect, useCallback } from 'react';
import { TableColumn } from "@/hooks/useTableColumns";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useElementSize } from "@/hooks/useElementSize";
import "@/components/ui/hide-scrollbar.css";

interface SpreadsheetTableProps {
  children: React.ReactNode;
  className?: string;
  pinnedColumns?: TableColumn[];
  showGrid?: boolean;
  containerClassName?: string;
}

export function SpreadsheetTable({ 
  children, 
  className, 
  pinnedColumns = [],
  showGrid = true,
  containerClassName
}: SpreadsheetTableProps) {
  const [headerHeight, setHeaderHeight] = useState(0);
  const tableRef = useRef<HTMLDivElement>(null);
  const { width } = useElementSize(tableRef);
  
  useEffect(() => {
    if (tableRef.current) {
      const headerElement = tableRef.current.querySelector('thead');
      if (headerElement) {
        setHeaderHeight(headerElement.offsetHeight);
      }
    }
  }, [width]);

  return (
    <div 
      className={cn(
        "relative bg-background/50 border border-border/30 rounded-md overflow-hidden",
        showGrid && "spreadsheet-grid",
        containerClassName
      )}
      style={{ background: "#fff" }} /* enforce white bg for all spreadsheet containers */
    >
      <ScrollArea
        ref={tableRef}
        className={cn("h-full max-h-[calc(100vh-300px)]", className)}
      >
        <div className="relative">
          <div
            className="sticky top-0 z-30 border-b border-border/30"
            style={{ height: `${headerHeight}px`, background: "#fafafb" }}
          />
          {children}
        </div>
      </ScrollArea>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .spreadsheet-grid table {
          border-collapse: collapse;
        }
        .spreadsheet-grid select,
        .spreadsheet-grid .select-trigger {
          background: #fff !important;
          color: #222 !important;
          border: 1px solid #E5E7EB !important;
          z-index: 500 !important;
        }
        .spreadsheet-grid .dropdown-menu,
        .spreadsheet-grid .dropdown-content,
        .spreadsheet-grid .select-content {
          background-color: #fff !important;
          color: #1A1F2C !important;
          z-index: 9999 !important;
        }
        .spreadsheet-grid th,
        .spreadsheet-grid td {
          background: #fff !important;
        }
        /* Fix for sticky column always on top and not ghosted */
        .spreadsheet-grid .sticky,
        .spreadsheet-grid td.sticky,
        .spreadsheet-grid th.sticky {
          background: #fff !important;
          z-index: 500 !important;
          box-shadow: 2px 0 4px 0 rgba(0,0,0,0.03);
        }
      `}} />
    </div>
  );
}
