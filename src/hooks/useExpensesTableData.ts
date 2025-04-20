
import { useState, useMemo, useEffect } from "react";
import { FinancialTransaction } from "@/utils/financial";

export function useExpensesTableData(expenses: FinancialTransaction[] = []) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewDetailsId, setViewDetailsId] = useState<string | null>(null);
  
  // Log expenses received for debugging
  useEffect(() => {
    console.log(`useExpensesTableData received ${expenses.length} expenses`);
  }, [expenses]);
  
  // Filter expenses based on search query
  const filteredExpenses = useMemo(() => {
    if (!Array.isArray(expenses)) {
      console.warn("Invalid expenses data provided to useExpensesTableData");
      return [];
    }
    
    return expenses.filter(expense => {
      if (!expense) return false;
      
      const lowerQuery = searchQuery.toLowerCase();
      return (
        expense.description?.toLowerCase().includes(lowerQuery) ||
        expense.category?.name?.toLowerCase().includes(lowerQuery) ||
        expense.vendor?.name?.toLowerCase().includes(lowerQuery) ||
        `${expense.amount}`.includes(searchQuery)
      );
    });
  }, [expenses, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    viewDetailsId,
    setViewDetailsId,
    filteredExpenses,
  };
}
