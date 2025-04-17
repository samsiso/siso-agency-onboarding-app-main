
import { AdminLayout } from "@/components/admin/layout/AdminLayout";
import { FinancialsHeader } from "@/components/admin/financials/FinancialsHeader";
import { FinancialsDashboard } from "@/components/admin/financials/FinancialsDashboard";
import { ExpensesTable } from "@/components/admin/financials/ExpensesTable";
import { RevenueTable } from "@/components/admin/financials/RevenueTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function AdminPayments() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <AdminLayout>
      <div className="container px-6 py-8 max-w-7xl">
        <FinancialsHeader />
        
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
            <ExpensesTable />
          </TabsContent>
          
          <TabsContent value="revenue" className="mt-6">
            <RevenueTable />
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
