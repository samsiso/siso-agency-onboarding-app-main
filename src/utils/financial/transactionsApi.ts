
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { FinancialTransaction } from './types';
import { RawTransactionData, TransactionFilters } from './types/transactionTypes';
import { transformEntityData } from './utils/relationshipUtils';
import { transformTransactionData } from './utils/transactionTransformers';

export async function fetchTransactions(filters: TransactionFilters = {}): Promise<FinancialTransaction[]> {
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
    
    // Use type assertion to avoid deep instantiation errors
    return transformEntityData<FinancialTransaction>(
      (data || []) as RawTransactionData[], 
      transformTransactionData
    );
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
