
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Invoice } from './types';

export async function fetchInvoices(filters = {}): Promise<Invoice[]> {
  try {
    const query = supabase
      .from('invoices')
      .select(`
        *,
        client:profiles(full_name, business_name),
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
    
    // Transform status to ensure it conforms to the union type
    const transformedData = (data || []).map(item => ({
      ...item,
      status: item.status as 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled'
    }));
    
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
export async function addInvoice(
  invoice: Omit<Invoice, 'id' | 'client' | 'payment_method'>
): Promise<Invoice | null> {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .insert(invoice)
      .select()
      .single();
      
    if (error) throw error;
    
    toast({
      title: 'Success',
      description: 'Invoice created successfully',
    });
    
    return {
      ...data,
      status: data.status as 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled'
    };
  } catch (error) {
    console.error('Error adding invoice:', error);
    toast({
      title: 'Error',
      description: 'Failed to create invoice',
      variant: 'destructive',
    });
    return null;
  }
}
