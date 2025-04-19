
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { addMultipleTransactions } from './transactionModifications';
import { toast } from '@/components/ui/use-toast';

// Updated sample expenses to include the specific expenses you mentioned
const sampleExpenses = [
  {
    description: "Virgin Media Internet",
    amount: 132.50,
    date: "2024-01-05",
    category: "Utilities",
    vendor: "Virgin Media",
    type: "expense"
  },
  {
    description: "Notion Subscription",
    amount: 50.90,
    date: "2024-01-11",
    category: "Services",
    vendor: "Notion",
    type: "expense"
  },
  {
    description: "Google Play Store",
    amount: 19.60,
    date: "2024-01-12",
    category: "Services",
    vendor: "Google",
    type: "expense"
  },
  {
    description: "OpenAI Subscription",
    amount: 56.45,
    date: "2024-01-12",
    category: "Services",
    vendor: "OpenAI",
    type: "expense"
  },
  {
    description: "Airtable Subscription",
    amount: 19.07,
    date: "2024-01-13",
    category: "Services",
    vendor: "Airtable",
    type: "expense"
  },
  {
    description: "Midjourney Subscription",
    amount: 9.57,
    date: "2024-01-27",
    category: "Services",
    vendor: "Midjourney",
    type: "expense"
  },
  {
    description: "FlutterFlow Subscription",
    amount: 55.04,
    date: "2024-01-31",
    category: "Services",
    vendor: "FlutterFlow",
    type: "expense"
  },
  {
    description: "Google Services",
    amount: 10.00,
    date: "2024-02-13",
    category: "Services",
    vendor: "Google",
    type: "expense"
  },
  {
    description: "Notion Additional Services",
    amount: 5.59,
    date: "2024-02-24",
    category: "Services",
    vendor: "Notion",
    type: "expense"
  },
  {
    description: "TradingView Subscription",
    amount: 35.94,
    date: "2024-02-28",
    category: "Services",
    vendor: "TradingView",
    type: "expense"
  }
];

/**
 * Seeds initial sample expenses for demonstration
 */
export async function seedInitialExpenses(): Promise<boolean> {
  try {
    // Use the new bulk insert method
    return await addMultipleTransactions(sampleExpenses);
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
