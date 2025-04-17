
import { ExpenseCategory, Vendor, PaymentMethod } from '../types';

/**
 * Raw transaction data interface as returned from Supabase
 */
export interface RawTransactionData {
  id: string;
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

/**
 * Transaction filters interface
 */
export interface TransactionFilters {
  type?: string;
  category_id?: string;
  vendor_id?: string;
  status?: string;
  [key: string]: any;
}
