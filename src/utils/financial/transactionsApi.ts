
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { FinancialTransaction } from "./types";
import { transformTransactionData } from "./utils/transactionTransformers";

// Fetch all transactions
export async function fetchTransactions(): Promise<FinancialTransaction[]> {
  const { data, error } = await supabase
    .from("financial_transactions")
    .select(`
      *,
      category:category_id(id, name),
      vendor:vendor_id(id, name),
      payment_method:payment_method_id(id, name)
    `)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }

  // Use the transformer to convert the raw data to the expected type
  return Array.isArray(data) ? data.map(transformTransactionData) : [];
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
