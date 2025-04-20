import { useState } from "react";
import { TableRow } from "@/components/ui/table";
import { FinancialTransaction } from "@/utils/financial";
import { ExpenseRowActions } from "../ExpenseRowActions";
import { TableColumn } from "@/hooks/useTableColumns";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { EditableCell } from "../table/EditableCell";

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
  // Track which cell is currently being edited
  const [editingCell, setEditingCell] = useState<{id: string, field: string} | null>(null);
  
  // List of recurring type options
  const recurringOptions = [
    { value: "one-time", label: "One-Time" },
    { value: "monthly", label: "Monthly" },
    { value: "annual", label: "Annual" }
  ];

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

  const handleCellUpdate = (expenseId: string, field: string, value: any) => {
    onUpdateExpense(expenseId, field, value);
    setEditingCell(null);
  };

  const getBadgeColor = (type: string | null) => {
    switch (type) {
      case 'monthly': return 'bg-green-100/50 text-green-800 border-green-200';
      case 'annual': return 'bg-purple-100/50 text-purple-800 border-purple-200';
      default: return 'bg-amber-100/50 text-amber-800 border-amber-200';
    }
  };

  return (
    <>
      {expenses.map(expense => {
        const isSelected = selectedExpenses.includes(expense.id);
        
        return (
          <TableRow 
            key={expense.id}
            className={cn(
              isSelected ? "bg-muted/20" : ""
            )}
            isSelected={isSelected}
          >
            <td className="sticky left-0 bg-inherit z-10 w-10 p-2 text-center">
              <Checkbox 
                checked={isSelected}
                onCheckedChange={() => onSelectExpense(expense.id)}
                aria-label={`Select ${expense.description}`}
              />
            </td>
            
            {visibleColumns.map((column) => {
              switch (column.key) {
                case "description":
                  return (
                    <EditableCell
                      key={`${expense.id}-${column.key}`}
                      value={expense.description || ""}
                      onChange={(value) => handleCellUpdate(expense.id, "description", value)}
                      className="font-medium"
                    />
                  );
                  
                case "category":
                  return (
                    <EditableCell
                      key={`${expense.id}-${column.key}`}
                      value={expense.category?.name || "Uncategorized"}
                      onChange={(value) => handleCellUpdate(expense.id, "category_id", value)}
                      type="select"
                      options={[
                        { value: "", label: "Uncategorized" },
                        { value: "office", label: "Office Supplies" },
                        { value: "software", label: "Software" },
                        { value: "marketing", label: "Marketing" },
                        { value: "travel", label: "Travel" },
                        { value: "utilities", label: "Utilities" }
                      ]}
                      formatter={(value) => (
                        <Badge variant="outline" className="bg-blue-100/50 text-blue-800 border-blue-200">
                          {value}
                        </Badge>
                      )}
                    />
                  );
                  
                case "amount":
                  return (
                    <EditableCell
                      key={`${expense.id}-${column.key}`}
                      value={expense.amount}
                      onChange={(value) => handleCellUpdate(expense.id, "amount", value)}
                      type="currency"
                      align="right"
                      className="font-medium"
                    />
                  );
                  
                case "date":
                  return (
                    <EditableCell
                      key={`${expense.id}-${column.key}`}
                      value={expense.date}
                      onChange={(value) => handleCellUpdate(expense.id, "date", value)}
                      type="date"
                    />
                  );
                  
                case "recurring_type":
                  return (
                    <EditableCell
                      key={`${expense.id}-${column.key}`}
                      value={expense.recurring_type || "one-time"}
                      onChange={(value) => handleCellUpdate(expense.id, "recurring_type", value)}
                      type="select"
                      options={[
                        { value: "one-time", label: "One-Time" },
                        { value: "monthly", label: "Monthly" },
                        { value: "annual", label: "Annual" }
                      ]}
                      formatter={(value) => (
                        <Badge className={cn("font-medium", getBadgeColor(value))}>
                          {value === 'monthly' ? 'Monthly' : 
                           value === 'annual' ? 'Annual' : 'One-Time'}
                        </Badge>
                      )}
                    />
                  );
                  
                case "vendor":
                  return (
                    <EditableCell
                      key={`${expense.id}-${column.key}`}
                      value={expense.vendor?.name || "—"}
                      onChange={(value) => handleCellUpdate(expense.id, "vendor_id", value)}
                    />
                  );
                  
                case "payment_method":
                  return (
                    <EditableCell
                      key={`${expense.id}-${column.key}`}
                      value={expense.payment_method?.name || "—"}
                      onChange={(value) => handleCellUpdate(expense.id, "payment_method_id", value)}
                    />
                  );

                default:
                  return (
                    <td key={`${expense.id}-${column.key}`}>—</td>
                  );
              }
            })}
            
            <td className="text-right">
              <ExpenseRowActions 
                expenseId={expense.id}
                onViewDetails={onViewDetails}
                onDelete={onDelete}
              />
            </td>
          </TableRow>
        );
      })}
    </>
  );
}
