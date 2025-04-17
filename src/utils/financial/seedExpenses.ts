
import { supabase } from '@/integrations/supabase/client';
import { addTransaction } from './transactionsApi';
import { toast } from '@/components/ui/use-toast';

interface Expense {
  vendor: string;
  amount: number;
  date: string;
}

// List of initial expenses to add
const initialExpenses: Expense[] = [
  { vendor: 'Virgin Media', amount: 132.50, date: '2024-01-05' },
  { vendor: 'Notion', amount: 50.90, date: '2024-01-11' },
  { vendor: 'Google Play', amount: 19.60, date: '2024-01-12' },
  { vendor: 'OpenAI', amount: 56.45, date: '2024-01-12' },
  { vendor: 'Airtable', amount: 19.07, date: '2024-01-13' },
  { vendor: 'Midjourney', amount: 9.57, date: '2024-01-27' },
  { vendor: 'FlutterFlow', amount: 55.04, date: '2024-01-31' },
  { vendor: 'Google', amount: 10.00, date: '2024-02-13' },
  { vendor: 'Notion', amount: 5.59, date: '2024-02-24' },
  { vendor: 'TradingView', amount: 35.94, date: '2024-02-28' }
];

// Function to ensure vendors exist in the database
export async function ensureVendorsExist(vendors: string[]): Promise<Record<string, string>> {
  const vendorMap: Record<string, string> = {};
  
  try {
    // Get existing vendors
    const { data: existingVendors } = await supabase
      .from('vendors')
      .select('id, name')
      .in('name', vendors);
      
    // Map existing vendor names to IDs
    (existingVendors || []).forEach(vendor => {
      vendorMap[vendor.name] = vendor.id;
    });
    
    // Find missing vendors
    const missingVendors = vendors.filter(vendor => !vendorMap[vendor]);
    
    // Create missing vendors
    if (missingVendors.length > 0) {
      const vendorsToAdd = missingVendors.map(name => ({ 
        name, 
        is_active: true 
      }));
      
      const { data: newVendors, error } = await supabase
        .from('vendors')
        .insert(vendorsToAdd)
        .select('id, name');
        
      if (error) throw error;
      
      // Map new vendor names to IDs
      (newVendors || []).forEach(vendor => {
        vendorMap[vendor.name] = vendor.id;
      });
    }
    
    return vendorMap;
  } catch (error) {
    console.error('Error ensuring vendors exist:', error);
    return vendorMap;
  }
}

// Function to seed initial expenses
export async function seedInitialExpenses(): Promise<boolean> {
  try {
    // Get default payment method (first active one)
    const { data: paymentMethods } = await supabase
      .from('payment_methods')
      .select('id')
      .eq('is_active', true)
      .limit(1);
      
    const paymentMethodId = paymentMethods?.[0]?.id;
    
    if (!paymentMethodId) {
      console.error('No active payment method found');
      return false;
    }
    
    // Ensure vendors exist
    const vendorNames = [...new Set(initialExpenses.map(exp => exp.vendor))];
    const vendorMap = await ensureVendorsExist(vendorNames);
    
    // Get software/subscription category
    const { data: categories } = await supabase
      .from('expense_categories')
      .select('id, name')
      .eq('name', 'Software Subscription')
      .limit(1);
      
    let categoryId = categories?.[0]?.id;
    
    // Create the category if it doesn't exist
    if (!categoryId) {
      const { data: newCategory } = await supabase
        .from('expense_categories')
        .insert({ name: 'Software Subscription', description: 'Monthly and annual software subscriptions' })
        .select('id')
        .single();
        
      categoryId = newCategory?.id;
    }
    
    // Add expenses one by one
    for (const expense of initialExpenses) {
      const vendorId = vendorMap[expense.vendor];
      
      if (!vendorId) {
        console.error(`Vendor ID not found for ${expense.vendor}`);
        continue;
      }
      
      await addTransaction({
        type: 'expense',
        amount: expense.amount,
        date: expense.date,
        description: `${expense.vendor} subscription`,
        vendor_id: vendorId,
        category_id: categoryId,
        payment_method_id: paymentMethodId,
        recurring_type: 'monthly',
        currency: 'GBP',
        status: 'completed'
      });
    }
    
    toast({
      title: 'Success',
      description: `Added ${initialExpenses.length} initial expenses`
    });
    
    return true;
  } catch (error) {
    console.error('Error seeding initial expenses:', error);
    toast({
      title: 'Error',
      description: 'Failed to add initial expenses',
      variant: 'destructive'
    });
    return false;
  }
}
