
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { FinancialTransaction } from "./types";
import { transformTransactionData } from "./utils/transactionTransformers";

// Fetch all transactions with better error handling
export async function fetchTransactions(): Promise<FinancialTransaction[]> {
  try {
    console.log("Fetching transactions");
    
    const { data, error } = await supabase
      .from("financial_transactions")
      .select(`
        *,
        category:expense_categories(id, name),
        vendor:vendors(id, name),
        payment_method:payment_methods(id, name)
      `)
      .order("date", { ascending: false });

    if (error) {
      console.error("Error fetching transactions:", error);
      toast({
        title: "Error",
        description: "Failed to fetch transactions: " + error.message,
        variant: "destructive"
      });
      return [];
    }

    // Check if data is available and log for debugging
    console.log(`Fetched ${data?.length || 0} transactions`);
    
    // Transform the data correctly
    return Array.isArray(data) ? data.map(transformTransactionData) : [];
  } catch (err) {
    console.error("Unexpected error fetching transactions:", err);
    toast({
      title: "Error",
      description: "An unexpected error occurred while fetching transactions",
      variant: "destructive"
    });
    return [];
  }
}

// Delete a transaction by ID
export async function deleteTransaction(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("financial_transactions")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting transaction:", error);
      toast({
        title: "Error",
        description: "Failed to delete the transaction",
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
    console.error("Unexpected error deleting transaction:", err);
    toast({
      title: "Error",
      description: "An unexpected error occurred",
      variant: "destructive"
    });
    return false;
  }
}
