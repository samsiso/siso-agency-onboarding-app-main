
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

/**
 * Adds a new financial transaction
 */
export async function addTransaction(transactionData: any): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('financial_transactions')
      .insert([transactionData]);

    if (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive"
      });
      return false;
    }

    toast({
      title: "Success",
      description: "Transaction added successfully",
    });
    return true;
  } catch (err) {
    console.error('Unexpected error in addTransaction:', err);
    toast({
      title: "Error",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return false;
  }
}

/**
 * Deletes a financial transaction by ID
 */
export async function deleteTransaction(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('financial_transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting transaction:', error);
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive"
      });
      return false;
    }

    toast({
      title: "Success",
      description: "Transaction deleted successfully",
    });
    return true;
  } catch (err) {
    console.error('Unexpected error in deleteTransaction:', err);
    toast({
      title: "Error",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return false;
  }
}
