import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AreaChart } from "./Charts";
import { useEffect, useState } from "react";
import { fetchTransactions, FinancialTransaction } from "@/utils/financial";
import { SoftwareExpenseStats } from "./SoftwareExpenseStats";
import { formatCurrency } from "@/lib/formatters";
import { ExpenseCreditCard } from "./ExpenseCreditCard";

export function FinancialsDashboard() {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState("month");
  
  // Load transactions
  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchTransactions();
        if (Array.isArray(data)) {
          setTransactions(data);
        }
      } catch (error) {
        console.error("Failed to load transactions for dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, []);
  
  // Get time period filter dates
  const getDateFilter = () => {
    const now = new Date();
    const dateFilters = {
      month: new Date(now.getFullYear(), now.getMonth(), 1),
      quarter: new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1),
      year: new Date(now.getFullYear(), 0, 1),
      all: new Date(0) // beginning of time
    };
    
    return dateFilters[period];
  };
  
  // Filter transactions by period
  const filteredTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate >= getDateFilter();
  });
  
  // Get expenses and revenues
  const expenses = filteredTransactions.filter(t => t.type === 'expense');
  const revenues = filteredTransactions.filter(t => t.type === 'revenue');
  
  // Calculate totals
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalRevenue = revenues.reduce((sum, revenue) => sum + revenue.amount, 0);
    // Calculate predicted costs (recurring expenses for the next month)
    const predictedMonthlyCosts = expenses
    .filter(expense => expense.recurring_type === 'monthly')
    .reduce((sum, expense) => sum + Number(expense.amount), 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Financial Overview</h2>
        <Tabs defaultValue="month" value={period} onValueChange={setPeriod} className="w-[400px]">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="quarter">Quarter</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
            <TabsTrigger value="all">All Time</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <ExpenseCreditCard 
            currentCosts={totalExpenses}
            predictedCosts={predictedMonthlyCosts}
          />
        </div>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <div className="h-6 w-24 bg-muted animate-pulse rounded" />
              ) : (
                formatCurrency(totalRevenue, 'GBP')
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From {revenues.length} transactions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {isLoading ? (
                <div className="h-6 w-24 bg-muted animate-pulse rounded" />
              ) : (
                formatCurrency(netProfit, 'GBP')
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {netProfit >= 0 ? 'Profit' : 'Loss'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${profitMargin >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {isLoading ? (
                <div className="h-6 w-24 bg-muted animate-pulse rounded" />
              ) : (
                `${profitMargin.toFixed(1)}%`
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {profitMargin >= 20 ? 'Healthy' : profitMargin >= 0 ? 'Moderate' : 'Negative'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Revenue vs. Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <AreaChart data={filteredTransactions.map(t => ({
              name: new Date(t.date).toLocaleDateString('en-US', { month: 'short' }),
              revenue: t.type === 'revenue' ? t.amount : 0,
              expense: t.type === 'expense' ? t.amount : 0,
            }))} />
          </CardContent>
        </Card>
        
        <SoftwareExpenseStats expenses={expenses} />
      </div>
    </div>
  );
}
