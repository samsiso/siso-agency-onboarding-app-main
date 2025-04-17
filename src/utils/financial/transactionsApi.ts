import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { FinancialTransaction, ExpenseCategory, Vendor, PaymentMethod } from './types';

interface BaseSupabaseEntity {
  id: string;
}

interface SupabaseTransactionResult extends BaseSupabaseEntity {
  type: string;
  amount: number;
  currency: string;
  date: string;
  description?: string;
  category_id?: string;
  vendor_id?: string;
  payment_method_id?: string;
  recurring_type?: string | null;
  status: string;
  receipt_url?: string;
  notes?: string;
  category?: any;
  vendor?: any;
  payment_method?: any;
}

function isValidRelationship(obj: any): boolean {
  return obj && 
         typeof obj === 'object' && 
         !('code' in obj) && 
         !('message' in obj) && 
         !('details' in obj);
}

export async function fetchTransactions(filters: Record<string, any> = {}): Promise<FinancialTransaction[]> {
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
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        query.eq(key, value);
      }
    });
    
    const { data, error } = await query;
      
    if (error) throw error;
    
    const transformedData = (data || []).map((item: any) => {
      return {
        ...item,
        type: item.type as 'expense' | 'revenue',
        recurring_type: item.recurring_type as 'one-time' | 'monthly' | 'annual' | null,
        category: isValidRelationship(item.category) ? item.category as ExpenseCategory : undefined,
        vendor: isValidRelationship(item.vendor) ? item.vendor as Vendor : undefined,
        payment_method: isValidRelationship(item.payment_method) ? item.payment_method as PaymentMethod : undefined
      };
    });
    
    return transformedData;
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

export async function addTransaction(
  transaction: Omit<FinancialTransaction, 'id' | 'category' | 'vendor' | 'payment_method'>
): Promise<FinancialTransaction | null> {
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
    
    return {
      ...data,
      type: data.type as 'expense' | 'revenue',
      recurring_type: data.recurring_type as 'one-time' | 'monthly' | 'annual' | null
    };
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
    
    return {
      ...data,
      type: data.type as 'expense' | 'revenue',
      recurring_type: data.recurring_type as 'one-time' | 'monthly' | 'annual' | null
    };
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
