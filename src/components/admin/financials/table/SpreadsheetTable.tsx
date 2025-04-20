
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
    >
      <ScrollArea
        ref={tableRef}
        className={cn("h-full max-h-[calc(100vh-300px)]", className)}
      >
        <div className="relative">
          <div
            className="sticky top-0 z-30 border-b border-border/30"
            style={{ height: `${headerHeight}px` }}
          />
          {children}
        </div>
      </ScrollArea>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .spreadsheet-grid table {
          border-collapse: collapse;
        }
        .spreadsheet-grid tbody tr:hover {
          background-color: rgba(0, 0, 0, 0.025);
        }
        .spreadsheet-grid td.cell-editable:hover:not(.cell-editing) {
          background-color: rgba(0, 0, 0, 0.04);
        }
        .spreadsheet-grid td.cell-editing {
          padding: 0;
        }
        .spreadsheet-grid td.cell-editing input, 
        .spreadsheet-grid td.cell-editing select {
          width: 100%;
          height: 100%;
          padding: 0.5rem;
          border: none;
          background: white;
          box-shadow: inset 0 0 0 2px #6366f1;
          outline: none;
        }
        .spreadsheet-grid .resize-handle {
          position: absolute;
          top: 0;
          right: 0;
          height: 100%;
          width: 4px;
          cursor: col-resize;
          user-select: none;
          background: transparent;
          transition: background 0.2s;
        }
        .spreadsheet-grid th:hover .resize-handle {
          background: rgba(99, 102, 241, 0.3);
        }
      `}} />
    </div>
  );
}
