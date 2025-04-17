
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { FinancialSummary } from './types';

// Get financial summary data for dashboard
export async function getFinancialSummary(period = 'month'): Promise<FinancialSummary> {
  try {
    // Get current date and calculate date ranges
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), quarter * 3, 1);
        break;
      case 'month':
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }
    
    // Format dates for queries
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedNowDate = now.toISOString().split('T')[0];
    
    // Fetch revenue transactions
    const { data: revenueData, error: revenueError } = await supabase
      .from('financial_transactions')
      .select('amount')
      .eq('type', 'revenue')
      .gte('date', formattedStartDate)
      .lte('date', formattedNowDate);
      
    if (revenueError) throw revenueError;
    
    // Fetch expense transactions
    const { data: expenseData, error: expenseError } = await supabase
      .from('financial_transactions')
      .select('amount')
      .eq('type', 'expense')
      .gte('date', formattedStartDate)
      .lte('date', formattedNowDate);
      
    if (expenseError) throw expenseError;
    
    // Fetch outstanding invoices
    const { data: outstandingData, error: outstandingError } = await supabase
      .from('invoices')
      .select('amount')
      .in('status', ['pending', 'overdue']);
      
    if (outstandingError) throw outstandingError;
    
    // Calculate totals - ensure we're parsing the values correctly
    const totalRevenue = revenueData.reduce((sum, item) => sum + Number(item.amount), 0);
    const totalExpenses = expenseData.reduce((sum, item) => sum + Number(item.amount), 0);
    const profitMargin = totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 : 0;
    const outstandingAmount = outstandingData.reduce((sum, item) => sum + Number(item.amount), 0);
    
    // Get monthly data for charts (simplified mock data for now)
    // In a real implementation, you would fetch this from the database grouped by month
    const revenueByMonth = [
      { name: 'Jan', revenue: 4000, expense: 2400 },
      { name: 'Feb', revenue: 3000, expense: 1398 },
      { name: 'Mar', revenue: 2000, expense: 9800 },
      { name: 'Apr', revenue: 2780, expense: 3908 },
      { name: 'May', revenue: 1890, expense: 4800 },
      { name: 'Jun', revenue: 2390, expense: 3800 },
      { name: 'Jul', revenue: 3490, expense: 4300 },
    ];
    
    return {
      totalRevenue,
      totalExpenses,
      profitMargin,
      outstandingAmount,
      revenueByMonth
    };
  } catch (error) {
    console.error('Error fetching financial summary:', error);
    toast({
      title: 'Error',
      description: 'Failed to load financial summary',
      variant: 'destructive',
    });
    
    // Return default values in case of error
    return {
      totalRevenue: 0,
      totalExpenses: 0,
      profitMargin: 0,
      outstandingAmount: 0,
      revenueByMonth: []
    };
  }
}
