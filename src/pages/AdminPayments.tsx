import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { FinancialsHeader } from "@/components/admin/financials/FinancialsHeader";
import { FinancialsDashboard } from "@/components/admin/financials/FinancialsDashboard";
import { ExpensesTable } from "@/components/admin/financials/ExpensesTable";
import { RevenueTable } from "@/components/admin/financials/RevenueTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchTransactions, FinancialTransaction } from "@/utils/financial";
import { Button } from "@/components/ui/button";
import { seedInitialExpenses } from "@/utils/financial/seedExpenses";
import { toast } from "@/components/ui/use-toast";

export default function AdminPayments() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [expenses, setExpenses] = useState<FinancialTransaction[]>([]);
  const [revenues, setRevenues] = useState<FinancialTransaction[]>([]);
  const [filters, setFilters] = useState({});
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    loadData();
  }, [filters]);

  async function loadData() {
    setIsLoading(true);
    
    try {
      // Load all transactions
      const transactionData = await fetchTransactions();
      
      // Filter expenses and revenues separately
      if (Array.isArray(transactionData)) {
        const expenseData = transactionData.filter(transaction => 
          transaction.type === 'expense'
        );
        setExpenses(expenseData);
        
        const revenueData = transactionData.filter(transaction => 
          transaction.type === 'revenue'
        );
        setRevenues(revenueData);
      } else {
        console.error("Invalid transaction data format:", transactionData);
        setExpenses([]);
        setRevenues([]);
        toast({
          title: "Error",
          description: "Failed to load financial data correctly",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error loading financial data:", error);
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
      await seedInitialExpenses();
      await loadData(); // Reload data after seeding
      toast({
        title: "Success",
        description: "Sample expenses have been added successfully",
      });
    } catch (error) {
      console.error("Error seeding expenses:", error);
      toast({
        title: "Error",
        description: "Failed to add sample expenses",
        variant: "destructive"
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <AdminLayout>
      <div className="container px-6 py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Financial Management</h1>
          {expenses.length === 0 && (
            <Button 
              variant="secondary" 
              onClick={handleSeedExpenses} 
              disabled={isLoading || isSeeding}
              className="mt-2 md:mt-0"
            >
              {isSeeding ? "Adding Expenses..." : "Add Sample Expenses"}
            </Button>
          )}
        </div>
        
        <FinancialsHeader onFilterChange={handleFilterChange} />
        
        <Tabs defaultValue="dashboard" className="mt-6" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
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
          
          <TabsContent value="predictions" className="mt-6">
            <div className="grid gap-6">
              <div className="bg-card/30 rounded-xl p-6 border border-border/40 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Financial Predictions</h2>
                <p className="text-muted-foreground">
                  Predictive analytics for future expenses, revenue forecasts, and AI-powered insights will be displayed here.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
