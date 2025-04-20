
import { useState } from "react";
import { Table, TableBody, TableHeader } from "@/components/ui/table";
import { deleteTransaction } from "@/utils/financial";
import { ExpenseDetailsDialog } from "./ExpenseDetailsDialog";
import { useExpensesSort } from "@/hooks/useExpensesSort";
import { useTableColumns } from "@/hooks/useTableColumns";
import { useTableViews } from "@/hooks/useTableViews";
import { useExpensesTableData } from "@/hooks/useExpensesTableData";
import { ExpensesTableHeader } from "./expense/ExpensesTableHeader";
import { ExpensesTableBody } from "./expense/ExpensesTableBody";
import { ExpensesTableLoading } from "./expense/ExpensesTableLoading";
import { ScrollableTable } from "../clients/ScrollableTable";
import { ExpensesFinanceToolbar } from "./table/ExpensesFinanceToolbar";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Download, Filter, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";

export function ExpensesTable({ expenses = [], isLoading = false, onDataChange }) {
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
  
  // Log received expenses for debugging
  useEffect(() => {
    console.log(`ExpensesTable received ${expenses?.length || 0} expenses`);
  }, [expenses]);
  
  // Define the initial columns configuration with pinning capability
  const initialColumns = [
    { key: "description", label: "Expense Name", visible: true, pinned: true },
    { key: "category", label: "Category", visible: true },
    { key: "amount", label: "Amount", visible: true },
    { key: "date", label: "Date", visible: true },
    { key: "recurring_type", label: "Recurrence", visible: true },
    { key: "vendor", label: "Vendor", visible: true },
    { key: "payment_method", label: "Payment Method", visible: true }
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

  // Get pinned columns for the ScrollableTable
  const pinnedColumns = visibleColumns.filter(col => col.pinned) || [];

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

      <ScrollableTable pinnedColumns={pinnedColumns}>
        <Table>
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
              <ExpensesTableBody
                expenses={filteredExpenses}
                visibleColumns={visibleColumns}
                onViewDetails={setViewDetailsId}
                onDelete={handleDelete}
                selectedExpenses={selectedExpenses}
                onSelectExpense={handleSelectExpense}
              />
            )}
          </TableBody>
        </Table>
      </ScrollableTable>

      <ExpenseDetailsDialog 
        expense={expenseDetails}
        isOpen={!!viewDetailsId}
        onOpenChange={(open) => !open && setViewDetailsId(null)}
      />
    </div>
  );
}
