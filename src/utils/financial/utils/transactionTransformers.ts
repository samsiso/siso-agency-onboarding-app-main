
import { FinancialTransaction, ExpenseCategory, Vendor, PaymentMethod } from '../types';

/**
 * Helper function to check if a relationship object is valid
 */
export function isValidRelationship(relation: any): boolean {
  return relation && typeof relation === 'object' && relation.id;
}

/**
 * Transforms raw transaction data from Supabase into the FinancialTransaction type
 * Uses type assertions to prevent deep instantiation chains
 */
export function transformTransactionData(item: any): FinancialTransaction {
  // Handle null or undefined item
  if (!item) {
    console.error("Received null or undefined transaction data");
    return {} as FinancialTransaction;
  }

  // Log for debugging
  console.log("Transforming transaction:", item.id, item.description);

  // Extract related entities with proper type checking
  const category = isValidRelationship(item.category) 
    ? {
        id: item.category.id,
        name: item.category.name,
        description: '',  // Provide default values for required fields
        is_active: true   // Provide default values for required fields
      } as ExpenseCategory
    : undefined;
    
  const vendor = isValidRelationship(item.vendor)
    ? {
        id: item.vendor.id,
        name: item.vendor.name,
        is_active: true,  // Provide default values for required fields
      } as Vendor
    : undefined;
    
  const paymentMethod = isValidRelationship(item.payment_method)
    ? {
        id: item.payment_method.id,
        name: item.payment_method.name,
        is_active: true   // Provide default values for required fields
      } as PaymentMethod
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
