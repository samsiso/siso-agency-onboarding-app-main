import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { addTransaction } from './transactionModifications';
import { toast } from '@/components/ui/use-toast';

// Sample expense data
const sampleExpenses = [
  {
    description: "Office Rent",
    amount: 1250,
    date: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    category_id: null,
    vendor_id: null,
    payment_method_id: null,
    type: "expense",
    recurring_type: "monthly"
  },
  {
    description: "Marketing Expenses",
    amount: 800,
    date: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    category_id: null,
    vendor_id: null,
    payment_method_id: null,
    type: "expense",
    recurring_type: "one-time"
  },
  {
    description: "Salaries",
    amount: 5000,
    date: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
    category_id: null,
    vendor_id: null,
    payment_method_id: null,
    type: "expense",
    recurring_type: "monthly"
  },
  {
    description: "Software Subscriptions",
    amount: 300,
    date: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString(),
    category_id: null,
    vendor_id: null,
    payment_method_id: null,
    type: "expense",
    recurring_type: "monthly"
  },
  {
    description: "Client Entertainment",
    amount: 400,
    date: new Date(new Date().setDate(new Date().getDate() - 25)).toISOString(),
    category_id: null,
    vendor_id: null,
    payment_method_id: null,
    type: "expense",
    recurring_type: "one-time"
  }
];

/**
 * Seeds initial sample expenses for demonstration
 */
export async function seedInitialExpenses(): Promise<boolean> {
  try {
    // Fetch existing categories or create default ones
    let categoryId = null;
    const { data: categories } = await supabase
      .from('expense_categories')
      .select('id, name')
      .eq('name', 'Office Expenses')
      .limit(1);
      
    if (!categories || categories.length === 0) {
      const { data: newCategory, error: categoryError } = await supabase
        .from('expense_categories')
        .insert({ id: uuidv4(), name: 'Office Expenses' })
        .select('id')
        .single();
        
      if (categoryError) {
        console.error("Error creating default category:", categoryError);
      } else if (newCategory) {
        categoryId = newCategory.id;
      }
    } else {
      categoryId = categories[0].id;
    }
    
    // Add sample expenses with the category
    for (const expense of sampleExpenses) {
      const expenseWithCategory = {
        ...expense,
        id: uuidv4(),
        category_id: categoryId
      };
      
      const success = await addTransaction(expenseWithCategory);
      if (!success) {
        throw new Error("Failed to add sample expense");
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error seeding expenses:", error);
    toast({
      title: "Error",
      description: "Failed to seed sample expenses",
      variant: "destructive"
    });
    return false;
  }
}
