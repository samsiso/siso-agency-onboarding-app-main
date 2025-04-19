
import { TableHead, TableRow } from "@/components/ui/table";
import { ArrowDown, ArrowUp, ArrowUpDown, Check } from "lucide-react";
import { TableColumn } from "@/hooks/useTableColumns";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface ExpensesTableHeaderProps {
  visibleColumns: TableColumn[];
  onSort: (field: string) => void;
  selectedExpenses: string[];
  expenses: any[];
  onSelectAll: () => void;
  sortColumn: string;
  sortDirection: "asc" | "desc";
}

export function ExpensesTableHeader({ 
  visibleColumns,
  onSort,
  selectedExpenses,
  expenses,
  onSelectAll,
  sortColumn,
  sortDirection
}: ExpensesTableHeaderProps) {
  return (
    <TableRow className="hover:bg-transparent border-border/30">
      <TableHead className="w-12 bg-background/95 backdrop-blur-sm sticky left-0 z-30 h-12 px-4">
        <Checkbox 
          checked={selectedExpenses.length === expenses.length && expenses.length > 0}
          onCheckedChange={onSelectAll}
          aria-label="Select all expenses"
          className={selectedExpenses.length > 0 && selectedExpenses.length < expenses.length ? "opacity-80" : ""}
        />
      </TableHead>
      
      {visibleColumns.map((col, index) => {
        const isPinned = !!col.pinned;
        let leftPosition = 48; // Adjusted for checkbox column width
        
        if (isPinned) {
          for (let i = 0; i < index; i++) {
            if (visibleColumns[i].pinned) {
              leftPosition += 150; // Use a fixed width or dynamic if implemented
            }
          }
        }
        
        const isSorted = sortColumn === col.key;
        
        return (
          <TableHead
            key={col.key}
            className={cn(
              "text-xs font-medium text-muted-foreground tracking-wider uppercase h-12",
              isPinned ? "sticky z-20 bg-background/95 backdrop-blur-sm" : ""
            )}
            style={isPinned ? { left: `${leftPosition}px` } : undefined}
          >
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => onSort(col.key)}
            >
              {col.label}
              {isSorted ? (
                sortDirection === "asc" ? (
                  <ArrowUp className="ml-2 h-3.5 w-3.5 text-primary" />
                ) : (
                  <ArrowDown className="ml-2 h-3.5 w-3.5 text-primary" />
                )
              ) : (
                <ArrowUpDown className="ml-2 h-3.5 w-3.5 opacity-30" />
              )}
            </div>
          </TableHead>
        );
      })}
      
      <TableHead className="text-xs font-medium text-muted-foreground tracking-wider uppercase text-right">
        Actions
      </TableHead>
    </TableRow>
  );
}
