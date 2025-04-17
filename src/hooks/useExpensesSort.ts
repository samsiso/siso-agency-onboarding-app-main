
import { useState, useMemo } from "react";
import { FinancialTransaction } from "@/utils/financial";

type SortField = "name" | "category" | "amount" | "date";
type SortDirection = "asc" | "desc";

export function useExpensesSort(expenses: FinancialTransaction[]) {
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Handle sort toggling
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Sort expenses based on current sort state
  const sortedExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => {
      if (sortField === "amount") {
        return sortDirection === "asc" 
          ? a.amount - b.amount 
          : b.amount - a.amount;
      } else if (sortField === "date") {
        return sortDirection === "asc" 
          ? new Date(a.date).getTime() - new Date(b.date).getTime() 
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortField === "name") {
        const aVal = a.description || "";
        const bVal = b.description || "";
        return sortDirection === "asc" 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal);
      } else if (sortField === "category") {
        const aVal = a.category?.name || "";
        const bVal = b.category?.name || "";
        return sortDirection === "asc" 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal);
      }
      return 0;
    });
  }, [expenses, sortField, sortDirection]);

  return {
    sortField,
    sortDirection,
    handleSort,
    sortedExpenses
  };
}
