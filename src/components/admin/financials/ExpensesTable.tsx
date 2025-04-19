import { useState, useMemo, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ArrowUpDown, Loader2 } from "lucide-react";
import { FinancialTransaction, deleteTransaction } from "@/utils/financial";
import { ExpenseDetailsDialog } from "./ExpenseDetailsDialog";
import { ExpensesTableHeader } from "./ExpensesTableHeader";
import { ExpenseRowActions } from "./ExpenseRowActions";
import { useExpensesSort } from "@/hooks/useExpensesSort";
import { useTableColumns, TableColumn } from "@/hooks/useTableColumns";
import { useTableViews, SavedView } from "@/hooks/useTableViews";

interface ExpensesTableProps {
  expenses: FinancialTransaction[];
  isLoading?: boolean;
  onDataChange?: () => void;
}

export function ExpensesTable({ expenses = [], isLoading = false, onDataChange }: ExpensesTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewDetailsId, setViewDetailsId] = useState<string | null>(null);
  
  // Define the initial columns configuration
  const initialColumns: TableColumn[] = [
    { key: "description", label: "Expense Name", visible: true },
    { key: "category", label: "Category", visible: true },
    { key: "amount", label: "Amount", visible: true },
    { key: "date", label: "Date", visible: true },
    { key: "recurring_type", label: "Recurrence", visible: true },
    { key: "vendor", label: "Vendor", visible: true },
    { key: "payment_method", label: "Payment Method", visible: true }
  ];
  
  // Use our custom hooks
  const { columns, visibleColumns, updateColumnVisibility } = useTableColumns(initialColumns);
  const { views, currentView, loadViews, saveView, selectView } = useTableViews("expenses");
  
  // Get sorted expenses using custom hook
  const { sortField, sortDirection, handleSort, sortedExpenses } = useExpensesSort(expenses);
  
  // Load saved views on component mount
  useEffect(() => {
    loadViews();
  }, []);
  
  // Filter expenses based on search query
  const filteredExpenses = useMemo(() => {
    return sortedExpenses.filter(expense => 
      expense.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.vendor?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${expense.amount}`.includes(searchQuery)
    );
  }, [sortedExpenses, searchQuery]);

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

  // Handle saving the current view
  const handleSaveView = (name: string) => {
    const currentState = {
      filters: { searchQuery },
      columns: columns
    };
    saveView(name, currentState);
  };

  // Apply a saved view
  const handleApplyView = (view: SavedView) => {
    selectView(view);
    if (view.filters) {
      setSearchQuery(view.filters.searchQuery || "");
    }
    if (view.columns) {
      updateColumnVisibility(view.columns);
    }
  };

  return (
    <div className="space-y-4">
      <ExpensesTableHeader 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        columns={columns}
        onColumnVisibilityChange={updateColumnVisibility}
        savedViews={views}
        onViewSelect={selectView}
        onViewSave={(name) => saveView(name, {
          filters: { searchQuery },
          columns
        })}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.map(col => (
                col.key === "description" ? (
                  <TableHead key={col.key} className="w-[250px]">
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort("name")}>
                      {col.label}
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                ) : col.key === "category" ? (
                  <TableHead key={col.key}>
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort("category")}>
                      {col.label}
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                ) : col.key === "amount" ? (
                  <TableHead key={col.key}>
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort("amount")}>
                      {col.label}
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                ) : col.key === "date" ? (
                  <TableHead key={col.key}>
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort("date")}>
                      {col.label}
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                ) : (
                  <TableHead key={col.key}>{col.label}</TableHead>
                )
              ))}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={visibleColumns.length + 1} className="text-center py-8">
                  <div className="flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredExpenses.length > 0 ? (
              filteredExpenses.map(expense => (
                <TableRow key={expense.id}>
                  {visibleColumns.map(col => {
                    if (col.key === "description") {
                      return <TableCell key={col.key} className="font-medium">{expense.description}</TableCell>;
                    } else if (col.key === "category") {
                      return (
                        <TableCell key={col.key}>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {expense.category?.name || "Uncategorized"}
                          </span>
                        </TableCell>
                      );
                    } else if (col.key === "amount") {
                      return <TableCell key={col.key}>£{expense.amount.toFixed(2)}</TableCell>;
                    } else if (col.key === "date") {
                      return <TableCell key={col.key}>{new Date(expense.date).toLocaleDateString()}</TableCell>;
                    } else if (col.key === "recurring_type") {
                      return (
                        <TableCell key={col.key}>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            expense.recurring_type === 'monthly' 
                              ? 'bg-green-100 text-green-800' 
                              : expense.recurring_type === 'annual'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {expense.recurring_type === 'monthly' 
                              ? 'Monthly' 
                              : expense.recurring_type === 'annual'
                              ? 'Annual'
                              : 'One-Time'}
                          </span>
                        </TableCell>
                      );
                    } else if (col.key === "vendor") {
                      return <TableCell key={col.key}>{expense.vendor?.name || "—"}</TableCell>;
                    } else if (col.key === "payment_method") {
                      return <TableCell key={col.key}>{expense.payment_method?.name || "—"}</TableCell>;
                    } else {
                      return <TableCell key={col.key}>—</TableCell>;
                    }
                  })}
                  <TableCell className="text-right">
                    <ExpenseRowActions 
                      expenseId={expense.id}
                      onViewDetails={setViewDetailsId}
                      onDelete={handleDelete}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={visibleColumns.length + 1} className="text-center py-8 text-muted-foreground">
                  No expenses found. Try adjusting your filters or add a new expense.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Expense Details Dialog */}
      <ExpenseDetailsDialog 
        expense={expenseDetails}
        isOpen={!!viewDetailsId}
        onOpenChange={(open) => !open && setViewDetailsId(null)}
      />
    </div>
  );
}
