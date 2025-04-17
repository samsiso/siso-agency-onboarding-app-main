
import { supabase } from '@/integrations/supabase/client';
import { FinancialSummary } from './types';
import { SummaryPeriod, SummaryFilters } from './types/summaryTypes';
import { fetchTransactions } from './transactionsApi';
import { 
  createMonthlyRevenueData, 
  calculateProfitMargin, 
  createDefaultSummary 
} from './utils/summaryTransformers';

/**
 * Calculate financial summary data
 */
export async function getFinancialSummary(period: SummaryPeriod = 'month'): Promise<FinancialSummary> {
  try {
    // Initialize the summary object with default values
    const summary = createDefaultSummary();

    // Get the start date based on the period
    const today = new Date();
    let startDate: Date;
    
    if (period === 'year') {
      startDate = new Date(today.getFullYear(), 0, 1); // Jan 1st of current year
    } else {
      startDate = new Date(today.getFullYear(), today.getMonth() - 5, 1); // 6 months ago
    }
    
    const startDateStr = startDate.toISOString().split('T')[0];

    // Fetch all transactions for the period
    const transactions = await fetchTransactions({});
    
    // Filter transactions by date
    const filteredTransactions = transactions.filter(tx => 
      new Date(tx.date) >= startDate
    );

    // Calculate total revenue and expenses
    filteredTransactions.forEach(tx => {
      if (tx.type === 'revenue') {
        summary.totalRevenue += Number(tx.amount);
      } else if (tx.type === 'expense') {
        summary.totalExpenses += Number(tx.amount);
      }
    });

    // Calculate profit margin
    summary.profitMargin = calculateProfitMargin(summary.totalRevenue, summary.totalExpenses);

    // Get revenue and expense by month for the chart
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize monthly data
    let monthlyData: { [key: string]: { revenue: number; expense: number } } = {};
    
    // Current month and year
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Initialize the last 6 months (or 12 months for year period)
    const monthsToShow = period === 'year' ? 12 : 6;
    
    for (let i = 0; i < monthsToShow; i++) {
      let monthIndex = currentMonth - i;
      let year = currentYear;
      
      if (monthIndex < 0) {
        monthIndex = 12 + monthIndex;
        year = currentYear - 1;
      }
      
      const monthKey = `${year}-${(monthIndex + 1).toString().padStart(2, '0')}`;
      monthlyData[monthKey] = {
        revenue: 0,
        expense: 0
      };
    }
    
    // Aggregate transactions by month
    filteredTransactions.forEach(tx => {
      const txDate = new Date(tx.date);
      const monthKey = `${txDate.getFullYear()}-${(txDate.getMonth() + 1).toString().padStart(2, '0')}`;
      
      // If we have this month in our data
      if (monthlyData[monthKey]) {
        if (tx.type === 'revenue') {
          monthlyData[monthKey].revenue += Number(tx.amount);
        } else if (tx.type === 'expense') {
          monthlyData[monthKey].expense += Number(tx.amount);
        }
      }
    });
    
    // Convert to array and sort by month
    summary.revenueByMonth = createMonthlyRevenueData(monthlyData, monthNames);

    // Get outstanding invoices amount
    await getOutstandingInvoicesAmount(summary);

    return summary;
  } catch (error) {
    console.error('Error getting financial summary:', error);
    return createDefaultSummary();
  }
}

/**
 * Fetch outstanding invoice amounts and add to summary
 */
async function getOutstandingInvoicesAmount(summary: FinancialSummary): Promise<void> {
  try {
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select('amount')
      .in('status', ['pending', 'overdue']);
      
    if (!error && invoices) {
      summary.outstandingAmount = invoices.reduce((sum, invoice) => sum + Number(invoice.amount), 0);
    }
  } catch (error) {
    console.error('Error fetching outstanding invoices:', error);
    // If there's an error, we'll leave the outstandingAmount as 0
  }
}
