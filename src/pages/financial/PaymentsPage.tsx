import { useState, useEffect } from 'react';
import { FinancialLayout } from '@/components/layout/FinancialLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, CreditCard, PiggyBank, Calendar, ArrowRight, Download, BarChart, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PaymentsSummaryCards } from '@/components/admin/financials/payments/PaymentsSummaryCards';
import { ExpensesList } from '@/components/admin/financials/expenses/ExpensesList';
import { fetchProjectExpenses, Expense } from '@/utils/financial/expenses';
import { ConnectWalletDialog } from '@/components/admin/financials/payments/dialogs/ConnectWalletDialog';
import { AddCardDialog } from '@/components/admin/financials/payments/dialogs/AddCardDialog';
import { BankDetailsDialog } from '@/components/admin/financials/payments/dialogs/BankDetailsDialog';

// Step 1: Basic structure with Summary Cards
export default function PaymentsPage() {
  // Basic state for tabs
  const [activeTab, setActiveTab] = useState('overview');
  
  // Dialog states
  const [connectWalletOpen, setConnectWalletOpen] = useState(false);
  const [addCardOpen, setAddCardOpen] = useState(false);
  const [bankDetailsOpen, setBankDetailsOpen] = useState(false);
  
  // Mock project ID
  const projectId = 'demo-project';
  
  // Demo expenses data
  const expenses: Expense[] = [
    {
      id: 'exp-1',
      project_id: projectId,
      name: 'Server Hosting',
      description: 'Monthly AWS server costs',
      amount: 450,
      currency: '£',
      category: 'Infrastructure',
      status: 'active',
      frequency: 'monthly',
      start_date: '2025-01-01',
      next_billing_date: '2025-06-01',
      created_at: '2025-01-01'
    },
    {
      id: 'exp-2',
      project_id: projectId,
      name: 'Security Monitoring',
      description: 'Ongoing security service',
      amount: 350,
      currency: '£',
      category: 'Security',
      status: 'active',
      frequency: 'monthly',
      start_date: '2025-01-01',
      next_billing_date: '2025-06-05',
      created_at: '2025-01-01'
    },
    {
      id: 'exp-3',
      project_id: projectId,
      name: 'Wallet Integration',
      description: 'Development of crypto wallet',
      amount: 1500,
      currency: '£',
      category: 'Development',
      status: 'completed',
      frequency: 'one-time',
      start_date: '2025-02-15',
      end_date: '2025-03-15',
      created_at: '2025-02-15'
    },
    {
      id: 'exp-4',
      project_id: projectId,
      name: 'Developer Time',
      description: 'Frontend developer hours',
      amount: 2400,
      currency: '£',
      category: 'Development',
      status: 'completed',
      frequency: 'one-time',
      start_date: '2025-02-01',
      end_date: '2025-04-30',
      created_at: '2025-02-01'
    },
    {
      id: 'exp-5',
      project_id: projectId,
      name: 'Database Hosting',
      description: 'PostgreSQL database hosting',
      amount: 120,
      currency: '£',
      category: 'Infrastructure',
      status: 'active',
      frequency: 'monthly',
      start_date: '2025-01-15',
      next_billing_date: '2025-06-15',
      created_at: '2025-01-15'
    }
  ];
  
  // Mock data for financial summaries
  const financialSummary = {
    totalCurrentExpenses: 4200,
    outstandingBalance: 1500,
    totalAppCost: 30000
  };
  
  // Mock active expenses
  const activeExpenses = [
    {
      id: 'exp-1',
      name: 'Server Hosting',
      amount: 450,
      status: 'active',
      frequency: 'monthly',
      nextDue: '2025-06-01'
    },
    {
      id: 'exp-2',
      name: 'Security Monitoring',
      amount: 350,
      status: 'active',
      frequency: 'monthly',
      nextDue: '2025-06-05'
    }
  ];
  
  // Mock invoices
  const invoices = [
    {
      id: 'inv-1',
      invoiceNumber: 'INV-2025-001',
      amount: 1500,
      status: 'due',
      dueDate: '2025-05-30',
      items: [{ description: 'Wallet Integration', amount: 1500 }]
    }
  ];
  
  // Next payment due info
  const nextPaymentDue = {
    amount: 1500,
    dueDate: '2025-05-30',
    invoiceId: 'inv-1'
  };
  
  // Date formatter function
  const formatDate = (date: string) => {
    if (!date) return '';
    const dateObj = new Date(date);
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(dateObj);
  };
  
  return (
    <>
      <FinancialLayout title="Payments & Billing">
      {/* Summary Cards */}
      <div className="mb-8">
        <PaymentsSummaryCards
          activeExpenses={activeExpenses}
          invoices={invoices}
          financialSummary={financialSummary}
          nextPaymentDue={nextPaymentDue}
          formatDate={formatDate}
        />
      </div>
      
      {/* Simple Payment Methods */}
      <Card className="bg-black/30 border border-purple-400/30 backdrop-blur-sm shadow-lg mb-8">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-white">
            <Wallet className="h-5 w-5 text-orange-500" />
            Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Crypto Payment */}
            <div className="p-4 bg-black/20 rounded-lg border border-purple-400/20">
              <div className="flex gap-2 items-center mb-2">
                <PiggyBank className="h-5 w-5 text-orange-500" />
                <h3 className="text-lg text-white">Crypto Payment</h3>
                <span className="ml-auto text-xs bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded">20% OFF</span>
              </div>
              <p className="text-white/80 mb-3">Get 20% discount when paying with cryptocurrency</p>
              <Button 
                variant="outline" 
                className="w-full text-white hover:text-white"
                onClick={() => setConnectWalletOpen(true)}
              >
                Connect Wallet
              </Button>
            </div>
            
            {/* Card Payment */}
            <div className="p-4 bg-black/20 rounded-lg border border-purple-400/20">
              <div className="flex gap-2 items-center mb-2">
                <CreditCard className="h-5 w-5 text-purple-400" />
                <h3 className="text-lg text-white">Card Payment</h3>
              </div>
              <p className="text-white/80 mb-3">Pay securely with your credit or debit card</p>
              <Button 
                variant="outline" 
                className="w-full text-white hover:text-white"
                onClick={() => setAddCardOpen(true)}
              >
                Add Card
              </Button>
            </div>
            
            {/* Bank Transfer */}
            <div className="p-4 bg-black/20 rounded-lg border border-purple-400/20">
              <div className="flex gap-2 items-center mb-2">
                <Calendar className="h-5 w-5 text-blue-400" />
                <h3 className="text-lg text-white">Bank Transfer</h3>
              </div>
              <p className="text-white/80 mb-3">Pay via direct bank transfer to our account</p>
              <Button 
                variant="outline" 
                className="w-full text-white hover:text-white"
                onClick={() => setBankDetailsOpen(true)}
              >
                View Bank Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Feature Costs Preview */}
      <Card className="bg-black/30 border border-purple-400/30 backdrop-blur-sm shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2 text-white">
            <BarChart className="h-5 w-5 text-orange-500" />
            Feature Cost Breakdown
          </CardTitle>
          <Button variant="outline" size="sm" className="text-white hover:text-white">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-white">View a detailed breakdown of your project's feature costs.</p>
          
          {/* Feature Cost Categories */}
          <div className="space-y-4">
            {/* Trading & Transactions */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/20 to-blue-600/10 border border-blue-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white">Trading & Transactions</h3>
                  <p className="text-sm text-white/70">3 features</p>
                </div>
                <p className="font-bold text-white">£2,400</p>
              </div>
            </div>
            
            {/* Security & Trust */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/20 to-green-600/10 border border-green-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white">Security & Trust</h3>
                  <p className="text-sm text-white/70">2 features</p>
                </div>
                <p className="font-bold text-white">£1,800</p>
              </div>
            </div>
            
            {/* Staking & Earning */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-purple-600/10 border border-purple-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white">Staking & Earning</h3>
                  <p className="text-sm text-white/70">2 features</p>
                </div>
                <p className="font-bold text-white">£1,500</p>
              </div>
            </div>
            
            {/* Community & Engagement */}
            <div className="p-4 rounded-lg bg-gradient-to-r from-orange-500/20 to-orange-600/10 border border-orange-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-white">Community & Engagement</h3>
                  <p className="text-sm text-white/70">1 feature</p>
                </div>
                <p className="font-bold text-white">£900</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white hover:opacity-90">
              View Detailed Breakdown
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Expenses List */}
      <div className="mt-8">
        <ExpensesList expenses={expenses} formatDate={formatDate} />
      </div>
      
      {/* Upcoming Payments */}
      <Card className="bg-black/30 border border-purple-400/30 backdrop-blur-sm shadow-lg mt-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2 text-white">
            <Calendar className="h-5 w-5 text-orange-500" />
            Upcoming Payments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-white">Your next scheduled payments and due dates.</p>
          
          <div className="space-y-4">
            <div className="p-4 bg-black/20 rounded-lg border border-orange-500/30">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-white">Invoice #INV-2025-001</h3>
                <div>
                  <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded">Due Soon</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/70">Due on {formatDate('2025-05-30')}</p>
                <p className="font-bold text-white">£1,500.00</p>
              </div>
              <div className="mt-4">
                <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-500 text-white hover:opacity-90">
                  Pay Now
                </Button>
              </div>
            </div>
            
            <div className="p-4 bg-black/20 rounded-lg border border-purple-400/30">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-white">Server Hosting (Monthly)</h3>
                <div>
                  <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">Upcoming</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-white/70">Due on {formatDate('2025-06-01')}</p>
                <p className="font-bold text-white">£450.00</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </FinancialLayout>
      
      {/* Payment Method Dialogs */}
      <ConnectWalletDialog open={connectWalletOpen} onOpenChange={setConnectWalletOpen} />
      <AddCardDialog open={addCardOpen} onOpenChange={setAddCardOpen} />
      <BankDetailsDialog open={bankDetailsOpen} onOpenChange={setBankDetailsOpen} />
    </>
  );
}
