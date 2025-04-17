
import { PaymentMethod, Invoice } from '../types';
import { RawInvoiceData } from '../types/invoiceTypes';
import { createClientData, isValidRelationship } from './relationshipUtils';

/**
 * Transforms raw invoice data from Supabase into the Invoice type
 */
export function transformInvoiceData(item: RawInvoiceData): Invoice {
  return {
    ...item,
    status: item.status as 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled',
    client: createClientData(item.client),
    payment_method: isValidRelationship(item.payment_method) ? item.payment_method as PaymentMethod : undefined
  };
}
