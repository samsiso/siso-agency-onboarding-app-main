
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

// Types for financial data
export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  contact_email?: string;
  payment_terms?: string;
  is_active: boolean;
}

export interface PaymentMethod {
  id: string;
  name: string;
  is_active: boolean;
}

export interface FinancialTransaction {
  id: string;
  type: 'expense' | 'revenue';
  amount: number;
  currency: string;
  date: string;
  description?: string;
  category_id?: string;
  vendor_id?: string;
  payment_method_id?: string;
  recurring_type?: 'one-time' | 'monthly' | 'annual' | null;
  status: string;
  receipt_url?: string;
  notes?: string;
  
  // Joined data
  category?: ExpenseCategory;
  vendor?: Vendor;
  payment_method?: PaymentMethod;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  client_id: string;
  amount: number;
  currency: string;
  issue_date: string;
  due_date: string;
  status: 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled';
  payment_method_id?: string;
  notes?: string;
  
  // Joined data
  client?: {
    full_name: string;
    business_name?: string;
  };
  payment_method?: PaymentMethod;
}

// Fetch financial data
export async function fetchExpenseCategories(): Promise<ExpenseCategory[]> {
  try {
    const { data, error } = await supabase
      .from('expense_categories')
      .select('*')
      .order('name');
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching expense categories:', error);
    toast({
      title: 'Error',
      description: 'Failed to load expense categories',
      variant: 'destructive',
    });
    return [];
  }
}

export async function fetchVendors(): Promise<Vendor[]> {
  try {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .order('name');
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching vendors:', error);
    toast({
      title: 'Error',
      description: 'Failed to load vendors',
      variant: 'destructive',
    });
    return [];
  }
}

export async function fetchPaymentMethods(): Promise<PaymentMethod[]> {
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .order('name');
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    toast({
      title: 'Error',
      description: 'Failed to load payment methods',
      variant: 'destructive',
    });
    return [];
  }
}

export async function fetchTransactions(filters = {}): Promise<FinancialTransaction[]> {
  try {
    const query = supabase
      .from('financial_transactions')
      .select(`
        *,
        category:expense_categories(*),
        vendor:vendors(*),
        payment_method:payment_methods(*)
      `)
      .order('date', { ascending: false });
    
    // Apply filters if provided
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.eq(key, value);
      }
    });
    
    const { data, error } = await query;
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    toast({
      title: 'Error',
      description: 'Failed to load financial transactions',
      variant: 'destructive',
    });
    return [];
  }
}

export async function fetchInvoices(filters = {}): Promise<Invoice[]> {
  try {
    const query = supabase
      .from('invoices')
      .select(`
        *,
        client:profiles(full_name, business_name),
        payment_method:payment_methods(*)
      `)
      .order('issue_date', { ascending: false });
    
    // Apply filters if provided
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.eq(key, value);
      }
    });
    
    const { data, error } = await query;
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching invoices:', error);
    toast({
      title: 'Error',
      description: 'Failed to load invoices',
      variant: 'destructive',
    });
    return [];
  }
}

// Add a new expense category
export async function addExpenseCategory(category: Omit<ExpenseCategory, 'id'>): Promise<ExpenseCategory | null> {
  try {
    const { data, error } = await supabase
      .from('expense_categories')
      .insert(category)
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: 'Success',
      description: 'Expense category added successfully',
    });
    
    return data;
  } catch (error) {
    console.error('Error adding expense category:', error);
    toast({
      title: 'Error',
      description: 'Failed to add expense category',
      variant: 'destructive',
    });
    return null;
  }
}

// Add a new vendor
export async function addVendor(vendor: Omit<Vendor, 'id'>): Promise<Vendor | null> {
  try {
    const { data, error } = await supabase
      .from('vendors')
      .insert(vendor)
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: 'Success',
      description: 'Vendor added successfully',
    });
    
    return data;
  } catch (error) {
    console.error('Error adding vendor:', error);
    toast({
      title: 'Error',
      description: 'Failed to add vendor',
      variant: 'destructive',
    });
    return null;
  }
}

// Add a new transaction
export async function addTransaction(transaction: Omit<FinancialTransaction, 'id' | 'category' | 'vendor' | 'payment_method'>): Promise<FinancialTransaction | null> {
  try {
    const { data, error } = await supabase
      .from('financial_transactions')
      .insert(transaction)
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: 'Success',
      description: `${transaction.type === 'expense' ? 'Expense' : 'Revenue'} recorded successfully`,
    });
    
    return data;
  } catch (error) {
    console.error('Error adding transaction:', error);
    toast({
      title: 'Error',
      description: `Failed to record ${transaction.type === 'expense' ? 'expense' : 'revenue'}`,
      variant: 'destructive',
    });
    return null;
  }
}

// Add a new invoice
export async function addInvoice(invoice: Omit<Invoice, 'id' | 'client' | 'payment_method'>): Promise<Invoice | null> {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .insert(invoice)
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: 'Success',
      description: 'Invoice created successfully',
    });
    
    return data;
  } catch (error) {
    console.error('Error adding invoice:', error);
    toast({
      title: 'Error',
      description: 'Failed to create invoice',
      variant: 'destructive',
    });
    return null;
  }
}

// Delete a transaction
export async function deleteTransaction(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('financial_transactions')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    toast({
      title: 'Success',
      description: 'Transaction deleted successfully',
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    toast({
      title: 'Error',
      description: 'Failed to delete transaction',
      variant: 'destructive',
    });
    return false;
  }
}

// Update a transaction
export async function updateTransaction(
  id: string, 
  updates: Partial<Omit<FinancialTransaction, 'id' | 'category' | 'vendor' | 'payment_method'>>
): Promise<FinancialTransaction | null> {
  try {
    const { data, error } = await supabase
      .from('financial_transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: 'Success',
      description: 'Transaction updated successfully',
    });
    
    return data;
  } catch (error) {
    console.error('Error updating transaction:', error);
    toast({
      title: 'Error',
      description: 'Failed to update transaction',
      variant: 'destructive',
    });
    return null;
  }
}

// Get financial summary data for dashboard
export async function getFinancialSummary(period = 'month'): Promise<{
  totalRevenue: number;
  totalExpenses: number;
  profitMargin: number;
  outstandingAmount: number;
  revenueByMonth: { name: string; revenue: number; expense: number }[];
}> {
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
    
    // Calculate totals
    const totalRevenue = revenueData.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const totalExpenses = expenseData.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const profitMargin = totalRevenue > 0 ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 : 0;
    const outstandingAmount = outstandingData.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    
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
