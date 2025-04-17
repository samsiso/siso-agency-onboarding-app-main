
import { supabase } from '@/integrations/supabase/client';
import { FinancialTransaction } from './types';
import { transformTransactionData } from './utils/transactionTransformers';
import { transformEntityData } from './utils/relationshipUtils';

/**
 * Fetches financial transactions with related entity data
 * Uses explicit casting to break recursive type chains
 */
export async function fetchTransactions(): Promise<FinancialTransaction[]> {
  try {
    const { data, error } = await supabase
      .from('financial_transactions')
      .select(`
        *,
        category:category_id (*),
        vendor:vendor_id (*),
        payment_method:payment_method_id (*)
      `)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }

    // Use transformEntityData to break deep type instantiation chains
    return transformEntityData<FinancialTransaction>(data || [], transformTransactionData);
  } catch (err) {
    console.error('Unexpected error in fetchTransactions:', err);
    return [];
  }
}

/**
 * Fetches a single transaction by ID with related data
 * Uses explicit type handling to prevent deep instantiation chains
 */
export async function fetchTransactionById(transactionId: string): Promise<FinancialTransaction | null> {
  try {
    const { data, error } = await supabase
      .from('financial_transactions')
      .select(`
        *,
        category:category_id (*),
        vendor:vendor_id (*),
        payment_method:payment_method_id (*)
      `)
      .eq('id', transactionId)
      .single();

    if (error) {
      console.error('Error fetching transaction by ID:', error);
      return null;
    }

    return transformTransactionData(data);
  } catch (err) {
    console.error('Unexpected error in fetchTransactionById:', err);
    return null;
  }
}
