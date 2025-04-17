
import { FinancialTransaction, ExpenseCategory, Vendor, PaymentMethod } from '../types';
import { isValidRelationship } from './relationshipUtils';

/**
 * Transforms raw transaction data from Supabase into the FinancialTransaction type
 * Uses type assertions to prevent deep instantiation chains
 */
export function transformTransactionData(item: any): FinancialTransaction {
  // Extract related entities with proper type checking
  const category = isValidRelationship(item.category) 
    ? item.category as ExpenseCategory
    : undefined;
    
  const vendor = isValidRelationship(item.vendor)
    ? item.vendor as Vendor
    : undefined;
    
  const paymentMethod = isValidRelationship(item.payment_method)
    ? item.payment_method as PaymentMethod
    : undefined;

  // Return a properly typed object
  return {
    ...item,
    type: item.type as 'expense' | 'revenue',
    recurring_type: item.recurring_type as 'one-time' | 'monthly' | 'annual' | null,
    category,
    vendor,
    payment_method: paymentMethod
  };
}
