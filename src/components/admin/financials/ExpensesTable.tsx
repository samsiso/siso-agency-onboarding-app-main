
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
import { ExpensesToolbar } from "./table/ExpensesToolbar";

export function ExpensesTable({ expenses = [], isLoading = false, onDataChange }) {
  // Define the initial columns configuration
  const initialColumns = [
    { key: "description", label: "Expense Name", visible: true },
    { key: "category", label: "Category", visible: true },
    { key: "amount", label: "Amount", visible: true },
    { key: "date", label: "Date", visible: true },
    { key: "recurring_type", label: "Recurrence", visible: true },
    { key: "vendor", label: "Vendor", visible: true },
    { key: "payment_method", label: "Payment Method", visible: true }
  ];

  const { columns, visibleColumns, updateColumnVisibility } = useTableColumns(initialColumns);
  const { views, currentView, loadViews, saveView, selectView } = useTableViews("expenses");
  const { sortField, sortDirection, handleSort, sortedExpenses } = useExpensesSort(expenses);
  const { 
    searchQuery, 
    setSearchQuery, 
    viewDetailsId, 
    setViewDetailsId, 
    filteredExpenses 
  } = useExpensesTableData(sortedExpenses);

  // Added handleApplyView function to resolve the undefined error
  const handleApplyView = (view) => {
    // Set search query and column visibility based on the selected view
    setSearchQuery(view.filters?.searchQuery || '');
    selectView(view);
  };

  // Get the expense being viewed in the details dialog
  const expenseDetails = viewDetailsId 
    ? expenses.find(expense => expense.id === viewDetailsId) 
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

  return (
    <div className="space-y-4">
      <ExpensesToolbar
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
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <ExpensesTableHeader 
              visibleColumns={visibleColumns} 
              onSort={handleSort} 
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
              />
            )}
          </TableBody>
        </Table>
      </div>

      <ExpenseDetailsDialog 
        expense={expenseDetails}
        isOpen={!!viewDetailsId}
        onOpenChange={(open) => !open && setViewDetailsId(null)}
      />
    </div>
  );
}
