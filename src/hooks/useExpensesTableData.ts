
import { useState, useMemo } from "react";
import { FinancialTransaction } from "@/utils/financial";

export function useExpensesTableData(expenses: FinancialTransaction[] = []) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewDetailsId, setViewDetailsId] = useState<string | null>(null);
  
  // Filter expenses based on search query
  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => 
      expense.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.vendor?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${expense.amount}`.includes(searchQuery)
    );
  }, [expenses, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    viewDetailsId,
    setViewDetailsId,
    filteredExpenses,
  };
}
