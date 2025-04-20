
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
import { ArrowUpDown, Download, Filter, Plus, Trash2 } from "lucide-react";
import { SpreadsheetExpensesBody } from "./expense/SpreadsheetExpensesBody";

export function ExpensesTable({ expenses = [], isLoading = false, onDataChange }) {
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
  
  // Log received expenses for debugging
  useEffect(() => {
    console.log(`ExpensesTable received ${expenses?.length || 0} expenses`);
  }, [expenses]);
  
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
  const { 
    searchQuery, 
    setSearchQuery, 
    viewDetailsId, 
    setViewDetailsId, 
    filteredExpenses 
  } = useExpensesTableData(sortedExpenses);

  // Function to handle view selection
  const handleApplyView = (view) => {
    setSearchQuery(view.filters?.searchQuery || '');
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
          filters: { searchQuery },
          columns
        })}
        selectedCount={selectedExpenses.length}
        onDeleteSelected={handleDeleteSelected}
        onAddExpense={() => alert("Add expense feature coming soon")}
        onExport={() => alert("Export feature coming soon")}
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
      
      <style jsx global>{`
        .spreadsheet-container {
          overflow: hidden;
          border-radius: 0.5rem;
          background: white;
        }
        
        /* Custom scrollbar for spreadsheet */
        .spreadsheet-container ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .spreadsheet-container ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        .spreadsheet-container ::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }
        
        .spreadsheet-container ::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        
        .spreadsheet-container ::-webkit-scrollbar-corner {
          background: #f1f1f1;
        }
      `}</style>
    </div>
  );
}
