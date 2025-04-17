
import { PaymentMethod } from '../types';

/**
 * Base interface for simple entity with ID
 */
export interface BaseEntity {
  id: string;
}

/**
 * Client data interface
 */
export interface ClientData {
  full_name?: string;
  business_name?: string;
}

/**
 * Raw invoice data as returned from Supabase
 */
export interface RawInvoiceData extends BaseEntity {
  invoice_number: string;
  client_id: string;
  amount: number;
  currency: string;
  issue_date: string;
  due_date: string;
  status: string;
  payment_method_id?: string;
  notes?: string;
  client?: any;
  payment_method?: any;
}

/**
 * Invoice filters interface
 */
export interface InvoiceFilters {
  client_id?: string;
  status?: string;
  payment_method_id?: string;
  [key: string]: any;
}
