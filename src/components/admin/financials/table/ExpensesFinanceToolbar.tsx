
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, Filter, Plus, Trash2, ArrowUpDown } from "lucide-react";
import { TableColumn } from "@/hooks/useTableColumns";
import { SavedView } from "@/hooks/useTableViews";
import { ColumnCustomization } from "./ColumnCustomization";
import { SavedViewsManager } from "./SavedViewsManager";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface ExpensesFinanceToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  columns: TableColumn[];
  onColumnVisibilityChange: (columns: TableColumn[]) => void;
  savedViews: SavedView[];
  onViewSelect: (view: SavedView) => void;
  onViewSave: (name: string) => void;
  selectedCount: number;
  onDeleteSelected: () => void;
  onAddExpense: () => void;
  onExport: () => void;
}

export function ExpensesFinanceToolbar({ 
  searchQuery, 
  onSearchChange, 
  columns,
  onColumnVisibilityChange,
  savedViews,
  onViewSelect,
  onViewSave,
  selectedCount,
  onDeleteSelected,
  onAddExpense,
  onExport
}: ExpensesFinanceToolbarProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-xl font-semibold">Expenses Tracking</h2>
        
        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <>
              <Badge className="bg-primary/20 text-primary border border-primary/30 px-2 py-1 text-xs">
                {selectedCount} selected
              </Badge>
              
              <Button 
                variant="outline" 
                size="sm"
                className="h-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={onDeleteSelected}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
              
              <Separator orientation="vertical" className="h-6" />
            </>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9"
            onClick={onExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button 
            size="sm" 
            className="h-9"
            onClick={onAddExpense}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 justify-between items-center bg-muted/30 p-4 rounded-md border border-border/50 shadow-sm">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search expenses..."
            className="pl-9 border-border/50 bg-background shadow-sm h-10"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="h-9 border-border/50 shadow-sm hover:bg-muted/50"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="h-9 border-border/50 shadow-sm hover:bg-muted/50"
          >
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Sort
          </Button>
          
          <Separator orientation="vertical" className="h-8" />
          
          <ColumnCustomization 
            columns={columns} 
            onColumnVisibilityChange={onColumnVisibilityChange}
          />
          
          <SavedViewsManager
            views={savedViews}
            onViewSelect={onViewSelect}
            onViewSave={onViewSave}
          />
        </div>
      </div>
    </div>
  );
}
