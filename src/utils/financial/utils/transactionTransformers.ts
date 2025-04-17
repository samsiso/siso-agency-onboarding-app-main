
import { FinancialTransaction, ExpenseCategory, Vendor, PaymentMethod } from '../types';
import { RawTransactionData } from '../types/transactionTypes';
import { isValidRelationship } from './relationshipUtils';

/**
 * Transforms raw transaction data from Supabase into the FinancialTransaction type
 */
export function transformTransactionData(item: RawTransactionData): FinancialTransaction {
  return {
    ...item,
    type: item.type as 'expense' | 'revenue',
    recurring_type: item.recurring_type as 'one-time' | 'monthly' | 'annual' | null,
    category: isValidRelationship(item.category) ? item.category as ExpenseCategory : undefined,
    vendor: isValidRelationship(item.vendor) ? item.vendor as Vendor : undefined,
    payment_method: isValidRelationship(item.payment_method) ? item.payment_method as PaymentMethod : undefined
  };
}
