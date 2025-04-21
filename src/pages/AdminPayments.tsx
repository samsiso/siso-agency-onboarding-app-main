
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { FinancialsHeader } from "@/components/admin/financials/FinancialsHeader";
import { FinancialsDashboard } from "@/components/admin/financials/FinancialsDashboard";
import { ExpensesTable } from "@/components/admin/financials/ExpensesTable";
import { RevenueTable } from "@/components/admin/financials/RevenueTable";
import { FinancialPipeline } from "@/components/admin/financials/FinancialPipeline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchTransactions, FinancialTransaction } from "@/utils/financial";
import { Button } from "@/components/ui/button";
import { seedInitialExpenses } from "@/utils/financial/seedExpenses";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ImportExpensesButton } from "@/components/admin/financials/expense/ImportExpensesButton";
import { Import, AlertCircle } from "lucide-react";
import { seedExpensesFromList } from "@/utils/financial/bulkExpenseSeeder";
import { Card } from "@/components/ui/card";

export default function AdminPayments() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [expenses, setExpenses] = useState<FinancialTransaction[]>([]);
  const [revenues, setRevenues] = useState<FinancialTransaction[]>([]);
  const [filters, setFilters] = useState({});
  const [isSeeding, setIsSeeding] = useState(false);
  const [expensesExist, setExpensesExist] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(true);

  // Check if expenses exist when component mounts
  useEffect(() => {
    const checkExpensesExistence = async () => {
      try {
        const { count, error } = await supabase
          .from('financial_transactions')
          .select('*', { count: 'exact' })
          .eq('type', 'expense');
        if (error) {
          console.error("Error checking expenses:", error);
          return;
        }
        setExpensesExist(count !== 0);
        if (count !== 0) setShowBulkImport(false); // hide if any exist
      } catch (error) {
        console.error("Error checking expenses:", error);
      }
    };
    checkExpensesExistence();
  }, []);

  useEffect(() => {
    loadData();
  }, [filters]);

  async function loadData() {
    setIsLoading(true);
    try {
      const transactionData = await fetchTransactions();
      if (Array.isArray(transactionData)) {
        const expenseData = transactionData.filter(transaction => transaction.type === 'expense');
        setExpenses(expenseData);
        const revenueData = transactionData.filter(transaction => transaction.type === 'revenue');
        setRevenues(revenueData);
      } else {
        setExpenses([]);
        setRevenues([]);
        toast({
          title: "Error",
          description: "Failed to load financial data correctly",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load financial data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleSeedExpenses = async () => {
    setIsSeeding(true);
    try {
      const success = await seedInitialExpenses();
      if (success) {
        await loadData(); // Reload data after seeding
        setExpensesExist(true);
        setShowBulkImport(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add sample expenses",
        variant: "destructive"
      });
    } finally {
      setIsSeeding(false);
    }
  };

  // Bulk import button for 100+ sample expenses
  const handleBulkImportAllExpenses = async () => {
    setIsLoading(true);
    try {
      await seedExpensesFromList();
      toast({
        title: "Expenses Imported",
        description: "All demo expenses (~100) have been imported.",
      });
      setExpensesExist(true);
      setShowBulkImport(false);
      await loadData();
    } catch (error: any) {
      toast({
        title: "Import Failed",
        description: error?.message || "Failed to import expenses.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate upcoming expenses
  const upcomingExpenses = expenses.filter(expense => {
    if (!expense.date) return false;
    const dueDate = new Date(expense.date);
    const today = new Date();
    const differenceInTime = dueDate.getTime() - today.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays > 0 && differenceInDays <= 7;
  });

  // Calculate total of upcoming expenses
  const upcomingExpensesTotal = upcomingExpenses.reduce((total, expense) => total + expense.amount, 0);

  return (
    <AdminLayout>
      <div className="px-6 py-8 max-w-7xl mx-auto bg-black min-h-screen">
        {/* SINGLE header and buttons section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Financial Management</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your expenses and revenue
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!expensesExist && showBulkImport && (
              <Button
                variant="destructive"
                onClick={handleBulkImportAllExpenses}
                disabled={isLoading}
                className="mt-2 md:mt-0 font-bold"
              >
                <Import className="h-4 w-4 mr-2" />
                {isLoading ? "Importing Expenses..." : "Bulk Import All Expenses"}
              </Button>
            )}
            {!expensesExist && !showBulkImport && (
              <>
                <Button 
                  variant="secondary" 
                  onClick={handleSeedExpenses} 
                  disabled={isLoading || isSeeding}
                  className="mt-2 md:mt-0"
                >
                  {isSeeding ? "Adding Expenses..." : "Add Sample Expenses"}
                </Button>
                <ImportExpensesButton onImport={loadData} />
              </>
            )}
            {/* Actions for custom add/filter/import can be handled here */}
          </div>
        </div>
        
        {upcomingExpenses.length > 0 && (
          <Card className="mb-6 bg-amber-900/20 border border-amber-400/50">
            <div className="p-4 flex items-center">
              <AlertCircle className="h-5 w-5 text-amber-400 mr-2" />
              <span className="text-amber-200 font-medium">
                {`£${upcomingExpensesTotal.toFixed(2)} in upcoming expenses due in the next 7 days`}
              </span>
            </div>
          </Card>
        )}
        
        {/* Remove FinancialsHeader - its controls merged up above */}
        {/* <FinancialsHeader onFilterChange={handleFilterChange} onDataChange={loadData} /> */}
        <Tabs defaultValue="dashboard" className="mt-6" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="mt-6">
            <FinancialsDashboard />
          </TabsContent>
          <TabsContent value="expenses" className="mt-6">
            <ExpensesTable 
              expenses={expenses} 
              isLoading={isLoading} 
              onDataChange={loadData}
            />
          </TabsContent>
          <TabsContent value="revenue" className="mt-6">
            <RevenueTable 
              revenues={revenues}
              isLoading={isLoading}
              onDataChange={loadData}
            />
          </TabsContent>
          <TabsContent value="pipeline" className="mt-6">
            <FinancialPipeline 
              expenses={expenses}
              revenues={revenues}
              isLoading={isLoading}
              onDataChange={loadData}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
