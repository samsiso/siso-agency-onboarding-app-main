
import { FinancialSummary } from '../types';
import { MonthlyRevenue } from '../types/summaryTypes';

/**
 * Creates monthly revenue data from raw transaction data
 */
export function createMonthlyRevenueData(
  transactionsByMonth: { [key: string]: { revenue: number; expense: number } },
  monthNames: string[]
): MonthlyRevenue[] {
  return Object.entries(transactionsByMonth)
    .map(([monthKey, data]) => {
      const [year, monthStr] = monthKey.split('-');
      const monthIndex = parseInt(monthStr, 10) - 1;
      
      return {
        name: monthNames[monthIndex],
        revenue: data.revenue || 0,
        expense: data.expense || 0
      };
    })
    .reverse();
}

/**
 * Calculates profit margin percentage
 */
export function calculateProfitMargin(revenue: number, expenses: number): number {
  if (revenue <= 0) return 0;
  const profit = revenue - expenses;
  return Math.round((profit / revenue) * 100);
}

/**
 * Creates a default financial summary object with empty values
 */
export function createDefaultSummary(): FinancialSummary {
  return {
    totalRevenue: 0,
    totalExpenses: 0,
    profitMargin: 0,
    outstandingAmount: 0,
    revenueByMonth: []
  };
}
