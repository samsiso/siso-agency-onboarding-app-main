
import { TableRow } from "@/components/ui/table";
import { FinancialTransaction } from "@/utils/financial";
import { TableColumn } from "@/hooks/useTableColumns";
import { SpreadsheetExpensesRow } from "./SpreadsheetExpensesRow";

interface SpreadsheetExpensesBodyProps {
  expenses: FinancialTransaction[];
  visibleColumns: TableColumn[];
  onViewDetails: (id: string) => void;
  onDelete: (id: string) => void;
  selectedExpenses: string[];
  onSelectExpense: (id: string) => void;
  onUpdateExpense: (expenseId: string, field: string, value: any) => void;
}

export function SpreadsheetExpensesBody({
  expenses,
  visibleColumns,
  onViewDetails,
  onDelete,
  selectedExpenses,
  onSelectExpense,
  onUpdateExpense
}: SpreadsheetExpensesBodyProps) {
  if (expenses.length === 0) {
    return (
      <TableRow>
        <td 
          colSpan={visibleColumns.length + 2} 
          className="text-center py-8 text-muted-foreground"
        >
          No expenses found. Try adjusting your filters or add a new expense.
        </td>
      </TableRow>
    );
  }

  return (
    <>
      {expenses.map(expense => (
        <SpreadsheetExpensesRow
          key={expense.id}
          expense={expense}
          visibleColumns={visibleColumns}
          isSelected={selectedExpenses.includes(expense.id)}
          onSelectExpense={onSelectExpense}
          onViewDetails={onViewDetails}
          onDelete={onDelete}
          onUpdateExpense={onUpdateExpense}
        />
      ))}
    </>
  );
}
