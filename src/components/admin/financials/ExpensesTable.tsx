
import { useState, useEffect } from "react";
import { Table, TableBody, TableHeader } from "@/components/ui/table";
import { deleteTransaction } from "@/utils/financial";
import { ExpenseDetailsDialog } from "./ExpenseDetailsDialog";
import { useExpensesSort } from "@/hooks/useExpensesSort";
import { useTableColumns } from "@/hooks/useTableColumns";
import { useTableViews } from "@/hooks/useTableViews";
import { useExpensesTableData } from "@/hooks/useExpensesTableData";
import { ExpensesTableHeader } from "./expense/ExpensesTableHeader";
import { ExpensesTableLoading } from "./expense/ExpensesTableLoading";
import { SpreadsheetTable } from "./table/SpreadsheetTable";
import { ExpensesFinanceToolbar } from "./table/ExpensesFinanceToolbar";
import { SpreadsheetExpensesBody } from "./expense/SpreadsheetExpensesBody";
import { AddExpenseRow } from "./expense/AddExpenseRow";
import { categorizeExpenses } from "@/utils/financial/expenseCategories";

export function ExpensesTable({ expenses = [], isLoading = false, onDataChange }) {
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
  const [categorizedExpenses, setCategorizedExpenses] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Define the initial columns configuration with pinning capability
  const initialColumns = [
    { key: "description", label: "Expense Name", visible: true, pinned: true, width: 180 },
    { key: "category", label: "Category", visible: true, width: 150 },
    { key: "amount", label: "Amount", visible: true, width: 120 },
    { key: "date", label: "Date", visible: true, width: 120 },
    { key: "recurring_type", label: "Recurrence", visible: true, width: 150 },
    { key: "vendor", label: "Vendor", visible: true, width: 150 },
    { key: "payment_method", label: "Payment Method", visible: true, width: 150 },
    { key: "notes", label: "Notes", visible: false, width: 200 }
  ];

  const { columns, visibleColumns, updateColumnVisibility } = useTableColumns(initialColumns);
  const { views, currentView, loadViews, saveView, selectView } = useTableViews("expenses");
  const { sortField, sortDirection, handleSort, sortedExpenses } = useExpensesSort(expenses || []);
  
  // Categorize expenses when they change
  useEffect(() => {
    if (Array.isArray(expenses)) {
      const categorized = categorizeExpenses(expenses);
      setCategorizedExpenses(categorized);
    }
  }, [expenses]);

  // Log received expenses for debugging
  useEffect(() => {
    console.log(`ExpensesTable received ${expenses?.length || 0} expenses`);
  }, [expenses]);

  const { 
    searchQuery, 
    setSearchQuery, 
    viewDetailsId, 
    setViewDetailsId,
    categoryFilter,
    setCategoryFilter,
    filteredExpenses 
  } = useExpensesTableData(
    activeCategory ? 
      categorizedExpenses.filter(exp => 
        exp.detected_category === activeCategory
      ) : 
      sortedExpenses
  );

  // Function to handle view selection
  const handleApplyView = (view) => {
    setSearchQuery(view.filters?.searchQuery || '');
    setCategoryFilter(view.filters?.categoryFilter || '');
    selectView(view);
  };

  // Load views when component mounts
  useEffect(() => {
    loadViews();
  }, []);

  // Get the expense being viewed in the details dialog
  const expenseDetails = viewDetailsId 
    ? expenses?.find(expense => expense?.id === viewDetailsId) 
    : null;

  // Handle expense deletion
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      const success = await deleteTransaction(id);
      if (success && onDataChange) {
        onDataChange();
      }
    }
  };
  
  // Handle selecting all expenses
  const handleSelectAll = () => {
    if (selectedExpenses.length === filteredExpenses.length) {
      setSelectedExpenses([]);
    } else {
      setSelectedExpenses(filteredExpenses.map(expense => expense.id));
    }
  };
  
  // Handle selecting individual expense
  const handleSelectExpense = (expenseId: string) => {
    setSelectedExpenses(prev => 
      prev.includes(expenseId)
        ? prev.filter(id => id !== expenseId)
        : [...prev, expenseId]
    );
  };
  
  // Handle multiple expenses deletion
  const handleDeleteSelected = async () => {
    if (selectedExpenses.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedExpenses.length} selected expenses?`)) {
      let success = true;
      for (const id of selectedExpenses) {
        const result = await deleteTransaction(id);
        if (!result) success = false;
      }
      
      if (success && onDataChange) {
        onDataChange();
        setSelectedExpenses([]);
      }
    }
  };

  // Handle expense update (after inline editing)
  const handleUpdateExpense = async (expenseId: string, field: string, value: any) => {
    console.log("Update expense:", expenseId, field, value);
    // TODO: Implement actual API call to update expense
    // For now just show it's working via console
  };

  // Get category summary data - fixed to ensure proper typing
  const categorySummary = Object.entries(
    categorizedExpenses.reduce((acc: Record<string, number>, expense) => {
      const category = expense.detected_category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + expense.amount;
      return acc;
    }, {})
  ).sort((a, b) => b[1] as number - a[1] as number);

  // Handle category filter change
  const handleCategoryChange = (category: string | null) => {
    setActiveCategory(category);
  };

  return (
    <div className="space-y-6">
      <ExpensesFinanceToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        columns={columns}
        onColumnVisibilityChange={updateColumnVisibility}
        savedViews={views}
        onViewSelect={handleApplyView}
        onViewSave={(name) => saveView(name, {
          filters: { searchQuery, categoryFilter },
          columns
        })}
        selectedCount={selectedExpenses.length}
        onDeleteSelected={handleDeleteSelected}
        onAddExpense={() => {}}
        onExport={() => alert("Export feature coming soon")}
        categorySummary={categorySummary}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />

      <div className="spreadsheet-container">
        <SpreadsheetTable showGrid containerClassName="border-none shadow rounded-md">
          <Table variant="striped" size="sm">
            <TableHeader>
              <ExpensesTableHeader 
                visibleColumns={visibleColumns}
                onSort={handleSort}
                selectedExpenses={selectedExpenses}
                expenses={filteredExpenses}
                onSelectAll={handleSelectAll}
                sortColumn={sortField}
                sortDirection={sortDirection}
              />
            </TableHeader>
            <TableBody>
              {/* Always show "Add Expense" row at the top */}
              <AddExpenseRow 
                onExpenseAdded={onDataChange}
                visibleColumns={visibleColumns}
              />
              {isLoading ? (
                <ExpensesTableLoading colSpan={visibleColumns.length + 1} />
              ) : (
                <SpreadsheetExpensesBody
                  expenses={filteredExpenses}
                  visibleColumns={visibleColumns}
                  onViewDetails={setViewDetailsId}
                  onDelete={handleDelete}
                  selectedExpenses={selectedExpenses}
                  onSelectExpense={handleSelectExpense}
                  onUpdateExpense={handleUpdateExpense}
                />
              )}
            </TableBody>
          </Table>
        </SpreadsheetTable>
      </div>

      <ExpenseDetailsDialog 
        expense={expenseDetails}
        isOpen={!!viewDetailsId}
        onOpenChange={(open) => !open && setViewDetailsId(null)}
      />
      
      <style dangerouslySetInnerHTML={{ __html: `
        .spreadsheet-container {
          overflow: hidden;
          border-radius: 0.5rem;
          background: #121212;
          max-height: calc(100vh - 350px);
        }
        
        /* Custom scrollbar for spreadsheet */
        .spreadsheet-container ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .spreadsheet-container ::-webkit-scrollbar-track {
          background: #1a1a1a;
        }
        
        .spreadsheet-container ::-webkit-scrollbar-thumb {
          background: #333333;
          border-radius: 4px;
        }
        
        .spreadsheet-container ::-webkit-scrollbar-thumb:hover {
          background: #555555;
        }
        
        .spreadsheet-container ::-webkit-scrollbar-corner {
          background: #1a1a1a;
        }
      `}} />
    </div>
  );
}
