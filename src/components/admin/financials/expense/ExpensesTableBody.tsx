
import { TableRow, TableCell } from "@/components/ui/table";
import { FinancialTransaction } from "@/utils/financial";
import { ExpenseRowActions } from "../ExpenseRowActions";
import { TableColumn } from "@/hooks/useTableColumns";

interface ExpensesTableBodyProps {
  expenses: FinancialTransaction[];
  visibleColumns: TableColumn[];
  onViewDetails: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ExpensesTableBody({ 
  expenses, 
  visibleColumns, 
  onViewDetails, 
  onDelete 
}: ExpensesTableBodyProps) {
  if (expenses.length === 0) {
    return (
      <TableRow>
        <TableCell 
          colSpan={visibleColumns.length + 1} 
          className="text-center py-8 text-muted-foreground"
        >
          No expenses found. Try adjusting your filters or add a new expense.
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {expenses.map(expense => (
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
              onViewDetails={onViewDetails}
              onDelete={onDelete}
            />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
