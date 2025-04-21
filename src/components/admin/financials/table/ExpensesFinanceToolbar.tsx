
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, FileDown, Plus, Trash2, PieChart } from "lucide-react";
import { ColumnCustomization } from "./ColumnCustomization";
import { SavedViewsManager } from "./SavedViewsManager";
import { TableColumn } from "@/hooks/useTableColumns";
import { SavedView } from "@/hooks/useTableViews";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { formatCurrency } from "@/lib/formatters";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ExpensesFinanceToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddExpense?: () => void;
  onExport?: () => void;
  onFilter?: () => void;
  columns: TableColumn[];
  onColumnVisibilityChange: (columns: TableColumn[]) => void;
  savedViews: SavedView[];
  onViewSelect: (view: SavedView) => void;
  onViewSave: (name: string) => void;
  selectedCount: number;
  onDeleteSelected: () => void;
  categorySummary?: [string, number][];
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export function ExpensesFinanceToolbar({ 
  searchQuery, 
  onSearchChange,
  onAddExpense,
  onExport,
  onFilter,
  columns,
  onColumnVisibilityChange,
  savedViews,
  onViewSelect,
  onViewSave,
  selectedCount,
  onDeleteSelected,
  categorySummary = [],
  activeCategory,
  onCategoryChange
}: ExpensesFinanceToolbarProps) {
  const [showCategorySummary, setShowCategorySummary] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search expenses..."
              className="pl-8 w-[250px]"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          
          <ColumnCustomization 
            columns={columns} 
            onColumnVisibilityChange={onColumnVisibilityChange}
          />
          
          <SavedViewsManager
            views={savedViews}
            onViewSelect={onViewSelect}
            onViewSave={onViewSave}
          />
          
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9"
            onClick={onFilter}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9"
            onClick={onExport}
          >
            <FileDown className="h-4 w-4 mr-2" />
            Export
          </Button>

          <Popover open={showCategorySummary} onOpenChange={setShowCategorySummary}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9"
              >
                <PieChart className="h-4 w-4 mr-2" />
                Categories
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <Card className="border-none shadow-none">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-base">Expense Categories</CardTitle>
                  <CardDescription>Summary by category</CardDescription>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <div className="space-y-2">
                    <Button 
                      variant={!activeCategory ? "secondary" : "outline"}
                      size="sm"
                      className="mb-1 w-full justify-between"
                      onClick={() => {
                        onCategoryChange(null);
                        setShowCategorySummary(false);
                      }}
                    >
                      <span>All Categories</span>
                      <Badge variant="outline" className="ml-2">
                        {categorySummary.reduce((sum, [_, amount]) => sum + (amount as number), 0).toFixed(2)}
                      </Badge>
                    </Button>
                    
                    {categorySummary.map(([category, amount]) => (
                      <Button 
                        key={category} 
                        variant={activeCategory === category ? "secondary" : "outline"}
                        size="sm"
                        className="mb-1 w-full justify-between"
                        onClick={() => {
                          onCategoryChange(category);
                          setShowCategorySummary(false);
                        }}
                      >
                        <span>{category}</span>
                        <Badge variant="outline" className="ml-2">
                          {formatCurrency(amount as number, 'GBP')}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <Button 
              variant="destructive" 
              size="sm" 
              className="h-9"
              onClick={onDeleteSelected}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected ({selectedCount})
            </Button>
          )}
          
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
      
      {/* Display active category filter if one is selected */}
      {activeCategory && (
        <div className="flex items-center">
          <span className="text-sm text-muted-foreground mr-2">Filtered by:</span>
          <Badge 
            variant="secondary" 
            className="mr-1 cursor-pointer"
            onClick={() => onCategoryChange(null)}
          >
            {activeCategory} ✕
          </Badge>
        </div>
      )}
    </div>
  );
}
