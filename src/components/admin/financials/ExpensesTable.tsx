
import { useState, useMemo } from "react";
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

interface ExpensesTableProps {
  expenses: FinancialTransaction[];
  isLoading?: boolean;
  onDataChange?: () => void;
}

export function ExpensesTable({ expenses = [], isLoading = false, onDataChange }: ExpensesTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewDetailsId, setViewDetailsId] = useState<string | null>(null);
  
  // Get sorted expenses using custom hook
  const { sortField, sortDirection, handleSort, sortedExpenses } = useExpensesSort(expenses);
  
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

  return (
    <div className="space-y-4">
      <ExpensesTableHeader 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("name")}>
                  Expense Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("category")}>
                  Category
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("amount")}>
                  Amount
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("date")}>
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Recurrence</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredExpenses.length > 0 ? (
              filteredExpenses.map(expense => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.description}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {expense.category?.name || "Uncategorized"}
                    </span>
                  </TableCell>
                  <TableCell>£{expense.amount.toFixed(2)}</TableCell>
                  <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                  <TableCell>
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
                  <TableCell>{expense.vendor?.name || "—"}</TableCell>
                  <TableCell>{expense.payment_method?.name || "—"}</TableCell>
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
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
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
