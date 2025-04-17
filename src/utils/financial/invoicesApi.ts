
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Invoice, PaymentMethod } from './types';

// Define simpler interfaces to break the nested type definition cycle
interface BaseSupabaseEntity {
  id: string;
}

// Interface for client data
interface ClientData {
  full_name?: string;
  business_name?: string;
}

// Define a more accurate interface for what Supabase returns
interface SupabaseInvoiceResult extends BaseSupabaseEntity {
  invoice_number: string;
  client_id: string;
  amount: number;
  currency: string;
  issue_date: string;
  due_date: string;
  status: string;
  payment_method_id?: string;
  notes?: string;
  // Using any for these relationships to break the deep nesting
  client?: any;
  payment_method?: any;
}

// Helper function to check if an object is a valid client
function isValidClient(obj: any): boolean {
  return obj && 
         typeof obj === 'object' && 
         !('code' in obj) && 
         !('message' in obj) && 
         !('details' in obj);
}

export async function fetchInvoices(filters: Record<string, any> = {}): Promise<Invoice[]> {
  try {
    const query = supabase
      .from('invoices')
      .select(`
        *,
        client:clients(*),
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
    
    // Transform data to match the Invoice type
    const transformedData = (data || []).map((item: any) => {
      // Create client object with required properties
      let clientData: ClientData = { full_name: 'Unknown' };
      
      if (isValidClient(item.client)) {
        const businessName = item.client.business_name || null;
        clientData = {
          full_name: item.client.full_name || 'Unknown',
          ...(businessName ? { business_name: businessName } : {})
        };
      }
      
      return {
        ...item,
        status: item.status as 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled',
        client: clientData,
        payment_method: isValidClient(item.payment_method) ? item.payment_method as PaymentMethod : undefined
      };
    });
    
    return transformedData;
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
      description: 'Invoice added successfully',
    });
    
    // Ensure the result conforms to the Invoice type
    return {
      ...data,
      status: data.status as 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled',
      client: { full_name: 'Unknown' } // Default client info
    };
  } catch (error) {
    console.error('Error adding invoice:', error);
    toast({
      title: 'Error',
      description: 'Failed to add invoice',
      variant: 'destructive',
    });
    return null;
  }
}

// Delete an invoice
export async function deleteInvoice(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    toast({
      title: 'Success',
      description: 'Invoice deleted successfully',
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting invoice:', error);
    toast({
      title: 'Error',
      description: 'Failed to delete invoice',
      variant: 'destructive',
    });
    return false;
  }
}

// Update an invoice
export async function updateInvoice(id: string, updates: Partial<Omit<Invoice, 'id' | 'client' | 'payment_method'>>): Promise<Invoice | null> {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: 'Success',
      description: 'Invoice updated successfully',
    });
    
    // Ensure the result conforms to the Invoice type
    return {
      ...data,
      status: data.status as 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled',
      client: { full_name: 'Unknown' } // Default client info
    };
  } catch (error) {
    console.error('Error updating invoice:', error);
    toast({
      title: 'Error',
      description: 'Failed to update invoice',
      variant: 'destructive',
    });
    return null;
  }
}

// Helper function to generate a sequential invoice number
export async function generateInvoiceNumber(): Promise<string> {
  try {
    // Get the latest invoice to determine the next number
    const { data, error } = await supabase
      .from('invoices')
      .select('invoice_number')
      .order('created_at', { ascending: false })
      .limit(1);
      
    if (error) throw error;
    
    // If there are no existing invoices, start with INV-0001
    if (!data || data.length === 0) {
      return 'INV-0001';
    }
    
    // Extract the numeric part and increment
    const lastInvoice = data[0].invoice_number;
    const prefix = lastInvoice.split('-')[0];
    const number = parseInt(lastInvoice.split('-')[1], 10);
    const nextNumber = number + 1;
    
    // Format with leading zeros (4 digits)
    return `${prefix}-${nextNumber.toString().padStart(4, '0')}`;
  } catch (error) {
    console.error('Error generating invoice number:', error);
    // Fallback to a timestamp-based number if there's an error
    const timestamp = new Date().getTime().toString().slice(-6);
    return `INV-${timestamp}`;
  }
}
