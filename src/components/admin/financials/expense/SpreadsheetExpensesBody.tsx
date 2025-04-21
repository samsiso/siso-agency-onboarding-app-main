
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

  // Category type options
  const recurringOptions = [
    { value: "one-time", label: "One-Time" },
    { value: "monthly", label: "Monthly" },
    { value: "annual", label: "Annual" }
  ];
  // Helper for badge styling by recurring type
  const getBadgeColor = (type: string | null) => {
    switch (type) {
      case 'monthly': return 'bg-green-900/30 text-green-300 border-green-800/50';
      case 'annual': return 'bg-purple-900/30 text-purple-300 border-purple-800/50';
      default: return 'bg-amber-900/30 text-amber-300 border-amber-800/50';
    }
  };

  // Helper for category badge color
  const getCategoryBadgeColor = (category: string) => {
    if (!category || category === "Uncategorized") return "bg-gray-900/20 text-gray-400 border-gray-700";
    if (category.toLowerCase().includes("software")) return "bg-blue-900/30 text-blue-300 border-blue-800/60";
    if (category.toLowerCase().includes("marketing")) return "bg-pink-900/25 text-pink-300 border-pink-900/40";
    if (category.toLowerCase().includes("office")) return "bg-yellow-900/30 text-yellow-300 border-yellow-700/50";
    if (category.toLowerCase().includes("utilities")) return "bg-green-700/20 text-green-400 border-green-900/30";
    if (category.toLowerCase().includes("travel")) return "bg-cyan-900/10 text-cyan-300 border-cyan-900/40";
    return "bg-purple-900/20 text-purple-200 border-purple-800/40";
  };

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

  return (
    <>
      {expenses.map(expense => {
        const isSelected = selectedExpenses.includes(expense.id);

        return (
          <TableRow 
            key={expense.id}
            className={cn(
              "transition-colors hover:bg-muted/5 group",
              isSelected ? "bg-muted/20" : ""
            )}
            data-state={isSelected ? "selected" : undefined}
          >
            {/* Checkbox sticky left */}
            <td className="sticky left-0 bg-background z-30 w-10 p-2 text-center border-r border-border/15">
              <Checkbox 
                checked={isSelected}
                onCheckedChange={() => onSelectExpense(expense.id)}
                aria-label={`Select ${expense.description}`}
              />
            </td>
            
            {/* Spreadsheet Columns */}
            {visibleColumns.map((column, colIdx) => {
              // Freeze first (description), second (category) columns
              let stickyStyle = {};
              let stickyClass = "";
              if (column.key === "description") {
                stickyStyle = { left: 48 }; // 48px for checkbox
                stickyClass = "sticky bg-background z-20 shadow-[2px_0px_4px_-2px_rgba(0,0,0,0.01)]";
              }
              if (column.key === "category") {
                stickyStyle = { left: 220 };
                stickyClass = "sticky bg-background z-20 shadow-[2px_0px_4px_-2px_rgba(0,0,0,0.01)]";
              }

              switch (column.key) {
                case "description":
                  return (
                    <EditableCell
                      key={`${expense.id}-desc`}
                      value={expense.description || ""}
                      onChange={(value) => handleCellUpdate(expense.id, "description", value)}
                      className={cn(
                        "font-medium group-hover:bg-vivid-purple/10 focus-within:bg-vivid-purple/20 aria-[editing=true]:bg-vivid-purple/30 transition-colors min-w-[160px] max-w-[260px]",
                        stickyClass
                      )}
                      style={stickyStyle}
                      inputClassName="font-normal"
                    />
                  );
                case "category":
                  // Extracted and shown as a badge (editable)
                  return (
                    <EditableCell
                      key={`${expense.id}-cat`}
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
                        <Badge variant="outline" className={cn(
                          "ml-1 mr-1 px-2", getCategoryBadgeColor(value)
                        )}>
                          {value || "Uncategorized"}
                        </Badge>
                      )}
                      className={cn(
                        "min-w-[140px] max-w-[180px] group-hover:bg-vivid-purple/10 focus-within:bg-vivid-purple/20 aria-[editing=true]:bg-vivid-purple/30 transition-colors",
                        stickyClass
                      )}
                      style={stickyStyle}
                      inputClassName="font-normal"
                    />
                  );
                case "amount":
                  return (
                    <EditableCell
                      key={`${expense.id}-amt`}
                      value={expense.amount}
                      onChange={(value) => handleCellUpdate(expense.id, "amount", value)}
                      type="currency"
                      align="right"
                      className="font-medium min-w-[100px] max-w-[140px] text-right group-hover:bg-green-800/10"
                    />
                  );
                case "date":
                  return (
                    <EditableCell
                      key={`${expense.id}-date`}
                      value={expense.date}
                      onChange={(value) => handleCellUpdate(expense.id, "date", value)}
                      type="date"
                      className="min-w-[116px] max-w-[140px] group-hover:bg-blue-900/10"
                    />
                  );
                case "recurring_type":
                  return (
                    <EditableCell
                      key={`${expense.id}-rec`}
                      value={expense.recurring_type || "one-time"}
                      onChange={(value) => handleCellUpdate(expense.id, "recurring_type", value)}
                      type="select"
                      options={recurringOptions}
                      formatter={(value) => (
                        <Badge className={cn("font-medium px-2", getBadgeColor(value))}>
                          {value === 'monthly' ? 'Monthly' : value === 'annual' ? 'Annual' : 'One-Time'}
                        </Badge>
                      )}
                      className="min-w-[106px] max-w-[120px] group-hover:bg-orange-900/10"
                    />
                  );
                case "vendor":
                  // Extract vendor details and show (not editable for now)
                  return (
                    <td
                      key={`${expense.id}-vendor`}
                      className="border-r border-border/10 px-3 py-2.5 min-w-[110px] max-w-[200px] whitespace-nowrap"
                    >
                      <span className={cn(
                        "text-primary-foreground/90 font-normal mr-1",
                        // subtle secondary color when empty
                        !expense.vendor?.name && "text-muted-foreground italic"
                      )}>
                        {expense.vendor?.name || "—"}
                      </span>
                    </td>
                  );
                case "payment_method":
                  return (
                    <EditableCell
                      key={`${expense.id}-pay`}
                      value={expense.payment_method?.name || "—"}
                      onChange={(value) => handleCellUpdate(expense.id, "payment_method_id", value)}
                      className="min-w-[110px] max-w-[160px] group-hover:bg-gray-600/10"
                    />
                  );
                default:
                  return (
                    <td
                      key={`${expense.id}-${column.key}`}
                      className="border-r border-border/10 px-3 py-2.5 min-w-[90px]"
                    >—</td>
                  );
              }
            })}

            <td className="text-right bg-background sticky right-0 z-20 min-w-[64px]">
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
